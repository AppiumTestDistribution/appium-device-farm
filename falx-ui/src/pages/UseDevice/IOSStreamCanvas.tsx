import { useEffect, useRef, useState } from 'react';

// Match constants from src/device-stream/types.ts.
const SRV_TAG_META = 0x01;
const SRV_TAG_FRAME = 0x04;
const CLIENT_TAP_TAG = 0x20;
const CLIENT_SWIPE_TAG = 0x21;
const CLIENT_INTENT_TAG = 0x22;
const INTENT_HOME = 0x01;
const INTENT_APP_SWITCHER = 0x02;

const SWIPE_PX_THRESHOLD = 10;
const SWIPE_MS_THRESHOLD = 120;

export interface IOSStreamCanvasProps {
  streamUrl: string;
  sessionId: string;
  /** Initial dimensions from /start response (in iOS points). META frame overwrites. */
  initialDeviceWidth: number;
  initialDeviceHeight: number;
}

export interface IOSStreamHandle {
  sendIntent: (intent: 'home' | 'app_switcher') => void;
}

export function IOSStreamCanvas(
  props: IOSStreamCanvasProps & { handleRef?: (h: IOSStreamHandle | null) => void },
) {
  const { streamUrl, initialDeviceWidth, initialDeviceHeight, handleRef } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [dims, setDims] = useState({
    widthPoints: initialDeviceWidth,
    heightPoints: initialDeviceHeight,
  });
  const decodeInFlight = useRef<Promise<unknown> | null>(null);
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null);

  // Connect WS.
  useEffect(() => {
    const ws = new WebSocket(streamUrl);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.addEventListener('message', (ev) => {
      const buf = new Uint8Array(ev.data as ArrayBuffer);
      if (buf.length < 1) return;
      const tag = buf[0];

      if (tag === SRV_TAG_META) {
        try {
          const meta = JSON.parse(new TextDecoder().decode(buf.slice(1)));
          setDims({
            widthPoints: meta.deviceWidthPoints,
            heightPoints: meta.deviceHeightPoints,
          });
          const c = canvasRef.current;
          if (c) {
            c.width = meta.deviceWidthPixels;
            c.height = meta.deviceHeightPixels;
          }
        } catch (e) {
          console.warn('[IOSStreamCanvas] bad META', e);
        }
      } else if (tag === SRV_TAG_FRAME) {
        const len = new DataView(buf.buffer, buf.byteOffset + 1, 4).getUint32(0, false);
        const jpeg = buf.slice(5, 5 + len);
        if (decodeInFlight.current) return; // drop-oldest — skip while previous frame decodes.
        const blob = new Blob([jpeg], { type: 'image/jpeg' });
        decodeInFlight.current = createImageBitmap(blob).then((bitmap) => {
          const c = canvasRef.current;
          if (c) {
            const ctx = c.getContext('2d');
            if (ctx) ctx.drawImage(bitmap, 0, 0, c.width, c.height);
          }
          bitmap.close();
        }).catch((e) => console.warn('[IOSStreamCanvas] decode failed', e))
          .finally(() => { decodeInFlight.current = null; });
      }
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [streamUrl]);

  // Expose imperative handle for the toolbar.
  useEffect(() => {
    if (!handleRef) return;
    handleRef({
      sendIntent: (intent: 'home' | 'app_switcher') => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== ws.OPEN) return;
        const buf = new Uint8Array(2);
        buf[0] = CLIENT_INTENT_TAG;
        buf[1] = intent === 'home' ? INTENT_HOME : INTENT_APP_SWITCHER;
        ws.send(buf);
      },
    });
    return () => handleRef(null);
  }, [handleRef]);

  function clientToPoints(e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * dims.widthPoints;
    const y = ((e.clientY - rect.top) / rect.height) * dims.heightPoints;
    return { x, y };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const p = clientToPoints(e);
    pointerStart.current = { x: p.x, y: p.y, t: performance.now() };
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const end = clientToPoints(e);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dt = performance.now() - start.t;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const ws = wsRef.current;
    if (!ws || ws.readyState !== ws.OPEN) return;

    if (dist < SWIPE_PX_THRESHOLD && dt < SWIPE_MS_THRESHOLD) {
      // tap
      const buf = new ArrayBuffer(1 + 8);
      const v = new DataView(buf);
      v.setUint8(0, CLIENT_TAP_TAG);
      v.setFloat32(1, end.x, false);
      v.setFloat32(5, end.y, false);
      ws.send(buf);
    } else {
      // swipe
      const buf = new ArrayBuffer(1 + 20);
      const v = new DataView(buf);
      v.setUint8(0, CLIENT_SWIPE_TAG);
      v.setFloat32(1, start.x, false);
      v.setFloat32(5, start.y, false);
      v.setFloat32(9, end.x, false);
      v.setFloat32(13, end.y, false);
      v.setUint32(17, Math.max(50, Math.round(dt)), false);
      ws.send(buf);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 200px)',
        width: 'auto',
        height: 'auto',
        aspectRatio: `${dims.widthPoints} / ${dims.heightPoints}`,
        backgroundColor: 'black',
      }}
    />
  );
}
