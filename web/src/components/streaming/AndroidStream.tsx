import { useEffect, useState, useRef, useCallback } from 'react';
import './streaming.css';
import { StreamingToolBar } from './toolbar';
import { SimpleInterationHandler } from '../../libs/simple-interation-handler';
import HomeIcon from '@mui/icons-material/Home';
import {
  Camera,
  Upload,
  StopCircle,
  ArrowBackIosNewOutlined,
  VolumeUpOutlined,
  VolumeDownOutlined,
  CropSquareOutlined,
} from '@mui/icons-material';
import { toolBarControl } from './util.ts';
import DeviceLoading from '../../assets/device-loading.gif';
import useWebSocket from 'react-use-websocket';
import { StreamActionNotifier } from './StreamActionNotifier.tsx';
import { AppInstaller } from './AppInstaller.tsx';
import { ScreenshotGallery } from './screenshot-gallery.tsx';

const MAX_HEIGHT = 720;
const MAX_WIDTH = 720;

function AndroidStream() {
  const [imageSrc, setImageSrc] = useState(DeviceLoading);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const uploadApp = useCallback(() => {
    setShowFileUpload((preVal) => !preVal);
  }, []);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const containerElement = useRef<HTMLDivElement>(null);
  const videoElement = useRef<HTMLImageElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  let interactionHandler: SimpleInterationHandler | null;

  const onStreamImage = (frame: Blob) => {
    const url = URL.createObjectURL(frame);
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
  const { sendMessage, getWebSocket } = useWebSocket(wsUrl, {
    share: false,
    shouldReconnect: (event: CloseEvent) => {
      return event.code !== 1000;
    },
    reconnectInterval: 1500,
    reconnectAttempts: 5,
  });

  useEffect(() => {
    const { width, height } = getParamsFromUrl() as any;

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
        { send: sendMessage },
        { width, height },
      );
    }
  }, []);

  const onNewScreenShot = (screenshot: string) => {
    setScreenshots((existingScreenshots) => [...existingScreenshots, screenshot]);
  };

  const onDeleteScreenshot = (index: number) => {
    const newScreenshots = [...screenshots];
    newScreenshots.splice(index, 1);
    setScreenshots(newScreenshots);
  };

  async function onToolbarControlClick(controlAction: string) {
    await toolBarControl({ send: sendMessage } as any, controlAction, getParamsFromUrl);
  }

  return (
    <div className="streaming-container">
      <StreamActionNotifier
        ws={getWebSocket() as any}
        onStreamImage={onStreamImage}
        onScreenshotImage={onNewScreenShot}
      />
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
              action: 'back',
              icon: <ArrowBackIosNewOutlined />,
              name: 'Back',
            },
            {
              action: 'backgroundApps',
              icon: <CropSquareOutlined />,
              name: 'Open background apps',
            },
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
            {
              action: 'takeScreenshot',
              icon: <Camera />,
              name: 'Capture Screenshot',
            },
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
        platform="android"
        open={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        deviceUdid={udid}
      />
      <ScreenshotGallery screenshots={screenshots} onDeleteScreenshot={onDeleteScreenshot} />
    </div>
  );
}

export default AndroidStream;
