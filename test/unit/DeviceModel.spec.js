import { DeviceModel } from '../../src/data-service/db';
import { deviceMock } from './fixtures/devices';
import { saveDevices } from '../../src/data-service/device-service';
import { expect } from 'chai';

describe('Model Test', () => {
  it('Should update device state as offline when the new polled device does not have previous device', async () => {
    DeviceModel.insert(deviceMock);
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
        sdk: '13.5',
        platform: 'ios',
        busy: false,
        realDevice: false,
        offline: false,
      },
    ];
    saveDevices(newDeviceList);
    const updatedDeviceList = DeviceModel.chain().find({ udid: 'emulator-5555' }).data();
    expect(updatedDeviceList[0].offline).to.be.true;
  });
});
