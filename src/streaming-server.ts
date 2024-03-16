import { WebSocketServer, WebSocket } from 'ws';
import { getDevice } from './data-service/device-service';
import log from './logger';

const SocketMap: Map<string, ProxySocket> = new Map();

class ProxySocket {
  private downstreamSockets: WebSocket[] = [];
  private socketClient!: WebSocket;

  constructor(private remoteProxyPort: number) {}

  async start() {
    this.socketClient = new WebSocket(`ws://127.0.0.1:${this.remoteProxyPort}`);
    this.socketClient.addEventListener('message', (message) => {
      this.downstreamSockets.forEach((socket) => socket.send(message.data));
    });
    return new Promise((resolve, reject) => {
      this.socketClient.addEventListener('open', resolve);
      this.socketClient.addEventListener('error', reject);
    });
  }

  addListener(websocket: WebSocket) {
    websocket.addEventListener('message', (message) => {
      this.socketClient.send(message.toString());
    });
    this.downstreamSockets.push(websocket);
  }
}

export function getStreamingServer() {
  const streamingServer = new WebSocketServer({ noServer: true });
  streamingServer.on('connection', async (ws, request) => {
    log.info(`New streaming request recieved with url: ${request.url}`);
    const pathname = request.url;
    if (!pathname) {
      throw new Error('Invalid connection request: pathname missing from request');
    }
    const deviceUdid = new RegExp('android-stream/([^/]+)$');
    const deviceUdidMatch = deviceUdid.exec(pathname);

    if (!deviceUdidMatch) {
      log.info(`No device id matched for streaming url : ${pathname}`);
      return ws.close();
    }

    const udid = deviceUdidMatch[1];
    log.info(`Device id ${udid} matched for streaming url : ${pathname}`);
    const device = await getDevice({
      udid: [udid],
    });

    if (!device || !device.systemPort) {
      log.info(`Invalid device or streaming not supported for device id ${udid}`);
      return ws.close();
    }

    const port = device.systemPort;
    if (SocketMap.has(device.udid)) {
      log.info(
        `Streaming session already available for device ${udid}. So reusing the existing connection`,
      );
      SocketMap.get(device.udid)?.addListener(ws);
    } else {
      try {
        log.info(`Creating new proxy streaming session for device ${udid}`);
        const proxySocket = new ProxySocket(port);
        await proxySocket.start();
        log.info(`Successfully created proxy streaming session for device ${udid}`);
        SocketMap.set(device.udid, proxySocket);
        proxySocket.addListener(ws);
      } catch (err) {
        console.log('Unable to connect to remote streaming socket');
        console.log(err);
      }
    }
  });
  return streamingServer;
}
