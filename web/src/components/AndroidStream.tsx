import { useEffect, useState } from 'react';

const AndroidStream = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const getWebSocketPort = () => {
      const queryParams = `${window.location.hash}`;
      return queryParams.split('?port=')[1] || '8004'; // Default port is '8002'
    };

    const wsPort = getWebSocketPort();
    const wsUrl = `ws://127.0.0.1:${wsPort}`;
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
