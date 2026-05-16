import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { AndroidScrcpyBridge } from '../../src/device-stream/android/bridge';

chai.use(sinonChai);
const expect = chai.expect;

describe('AndroidScrcpyBridge', () => {
  let sandbox: sinon.SinonSandbox;
  let mockAdb: any;
  let mockScrcpy: any;
  let bridge: AndroidScrcpyBridge;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockAdb = {
      subprocess: {
        shellProtocol: { spawn: sandbox.stub().resolves({ exit: Promise.resolve(0) }) },
      },
    };
    mockScrcpy = {
      videoStream: Promise.resolve({
        metadata: { codec: 0 /* h264 */ },
        stream: { pipeTo: sandbox.stub().resolves() },
        sizeChanged: sandbox.stub(),
      }),
      controller: {
        injectTouch: sandbox.stub().resolves(),
        injectKeyCode: sandbox.stub().resolves(),
      },
      output: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
      close: sandbox.stub().resolves(),
    };
    bridge = new AndroidScrcpyBridge(mockAdb as any, {
      jarPath: '/fake/path/scrcpy-server.jar',
      scrcpyFactory: sandbox.stub().resolves(mockScrcpy),
      pushJar: sandbox.stub().resolves(),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('kills leftover scrcpy processes before starting', async () => {
    await bridge.start();
    expect(mockAdb.subprocess.shellProtocol.spawn).to.have.been.calledWith(
      sinon.match(/pkill.*com.genymobile.scrcpy.Server/),
    );
  });

  it('returns dimensions from sizeChanged', async () => {
    const handle = await bridge.start();
    const sizeChangedHandler = mockScrcpy.videoStream.then((v: any) =>
      v.sizeChanged.firstCall.args[0],
    );
    const handler = await sizeChangedHandler;
    handler({ width: 528, height: 1080 });
    expect(handle.getDimensions()).to.deep.equal({ width: 528, height: 1080 });
  });

  it('stop() is idempotent', async () => {
    const handle = await bridge.start();
    await handle.stop();
    await handle.stop();
    expect(mockScrcpy.close).to.have.been.calledOnce;
  });

  it('forwards touch via injectTouch in device-pixel space', async () => {
    const handle = await bridge.start();
    const sizeHandler = (await mockScrcpy.videoStream).sizeChanged.firstCall.args[0];
    sizeHandler({ width: 528, height: 1080 });
    await handle.injectTouch({ action: 0, normX: 0.5, normY: 0.75 });
    expect(mockScrcpy.controller.injectTouch).to.have.been.calledOnce;
    const arg = mockScrcpy.controller.injectTouch.firstCall.args[0];
    expect(arg.pointerX).to.equal(264);
    expect(arg.pointerY).to.equal(810);
    expect(arg.action).to.equal(0);
  });

  it('forwards keycode via injectKeyCode', async () => {
    const handle = await bridge.start();
    await handle.injectKeycode(3 /* HOME */);
    expect(mockScrcpy.controller.injectKeyCode).to.have.been.calledWith(
      sinon.match({ keyCode: 3 }),
    );
  });
});
