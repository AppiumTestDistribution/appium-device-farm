import chai from 'chai';
import express from 'express';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import {
  registerDeviceStreamRoutes,
  attachDeviceStreamWebSocket,
} from '../../src/device-stream/router';

const expect = chai.expect;

describe('device-stream lifecycle (integration)', function () {
  this.timeout(30_000);
  let server: http.Server;
  let baseUrl: string;

  beforeEach((done) => {
    const app = express();
    app.use(express.json());
    const router = express.Router();
    registerDeviceStreamRoutes(router, {
      port: 0,
      basePath: '/wd/hub',
    } as any);
    app.use('/device-farm/api/dashboard', router);
    server = http.createServer(app);
    attachDeviceStreamWebSocket(server);
    server.listen(0, () => {
      const addr = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${addr.port}`;
      done();
    });
  });

  afterEach((done) => {
    server.close(() => done());
  });

  it('rejects start with missing udid', async () => {
    const res = await fetch(`${baseUrl}/device-farm/api/dashboard/use-device/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).to.equal(400);
  });
});
