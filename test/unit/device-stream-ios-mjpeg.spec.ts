import { expect } from 'chai';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { MjpegFanout } from '../../src/device-stream/ios/mjpeg';

const BOUNDARY = '--BoundaryStringTest';

function jpegPart(jpeg: Buffer): Buffer {
  // WDA-style frame: boundary line, Content-Type/Length headers, blank line, JPEG, blank line.
  return Buffer.concat([
    Buffer.from(`${BOUNDARY}\r\n`),
    Buffer.from(`Content-Type: image/jpeg\r\n`),
    Buffer.from(`Content-Length: ${jpeg.length}\r\n\r\n`),
    jpeg,
    Buffer.from(`\r\n`),
  ] as Uint8Array[]);
}

describe('MjpegFanout', () => {
  it('extracts JPEG frames from a WDA-style multipart stream using the boundary verbatim', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      res.write(jpegPart(Buffer.from([0xff, 0xd8, 0x01, 0x02])));
      res.write(jpegPart(Buffer.from([0xff, 0xd8, 0x03, 0x04])));
      res.end(jpegPart(Buffer.from([0xff, 0xd8, 0x05, 0x06])));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    const received: Buffer[] = [];
    fan.subscribe((j: Buffer) => received.push(j));
    await fan.start();
    // wait a short tick for stream draining
    await new Promise((r) => setTimeout(r, 200));
    await fan.stop();
    server.close();

    expect(received).to.have.length(3);
    expect(received[0]).to.deep.equal(Buffer.from([0xff, 0xd8, 0x01, 0x02]));
    expect(received[1]).to.deep.equal(Buffer.from([0xff, 0xd8, 0x03, 0x04]));
    expect(received[2]).to.deep.equal(Buffer.from([0xff, 0xd8, 0x05, 0x06]));
  });

  it('fans out one upstream stream to multiple subscribers', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      res.write(jpegPart(Buffer.from([0xaa])));
      res.write(jpegPart(Buffer.from([0xbb])));
      res.end(jpegPart(Buffer.from([0xcc])));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    const a: Buffer[] = [];
    const b: Buffer[] = [];
    fan.subscribe((j: Buffer) => a.push(j));
    fan.subscribe((j: Buffer) => b.push(j));
    await fan.start();
    await new Promise((r) => setTimeout(r, 200));
    await fan.stop();
    server.close();

    expect(a).to.have.length(3);
    expect(b).to.have.length(3);
  });

  it('unsubscribe stops further frames to that subscriber', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      const interval = setInterval(() => {
        res.write(jpegPart(Buffer.from([0x01])));
      }, 20);
      req.on('close', () => clearInterval(interval));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    const received: Buffer[] = [];
    const unsub = fan.subscribe((j: Buffer) => received.push(j));
    await fan.start();
    await new Promise((r) => setTimeout(r, 100));
    const countAfterFirst = received.length;
    unsub();
    await new Promise((r) => setTimeout(r, 100));
    expect(received.length).to.equal(countAfterFirst);

    await fan.stop();
    server.close();
  });

  it('stop() closes the upstream fetch and is idempotent', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      const interval = setInterval(() => res.write(jpegPart(Buffer.from([0xff]))), 30);
      req.on('close', () => clearInterval(interval));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    await fan.start();
    await new Promise((r) => setTimeout(r, 60));
    await fan.stop();
    await fan.stop(); // no throw

    server.close();
  });
});
