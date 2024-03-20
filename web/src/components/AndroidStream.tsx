import { useEffect, useState } from 'react';

const AndroidStream = () => {
  const [imageSrc, setImageSrc] = useState('');
  let ws: any;
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
  };

  useEffect(() => {
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

    const { host, udid, port } = getWebSocketPort() as any;
    const wsUrl = `ws://${host}:${port}/android-stream/${udid}`;

    createWebSocketConnection(wsUrl);

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      ws.removeEventListener('message', handleWebSocketMessage);
      ws.close();
    };
  }, []);

  return (
    <div>
      <img
        id="outputImage"
        src={imageSrc}
        alt="Output Image"
        style={{ width: '400px', height: '800px' }}
      />
    </div>
  );
};

export default AndroidStream;
