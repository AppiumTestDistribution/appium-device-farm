import { WebSocketServer, WebSocket } from 'ws';
import ip from 'ip';

const wsServer = new WebSocketServer({
  host: ip.address(),
  port: 8080,
});

export function adbStreamingWebSocket(ADB_STREAMING_PORT: number) {
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
