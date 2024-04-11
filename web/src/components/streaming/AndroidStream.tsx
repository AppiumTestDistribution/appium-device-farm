import { useEffect, useState, useRef } from 'react';
import './streaming.css';
import { StreamingToolBar } from './toolbar';
import { SimpleInterationHandler } from '../../libs/simple-interation-handler';
import DeviceFarmApiService from '../../api-service';
import HomeIcon from '@mui/icons-material/Home';
import { Camera, Upload, Close } from '@mui/icons-material';
import { toolBarControl } from './util.ts';
import DeviceLoading from '../../assets/device-loading.gif';
import useWebSocket from 'react-use-websocket';

const MAX_HEIGHT = 720;
const MAX_WIDTH = 720;

function AndroidStream() {
  const [imageSrc, setImageSrc] = useState(DeviceLoading);
  const [file, setFile] = useState(null);

  const containerElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLImageElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  let interactionHandler: SimpleInterationHandler | null;

  const handleWebSocketMessage = (event: { data: any }) => {
    const blob = event.data;
    const url = URL.createObjectURL(blob);
    setImageSrc(url);
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
  const { host, udid, port } = getParamsFromUrl() as any;
  const wsUrl = `ws://${host}:${port}/android-stream/${udid}`;
  const { sendMessage } = useWebSocket(wsUrl, {
    share: false,
    shouldReconnect: () => true,
    onMessage: handleWebSocketMessage,
    reconnectInterval: 1500,
    reconnectAttempts: 15,
  });

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
        { send: sendMessage },
        { width, height },
      );
    }
  }, []);

  async function onToolbarControlClick(controlAction: string) {
    await toolBarControl({ send: sendMessage } as any, controlAction, getParamsFromUrl);
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
              icon: <HomeIcon />,
              name: 'Show Home Screen', //onClick={() => onToolbarControlClick('home')}
            },
            {
              action: 'screenshot',
              icon: <Camera />,
              name: 'Capture Screenshot',
            },
            {
              action: 'upload',
              icon: (
                <div>
                  <label htmlFor="input-file">Upload APK</label>
                  <Upload onClick={uploadFile} />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    name="fileUpload"
                    accept="apk, aab"
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
    </div>
  );
}

export default AndroidStream;
