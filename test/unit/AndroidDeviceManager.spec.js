import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';

describe('Android Device Manager', () => {
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    sinon
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5554', state: 'device' }]);
    sinon.stub(androidDevices, 'getDeviceVersion').returns('9');
    sinon.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sinon.stub(androidDevices, 'isRealDevice').returns(false);
    const devices = await androidDevices.getDevices(true, []);
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
      },
    ]);
  });

  it('Android Device List to have added state - Include emulators with real devices', async () => {
    const androidDevices = new AndroidDeviceManager();
    const existingDevices = [
      { udid: 'emulator-5554', deviceType: 'emulator', realDevice: false, state: 'device', sdk: '9', name:'sdk_phone_x86' },
      { udid: 'samsung_galaxy_s10', deviceType: 'real', realDevice: true, state: 'device', sdk: '9', name:'sdk_phone_x86' },
    ];
    sinon
    .stub(androidDevices, 'getConnectedDevices')
    .returns(existingDevices);
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
      },
    ]);
  });

  it('Android Device List to have added state - Only real devices', async () => {
    const androidDevices = new AndroidDeviceManager();
    const existingDevices = [
      { udid: 'emulator-5554', deviceType: 'emulator', realDevice: false, state: 'device', sdk: '9', name:'sdk_phone_x86' },
      { udid: 'samsung_galaxy_s10', deviceType: 'real', realDevice: true, state: 'device', sdk: '9', name:'sdk_phone_x86' },
    ];
    sinon
    .stub(androidDevices, 'getConnectedDevices')
    .returns(existingDevices);
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
      },
    ]);
  });
});
