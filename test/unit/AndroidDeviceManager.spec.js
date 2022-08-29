import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';
import * as Helper from '../../src/helpers';
var sandbox = sinon.createSandbox();

describe('Android Device Manager', () => {
  afterEach(function () {
    sandbox.restore();
  });
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    sandbox
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5554', state: 'device' }]);
    sandbox.stub(androidDevices, 'getDeviceVersion').returns('9');
    sandbox.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sandbox.stub(androidDevices, 'isRealDevice').returns(false);
    sandbox.stub(Helper, 'getFreePort').returns(54321);
    const devices = await androidDevices.getDevices(true, [], { port: 4723, plugin: '' });
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
      },
    ]);
  });

  it('Android Device List to have added state - Include emulators with real devices', async () => {
    const androidDevices = new AndroidDeviceManager();
    const existingDevices = [
      {
        udid: 'emulator-5554',
        deviceType: 'emulator',
        realDevice: false,
        state: 'device',
        sdk: '9',
        name: 'sdk_phone_x86',
        host: '127.0.0.1',
      },
      {
        udid: 'samsung_galaxy_s10',
        deviceType: 'real',
        realDevice: true,
        state: 'device',
        sdk: '9',
        name: 'sdk_phone_x86',
        host: '127.0.0.1',
      },
    ];
    sandbox.stub(androidDevices, 'getConnectedDevices').returns(existingDevices);
    const devices = await androidDevices.getDevices(false, existingDevices);
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'real',
        sdk: '9',
        realDevice: true,
        udid: 'samsung_galaxy_s10',
        host: '127.0.0.1',
      },
    ]);
  });

  it('Android Device List to have added state - Only real devices', async () => {
    const androidDevices = new AndroidDeviceManager();
    const existingDevices = [
      {
        udid: 'emulator-5554',
        deviceType: 'emulator',
        realDevice: false,
        state: 'device',
        sdk: '9',
        name: 'sdk_phone_x86',
        host: '127.0.0.1',
      },
      {
        udid: 'samsung_galaxy_s10',
        deviceType: 'real',
        realDevice: true,
        state: 'device',
        sdk: '9',
        name: 'sdk_phone_x86',
        host: '127.0.0.1',
      },
    ];
    sandbox.stub(androidDevices, 'getConnectedDevices').returns(existingDevices);
    const devices = await androidDevices.getDevices(false, existingDevices);
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        deviceType: 'real',
        state: 'device',
        sdk: '9',
        realDevice: true,
        udid: 'samsung_galaxy_s10',
        host: '127.0.0.1',
      },
    ]);
  });
});
