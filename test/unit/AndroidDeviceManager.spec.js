import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';
import * as Helper from '../../src/helpers';
var sandbox = sinon.createSandbox();

const cliArgs = {
  'device-farm': {
    platform: 'android',
    'device-types': 'both',
    remote: ['http://127.0.0.1:4723'],
    skipChromeDownload: true,
  },
};
describe('Android Device Manager', function () {
  this.timeout(500000);
  afterEach(function () {
    sandbox.restore();
  });
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    sandbox.stub(androidDevices, 'getConnectedDevices').returns([
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'emulator-5555', state: 'device' },
    ]);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54321);
    const devices = await androidDevices.getDevices('both', [], { port: 4723, plugin: cliArgs });
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
        systemPort: 54321,
        host: 'http://127.0.0.1:4723',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
      },
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        realDevice: true,
        udid: 'emulator-5555',
        platform: 'android',
        systemPort: 54321,
        host: 'http://127.0.0.1:4723',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
      },
    ]);
  });

  it('Android Device List to have added state - Only emulators', async () => {
    const androidDevices = new AndroidDeviceManager();
    sandbox.stub(androidDevices, 'getConnectedDevices').returns([
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'emulator-5555', state: 'device' },
    ]);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54321);
    const devices = await androidDevices.getDevices('simulated', [], {
      port: 4723,
      plugin: cliArgs,
    });
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
        systemPort: 54321,
        host: 'http://127.0.0.1:4723',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
      },
    ]);
  });

  it('Android Device List to have added state - Only real devices', async () => {
    const androidDevices = new AndroidDeviceManager();
    sandbox.stub(androidDevices, 'getConnectedDevices').returns([
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54322);
    const devices = await androidDevices.getDevices('real', [], { port: 4723, plugin: cliArgs });
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'Nexus 6',
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        realDevice: true,
        udid: 'YOGAA1BBB4124',
        platform: 'android',
        systemPort: 54322,
        host: 'http://127.0.0.1:4723',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
      },
    ]);
  });
});
