import { DeviceModel } from '../../src/data-service/db';
import { deviceMock } from './fixtures/devices';
import { expect } from 'chai';
import {
  addNewDevice,
  removeDevice,
  setSimulatorState,
} from '../../src/data-service/device-service';
import sinon from 'sinon';
var sandbox = sinon.createSandbox();

describe('Model Test', () => {
  before('Add device collection', () => {
    DeviceModel.insert(deviceMock);
  });
  after('clean', () => {
    sandbox.restore();
  });
  it('Should remove device from old pool when new poll call does not have the device', () => {
    removeDevice({ udid: 'emulator-5570', host: '127.0.0.1' });
    const updatedDeviceList = DeviceModel.chain().find({ udid: 'emulator-5555' }).data();
    expect(updatedDeviceList).to.deep.equal([]);
  });

  it('Should update new device polled into the existing device list', () => {
    const newDeviceList = [
      {
        busy: false,
        state: 'device',
        udid: 'emulator-9994',
        platform: 'android',
      },
    ];
    addNewDevice(newDeviceList);
    const updatedDeviceList = DeviceModel.chain().find({ udid: 'emulator-9994' }).data();
    expect(updatedDeviceList.length).to.be.equal(1);
  });

  it('Should update the ios simulator state from shutdown to booted', async () => {
    const newDeviceList = [
      {
        busy: false,
        state: 'device',
        udid: 'emulator-5554',
        platform: 'android',
        offline: false,
      },
      {
        busy: false,
        state: 'device',
        udid: 'emulator-5556',
        platform: 'android',
        offline: false,
      },
      {
        name: 'iPad Air',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888',
        state: 'Shutdown',
        deviceType: 'simulator',
        sdk: '13.5',
        platform: 'ios',
        busy: true,
        realDevice: false,
        offline: false,
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        deviceType: 'simulator',
        sdk: '13.5',
        platform: 'ios',
        busy: false,
        realDevice: false,
        offline: false,
      },
    ];
    setSimulatorState(newDeviceList);
    const updatedDeviceList = DeviceModel.chain()
      .find({ udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888' })
      .data();
    expect(updatedDeviceList[0].state).to.be.equal('Shutdown');
  });
});
