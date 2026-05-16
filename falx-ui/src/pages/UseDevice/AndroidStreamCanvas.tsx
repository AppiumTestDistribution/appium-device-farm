import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ScrcpyVideoCodecId } from '@yume-chan/scrcpy';
import {
  BitmapVideoFrameRenderer,
  WebCodecsVideoDecoder,
} from '@yume-chan/scrcpy-decoder-webcodecs';

const SRV_TAG_META = 0x01;
const SRV_TAG_CONFIG = 0x02;
const SRV_TAG_DATA = 0x03;
const CLIENT_TOUCH_TAG = 0x10;
const CLIENT_KEYCODE_TAG = 0x11;

export interface AndroidStreamHandle {
  sendKeycode(keycode: number): void;
}

interface Props {
  streamUrl: string;
  deviceWidth: number;
  deviceHeight: number;
  onDisconnect(): void;
}

type Meta = { codec: string; width: number; height: number };

function codecIdFromName(codec: string): ScrcpyVideoCodecId | null {
  if (codec === 'h264') return ScrcpyVideoCodecId.H264;
  if (codec === 'h265') return ScrcpyVideoCodecId.H265;
  if (codec === 'av1') return ScrcpyVideoCodecId.AV1;
  return null;
}

export const AndroidStreamCanvas = forwardRef<AndroidStreamHandle, Props>(
  function AndroidStreamCanvas(props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [status, setStatus] = useState<
      'connecting' | 'streaming' | 'closed' | 'error'
    >('connecting');

    useImperativeHandle(
      ref,
      () => ({
        sendKeycode(keycode: number) {
          const ws = wsRef.current;
          if (!ws || ws.readyState !== WebSocket.OPEN) return;
          const buf = new ArrayBuffer(5);
          const view = new DataView(buf);
          view.setUint8(0, CLIENT_KEYCODE_TAG);
          view.setUint32(1, keycode, false); // big-endian
          ws.send(buf);
        },
      }),
      [],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      let decoder: WebCodecsVideoDecoder | null = null;
      // as any: WebCodecsVideoDecoder.writable generic type isn't fully inferred
      // by TS from the external package; the runtime shape is correct per the spike.
      let writer:
        | WritableStreamDefaultWriter<{
            type: 'configuration' | 'data';
            data: Uint8Array;
            pts?: bigint;
          }>
        | null = null;
      let closed = false;

      const ensureDecoder = (codec: string) => {
        if (decoder) return;
        const codecId = codecIdFromName(codec);
        if (codecId == null) {
          setStatus('error');
          return;
        }
        const renderer = new BitmapVideoFrameRenderer(canvas);
        decoder = new WebCodecsVideoDecoder({ codec: codecId, renderer });
        // as any: writable property type not exported precisely; proven correct in spike
        writer = (decoder as any).writable.getWriter();
        decoder.sizeChanged(({ width, height }: { width: number; height: number }) => {
          canvas.width = width;
          canvas.height = height;
        });
      };

      const ws = new WebSocket(props.streamUrl);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => setStatus('streaming');
      ws.onclose = () => {
        if (closed) return;
        setStatus('closed');
        props.onDisconnect();
      };
      ws.onerror = () => setStatus('error');
      ws.onmessage = async (ev) => {
        if (typeof ev.data === 'string') return;
        const buf = ev.data as ArrayBuffer;
        const view = new DataView(buf);
        const tag = view.getUint8(0);
        if (tag === SRV_TAG_META) {
          const json = new TextDecoder().decode(new Uint8Array(buf, 1));
          const parsed = JSON.parse(json) as Meta;
          ensureDecoder(parsed.codec);
        } else if (tag === SRV_TAG_CONFIG) {
          if (!writer) return;
          const data = new Uint8Array(buf, 1);
          await writer.write({ type: 'configuration', data });
        } else if (tag === SRV_TAG_DATA) {
          if (!writer) return;
          const pts = view.getBigUint64(1, true);
          const data = new Uint8Array(buf, 9);
          await writer.write({ type: 'data', data, pts });
        }
      };

      return () => {
        closed = true;
        try {
          writer?.close();
        } catch {}
        try {
          ws.close();
        } catch {}
      };
    }, [props.streamUrl, props.onDisconnect]);

    function sendTouch(action: 0 | 1 | 2, ev: React.PointerEvent) {
      const ws = wsRef.current;
      const canvas = canvasRef.current;
      if (!ws || !canvas || ws.readyState !== WebSocket.OPEN) return;
      const rect = canvas.getBoundingClientRect();
      const normX = (ev.clientX - rect.left) / rect.width;
      const normY = (ev.clientY - rect.top) / rect.height;
      const buf = new ArrayBuffer(10);
      const view = new DataView(buf);
      view.setUint8(0, CLIENT_TOUCH_TAG);
      view.setUint8(1, action);
      view.setFloat32(2, Math.max(0, Math.min(1, normX)), false);
      view.setFloat32(6, Math.max(0, Math.min(1, normY)), false);
      ws.send(buf);
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={props.deviceWidth}
          height={props.deviceHeight}
          style={{
            maxHeight: '80vh',
            maxWidth: '100%',
            height: 'auto',
            touchAction: 'none',
            background: '#000',
            borderRadius: 8,
          }}
          onPointerDown={(e) => {
            (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
            sendTouch(0, e);
            e.preventDefault();
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 0) {
              sendTouch(2, e);
              e.preventDefault();
            }
          }}
          onPointerUp={(e) => {
            sendTouch(1, e);
            e.preventDefault();
          }}
          onPointerCancel={(e) => {
            sendTouch(1, e);
            e.preventDefault();
          }}
        />
        <div className="text-xs text-gray-500">Status: {status}</div>
      </div>
    );
  },
);
