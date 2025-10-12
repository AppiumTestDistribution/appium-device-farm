import { DeviceWithPath } from '@devicefarmer/adbkit';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import ip from 'ip';
import _ from 'lodash';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import { ATDRepository } from '../../src/data-service/db';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';
import * as Helper from '../../src/helpers';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import { getAdbOriginal } from './GetAdbOriginal';

chai.use(chaiAsPromised);

const sandbox = sinon.createSandbox();

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
      tags: [],
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
      Object.assign({}, DefaultPluginArgs, {
        platform: 'android',
        portRange: '8200-8210',
      }),
      4723,
      uuidv4(),
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    cloneAdb = await getCloneAdb();
    deviceList.set(adb, [{ udid: 'emulator-5554', state: 'device' }]);
    deviceList.set(cloneAdb, [{ udid: 'emulator-5555', state: 'device' }]);

    // console.log('deviceList', deviceList);

    const getConnectedDevicesStub = sandbox
      .stub(androidDevices, 'getConnectedDevices')
      .returns(Promise.resolve(deviceList));
    sandbox.stub(androidDevices, 'getDeviceSize').returns(
      Promise.resolve({
        screenWidth: '350',
        screenHeight: '600',
      }),
    );
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion' as any);
    getDeviceVersion.onFirstCall().returns(Promise.resolve('9'));
    getDeviceVersion.onSecondCall().returns(Promise.resolve('13'));
    sandbox.stub(androidDevices, 'getDeviceName' as any).returns(Promise.resolve('sdk_phone_x86'));
    sandbox
      .stub(androidDevices, 'getChromeVersion')
      .returns(Promise.resolve('/var/path/chromedriver'));
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice' as any);
    realDevice.onFirstCall().returns(Promise.resolve(false));
    realDevice.onSecondCall().returns(Promise.resolve(true));
    const getFreePortStub = sandbox.stub(Helper, 'getFreePort').returns(Promise.resolve(54321));

    const devices = await androidDevices.getDevices({ androidDeviceType: 'both' }, []);

    expect(androidDevices.getDevices({ androidDeviceType: 'both' }, [])).to.eventually.be.equal(
      deviceList,
    );
    expect(getConnectedDevicesStub.called).to.be.true;

    console.log('devices', devices);

    const expectedDevices = [
      {
        busy: false,
        adbRemoteHost: null,
        adbPort: 5037,
        name: 'sdk_phone_x86',
        state: 'device',
        tags: [],
        deviceType: 'emulator',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
        systemPort: 54321,
        width: '350',
        height: '600',
        liveStreaming: true,
        host: `http://${ip.address()}:4723`,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
        offline: false,
      },
      {
        busy: false,
        adbRemoteHost: '192.168.0.104',
        adbPort: 5037,
        width: '350',
        height: '600',
        tags: [],
        liveStreaming: true,
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
        offline: false,
      },
    ];

    // Verify that devices have valid UUIDs for id field
    devices.forEach((device) => {
      expect(device.id).to.be.a('string');
      expect(device.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    // Compare devices excluding the id field
    const devicesWithoutId = devices.map(({ id, ...device }) => device);
    expect(devicesWithoutId).to.deep.equal(expectedDevices);
    expect(getFreePortStub).to.have.been.calledWith('8200-8210');
  });

  it('Android Device List to have added state - Only emulators', async () => {
    const androidDevices = new AndroidDeviceManager(
      Object.assign({}, DefaultPluginArgs, { platform: 'android' }),
      4723,
      uuidv4(),
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'emulator-5555', state: 'device' },
    ]);
    sandbox.stub(androidDevices, 'getConnectedDevices' as any).returns(deviceList);
    sandbox.stub(androidDevices, 'getDeviceSize').returns(
      Promise.resolve({
        screenWidth: '350',
        screenHeight: '600',
      }),
    );
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion' as any);
    sandbox.stub(androidDevices, 'getChromeVersion' as any).returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName' as any).returns('sdk_phone_x86');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice' as any);
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort' as any).returns(54321);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'simulated' }, []);
    const expectedDevices = [
      {
        busy: false,
        adbPort: 5037,
        adbRemoteHost: null,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        tags: [],
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
        systemPort: 54321,
        width: '350',
        height: '600',
        liveStreaming: true,
        host: `http://${ip.address()}:4723`,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
        offline: false,
      },
    ];

    // Verify that devices have valid UUIDs for id field
    devices.forEach((device) => {
      expect(device.id).to.be.a('string');
      expect(device.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    // Compare devices excluding the id field
    const devicesWithoutId = devices.map(({ id, ...device }) => device);
    expect(devicesWithoutId).to.deep.equal(expectedDevices);
  });

  it('Android Device List to have added state - Only real devices', async () => {
    const androidDevices = new AndroidDeviceManager(
      Object.assign({}, DefaultPluginArgs, { platform: 'android' }),
      4723,
      uuidv4(),
    );
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    sandbox.stub(androidDevices, 'getConnectedDevices' as any).returns(deviceList);
    sandbox.stub(androidDevices, 'getDeviceSize').returns(
      Promise.resolve({
        screenWidth: '350',
        screenHeight: '600',
      }),
    );
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion' as any);
    sandbox.stub(androidDevices, 'getChromeVersion' as any).returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName' as any).returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice' as any);
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort' as any).returns(54322);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'real' }, []);
    const expectedDevices = [
      {
        busy: false,
        name: 'Nexus 6',
        adbPort: 5037,
        adbRemoteHost: null,
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        tags: [],
        realDevice: true,
        udid: 'YOGAA1BBB4124',
        width: '350',
        height: '600',
        liveStreaming: true,
        platform: 'android',
        systemPort: 54322,
        host: `http://${ip.address()}:4723`,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
        offline: false,
      },
    ];

    // Verify that devices have valid UUIDs for id field
    devices.forEach((device) => {
      expect(device.id).to.be.a('string');
      expect(device.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    // Compare devices excluding the id field
    const devicesWithoutId = devices.map(({ id, ...device }) => device);
    expect(devicesWithoutId).to.deep.equal(expectedDevices);
  });
  it('Android Device List to have host as remoteMachineProxyIP if provided', async () => {
    (await ATDRepository.DeviceModel).removeDataOnly();
    const pluginArgs = Object.assign({}, DefaultPluginArgs, {
      platform: 'android',
      'device-types': 'both',
      skipChromeDownload: true,
      remoteMachineProxyIP: 'http://10.1.1.1:3333',
    });
    const androidDevices = new AndroidDeviceManager(pluginArgs, 4723, uuidv4());
    const deviceList = new Map();
    adb = await getAdbOriginal();
    deviceList.set(adb, [
      { udid: 'emulator-5554', state: 'device' },
      { udid: 'YOGAA1BBB4124', state: 'device' },
    ]);
    sandbox.stub(androidDevices, 'getConnectedDevices' as any).returns(deviceList);
    sandbox.stub(androidDevices, 'getDeviceSize').returns(
      Promise.resolve({
        screenWidth: '350',
        screenHeight: '600',
      }),
    );
    const getDeviceVersion = sandbox.stub(androidDevices, 'getDeviceVersion' as any);
    sandbox.stub(androidDevices, 'getChromeVersion' as any).returns('/var/path/chromedriver');
    getDeviceVersion.onFirstCall().returns('9');
    getDeviceVersion.onSecondCall().returns('13');
    sandbox.stub(androidDevices, 'getDeviceName' as any).returns('Nexus 6');
    const realDevice = sandbox.stub(androidDevices, 'isRealDevice' as any);
    realDevice.onFirstCall().returns(false);
    realDevice.onSecondCall().returns(true);
    sandbox.stub(Helper, 'getFreePort' as any).returns(54322);
    const devices = await androidDevices.getDevices({ androidDeviceType: 'real' }, []);
    const expectedDevices = [
      {
        busy: false,
        name: 'Nexus 6',
        adbPort: 5037,
        adbRemoteHost: null,
        state: 'device',
        deviceType: 'real',
        sdk: '13',
        realDevice: true,
        tags: [],
        udid: 'YOGAA1BBB4124',
        platform: 'android',
        systemPort: 54322,
        width: '350',
        height: '600',
        liveStreaming: true,
        host: 'http://10.1.1.1:3333',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        chromeDriverPath: '/var/path/chromedriver',
        userBlocked: false,
        offline: false,
      },
    ];

    // Verify that devices have valid UUIDs for id field
    devices.forEach((device) => {
      expect(device.id).to.be.a('string');
      expect(device.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    // Compare devices excluding the id field
    const devicesWithoutId = devices.map(({ id, ...device }) => device);
    expect(devicesWithoutId).to.deep.equal(expectedDevices);
  });

  it('Should handle error when adb doesnt respond', async () => {
    // mock getDeviceProperty
    const androidDevices = new AndroidDeviceManager(
      Object.assign({}, DefaultPluginArgs, { platform: 'android' }),
      4723,
      uuidv4(),
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

    sandbox.stub(androidDevices, 'getConnectedDevices' as any).returns(deviceList);
    sandbox.stub(androidDevices, 'getChromeVersion' as any).returns('/var/path/chromedriver');
    sandbox.stub(adb, 'adbExec').callsFake(mockAdbExec);

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
      Object.assign({}, DefaultPluginArgs, { platform: 'android' }),
      4723,
      uuidv4(),
    );
    adb = await getAdbOriginal();
    sandbox
      .stub(androidDevices, 'waitBootComplete' as any)
      .throwsException(new Error('Adb timeout'));

    androidDevices.onDeviceAdded(adb, {
      udid: 'emulator-9999',
      state: 'device',
    } as any as DeviceWithPath).should.not.throw;
  });
});
