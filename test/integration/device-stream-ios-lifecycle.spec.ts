import chai from 'chai';
import express from 'express';
import http from 'node:http';
import { WebSocket } from 'ws';
import { AddressInfo } from 'node:net';
import sinon from 'sinon';
import {
  registerDeviceStreamRoutes,
  attachDeviceStreamWebSocket,
} from '../../src/device-stream/router';
import * as deviceService from '../../src/data-service/device-service';
import { IOSWdaBridge } from '../../src/device-stream/ios/bridge';
import type { IOSBridgeHandle } from '../../src/device-stream/ios/bridge';
import type { MjpegFanout } from '../../src/device-stream/ios/mjpeg';
import {
  SRV_TAG_META,
  SRV_TAG_FRAME,
  CLIENT_TAP_TAG,
  CLIENT_INTENT_TAG,
  INTENT_HOME,
} from '../../src/device-stream/types';

const expect = chai.expect;

const TEST_UDID = 'IOS-TEST-UDID-LIFECYCLE';
const FAKE_WDA_SESSION_ID = 'wda-sid-test';
const FAKE_APPIUM_SESSION_ID = 'fake-appium-session-id';

/** Minimal fake MjpegFanout that lets the test push frames into subscribed handlers. */
function makeFakeMjpegFanout() {
  const handlers: Array<(jpeg: Buffer) => void> = [];
  const fanout = {
    subscribe(handler: (jpeg: Buffer) => void): () => void {
      handlers.push(handler);
      return () => {
        const idx = handlers.indexOf(handler);
        if (idx !== -1) handlers.splice(idx, 1);
      };
    },
    stop: sinon.stub().resolves(),
    emitFakeFrame(buf: Buffer): void {
      for (const h of handlers) {
        try { h(buf); } catch { /* test harness */ }
      }
    },
  };
  return fanout;
}

/** Build a fake IOSBridgeHandle whose wdaClient methods are sinon stubs. */
function makeFakeBridgeHandle(fanout: ReturnType<typeof makeFakeMjpegFanout>) {
  const wdaClient = {
    tap: sinon.stub().resolves(),
    drag: sinon.stub().resolves(),
    getActiveAppBundleId: sinon.stub().resolves('com.apple.Preferences'),
    terminateApp: sinon.stub().resolves(),
    deleteSession: sinon.stub().resolves(),
    setMjpegSettings: sinon.stub().resolves(),
  };

  const bridgeStop = sinon.stub().resolves();

  const handle: IOSBridgeHandle = {
    sessionId: FAKE_WDA_SESSION_ID,
    deviceWidthPoints: 428,
    deviceHeightPoints: 926,
    deviceWidthPixels: 1284,
    deviceHeightPixels: 2778,
    scale: 3,
    wdaClient: wdaClient as unknown as IOSBridgeHandle['wdaClient'],
    mjpegFanout: fanout as unknown as MjpegFanout,
    stop: bridgeStop,
  };

  return { handle, wdaClient, bridgeStop };
}

/** Wait up to `timeoutMs` for `predicate` to be true. Polls every 20 ms. */
async function waitFor(predicate: () => boolean, timeoutMs = 2000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('waitFor timed out');
    await new Promise((r) => setTimeout(r, 20));
  }
}

describe('device-stream iOS lifecycle (integration)', function () {
  this.timeout(30_000);

  let falxServer: http.Server;
  let appiumMockServer: http.Server;
  let baseUrl: string;
  let appiumMockPort: number;

  // Track open WS clients so afterEach can close them.
  const openWsClients: WebSocket[] = [];

  beforeEach((done) => {
    // ── 1. Appium mock: in-process express that accepts session create/delete ──
    const appiumApp = express();
    appiumApp.use(express.json());
    appiumApp.post('/wd/hub/session', (_req, res) => {
      res.json({ value: { sessionId: FAKE_APPIUM_SESSION_ID } });
    });
    appiumApp.delete('/wd/hub/session/:sid', (_req, res) => {
      res.json({ value: null });
    });

    appiumMockServer = http.createServer(appiumApp);
    appiumMockServer.listen(0, () => {
      appiumMockPort = (appiumMockServer.address() as AddressInfo).port;

      // ── 2. Falx test server ──
      const app = express();
      app.use(express.json());
      const router = express.Router();
      registerDeviceStreamRoutes(router, {
        port: 0,
        basePath: '/wd/hub',
        callbackPort: appiumMockPort,
      } as any);
      app.use('/device-farm/api/dashboard', router);
      falxServer = http.createServer(app);
      attachDeviceStreamWebSocket(falxServer);
      falxServer.listen(0, () => {
        const addr = falxServer.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        done();
      });
    });
  });

  afterEach((done) => {
    // Close any open WS clients first.
    for (const ws of openWsClients) {
      try { ws.close(); } catch { /* already closed */ }
    }
    openWsClients.length = 0;

    sinon.restore();

    let closed = 0;
    const onClose = () => { if (++closed === 2) done(); };
    falxServer.close(onClose);
    appiumMockServer.close(onClose);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper: stub all mocks and call /start, return the parsed JSON body.
  // ─────────────────────────────────────────────────────────────────────────────
  async function startIosSession() {
    const fanout = makeFakeMjpegFanout();
    const { handle, wdaClient, bridgeStop } = makeFakeBridgeHandle(fanout);

    // Stub static probes.
    sinon.stub(IOSWdaBridge, 'probeTunnel').resolves();
    sinon.stub(IOSWdaBridge, 'probeWdaInstalled').resolves();

    // Stub instance bridge.start.
    sinon.stub(IOSWdaBridge.prototype, 'start').resolves(
      handle as unknown as Awaited<ReturnType<IOSWdaBridge['start']>>,
    );

    // Stub getDevice.
    sinon.stub(deviceService, 'getDevice').resolves({
      udid: TEST_UDID,
      platform: 'iOS',
    } as any);

    const res = await fetch(`${baseUrl}/device-farm/api/dashboard/use-device/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ udid: TEST_UDID }),
    });

    return { res, fanout, wdaClient, bridgeStop, handle };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 1: /start happy path + WS META + FRAME + concurrent 409 + /stop idempotent
  // ─────────────────────────────────────────────────────────────────────────────
  it('/start returns 200 with platform:ios, correct dims/scale; WS emits META then FRAME; concurrent /start returns 409; /stop is idempotent', async () => {
    const { res, fanout, bridgeStop } = await startIosSession();

    // ── Assert /start 200 ──
    expect(res.status).to.equal(200);
    const body = (await res.json()) as {
      platform: string;
      deviceWidth: number;
      scale: number;
      sessionId: string;
      streamUrl: string;
    };
    expect(body.platform).to.equal('ios');
    expect(body.deviceWidth).to.equal(428);
    expect(body.scale).to.equal(3);
    const { sessionId, streamUrl } = body;

    // ── Open WS and collect messages ──
    const wsUrl = streamUrl.replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);
    openWsClients.push(ws);

    const messages: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      ws.on('error', reject);
      ws.on('message', (data) => {
        messages.push(data as Buffer);
        if (messages.length === 1) resolve(); // resolve once META arrives
      });
    });

    // ── Assert first message is SRV_TAG_META ──
    expect(messages).to.have.length.at.least(1);
    const metaBuf = messages[0]!;
    expect(metaBuf[0]).to.equal(SRV_TAG_META);
    const metaJson = JSON.parse(metaBuf.slice(1).toString('utf-8')) as {
      deviceWidthPoints: number;
      deviceHeightPoints: number;
      scale: number;
    };
    expect(metaJson.deviceWidthPoints).to.equal(428);
    expect(metaJson.deviceHeightPoints).to.equal(926);
    expect(metaJson.scale).to.equal(3);

    // ── Push a fake JPEG frame and assert SRV_TAG_FRAME arrives ──
    const fakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x01]);
    const framePromise = new Promise<Buffer>((resolve) => {
      ws.on('message', (data) => {
        const buf = data as Buffer;
        if (buf[0] === SRV_TAG_FRAME) resolve(buf);
      });
    });
    fanout.emitFakeFrame(fakeJpeg);
    const frameBuf = await framePromise;
    expect(frameBuf[0]).to.equal(SRV_TAG_FRAME);
    // wire: [SRV_TAG_FRAME, uint32BE(len), ...jpeg]
    const payloadLen = frameBuf.readUInt32BE(1);
    expect(payloadLen).to.equal(fakeJpeg.length);
    expect(frameBuf.slice(5)).to.deep.equal(fakeJpeg);

    // ── Concurrent /start for same UDID → 409 ──
    const res409 = await fetch(`${baseUrl}/device-farm/api/dashboard/use-device/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ udid: TEST_UDID }),
    });
    expect(res409.status).to.equal(409);
    const body409 = (await res409.json()) as { error: string };
    expect(body409.error).to.equal('device_busy');

    // ── /stop → 200, bridge.stop called once ──
    const stopRes = await fetch(
      `${baseUrl}/device-farm/api/dashboard/use-device/stop/${sessionId}`,
      { method: 'POST' },
    );
    expect(stopRes.status).to.equal(200);
    // Wait for async stop to propagate (registry is async).
    await waitFor(() => bridgeStop.callCount >= 1);
    expect(bridgeStop.callCount).to.equal(1);

    // ── Second /stop → still 200, bridge.stop NOT called again ──
    const stopRes2 = await fetch(
      `${baseUrl}/device-farm/api/dashboard/use-device/stop/${sessionId}`,
      { method: 'POST' },
    );
    expect(stopRes2.status).to.equal(200);
    // Give it a moment to settle.
    await new Promise((r) => setTimeout(r, 100));
    // Registry already removed the session; second stop is a no-op.
    expect(bridgeStop.callCount).to.equal(1);
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 2: CLIENT_TAP_TAG dispatches wdaClient.tap
  // ─────────────────────────────────────────────────────────────────────────────
  it('CLIENT_TAP_TAG sends correct tap(sessionId, x, y) to wdaClient', async () => {
    const { res, wdaClient } = await startIosSession();
    expect(res.status).to.equal(200);
    const body = (await res.json()) as { streamUrl: string; sessionId: string };

    // Open WS and wait for META before sending control message.
    const wsUrl = body.streamUrl.replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);
    openWsClients.push(ws);

    await new Promise<void>((resolve, reject) => {
      ws.on('error', reject);
      ws.on('message', (data) => {
        const buf = data as Buffer;
        if (buf[0] === SRV_TAG_META) resolve();
      });
    });

    // Build a tap message: [CLIENT_TAP_TAG, float32BE(x), float32BE(y)]
    const tapBuf = Buffer.alloc(9);
    tapBuf[0] = CLIENT_TAP_TAG;
    tapBuf.writeFloatBE(123.5, 1);
    tapBuf.writeFloatBE(456.75, 5);

    ws.send(tapBuf);

    await waitFor(() => wdaClient.tap.callCount >= 1);

    expect(wdaClient.tap.calledOnce).to.be.true;
    const [calledSessionId, calledX, calledY] = wdaClient.tap.firstCall.args;
    expect(calledSessionId).to.equal(FAKE_WDA_SESSION_ID);
    // Float32 round-trip precision — compare with tolerance.
    expect(calledX).to.be.closeTo(123.5, 0.01);
    expect(calledY).to.be.closeTo(456.75, 0.01);

    // Cleanup: stop the session.
    await fetch(
      `${baseUrl}/device-farm/api/dashboard/use-device/stop/${body.sessionId}`,
      { method: 'POST' },
    );
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Test 3: CLIENT_INTENT_TAG / HOME → getActiveAppBundleId → terminateApp
  // ─────────────────────────────────────────────────────────────────────────────
  it('CLIENT_INTENT_TAG / HOME calls getActiveAppBundleId then terminateApp', async () => {
    const { res, wdaClient } = await startIosSession();
    expect(res.status).to.equal(200);
    const body = (await res.json()) as { streamUrl: string; sessionId: string };

    const wsUrl = body.streamUrl.replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);
    openWsClients.push(ws);

    await new Promise<void>((resolve, reject) => {
      ws.on('error', reject);
      ws.on('message', (data) => {
        const buf = data as Buffer;
        if (buf[0] === SRV_TAG_META) resolve();
      });
    });

    // Build HOME intent message: [CLIENT_INTENT_TAG, INTENT_HOME]
    const intentBuf = Buffer.from([CLIENT_INTENT_TAG, INTENT_HOME]);
    ws.send(intentBuf);

    await waitFor(() => wdaClient.terminateApp.callCount >= 1);

    expect(wdaClient.getActiveAppBundleId.calledOnce).to.be.true;
    expect(wdaClient.terminateApp.calledOnce).to.be.true;
    const [calledSessionId, calledBundleId] = wdaClient.terminateApp.firstCall.args;
    expect(calledSessionId).to.equal(FAKE_WDA_SESSION_ID);
    expect(calledBundleId).to.equal('com.apple.Preferences');

    // Cleanup.
    await fetch(
      `${baseUrl}/device-farm/api/dashboard/use-device/stop/${body.sessionId}`,
      { method: 'POST' },
    );
  });
});
