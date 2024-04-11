import { useEffect, useState, useRef } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import './streaming.css';
import { StreamingToolBar } from './toolbar';
import { SimpleInterationHandler } from '../../libs/simple-interation-handler';
import { Camera, Close, Upload } from '@mui/icons-material';
import { toolBarControl, uploadFile } from './util.ts';
import DeviceLoading from '../../assets/device-loading.gif';
import useWebSocket from 'react-use-websocket';

const MAX_HEIGHT = 720;
const MAX_WIDTH = 720;

function IOSStream() {
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

  // const [imageSrc, setImageSrc] = useState('');
  const { host, port, udid, width, height, streamPort } = getParamsFromUrl() as any;
  const wsUrl = `ws://${host}:${port}/ios-stream/${udid}`;
  const { sendMessage } = useWebSocket(wsUrl, {
    share: false,
    shouldReconnect: () => true,
    reconnectInterval: 1500,
    reconnectAttempts: 15,
  });

  const containerElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLImageElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState(null);
  let interactionHandler: SimpleInterationHandler | null;

  // eslint-disable-next-line prefer-const

  const uploadAUT = async () => {
    await uploadFile(file, getParamsFromUrl);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const selectedFile = event.target.files[0];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFile(selectedFile);
  };

  useEffect(() => {
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
        { send: sendMessage } as any,
        { width, height },
      );
    }
  }, []);

  async function onToolbarControlClick(controlAction: string) {
    await toolBarControl(
      {
        send: sendMessage,
      } as any,
      controlAction,
      getParamsFromUrl,
    );
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
              maxHeight: MAX_HEIGHT + 'px',
              maxWidth: MAX_WIDTH + 'px',
              width: 'auto',
              position: 'absolute',
              backgroundImage: `url(${DeviceLoading})`,
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
              backgroundPosition: 'center',
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
                  <label htmlFor="input-file">Upload IPA/App</label>
                  <Upload onClick={uploadAUT} />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="fileUpload"
                    accept="ipa, app"
                  />
                </div>
              ),
              name: '',
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
