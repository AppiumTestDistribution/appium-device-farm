import { useEffect, useState } from 'react';

const AndroidStream = () => {
  const [imageSrc, setImageSrc] = useState('');

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
    const ws = new WebSocket(wsUrl);

    const handleWebSocketMessage = (event: { data: any }) => {
      const blob = event.data;
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    };

    ws.addEventListener('message', handleWebSocketMessage);

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
