import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

function AndroidStream() {
  const [imageSrc, setImageSrc] = useState('');
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
      createWebSocketConnection(wsUrl)
    });
    return ws;
  };

  const getWebSocketPort = () => {
    if (window.location.hash.includes('?')) {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      return {
        port: params.get('port'),
        udid: params.get('udid'),
        host: params.get('host'),
      };
    } else {
      return { port: 8004, host: '127.0.0.1', udid: '' };
    }
  };
  useEffect(() => {
    const { host, udid, port } = getWebSocketPort() as any;
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

  function homeButtonHandler() {
    console.log('Sending home button event', ws);
    const { udid } = getWebSocketPort() as any;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    ws.send(JSON.stringify({ action: 'home', udid}));
  }
  return (
    <div>
      <img
        id="outputImage"
        src={imageSrc}
        alt="Output Image"
        style={{ width: '400px', height: '800px' }}
      />
      <Button
        onClick={homeButtonHandler}
        startIcon={<HomeIcon />}
      >
        Home
      </Button>
    </div>
  );
}

export default AndroidStream;
