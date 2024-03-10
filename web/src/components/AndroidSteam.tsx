import { useEffect, useState } from 'react';
const ImageRenderer = () => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const getWebSocketPort = () => {
      const queryParams = new URLSearchParams(window.location.search);
      return queryParams.get('port') || 8004; // Default port is 8002
    };

    const wsPort = getWebSocketPort();
    const wsUrl = `ws://127.0.0.1:${wsPort}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const blob = event.data;
      const url = URL.createObjectURL(blob);
      setImageSrc(url);
    };

    return () => {
      // Clean up the WebSocket connection when the component is unmounted
      ws.close();
    };
  }, []);

  return (
    <div>
      <img id="outputImage" src={imageSrc} alt="Output Image" style={{ width: '400px', height: '800px' }} />
    </div>
  );
};

export default ImageRenderer;
