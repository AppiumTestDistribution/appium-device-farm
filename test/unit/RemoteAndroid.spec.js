import Sinon from 'sinon';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';
import * as Helper from '../../src/helpers';
import * as DeviceUtils from '../../src/device-utils';
import { expect } from 'chai';
import { getAdbOriginal } from './GetAdbOriginal';
import axios from 'axios';
const firstNode = 'http://192.168.0.103';
const secondNode = 'http://192.168.0.104';
const cliArgs = {
  'device-farm': {
    platform: 'android',
    'device-types': 'both',
    skipChromeDownload: true,
    remote: [`http://${firstNode}:3000`, `http://${secondNode}:3000`, 'http://127.0.0.1:4723'],
  },
};
describe.skip('Remote Android', () => {
  const stubResponse = {
    data: [
      {
        busy: false,
        adbPort: 5037,
        adbRemoteHost: null,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: true,
        udid: 'emulator-5555',
        platform: 'android',
        systemPort: 54322,
        chromeDriverPath: '/var/path/chromedriver',
        meta: {
          revision: 0,
          created: 1661836020465,
          version: 0,
        },
        $loki: 1,
      },
    ],
  };
  let stub;
  let sandbox;
  afterEach(() => {
    stub.restore();
    sandbox.restore();
  });
  it('Fetch remote devices', async function () {
    sandbox = Sinon.createSandbox();

    stub = Sinon.stub(axios, 'get').resolves(stubResponse);
    const androidDevices = new AndroidDeviceManager();
    const deviceList = new Map();
    const adb = await getAdbOriginal();
    deviceList.set(adb, [{ udid: 'emulator-5554', state: 'device' }]);
    sandbox.stub(androidDevices, 'getConnectedDevices').returns(deviceList);
    sandbox.stub(androidDevices, 'getDeviceVersion').returns('9');
    sandbox.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sandbox.stub(androidDevices, 'getChromeVersion').returns('/var/path/chromedriver');
    sandbox.stub(androidDevices, 'isRealDevice').returns(false);
    sandbox.stub(Helper, 'getFreePort').returns(54321);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await androidDevices.getDevices('both', [], { port: 4723, plugin: cliArgs });
    const expected = [
      {
        busy: false,
        adbPort: 5037,
        adbRemoteHost: null,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: true,
        udid: 'emulator-5555',
        platform: 'android',
        systemPort: 54322,
        host: `http://${firstNode}:3000`,
        chromeDriverPath: '/var/path/chromedriver',
      },
      {
        busy: false,
        adbPort: 5037,
        adbRemoteHost: null,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: true,
        udid: 'emulator-5555',
        platform: 'android',
        systemPort: 54322,
        host: `http://${secondNode}:3000`,
        chromeDriverPath: '/var/path/chromedriver',
      },
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
        host: 'http://127.0.0.1:4723',
        chromeDriverPath: '/var/path/chromedriver',
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
      },
    ];
    expect(devices).to.deep.equal(expected);
  });
});
