import { useEffect, useState, useRef } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import './streaming.css';
import { StreamingToolBar } from './toolbar';
import { SimpleInterationHandler } from '../../libs/simple-interation-handler';
import { Camera, Close, Upload } from '@mui/icons-material';
import { uploadFile } from './upload.ts';
import DeviceFarmApiService from '../../api-service';

const MAX_HEIGHT = 720;
const MAX_WIDTH = 720;

function IOSStream() {
  // const [imageSrc, setImageSrc] = useState('');

  const containerElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLImageElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState(null);
  let interactionHandler: SimpleInterationHandler | null;

  // eslint-disable-next-line prefer-const
  let [ws, setWebSocket] = useState<WebSocket | undefined>(undefined);

  const createWebSocketConnection = (wsUrl: string) => {
    ws = new WebSocket(wsUrl);
    // ws.addEventListener('message', handleWebSocketMessage);
    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed. Reconnecting...');
      createWebSocketConnection(wsUrl);
    });
    setWebSocket(ws);
    return ws;
  };

  const uploadAUT = async () => {
    await uploadFile(file, getParamsFromUrl)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const selectedFile = event.target.files[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFile(selectedFile);
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
        streamPort: params.get('streamPort'),
      };
    } else {
      return { port: 8004, host: '127.0.0.1', udid: '' };
    }
  };
  useEffect(() => {
    const { host, port, udid } = getParamsFromUrl() as any;
    const wsUrl = `ws://${host}:${port}/ios-stream/${udid}`;

    createWebSocketConnection(wsUrl);
    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //ws.removeEventListener('message', handleWebSocketMessage);
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
  const { host, port, streamPort } = getParamsFromUrl() as any;
  async function onToolbarControlClick(controlAction: string) {
    console.log('Sending event', ws, JSON.stringify({ action: controlAction }));
    if(controlAction === 'close') {
      console.log('Closing session');
      const { udid } = getParamsFromUrl() as any;
      const response = await DeviceFarmApiService.closeSession(udid);
      if(response.status === 200) {
        window.location.href = '/device-farm/#';
      }
    } else {
      //const { udid } = getWebSocketPort() as any;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      ws.send(JSON.stringify({ action: controlAction }));
    }
  }
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
              maxHeight: 730 + 'px',
              maxWidth: 730 + 'px',
              width: 'auto',
              position: 'absolute',
            }}
            src={`http://${host}:${port}/device-farm/api/dashboard/mjpeg-stream/${streamPort}`}
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
            { action: 'home', icon: <HomeIcon />, name: 'Home' },
            { action: 'screenshot', icon: <Camera />, name: 'screenshot' },
            {
              action: 'upload',
              icon: (
                <div>
                  <label htmlFor="input-file">Upload IPA</label>
                  <Upload
                    onClick={uploadAUT}
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="fileUpload"
                    accept="ipa, app, zip"
                  />
                </div>
              ),
              name: ''
            },
            {
              action: 'close',
              icon: <Close />,
              name: 'Close Session',
            },
          ]}
          onClickCallback={onToolbarControlClick}
        />
      </div>
      {/* <Button onClick={homeButtonHandler} startIcon={<HomeIcon />}>
        Home
      </Button> */}
    </div>
  );
}

export default IOSStream;
