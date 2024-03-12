import { useEffect, useState } from 'react';

const AndroidStream = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const getWebSocketPort = () => {
      const queryParams = `${window.location.hash}`;
      const port = queryParams.split('?')[1].split('=')[1] || '8004'; // Default port is '8002'
      const host = queryParams.split('?')[2].split('=')[1] || '127.0.0.1';
      return { port, host }
    };

    const { host, port} = getWebSocketPort();
    const wsUrl = `ws://${host}:${port}`;
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
