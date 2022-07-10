import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/device-managers/AndroidDeviceManager';

describe('Android Device Manager', () => {
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    const existingDevices = [
      { udid: 'emulator-5554', deviceType: 'emulator', realDevice: false, state: 'device', sdk: '9', name:'sdk_phone_x86' },
      { udid: 'samsung_galaxy_s10', deviceType: 'real', realDevice: true, state: 'device', sdk: '9', name:'sdk_phone_x86' },
    ];
    sinon
    .stub(androidDevices, 'getConnectedDevices')
    .returns(existingDevices);
    const all_devices = await androidDevices.getDevices(true, existingDevices);
    expect(all_devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        deviceType: 'emulator',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
      },
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
    const real_devices = await androidDevices.getDevices(false, existingDevices);
    expect(real_devices).to.deep.equal([
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
});
