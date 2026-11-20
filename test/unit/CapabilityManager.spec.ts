import { expect } from 'chai';
import sinon from 'sinon';
import { iOSCapabilities } from '../../src/CapabilityManager';
import * as DeviceService from '../../src/data-service/device-service';
import * as Helpers from '../../src/helpers';
import { IDevice } from '../../src/interfaces/IDevice';
import { ISessionCapability } from '../../src/interfaces/ISessionCapability';
import * as PrismaModule from '../../src/prisma';

describe('iOS recording capabilities', () => {
  const sandbox = sinon.createSandbox();
  let allocatedPorts: sinon.SinonSpy;
  let updateDevice: sinon.SinonStub;

  function device(udid: string, realDevice = true): IDevice {
    return {
      udid,
      name: 'Test iPhone',
      platform: 'ios',
      sdk: '17.0',
      realDevice,
      derivedDataPath: '/tmp/device-farm-test-derived-data',
    } as IDevice;
  }

  function capabilities(): ISessionCapability {
    return {
      alwaysMatch: { platformName: 'iOS', 'appium:automationName': 'XCUITest' },
      firstMatch: [{}],
    };
  }

  beforeEach(() => {
    // Exercise the real allocator, including its protection against concurrent allocation.
    allocatedPorts = sandbox.spy(Helpers, 'getFreePort');
    updateDevice = sandbox.stub(DeviceService, 'updatedAllocatedDevice').resolves();
    sandbox.stub(PrismaModule, 'prisma').value({
      appInformation: { findFirst: sandbox.stub().resolves(null) },
    });
  });

  afterEach(async () => {
    const results = await Promise.allSettled(allocatedPorts.returnValues);
    for (const result of results) {
      if (result.status === 'fulfilled') Helpers.releasePort(result.value);
    }
    sandbox.restore();
  });

  for (const realDevice of [true, false]) {
    it(`assigns an MJPEG port to a ${realDevice ? 'real device' : 'simulator'}`, async () => {
      const caps = capabilities();
      const selectedDevice = device('test-device', realDevice);

      await iOSCapabilities(caps, selectedDevice, {});

      const port = caps.firstMatch[0]['appium:mjpegServerPort'];
      expect(port).to.be.a('number').and.be.within(1, 65535);
      expect(port).not.to.equal(caps.firstMatch[0]['appium:wdaLocalPort']);
      expect(selectedDevice.mjpegServerPort).to.equal(port);
      expect(updateDevice.calledOnceWith(selectedDevice, sinon.match({ mjpegServerPort: port }))).to
        .be.true;
    });
  }

  for (const location of ['alwaysMatch', 'firstMatch']) {
    it(`replaces a shared MJPEG port supplied in ${location}`, async () => {
      const caps = capabilities();
      const clientCaps = location === 'alwaysMatch' ? caps.alwaysMatch : caps.firstMatch[0];
      clientCaps['appium:mjpegServerPort'] = 9100;

      await iOSCapabilities(caps, device('test-device'), { portRange: '49152-49252' });

      expect(caps.firstMatch[0]['appium:mjpegServerPort']).to.be.within(49152, 49252);
      expect(caps.alwaysMatch).not.to.have.property('appium:mjpegServerPort');
    });
  }

  it('allocates distinct recording and WDA ports for concurrent sessions', async () => {
    const sessions = Array.from({ length: 3 }, (_, index) => ({
      caps: capabilities(),
      device: device(`test-device-${index}`),
    }));

    await Promise.all(sessions.map(({ caps, device }) => iOSCapabilities(caps, device, {})));

    const ports = sessions.flatMap(({ caps }) => [
      caps.firstMatch[0]['appium:mjpegServerPort'],
      caps.firstMatch[0]['appium:wdaLocalPort'],
    ]);
    expect(ports.every((port) => Number.isInteger(port) && port > 0)).to.be.true;
    expect(new Set(ports).size).to.equal(6);
  });

  it('uses the configured port range for both recording and WDA', async () => {
    const caps = capabilities();

    await iOSCapabilities(caps, device('test-device'), { portRange: '49152-49252' });

    expect(caps.firstMatch[0]['appium:mjpegServerPort']).to.be.within(49152, 49252);
    expect(caps.firstMatch[0]['appium:wdaLocalPort']).to.be.within(49152, 49252);
    expect(allocatedPorts.callCount).to.equal(2);
    expect(allocatedPorts.alwaysCalledWithExactly('49152-49252')).to.be.true;
  });
});
