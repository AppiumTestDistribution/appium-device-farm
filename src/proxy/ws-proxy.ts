import { WebSocketServer, WebSocket } from 'ws';
import ip from 'ip';
export function adbStreamingWebSocket(ADB_STREAMING_PORT: number) {
  const wsServer = new WebSocketServer({
    host: ip.address(),
    port: ADB_STREAMING_PORT,
  });
  wsServer.on('connection', (feSocket) => {
    const adbStreamingOriginalSocket = new WebSocket(`ws://localhost:${ADB_STREAMING_PORT}`);

    adbStreamingOriginalSocket.onopen = () => {
      feSocket.on('message', (message) => {
        adbStreamingOriginalSocket.send(message.toString());
      });
    };

    adbStreamingOriginalSocket.onmessage = (event) => {
      feSocket.send(event.data);
    };
  });
}
