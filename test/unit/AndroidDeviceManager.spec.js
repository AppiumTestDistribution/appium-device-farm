import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/AndroidDeviceManager';
describe('Android Device Manager', () => {
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    const actualDevices = [];
    sinon
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5554', state: 'device' }]);
    sinon.stub(androidDevices, 'getDeviceVersion').returns('9');
    sinon.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sinon.stub(androidDevices, 'isRealDevice').returns(false);
    const devices = await androidDevices.getDevices(actualDevices);
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      },
    ]);
  });
  it('Get device data from device state', async () => {
    const androidDevices = new AndroidDeviceManager();
    const actualDevices = [
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5553',
        platform: 'android',
      },
      {
        busy: false,
        name: 'sdk_phone_x90',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      }
    ]
    sinon.stub([], 'push');
    sinon
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5553', state: 'device' }, { udid: 'emulator-5554', state: 'device' }, { udid: 'emulator-5555', state: 'device' }]);
    sinon.stub(androidDevices, 'getDeviceVersion').returns('9');
    sinon.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sinon.stub(androidDevices, 'isRealDevice').returns(false);
    const devices1 = await androidDevices.getDevices(actualDevices);
    expect(devices1).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5553',
        platform: 'android',
      },
      {
        busy: false,
        name: 'sdk_phone_x90',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      },
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5555',
        platform: 'android',
      },
    ]);
  });
});
import sinon from 'sinon';
import { expect } from 'chai';
import AndroidDeviceManager from '../../src/AndroidDeviceManager';
describe('Android Device Manager', () => {
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    const actualDevices = [];
    sinon
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5554', state: 'device' }]);
    sinon.stub(androidDevices, 'getDeviceVersion').returns('9');
    sinon.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sinon.stub(androidDevices, 'isRealDevice').returns(false);
    const devices = await androidDevices.getDevices(actualDevices);
    expect(devices).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      },
    ]);
  });
  it('Get device data from device state', async () => {
    const androidDevices = new AndroidDeviceManager();
    const actualDevices = [
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5553',
        platform: 'android',
      },
      {
        busy: false,
        name: 'sdk_phone_x90',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      }
    ]
    sinon.stub([], 'push');
    sinon
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5553', state: 'device' }, { udid: 'emulator-5554', state: 'device' }, { udid: 'emulator-5555', state: 'device' }]);
    sinon.stub(androidDevices, 'getDeviceVersion').returns('9');
    sinon.stub(androidDevices, 'getDeviceName').returns('sdk_phone_x86');
    sinon.stub(androidDevices, 'isRealDevice').returns(false);
    const devices1 = await androidDevices.getDevices(actualDevices);
    expect(devices1).to.deep.equal([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5553',
        platform: 'android',
      },
      {
        busy: false,
        name: 'sdk_phone_x90',
        state: 'device',
        sdk: '11',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      },
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5555',
        platform: 'android',
      },
    ]);
  });
});