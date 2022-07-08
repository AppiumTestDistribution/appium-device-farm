import { DeviceModel } from '../../src/data-service/db';
import { deviceMock } from './fixtures/devices';
import { saveDevices } from '../../src/data-service/device-service';
import { expect } from 'chai';

describe('Model Test', () => {
  before('Add device collection', () => {
    DeviceModel.insert(deviceMock);
  });
  it('Should update device state as offline when the new polled device does not have previous device', async () => {
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

  it('Should update device state as online when the new polled device has previous offline device', async () => {
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
    const updatedDeviceList = DeviceModel.chain().find({ udid: 'emulator-5556' }).data();
    expect(updatedDeviceList[0].offline).to.be.false;
  });

  it('Should update new device polled into the existing device list', async () => {
    const newDeviceList = [
      {
        busy: false,
        state: 'device',
        udid: 'emulator-9994',
        platform: 'android',
        offline: false,
      },
    ];
    saveDevices(newDeviceList);
    const updatedDeviceList = DeviceModel.chain().find({ udid: 'emulator-9994' }).data();
    expect(updatedDeviceList.length).to.be.equal(1);
  });

  describe('IOS Simulator modal', () => {
    it('Filter only the booted simulator', () => {
      it('Should update the ios simulator state from shutdown to booted', async () => {
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
        saveDevices(newDeviceList);
        const updatedDeviceList = DeviceModel.chain()
          .find({ udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888' })
          .data();
        expect(updatedDeviceList[0].state).to.be.equal('Shutdown');
      });
    });
  });
});
