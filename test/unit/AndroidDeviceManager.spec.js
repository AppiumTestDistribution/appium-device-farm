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
    const devices = await androidDevices.getDevices([]);
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
});
