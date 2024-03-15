import { WebSocketServer } from 'ws';

const wsServer = new WebSocketServer({
  port: 8080,
});

export function adbStreamingWebSocket(ADB_STREAMING_PORT: number) {
  wsServer.on('connection', (feSocket) => {
    const adbStreamingOriginalSocket = new WebSocket(`ws://127.0.0.1:${ADB_STREAMING_PORT}`);

    adbStreamingOriginalSocket.onopen = () => {
      feSocket.on('message', (message) => {
        console.log(message);
        adbStreamingOriginalSocket.send(message.toString());
      });
    };

    adbStreamingOriginalSocket.onmessage = (event) => {
      console.log(event);
      feSocket.send(event.data.toString());
    };
  });
}
