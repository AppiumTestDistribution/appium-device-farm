import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';
import * as Helper from '../../src/helpers';
import * as DeviceUtils from '../../src/device-utils';
import { getAdbOriginal } from './GetAdbOriginal';
import ip from 'ip';
import _ from 'lodash';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import { DeviceModel } from '../../src/data-service/db';
import { DeviceWithPath } from '@devicefarmer/adbkit';

var sandbox = sinon.createSandbox();

let adb: any;
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
    const androidDevices = new AndroidDeviceManager(
      Object.assign(DefaultPluginArgs, { platform: 'android' }),
      4723,
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    cloneAdb = await getCloneAdb();
    deviceList.set(adb, [{ udid: 'emulator-5554', state: 'device' }]);
    deviceList.set(cloneAdb, [{ udid: 'emulator-5555', state: 'device' }]);

    sandbox.stub(androidDevices, 'getConnectedDevices').returns(Promise.resolve(deviceList));
    const getDeviceVersion = sandbox.stub(androidDevices, <any>'getDeviceVersion');
    getDeviceVersion.onFirstCall().returns(Promise.resolve('9'));
    getDeviceVersion.onSecondCall().returns(Promise.resolve('13'));
    sandbox.stub(androidDevices, <any>'getDeviceName').returns(Promise.resolve('sdk_phone_x86'));
    sandbox
      .stub(androidDevices, 'getChromeVersion')
      .returns(Promise.resolve('/var/path/chromedriver'));
    const realDevice = sandbox.stub(androidDevices, <any>'isRealDevice');
    realDevice.onFirstCall().returns(Promise.resolve(false));
    realDevice.onSecondCall().returns(Promise.resolve(true));
    sandbox.stub(Helper, 'getFreePort').returns(Promise.resolve(54321));
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(Promise.resolve(0));
    const devices = await androidDevices.getDevices({ androidDeviceType: 'both' }, []);
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
    const androidDevices = new AndroidDeviceManager(
      Object.assign(DefaultPluginArgs, { platform: 'android' }),
      4723,
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'emulator-5555', state: 'device' },
    ]);
    sandbox.stub(androidDevices, <any>'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, <any>'getDeviceVersion');
    sandbox.stub(androidDevices, <any>'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, <any>'getDeviceName').returns('sdk_phone_x86');
    const realDevice = sandbox.stub(androidDevices, <any>'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, <any>'getFreePort').returns(54321);
    sandbox.stub(DeviceUtils, <any>'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'simulated' }, []);
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
    const androidDevices = new AndroidDeviceManager(
      Object.assign(DefaultPluginArgs, { platform: 'android' }),
      4723,
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    sandbox.stub(androidDevices, <any>'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, <any>'getDeviceVersion');
    sandbox.stub(androidDevices, <any>'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, <any>'getDeviceName').returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, <any>'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, <any>'getFreePort').returns(54322);
    sandbox.stub(DeviceUtils, <any>'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'real' }, []);
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
    DeviceModel.removeDataOnly();
    const pluginArgs = Object.assign(DefaultPluginArgs, {
      platform: 'android',
      'device-types': 'both',
      skipChromeDownload: true,
      remoteMachineProxyIP: 'http://10.1.1.1:3333',
    });
    const androidDevices = new AndroidDeviceManager(pluginArgs, 4723);
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    sandbox.stub(androidDevices, <any>'getConnectedDevices').returns(deviceList);
    const getDeviceVersion = sandbox.stub(androidDevices, <any>'getDeviceVersion');
    sandbox.stub(androidDevices, <any>'getChromeVersion').returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, <any>'getDeviceName').returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, <any>'isRealDevice');
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, <any>'getFreePort').returns(54322);
    sandbox.stub(DeviceUtils, <any>'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'real' }, []);
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

  it("Should handle error when adb doesn't respond", async () => {
    // mock getDeviceProperty
    const androidDevices = new AndroidDeviceManager(
      Object.assign(DefaultPluginArgs, { platform: 'android' }),
      4723,
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-9999', state: 'device' },
      { udid: 'emulator-7777', state: 'device' },
    ]);

    const mockAdbExec = (args: any) => {
      if (args.includes('emulator-9999')) {
        return Promise.reject(new Error('Adb timeout'));
      } else {
        return Promise.resolve('foo');
      }
    };

    sandbox.stub(androidDevices, <any>'getConnectedDevices').returns(deviceList);
    sandbox.stub(androidDevices, <any>'getChromeVersion').returns('/var/path/chromedriver');
    sandbox.stub(adb, <any>'adbExec').callsFake(mockAdbExec);

    const devices = await androidDevices.getDevices({ androidDeviceType: 'both' }, []);

    const resultDevices = _.map(devices, (device) => {
      return { udid: device.udid };
    });
    // check that emulator-7777 is returned and emulator-9999 is not
    expect(resultDevices).to.have.deep.members([
      {
        udid: 'emulator-7777',
      },
    ]);

    expect(resultDevices).to.not.have.deep.members([
      {
        udid: 'emulator-9999',
      },
    ]);
  });

  it('should handle device never completing boot', async () => {
    // mock getDeviceProperty
    const androidDevices = new AndroidDeviceManager(
      Object.assign(DefaultPluginArgs, { platform: 'android' }),
      4723,
    );
    adb = await getAdbOriginal();
    sandbox.stub(androidDevices, <any>'waitBootComplete').throwsException(new Error('Adb timeout'));

    androidDevices.onDeviceAdded(adb, {
      udid: 'emulator-9999',
      state: 'device',
    } as any as DeviceWithPath).should.not.throw;
  });
});
