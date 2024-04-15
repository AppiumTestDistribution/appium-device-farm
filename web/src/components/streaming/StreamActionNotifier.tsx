import { useEffect } from 'react';
import { toast, ToastOptions, ToastContent } from 'react-toastify';
import { Timer } from './timer';

export function StreamActionNotifier({
  ws,
  onStreamImage,
  onScreenshotImage,
}: {
  ws: WebSocket;
  onStreamImage?: (frame: Blob) => void;
  onScreenshotImage?: (base64Frame: string) => void;
}) {
  const refreshSession = () => {
    ws.send(JSON.stringify({ action: 'refreshSession' }));
    clearToast();
  };

  const clearToast = () => {
    toast.dismiss();
  };

  const showToast = (content: ToastContent, options: ToastOptions) => {
    clearToast();
    toast(content, {
      ...options,
      position: 'top-center',
    });
  };

  const parseIncommingMessage = ({ action, data }: { action: string; data: any }) => {
    if (action == 'session_timeout') {
      showToast(
        <div>
          The live session will be terminated after{' '}
          <Timer timeout={data.endTimeInSecs} timeoutCallback={() => clearToast()} /> due to
          inactivity. Click <button onClick={() => refreshSession()}>Refresh</button> to keep the
          session alive
        </div>,
        {
          position: 'top-center',
          type: 'warning',
          autoClose: false,
        },
      );
    } else if (action == 'session_inactive') {
      showToast('Live mobile session has been terminated due to inactivity', {
        type: 'error',
        autoClose: false,
      });
      window.location.href = '/device-farm/#';
    } else if (action == 'session_active') {
      showToast('Session is refreshed', {
        type: 'success',
        autoClose: 1000,
      });
    } else if (action == 'screenshot_image') {
      if (onScreenshotImage) {
        onScreenshotImage(data);
      }
    }
  };

  useEffect(() => {
    if (!ws) {
      return;
    }
    ws.addEventListener('message', (message: any) => {
      try {
        const parsedMesage = JSON.parse(message.data);
        if (parsedMesage.action) {
          parseIncommingMessage(parsedMesage);
        }
      } catch (err) {
        if (onStreamImage) {
          onStreamImage(message.data);
        }
      }
    });
  }, [ws]);

  return <></>;
}
