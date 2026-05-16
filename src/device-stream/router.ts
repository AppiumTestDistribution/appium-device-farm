import path from 'node:path';
import { Router, Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'node:http';
import { AdbServerClient } from '@yume-chan/adb';
import { AdbServerNodeTcpConnector } from '@yume-chan/adb-server-node-tcp';
import { WritableStream } from '@yume-chan/stream-extra';
import axios from 'axios';
import { AndroidScrcpyBridge, VideoPacket } from './android/bridge';
import {
  encodeMeta,
  encodeConfig,
  encodeData,
  decodeClientTouchMessage,
  decodeClientKeycodeMessage,
} from './android/framing';
import { useDeviceRegistry } from './registry';
import { StartUseDeviceRequest } from './types';
import log from '../logger';
import { IPluginArgs } from '../interfaces/IPluginArgs';
import EventBus from '../notifier/event-bus';
import { AfterSessionDeletedEvent } from '../events/after-session-deleted-event';

const JAR_PATH = path.join(__dirname, 'android', 'scrcpy-server.jar');

interface AppiumSessionCreateResult {
  sessionId: string;
  capabilities?: { udid?: string; deviceUDID?: string };
}

/** Tracks live SessionHandle per session id for the WS route to pick up. */
const bridgeHandles = new Map<
  string,
  Awaited<ReturnType<AndroidScrcpyBridge['start']>>
>();

function pluginCallbackPort(pluginArgs: IPluginArgs): number {
  return (pluginArgs as any).callbackPort ?? 4723;
}

function pluginPort(pluginArgs: IPluginArgs): number {
  return (pluginArgs as any).port ?? 4723;
}

export function registerDeviceStreamRoutes(
  router: Router,
  pluginArgs: IPluginArgs,
): void {
  router.post('/use-device/start', async (req: Request, res: Response) => {
    const body = req.body as StartUseDeviceRequest;
    if (!body?.udid) {
      return res
        .status(400)
        .json({ error: 'missing_udid', message: 'udid is required' });
    }

    let appiumSessionId: string | undefined;
    let bridgeHandle: Awaited<ReturnType<AndroidScrcpyBridge['start']>> | undefined;
    log.info(`[device-stream] /start invoked for udid=${body.udid}`);
    try {
      // 1. Create an Appium session through our own plugin (reserves device).
      const createUrl = `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session`;
      log.info(`[device-stream] step1: POST ${createUrl}`);
      const caps = {
        capabilities: {
          alwaysMatch: {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:udid': body.udid,
            'appium:newCommandTimeout': 3600,
          },
          // Upstream plugin's createSession reads caps.firstMatch[0]
          // unconditionally; without this it throws "Cannot read properties
          // of undefined (reading '0')".
          firstMatch: [{}],
        },
      };
      const created = await axios.post<{ value: AppiumSessionCreateResult }>(
        createUrl,
        caps,
        { timeout: 90_000 },
      );
      appiumSessionId = created.data.value.sessionId;
      log.info(`[device-stream] step1: appiumSessionId=${appiumSessionId}`);

      // 2. Connect to local adb-server, build the Adb client.
      log.info(`[device-stream] step2: connecting to adb-server 127.0.0.1:5037`);
      const connector = new AdbServerNodeTcpConnector({
        host: '127.0.0.1',
        port: 5037,
      });
      const serverClient = new AdbServerClient(connector);
      log.info(`[device-stream] step2: calling serverClient.getDevices()`);
      const devices = await serverClient.getDevices();
      log.info(`[device-stream] step2: getDevices returned ${devices.length} device(s): ${JSON.stringify(devices.map((d: any) => ({ serial: d.serial, state: d.state, transportId: String(d.transportId) })))}`);
      const picked = devices.find(
        (d: any) => d.serial === body.udid && d.state === 'device',
      );
      if (!picked) throw new Error(`device ${body.udid} not online via adb`);
      log.info(`[device-stream] step2: picked transportId=${String(picked.transportId)}; calling createAdb`);
      const adb = await serverClient.createAdb({
        transportId: picked.transportId,
      } as any);
      log.info(`[device-stream] step2: adb client ready`);

      // 3. Start the scrcpy bridge.
      log.info(`[device-stream] step3: starting AndroidScrcpyBridge`);
      const bridge = new AndroidScrcpyBridge(adb, { jarPath: JAR_PATH });
      bridgeHandle = await bridge.start();
      log.info(`[device-stream] step3: bridge.start() resolved`);

      // 4. Skip "wait for dimensions" — scrcpy doesn't emit sizeChanged
      // until the video stream is consumed, and we don't consume it until
      // the client connects the WS. The WS handler sends a META packet to
      // the client once dimensions arrive; the client's canvas adapts.
      // Register placeholder dimensions; real ones flow over the WS.

      // 5. Register in registry.
      const session = useDeviceRegistry.register({
        sessionId: appiumSessionId!,
        udid: body.udid,
        platform: 'android',
        deviceWidth: 0,
        deviceHeight: 0,
        stop: async () => {
          await bridgeHandle!.stop();
          try {
            await axios.delete(
              `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
              { timeout: 30_000 },
            );
          } catch (err) {
            log.warn(
              `[device-stream] DELETE appium session failed: ${(err as Error)?.message ?? err}`,
            );
          }
        },
      });

      // 6. Stash handle for the WS route.
      bridgeHandles.set(session.sessionId, bridgeHandle);

      // 7. Respond.
      const host = req.get('host') ?? `localhost:${pluginPort(pluginArgs)}`;
      const protocol = req.protocol === 'https' ? 'wss' : 'ws';
      const streamPath = `/device-farm/api/dashboard/use-device/stream/${session.sessionId}`;
      const streamUrl = `${protocol}://${host}${streamPath}`;
      log.info(`[device-stream] step7: responding streamUrl=${streamUrl}`);
      return res.json({
        sessionId: session.sessionId,
        streamUrl,
        platform: 'android',
        deviceWidth: 0,
        deviceHeight: 0,
      });
    } catch (err) {
      log.error(
        `[device-stream] /start failed: ${(err as Error)?.message ?? err}`,
      );
      if (bridgeHandle) await bridgeHandle.stop().catch(() => {});
      if (appiumSessionId) {
        try {
          await axios.delete(
            `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
            { timeout: 30_000 },
          );
        } catch {}
      }
      const message = (err as Error)?.message ?? String(err);
      if (message.includes('busy') || message.includes('blocked')) {
        return res
          .status(409)
          .json({ error: 'device_busy', message });
      }
      return res
        .status(502)
        .json({ error: 'bridge_start_failed', message });
    }
  });

  router.post(
    '/use-device/stop/:sessionId',
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;
      await useDeviceRegistry.stop(sessionId);
      bridgeHandles.delete(sessionId);
      return res.status(200).json({});
    },
  );

  // EventBus subscription: when an Appium session ends for any reason
  // (external kill, idle sweep, client disconnect), tear down the bridge.
  // Idempotent — registry.stop is a no-op for unknown / already-terminated
  // sessions, so this is safe even when /stop or WS-close already ran.
  EventBus.addListener(
    AfterSessionDeletedEvent.listener(({ sessionId }) => {
      void useDeviceRegistry.stop(sessionId);
      bridgeHandles.delete(sessionId);
    }),
  );
}

export function attachDeviceStreamWebSocket(httpServer: HttpServer): void {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (req, socket, head) => {
    const url = req.url ?? '';
    const match = url.match(
      /^\/device-farm\/api\/dashboard\/use-device\/stream\/([^/?]+)/,
    );
    if (!match) return;
    const sessionId = match[1]!;
    wss.handleUpgrade(req, socket, head, (ws) => {
      void handleWsConnection(ws, sessionId);
    });
  });
}

async function handleWsConnection(
  ws: WebSocket,
  sessionId: string,
): Promise<void> {
  const handle = bridgeHandles.get(sessionId);
  const session = useDeviceRegistry.get(sessionId);
  if (!handle || !session) {
    ws.close(1008, 'unknown session');
    return;
  }

  let closed = false;
  ws.on('close', () => {
    closed = true;
    log.info(`[device-stream] ws closed for ${sessionId}`);
    void useDeviceRegistry.stop(sessionId);
    bridgeHandles.delete(sessionId);
  });

  // WS heartbeat — ping every 10 s; terminate after one missed pong.
  let alive = true;
  ws.on('pong', () => {
    alive = true;
  });
  const interval = setInterval(() => {
    if (!alive) {
      ws.terminate();
      clearInterval(interval);
      return;
    }
    alive = false;
    try {
      ws.ping();
    } catch {}
  }, 10_000);
  ws.once('close', () => clearInterval(interval));

  // Send initial meta.
  ws.send(
    encodeMeta({
      codec: 'h264',
      width: session.deviceWidth,
      height: session.deviceHeight,
    }),
    { binary: true },
  );

  // Forward subsequent size changes as meta updates.
  handle.onDimensions(({ width, height }) => {
    session.deviceWidth = width;
    session.deviceHeight = height;
    if (ws.readyState === ws.OPEN) {
      ws.send(encodeMeta({ codec: 'h264', width, height }), { binary: true });
    }
  });

  // Forward video. Drop-newest back-pressure: if WS buffered > 1 MB, drop data
  // frames until it drains. Config frames always go through.
  const MAX_BUFFERED = 1_000_000;
  void handle
    .pipeVideoTo(
      new WritableStream<VideoPacket>({
        write(packet) {
          if (closed || ws.readyState !== ws.OPEN) return;
          if (packet.kind === 'configuration') {
            ws.send(encodeConfig(packet.data), { binary: true });
            return;
          }
          if (ws.bufferedAmount > MAX_BUFFERED) return;
          ws.send(encodeData(packet.pts, packet.data), { binary: true });
        },
      }),
    )
    .catch((err) =>
      log.warn(`[device-stream] video pipe error: ${err}`),
    );

  // Forward control.
  ws.on('message', (raw, isBinary) => {
    if (!isBinary || !(raw instanceof Buffer) || raw.length < 1) return;
    const touch = decodeClientTouchMessage(raw);
    if (touch) {
      handle
        .injectTouch(touch)
        .catch((err) =>
          log.warn(`[device-stream] injectTouch failed: ${err}`),
        );
      return;
    }
    const key = decodeClientKeycodeMessage(raw);
    if (key) {
      handle
        .injectKeycode(key.keycode)
        .catch((err) =>
          log.warn(`[device-stream] injectKeycode failed: ${err}`),
        );
    }
  });
}
