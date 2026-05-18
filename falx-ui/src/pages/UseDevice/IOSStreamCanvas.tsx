import { useEffect, useRef, useState } from 'react';
import {
  drawRing,
  drawTrail,
  ringIsExpired,
  trimTrail,
  type RingState,
  type TrailPoint,
} from './overlay-renderer';

const RING_LIFETIME_MS = 220;
const TRAIL_MAX_AGE_MS = 280;

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
  const ringRef = useRef<{ x: number; y: number; tStartMs: number } | null>(null);
  const trailRef = useRef<{ x: number; y: number; tMs: number }[]>([]);
  const overlayRafRef = useRef<number | null>(null);

  function renderOverlays() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const now = performance.now();
    const ring = ringRef.current;
    const trail = trailRef.current;
    if (ring) {
      const ageMs = now - ring.tStartMs;
      if (ringIsExpired(ageMs, RING_LIFETIME_MS)) {
        ringRef.current = null;
      } else {
        const state: RingState = { x: ring.x, y: ring.y, ageMs, lifetimeMs: RING_LIFETIME_MS };
        drawRing(ctx, state);
      }
    }
    if (trail.length > 0) {
      const aged: TrailPoint[] = trail.map((p) => ({ x: p.x, y: p.y, ageMs: now - p.tMs }));
      const kept = trimTrail(aged, TRAIL_MAX_AGE_MS);
      trailRef.current = trail.filter((_, i) => aged[i].ageMs <= TRAIL_MAX_AGE_MS);
      drawTrail(ctx, kept, TRAIL_MAX_AGE_MS);
    }
    if (ringRef.current || trailRef.current.length > 0) {
      overlayRafRef.current = requestAnimationFrame(renderOverlays);
    } else {
      overlayRafRef.current = null;
    }
  }

  function startOverlayLoop() {
    if (overlayRafRef.current == null) {
      overlayRafRef.current = requestAnimationFrame(renderOverlays);
    }
  }

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
      if (overlayRafRef.current != null) {
        cancelAnimationFrame(overlayRafRef.current);
        overlayRafRef.current = null;
      }
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

  function clientToCanvasAndPoints(e: React.PointerEvent<HTMLCanvasElement>): {
    px: number; py: number; x: number; y: number;
  } {
    const c = canvasRef.current;
    if (!c) return { px: 0, py: 0, x: 0, y: 0 };
    const rect = c.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const rawX = relX * dims.widthPoints;
    const rawY = relY * dims.heightPoints;
    return {
      px: Math.max(0, Math.min(c.width, relX * c.width)),
      py: Math.max(0, Math.min(c.height, relY * c.height)),
      x: Math.max(0, Math.min(dims.widthPoints, rawX)),
      y: Math.max(0, Math.min(dims.heightPoints, rawY)),
    };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const p = clientToCanvasAndPoints(e);
    const now = performance.now();
    pointerStart.current = { x: p.x, y: p.y, t: now };
    ringRef.current = { x: p.px, y: p.py, tStartMs: now };
    trailRef.current = [{ x: p.px, y: p.py, tMs: now }];
    startOverlayLoop();
    e.preventDefault();
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!pointerStart.current) return;
    const p = clientToCanvasAndPoints(e);
    const now = performance.now();
    trailRef.current.push({ x: p.px, y: p.py, tMs: now });
    if (trailRef.current.length > 64) trailRef.current.shift();
    startOverlayLoop();
    e.preventDefault();
  }

  function onPointerCancel() {
    pointerStart.current = null;
    trailRef.current = [];
    ringRef.current = null;
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    trailRef.current = [];
    if (!start) return;
    const end = clientToCanvasAndPoints(e);
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
    e.preventDefault();
  }

  // Aspect-locked wrapper. Three reasons for this shape:
  //   1. `aspect-ratio` on a `<canvas>` is unreliable: the intrinsic
  //      backing-store size (`width`/`height` HTML attrs) keeps the layout
  //      pinned to the intrinsic width whenever max-height clips, so the
  //      locked ratio quietly breaks.
  //   2. The wrapper carries the aspect-ratio + definite height. With
  //      `width: auto` it would still stretch to fill a flex-column parent,
  //      so we set `alignSelf: 'center'` to opt out of cross-axis stretch
  //      and let the width derive from `height × aspect`.
  //   3. The canvas inside fills the wrapper via `width: 100%; height: 100%`
  //      so its CSS size is decoupled from its backing-store size.
  return (
    <div
      style={{
        alignSelf: 'center',
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 200px)',
        height: 'calc(100vh - 200px)',
        width: 'auto',
        aspectRatio: `${dims.widthPoints} / ${dims.heightPoints}`,
        backgroundColor: 'black',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
        }}
      />
    </div>
  );
}
