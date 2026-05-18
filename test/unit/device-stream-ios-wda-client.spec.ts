import { expect } from 'chai';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { WDAClient, DeviceLockedError } from '../../src/device-stream/ios/wda-client';

async function withServer(
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
  block: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as AddressInfo).port;
  try {
    await block(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

describe('WDAClient', () => {
  it('getStatus returns ready=true when WDA returns 200', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/status') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ value: { ready: true } }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        const r = await c.getStatus();
        expect(r.ready).to.equal(true);
      },
    );
  });

  it('createSession POSTs bare-minimum caps and returns sessionId', async () => {
    let postedBody: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session' && req.method === 'POST') {
            postedBody = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ value: { sessionId: 'WDA-SESSION-ABC' } }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        const sid = await c.createSession();
        expect(sid).to.equal('WDA-SESSION-ABC');
        expect(postedBody).to.deep.equal({
          capabilities: { alwaysMatch: { platformName: 'iOS' } },
        });
      },
    );
  });

  it('getLocked returns boolean from value field', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID/wda/locked') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ value: true }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        expect(await c.getLocked('SID')).to.equal(true);
      },
    );
  });

  it('getScreen returns width/height/scale from value field', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID/wda/screen') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              value: {
                statusBarSize: { width: 428, height: 47 },
                scale: 3,
                screenSize: { width: 428, height: 926 },
              },
            }),
          );
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        const s = await c.getScreen('SID');
        expect(s).to.deep.equal({ width: 428, height: 926, scale: 3 });
      },
    );
  });

  it('tap posts x/y to /wda/tap', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/wda/tap' && req.method === 'POST') {
            posted = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ value: null }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.tap('SID', 263.5, 859.5);
        expect(posted).to.deep.equal({ x: 263.5, y: 859.5 });
      },
    );
  });

  it('drag posts fromX/fromY/toX/toY/duration (in seconds) to /wda/dragfromtoforduration', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/wda/dragfromtoforduration' && req.method === 'POST') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: null }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.drag('SID', 380, 463, 40, 463, 250);
        expect(posted).to.deep.equal({
          fromX: 380, fromY: 463, toX: 40, toY: 463, duration: 0.25,
        });
      },
    );
  });

  it('getActiveAppBundleId reads value.bundleId from /wda/activeAppInfo', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID/wda/activeAppInfo') {
          res.writeHead(200, {});
          res.end(JSON.stringify({ value: { bundleId: 'com.apple.Preferences' } }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        expect(await c.getActiveAppBundleId('SID')).to.equal('com.apple.Preferences');
      },
    );
  });

  it('terminateApp posts bundleId to /wda/apps/terminate', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/wda/apps/terminate') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: true }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.terminateApp('SID', 'com.apple.Preferences');
        expect(posted).to.deep.equal({ bundleId: 'com.apple.Preferences' });
      },
    );
  });

  it('setMjpegSettings POSTs to /appium/settings', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/appium/settings') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: {} }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.setMjpegSettings('SID', {
          mjpegServerFramerate: 20,
          mjpegServerScreenshotQuality: 70,
          mjpegScalingFactor: 100,
        });
        expect(posted).to.deep.equal({
          settings: {
            mjpegServerFramerate: 20,
            mjpegServerScreenshotQuality: 70,
            mjpegScalingFactor: 100,
          },
        });
      },
    );
  });

  it('deleteSession DELETEs /session/<sid>', async () => {
    let methodSeen = '';
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID') {
          methodSeen = req.method ?? '';
          res.writeHead(200, {}); res.end(JSON.stringify({ value: null }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.deleteSession('SID');
        expect(methodSeen).to.equal('DELETE');
      },
    );
  });

  it('setDispatchTunables POSTs waitForIdleTimeout:0 and animationCoolOffTimeout:0 to /appium/settings', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID-1/appium/settings') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: {} }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.setDispatchTunables('SID-1');
        expect(posted).to.deep.equal({
          settings: { waitForIdleTimeout: 0, animationCoolOffTimeout: 0 },
        });
      },
    );
  });
});
