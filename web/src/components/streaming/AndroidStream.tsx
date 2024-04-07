import { useEffect, useState, useRef } from 'react';
import './streaming.css';
import { StreamingToolBar } from './toolbar';
import { SimpleInterationHandler } from '../../libs/simple-interation-handler';
import DeviceFarmApiService from '../../api-service';

const MAX_HEIGHT = 720;
const MAX_WIDTH = 720;

function AndroidStream() {
  const [imageSrc, setImageSrc] = useState('');
  const [file, setFile] = useState(null);

  const containerElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLImageElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  let interactionHandler: SimpleInterationHandler | null;

  // eslint-disable-next-line prefer-const
  let [ws, setWebSocket] = useState<WebSocket | undefined>(undefined);
  const handleWebSocketMessage = (event: { data: any }) => {
    const blob = event.data;
    const url = URL.createObjectURL(blob);
    setImageSrc(url);
  };

  const createWebSocketConnection = (wsUrl: string) => {
    ws = new WebSocket(wsUrl);
    ws.addEventListener('message', handleWebSocketMessage);
    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed. Reconnecting...');
      createWebSocketConnection(wsUrl);
    });
    return ws;
  };

  const getParamsFromUrl = () => {
    if (window.location.hash.includes('?')) {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      return {
        port: params.get('port'),
        udid: params.get('udid'),
        host: params.get('host'),
        width: params.get('width'),
        height: params.get('height'),
      };
    } else {
      return { port: 8004, host: '127.0.0.1', udid: '' };
    }
  };
  useEffect(() => {
    const { host, udid, port } = getParamsFromUrl() as any;
    const wsUrl = `ws://${host}:${port}/android-stream/${udid}`;

    createWebSocketConnection(wsUrl);
    setWebSocket(ws);
    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ws.removeEventListener('message', handleWebSocketMessage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ws.close();
    };
  }, []);

  useEffect(() => {
    const { width, height } = getParamsFromUrl() as any;

    if (
      !interactionHandler &&
      canvasElement.current &&
      containerElement.current &&
      videoElement.current
    ) {
      videoElement.current.style.height = height + 'px';
      interactionHandler = new SimpleInterationHandler(
        videoElement.current as any,
        canvasElement.current,
        containerElement.current,
        ws,
        { width, height },
      );
    }
  }, []);

  async function onToolbarControlClick(controlAction: string) {
    console.log('Sending event', ws, JSON.stringify({ action: controlAction }));
    //const { udid } = getWebSocketPort() as any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ws.send(JSON.stringify({ action: controlAction }));
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const selectedFile = event.target.files[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!(file.type === 'application/vnd.android.package-archive')) {
      alert(`File extension not allowed`);
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/device-farm/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        alert('Failed to upload file');
      }

      const data = await response.json();
      console.log('File uploaded successfully:', data);

      const { udid } = getParamsFromUrl() as any;
      await DeviceFarmApiService.installApk(udid, data.path);
      // Handle success, if needed
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error, if needed
    }
  };

  return (
    <div className="streaming-container">
      <div className="device-container">
        <div
          style={{
            position: 'relative',
            maxHeight: MAX_HEIGHT + 'px',
            maxWidth: MAX_WIDTH + 'px',
          }}
          ref={containerElement}
        >
          <img
            style={{
              maxHeight: MAX_HEIGHT + 'px',
              maxWidth: MAX_WIDTH + 'px',
              width: 'auto',
              position: 'absolute',
            }}
            src={imageSrc}
            ref={videoElement}
            id="outputImage"
          />
          <canvas
            ref={canvasElement}
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          />
        </div>
        <StreamingToolBar
          controls={[
            {
              action: 'home',
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  id="home"
                >
                  <path
                    fill="#200E32"
                    d="M6.64373233,18.7821107 L6.64373233,15.7152449 C6.64371685,14.9380902 7.27567036,14.3067075 8.05843544,14.3018198 L10.9326107,14.3018198 C11.7188748,14.3018198 12.3562677,14.9346318 12.3562677,15.7152449 L12.3562677,15.7152449 L12.3562677,18.7732212 C12.3562498,19.4472781 12.9040221,19.995083 13.5829406,20 L15.5438266,20 C16.4596364,20.0023291 17.3387522,19.6427941 17.9871692,19.0007051 C18.6355861,18.3586161 19,17.4867541 19,16.5775231 L19,7.86584638 C19,7.13138763 18.6720694,6.43471253 18.1046183,5.96350064 L11.4429783,0.674268354 C10.2785132,-0.250877524 8.61537279,-0.22099178 7.48539114,0.745384082 C7.48539114,0.745384082 0.967012253,5.96350064 0.967012253,5.96350064 C0.37274068,6.42082162 0.0175522924,7.11956262 0,7.86584638 L0,16.5686336 C0,18.463707 1.54738155,20 3.45617342,20 L5.37229029,20 C5.69917279,20.0023364 6.01348703,19.8750734 6.24547302,19.6464237 C6.477459,19.417774 6.60792577,19.1066525 6.60791706,18.7821107 L6.64373233,18.7821107 Z"
                    transform="translate(2.5 2)"
                  ></path>
                </svg>
              ),
              name: 'Show Home Screen', //onClick={() => onToolbarControlClick('home')}
            },
            {
              action: 'screenshot',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" id="camera">
                  <path fill="none" d="M0 0h48v48H0z"></path>
                  <path d="m18.8 21 9.53-16.51C26.94 4.18 25.49 4 24 4c-4.8 0-9.19 1.69-12.64 4.51l7.33 12.69.11-.2zm24.28-3c-1.84-5.85-6.3-10.52-11.99-12.68L23.77 18h19.31zm.52 2H28.62l.58 1 9.53 16.5C41.99 33.94 44 29.21 44 24c0-1.37-.14-2.71-.4-4zm-26.53 4-7.8-13.5C6.01 14.06 4 18.79 4 24c0 1.37.14 2.71.4 4h14.98l-2.31-4zM4.92 30c1.84 5.85 6.3 10.52 11.99 12.68L24.23 30H4.92zm22.54 0-7.8 13.51c1.4.31 2.85.49 4.34.49 4.8 0 9.19-1.69 12.64-4.51L29.31 26.8 27.46 30z"></path>
                </svg>
              ),
              name: 'Capture Screenshot',
            },
            {
              action: 'upload',
              icon: (
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="fileUpload"
                    accept="apk, aab"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 20 20"
                    id="install"
                    onClick={uploadFile}
                  >
                    <path d="m19.059 10.898-3.171-7.927A1.543 1.543 0 0 0 14.454 2H12.02l.38 4.065h2.7L10 10.293 4.9 6.065h2.7L7.98 2H5.546c-.632 0-1.2.384-1.434.971L.941 10.898a4.25 4.25 0 0 0-.246 2.272l.59 3.539A1.544 1.544 0 0 0 2.808 18h14.383c.755 0 1.399-.546 1.523-1.291l.59-3.539a4.22 4.22 0 0 0-.245-2.272zm-2.1 4.347a.902.902 0 0 1-.891.755H3.932a.902.902 0 0 1-.891-.755l-.365-2.193A.902.902 0 0 1 3.567 12h12.867c.558 0 .983.501.891 1.052l-.366 2.193z"></path>
                  </svg>
                </div>
              ),
              name: '',
            },
          ]}
          onClickCallback={onToolbarControlClick}
        />
      </div>
    </div>
  );
}

export default AndroidStream;
