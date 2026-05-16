import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createUseDeviceSession,
  endUseDeviceSession,
  StartUseDeviceResponse,
} from '../../api-service/use-device';
import {
  AndroidStreamCanvas,
  AndroidStreamHandle,
} from './AndroidStreamCanvas';
import { ControlToolbar } from './ControlToolbar';
import { BrowserUnsupported } from './BrowserUnsupported';

function webCodecsAvailable(): boolean {
  return typeof (globalThis as unknown as { VideoDecoder?: unknown })
    .VideoDecoder !== 'undefined';
}

export default function UseDevice() {
  const { udid } = useParams<{ udid: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<StartUseDeviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<AndroidStreamHandle>(null);

  useEffect(() => {
    if (!webCodecsAvailable() || !udid) return;
    let cancelled = false;
    createUseDeviceSession(udid)
      .then((s) => {
        if (cancelled) {
          // Cancelled before the session response arrived — clean up.
          endUseDeviceSession(s.sessionId).catch(() => {});
        } else {
          setSession(s);
        }
      })
      .catch((e: unknown) => {
        const msg =
          (e instanceof Error && e.message) || 'Failed to start session';
        setError(msg);
      });
    return () => {
      cancelled = true;
    };
  }, [udid]);

  function handleStop() {
    if (session) endUseDeviceSession(session.sessionId).catch(() => {});
    navigate('/');
  }

  function handleKey(keycode: number) {
    canvasRef.current?.sendKeycode(keycode);
  }

  if (!webCodecsAvailable()) return <BrowserUnsupported />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600 font-semibold">Couldn't start Use Device</p>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to devices
        </button>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Starting session…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ControlToolbar onKey={handleKey} onStop={handleStop} />
      <AndroidStreamCanvas
        ref={canvasRef}
        streamUrl={session.streamUrl}
        deviceWidth={session.deviceWidth}
        deviceHeight={session.deviceHeight}
        onDisconnect={handleStop}
      />
    </div>
  );
}
