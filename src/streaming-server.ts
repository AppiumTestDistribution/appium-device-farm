import { WebSocketServer, WebSocket } from 'ws';
import { getDevice } from './data-service/device-service';
import log from './logger';
import ADB from 'appium-adb';
import { getScreenShot } from './modules/androidStreaming';
import { IDevice } from './interfaces/IDevice';

const SocketMap: Map<string, ProxySocket> = new Map();

class ProxySocket {
  private downstreamSockets: WebSocket[] = [];
  private socketClient!: WebSocket;
  private latestScreenshot!: Buffer;
  private isRunning = false;

  constructor(
    private device: IDevice,
    private adbInstance: ADB,
  ) {}

  async start() {
    this.socketClient = new WebSocket(`ws://127.0.0.1:${this.device.systemPort}`);
    this.socketClient.addEventListener('message', (message) => {
      this.latestScreenshot = message.data as Buffer;
      this.downstreamSockets.forEach((socket) => socket.send(message.data));
    });
    return new Promise((resolve, reject) => {
      this.socketClient.addEventListener('open', () => {
        this.isRunning = true;
        resolve(null);
      });
      this.socketClient.addEventListener('error', reject);
    });
  }

  async addListener(websocket: WebSocket) {
    websocket.addEventListener('message', (message) => {
      this.socketClient.send(message.toString());
    });
    if (this.isRunning && !this.latestScreenshot) {
      this.latestScreenshot = await getScreenShot(this.adbInstance, this.device.udid);
    }
    websocket.send(this.latestScreenshot);
    this.downstreamSockets.push(websocket);
  }
}

export function getStreamingServer(adbInstance: ADB) {
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
    const streamingKey = `${device.udid}:${device.systemPort}`;
    if (SocketMap.has(streamingKey)) {
      log.info(
        `Streaming session already available for device ${udid}. So reusing the existing connection`,
      );
      SocketMap.get(streamingKey)?.addListener(ws);
    } else {
      try {
        log.info(`Creating new proxy streaming session for device ${udid}`);
        const proxySocket = new ProxySocket(device, adbInstance);
        await proxySocket.start();
        log.info(`Successfully created proxy streaming session for device ${udid}`);
        SocketMap.set(streamingKey, proxySocket);
        await proxySocket.addListener(ws);
      } catch (err) {
        console.log('Unable to connect to remote streaming socket');
        console.log(err);
      }
    }
  });
  return streamingServer;
}
