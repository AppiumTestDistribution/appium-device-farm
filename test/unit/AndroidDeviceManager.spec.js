import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';
import * as Helper from '../../src/helpers';
import * as DeviceUtils from '../../src/device-utils';
import { getAdbOriginal } from './GetAdbOriginal';
import ip from 'ip';

var sandbox = sinon.createSandbox();

const cliArgs = {
  'device-farm': {
    platform: 'android',
    'device-types': 'both',
    skipChromeDownload: true,
  },
};
let adb;
let cloneAdb;

describe('Android Device Manager', function () {
  this.timeout(500000);
  afterEach(function () {
    sandbox.restore();
  });

  async function getCloneAdb() {
    return await adb.clone({
      remoteAdbHost: '192.168.0.104',
      adbPort: 5037,
      udid: null,
      appDeviceReadyTimeout: null,
      useKeystore: null,
      keystorePath: null,
      keystorePassword: null,
      keyAlias: null,
      keyPassword: null,
      curDeviceId: null,
      emulatorPort: null,
      logcat: null,
      instrumentProc: null,
      suppressKillServer: null,
      jars: {},
      adbHost: '192.168.0.104',
      adbExecTimeout: 20000,
      remoteAppsCacheLimit: 10,
      buildToolsVersion: null,
      allowOfflineDevices: false,
      allowDelayAdb: true,
    });
  }

  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    const deviceList = new Map();
    adb = await getAdbOriginal();
    cloneAdb = await getCloneAdb();
    deviceList.set(adb, [{ udid: 'emulator-5554', state: 'device' }]);
    deviceList.set(cloneAdb, [{ udid: 'emulator-5555', state: 'device' }]);

    sandbox.stub(androidDevices, 'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54321);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices('both', [], { port: 4723, plugin: cliArgs });
    expect(devices).to.deep.equal([
      {
        busy: false,
        adbRemoteHost: null,
        adbPort: 5037,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
        systemPort: 54321,
        host: `http://${ip.address()}:4723`,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
      },
      {
        busy: false,
        adbRemoteHost: '192.168.0.104',
        adbPort: 5037,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        realDevice: true,
        udid: 'emulator-5555',
        platform: 'android',
        systemPort: 54321,
        host: 'http://192.168.0.104:5037',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
      },
    ]);
  });

  it('Android Device List to have added state - Only emulators', async () => {
    const androidDevices = new AndroidDeviceManager();
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'emulator-5555', state: 'device' },
    ]);
    sandbox.stub(androidDevices, 'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54321);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'simulated' }, [], {
      port: 4723,
      plugin: cliArgs,
    });
    expect(devices).to.deep.equal([
      {
        busy: false,
        adbPort: 5037,
        adbRemoteHost: null,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
        systemPort: 54321,
        host: `http://${ip.address()}:4723`,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
      },
    ]);
  });

  it('Android Device List to have added state - Only real devices', async () => {
    const androidDevices = new AndroidDeviceManager();
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    sandbox.stub(androidDevices, 'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54322);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'real' }, [], {
      port: 4723,
      plugin: cliArgs,
    });
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'Nexus 6',
        adbPort: 5037,
        adbRemoteHost: null,
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        realDevice: true,
        udid: 'YOGAA1BBB4124',
        platform: 'android',
        systemPort: 54322,
        host: `http://${ip.address()}:4723`,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
      },
    ]);
  });
  it('Android Device List to have host as remoteMachineProxyIP if provided', async () => {
    const androidDevices = new AndroidDeviceManager();
    const deviceList = new Map();
    const cliArgs = {
      'device-farm': {
        platform: 'android',
        'device-types': 'both',
        skipChromeDownload: true,
        remoteMachineProxyIP: 'http://10.1.1.1:3333',
      },
    };
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    sandbox.stub(androidDevices, 'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName').returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54322);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'real' }, [], {
      port: 4723,
      plugin: cliArgs,
    });
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'Nexus 6',
        adbPort: 5037,
        adbRemoteHost: null,
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        realDevice: true,
        udid: 'YOGAA1BBB4124',
        platform: 'android',
        systemPort: 54322,
        host: 'http://10.1.1.1:3333',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
      },
    ]);
  });
});
