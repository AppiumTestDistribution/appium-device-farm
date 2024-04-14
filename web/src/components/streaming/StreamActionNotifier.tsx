import { useEffect } from 'react';
import { toast, ToastOptions, ToastContent } from 'react-toastify';
import { Timer } from './timer';

export function StreamActionNotifier({ ws }: { ws: WebSocket }) {
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
    console.log(action, data);
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
        //ignore
      }
    });
  }, [ws]);

  return <></>;
}
