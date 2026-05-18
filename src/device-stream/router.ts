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
import { Platform, StartUseDeviceRequest } from './types';
import log from '../logger';
import { IPluginArgs } from '../interfaces/IPluginArgs';
import EventBus from '../notifier/event-bus';
import { AfterSessionDeletedEvent } from '../events/after-session-deleted-event';
import { getDevice } from '../data-service/device-service';
import { IOSPortAllocator } from './ios/port-allocator';
import {
  IOSWdaBridge,
  TunnelNotRunningError,
  WDANotInstalledError,
} from './ios/bridge';
import { DeviceLockedError } from './ios/wda-client';
import {
  encodeIosMeta,
  encodeIosFrame,
  decodeIosClientMessage,
} from './ios/framing';

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

const iosPortAllocator = new IOSPortAllocator({
  baseRestPort: Number(process.env.IOS_WDA_BASE_REST_PORT ?? 8100),
  baseMjpegPort: Number(process.env.IOS_WDA_BASE_MJPEG_PORT ?? 9100),
});

const IOS_RUNNER_BUNDLE_ID =
  process.env.WDA_RUNNER_BUNDLE_ID ?? 'com.falx.WebDriverAgentRunner.xctrunner';

/** Bridge handles for active iOS sessions, keyed by sessionId. iOS uses a
 *  different bridge handle type than Android, so this Map is intentionally
 *  separate; the WS handler branches on platform when consuming. */
const iosBridgeHandles = new Map<
  string,
  Awaited<ReturnType<IOSWdaBridge['start']>>
>();

function pluginCallbackPort(pluginArgs: IPluginArgs): number {
  return (pluginArgs as any).callbackPort ?? 4723;
}

function pluginPort(pluginArgs: IPluginArgs): number {
  return (pluginArgs as any).port ?? 4723;
}

async function lookupPlatformByUdid(
  udid: string,
): Promise<Platform | undefined> {
  // Cast: IDeviceFilterOptions is a broad filter type; udid alone is a valid
  // selector used elsewhere in device-service for single-device lookups.
  const device = await getDevice({ udid } as any);
  if (!device) return undefined;
  const p = String((device as any).platform ?? '').toLowerCase();
  if (p === 'android') return 'android';
  if (p === 'ios') return 'ios';
  return undefined;
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

    const platform = await lookupPlatformByUdid(body.udid);
    if (!platform) {
      return res.status(404).json({
        error: 'device_not_found',
        message: `No device with udid ${body.udid}`,
      });
    }

    // Atomic UDID reservation BEFORE any I/O. JavaScript is single-threaded,
    // so check-then-insert in the registry is the entire mutex.
    const reservationToken = useDeviceRegistry.tryReserveUdid(
      body.udid,
      platform,
    );
    if (!reservationToken) {
      log.info(`[device-stream] /start 409: udid ${body.udid} already in use`);
      return res.status(409).json({
        error: 'device_busy',
        message: `Device ${body.udid} is already in use by another Use Device session`,
      });
    }

    if (platform === 'android') {
      return handleAndroidStart(req, res, body, reservationToken, pluginArgs);
    }
    return handleIosStart(req, res, body, reservationToken, pluginArgs);
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
      // iOS stop closure already deletes from iosBridgeHandles, but this is
      // a defensive cleanup so the map can't leak if the listener fires
      // before that closure runs to completion.
      iosBridgeHandles.delete(sessionId);
    }),
  );
}

async function handleAndroidStart(
  req: Request,
  res: Response,
  body: StartUseDeviceRequest,
  reservationToken: string,
  pluginArgs: IPluginArgs,
): Promise<Response> {
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
    // Promote with placeholder dimensions; real ones flow over the WS.

    // 5. Promote the reservation into a live session.
    const session = useDeviceRegistry.promote(reservationToken, {
      sessionId: appiumSessionId!,
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
    // Release the reservation in every error path.
    useDeviceRegistry.releaseReservation(reservationToken);
    // Best-effort cleanup of partially-allocated resources.
    if (bridgeHandle) await bridgeHandle.stop().catch(() => {});
    if (appiumSessionId) {
      try {
        await axios.delete(
          `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
          { timeout: 30_000 },
        );
      } catch (delErr) {
        log.warn(
          `[device-stream] cleanup DELETE appium session ${appiumSessionId} failed: ${(delErr as Error)?.message ?? delErr}`,
        );
      }
    }
    const message = (err as Error)?.message ?? String(err);
    if (message.includes('busy') || message.includes('blocked')) {
      return res.status(409).json({ error: 'device_busy', message });
    }
    return res.status(502).json({ error: 'bridge_start_failed', message });
  }
}

async function handleIosStart(
  req: Request,
  res: Response,
  body: StartUseDeviceRequest,
  reservationToken: string,
  pluginArgs: IPluginArgs,
): Promise<Response> {
  let appiumSessionId: string | undefined;
  let bridgeHandle: Awaited<ReturnType<IOSWdaBridge['start']>> | undefined;
  let portsAllocated = false;

  log.info(`[device-stream] /start (iOS) invoked for udid=${body.udid}`);

  try {
    // a) Probe tunnel.
    await IOSWdaBridge.probeTunnel(body.udid);

    // b) Probe WDA runner installed.
    await IOSWdaBridge.probeWdaInstalled(body.udid, IOS_RUNNER_BUNDLE_ID);

    // c) Allocate ports.
    const ports = iosPortAllocator.allocate(body.udid);
    portsAllocated = true;

    // d) Bring up WDA + MJPEG fan-out.
    const bridge = new IOSWdaBridge();
    bridgeHandle = await bridge.start(body.udid, ports, IOS_RUNNER_BUNDLE_ID);

    // e) Create an Appium XCUITest session attached to OUR WDA.
    //    appium:webDriverAgentUrl — "don't xcodebuild; attach here".
    //    appium:usePrebuiltWDA   — belt-and-braces.
    //    NO appium:bundleId      — spike 03 verdict: SpringBoard refuses on iOS 26.
    const createUrl = `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session`;
    const caps = {
      capabilities: {
        alwaysMatch: {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'appium:udid': body.udid,
          'appium:newCommandTimeout': 3600,
          'appium:webDriverAgentUrl': `http://localhost:${ports.wdaRestPort}`,
          'appium:usePrebuiltWDA': true,
        },
        firstMatch: [{}],
      },
    };
    const created = await axios.post<{ value: { sessionId: string } }>(
      createUrl,
      caps,
      { timeout: 90_000 },
    );
    appiumSessionId = created.data.value.sessionId;
    log.info(`[device-stream] iOS appiumSessionId=${appiumSessionId}`);

    // f) Promote.
    const session = useDeviceRegistry.promote(reservationToken, {
      sessionId: appiumSessionId!,
      deviceWidth: bridgeHandle.deviceWidthPoints,
      deviceHeight: bridgeHandle.deviceHeightPoints,
      stop: async () => {
        try {
          await axios.delete(
            `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
            { timeout: 30_000 },
          );
        } catch (err) {
          log.warn(
            `[device-stream] DELETE appium session failed: ${(err as Error)?.message}`,
          );
        }
        await bridgeHandle!.stop();
        iosPortAllocator.release(body.udid);
        iosBridgeHandles.delete(appiumSessionId!);
      },
    });

    iosBridgeHandles.set(session.sessionId, bridgeHandle);

    const host = req.get('host') ?? `localhost:${pluginPort(pluginArgs)}`;
    const protocol = req.protocol === 'https' ? 'wss' : 'ws';
    const streamPath = `/device-farm/api/dashboard/use-device/stream/${session.sessionId}`;
    const streamUrl = `${protocol}://${host}${streamPath}`;

    return res.json({
      sessionId: session.sessionId,
      streamUrl,
      platform: 'ios',
      deviceWidth: bridgeHandle.deviceWidthPoints,
      deviceHeight: bridgeHandle.deviceHeightPoints,
      scale: bridgeHandle.scale,
    });
  } catch (err) {
    log.error(
      `[device-stream] iOS /start failed: ${(err as Error)?.message ?? err}`,
    );
    useDeviceRegistry.releaseReservation(reservationToken);

    if (bridgeHandle) await bridgeHandle.stop().catch(() => {});
    if (portsAllocated) iosPortAllocator.release(body.udid);
    if (appiumSessionId) {
      try {
        await axios.delete(
          `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
          { timeout: 30_000 },
        );
      } catch {
        /* best-effort */
      }
    }

    if (err instanceof DeviceLockedError) {
      return res.status(423).json({
        error: 'device_locked',
        message: `iPhone ${body.udid} is locked. Unlock it, then try again.`,
      });
    }
    if (err instanceof TunnelNotRunningError) {
      return res.status(502).json({
        error: 'tunnel_not_running',
        message:
          'go-ios tunnel daemon is not running. Start it with: sudo ios tunnel start',
      });
    }
    if (err instanceof WDANotInstalledError) {
      return res.status(502).json({
        error: 'wda_not_installed',
        message: `WebDriverAgent runner not installed on device. Rebuild via Xcode (runner bundle id: ${IOS_RUNNER_BUNDLE_ID}).`,
      });
    }
    return res.status(502).json({
      error: 'bridge_start_failed',
      message: (err as Error)?.message ?? String(err),
    });
  }
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
  const session = useDeviceRegistry.get(sessionId);
  if (session?.platform === 'ios') {
    return handleIosWs(ws, sessionId);
  }
  const handle = bridgeHandles.get(sessionId);
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

async function handleIosWs(
  ws: WebSocket,
  sessionId: string,
): Promise<void> {
  const handle = iosBridgeHandles.get(sessionId);
  const session = useDeviceRegistry.get(sessionId);
  if (!handle || !session) {
    ws.close(1008, 'unknown session');
    return;
  }

  ws.on('close', () => {
    log.info(`[device-stream] ws closed for ${sessionId}`);
    void useDeviceRegistry.stop(sessionId);
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

  // Send initial META.
  ws.send(
    encodeIosMeta({
      deviceWidthPoints: handle.deviceWidthPoints,
      deviceHeightPoints: handle.deviceHeightPoints,
      deviceWidthPixels: handle.deviceWidthPixels,
      deviceHeightPixels: handle.deviceHeightPixels,
      scale: handle.scale,
    }),
    { binary: true },
  );

  // Subscribe to MJPEG fan-out.
  const MAX_BUFFERED = 1_000_000;
  const unsub = handle.mjpegFanout.subscribe((jpeg) => {
    if (ws.readyState !== ws.OPEN) return;
    if (ws.bufferedAmount > MAX_BUFFERED) return; // drop-oldest semantics
    ws.send(encodeIosFrame(jpeg), { binary: true });
  });
  ws.once('close', () => unsub());

  // Client → server.
  ws.on('message', async (raw, isBinary) => {
    if (!isBinary || !(raw instanceof Buffer)) return;
    const msg = decodeIosClientMessage(raw);
    if (!msg) return;

    try {
      if (msg.kind === 'tap') {
        await handle.wdaClient.tap(handle.sessionId, msg.x, msg.y);
      } else if (msg.kind === 'swipe') {
        await handle.wdaClient.drag(
          handle.sessionId,
          msg.x1,
          msg.y1,
          msg.x2,
          msg.y2,
          msg.durationMs,
        );
      } else if (msg.kind === 'intent') {
        if (msg.intent === 'home') {
          const bid = await handle.wdaClient.getActiveAppBundleId(
            handle.sessionId,
          );
          if (bid && bid !== 'com.apple.springboard') {
            await handle.wdaClient.terminateApp(handle.sessionId, bid);
          }
        } else if (msg.intent === 'app_switcher') {
          const w = handle.deviceWidthPoints;
          const h = handle.deviceHeightPoints;
          // Unvalidated gesture per spike 03; tune in manual verification.
          await handle.wdaClient.drag(
            handle.sessionId,
            w / 2,
            h - 5,
            w / 2,
            h * 0.55,
            350,
          );
        }
      }
    } catch (err) {
      log.warn(
        `[device-stream/ios] message dispatch failed: ${(err as Error)?.message}`,
      );
    }
  });
}
