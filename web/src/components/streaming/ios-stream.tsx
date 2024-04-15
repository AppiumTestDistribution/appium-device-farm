import { useEffect, useState, useRef, useCallback } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import './streaming.css';
import { StreamingToolBar } from './toolbar';
import { SimpleInterationHandler } from '../../libs/simple-interation-handler';
import {
  Camera,
  StopCircle,
  Upload,
  PowerSettingsNew,
  VolumeDownOutlined,
  VolumeUpOutlined,
} from '@mui/icons-material';
import { toolBarControl } from './util.ts';
import DeviceLoading from '../../assets/device-loading.gif';
import useWebSocket from 'react-use-websocket';
import { StreamActionNotifier } from './StreamActionNotifier.tsx';
import { AppInstaller } from './AppInstaller.tsx';
import { ScreenshotGallery } from './screenshot-gallery.tsx';

const MAX_HEIGHT = 820;
const MAX_WIDTH = 820;

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
  const { sendMessage, getWebSocket } = useWebSocket(wsUrl, {
    share: false,
    shouldReconnect: (event: CloseEvent) => event.code !== 1000,
    reconnectInterval: 1500,
    reconnectAttempts: 5,
  });

  const containerElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLImageElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  let interactionHandler: SimpleInterationHandler | null;

  const uploadApp = useCallback(() => {
    setShowFileUpload((preVal) => !preVal);
  }, []);

  const onNewScreenShot = (screenshot: string) => {
    setScreenshots((existingScreenshots) => [...existingScreenshots, screenshot]);
  };

  const onDeleteScreenshot = (index: number) => {
    const newScreenshots = [...screenshots];
    newScreenshots.splice(index, 1);
    setScreenshots(newScreenshots);
  };

  const [showFileUpload, setShowFileUpload] = useState(false);

  useEffect(() => {
    if (
      !interactionHandler &&
      canvasElement.current &&
      containerElement.current &&
      videoElement.current
    ) {
      //videoElement.current.style.width = width + 'px';
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
      <StreamActionNotifier ws={getWebSocket() as any} onScreenshotImage={onNewScreenShot} />
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
              height: 'auto!important',
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
            {
              action: 'volumeUp',
              icon: <VolumeUpOutlined />,
              name: 'Volume Up',
            },
            {
              action: 'volumeDown',
              icon: <VolumeDownOutlined />,
              name: 'Volume Down',
            },
            { action: 'power', icon: <PowerSettingsNew />, name: 'Power' },
            { action: 'takeScreenshot', icon: <Camera />, name: 'screenshot' },
            {
              name: 'Upload app',
              icon: <Upload />,
              onClick: uploadApp,
              action: 'uploadFile',
            },
            {
              action: 'close',
              icon: <StopCircle color="error" />,
              name: 'Close Session',
            },
          ]}
          onClickCallback={onToolbarControlClick}
        />
      </div>
      <AppInstaller
        platform="ios"
        open={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        deviceUdid={udid}
      />
      <ScreenshotGallery screenshots={screenshots} onDeleteScreenshot={onDeleteScreenshot} />
    </div>
  );
}

export default IOSStream;
