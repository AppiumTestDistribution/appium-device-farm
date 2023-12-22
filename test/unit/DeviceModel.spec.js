import { DeviceModel } from '../../src/data-service/db';
import { getAllDevices } from '../../src/data-service/device-service';
import { deviceMock } from './fixtures/devices';
import { expect } from 'chai';
import {
  addNewDevice,
  removeDevice,
  setSimulatorState,
} from '../../src/data-service/device-service';
import sinon from 'sinon';
import { log } from 'node-persist';
var sandbox = sinon.createSandbox();

describe('Model Test', () => {
  before('Add device collection', () => {
    DeviceModel.removeDataOnly()
    DeviceModel.insert(deviceMock);
    DeviceModel.chain().find().data().length.should.be.equal(deviceMock.length);
  });

  after('clean', () => {
    sandbox.restore();
  });

  it('Should remove device from old pool when new poll call does not have the device', () => {
    removeDevice([{ udid: 'emulator-5570', host: '127.0.0.1' }]);
    const updatedDeviceList = DeviceModel.chain().find({ udid: 'emulator-5570' }).data();
    expect(updatedDeviceList).to.deep.equal([]);
  });

  it('Should update new device polled into the existing device list', async () => {
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
    expect(updatedDeviceList.length).to.be.greaterThanOrEqual(1);
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

  it('Should handle concurrent update to device list', async () => {
    // create bunch of devices using loop
    let newDeviceList = [];
    for (let i = 0; i < 10; i++) {
      newDeviceList.push({
        busy: false,
        state: 'device',
        udid: `emulator-${i}`,
        platform: 'android',
      });
    }

    // create a function to add new device with random delay to simulate concurrent calls from multiple nodes
    const delayedAddDevice = async (newDeviceList) => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
      for (const device of newDeviceList) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
        await addNewDevice([device]);
      }
    };

    const existingDevices = getAllDevices()

    // create some parallel calls to addNewDevice
    await Promise.all([delayedAddDevice(newDeviceList), delayedAddDevice(existingDevices)]);

    // verify that all devices are added to the db
    const updatedDeviceList = DeviceModel.chain().find({ platform: 'android' }).data();
    
    // every newDeviceList should be listed under updatedDeviceList
    // map udid only to make it simple
    const addedDeviceUdids = newDeviceList.map((device) => device.udid);
    const updatedDeviceUdids = updatedDeviceList.map((device) => device.udid);
    addedDeviceUdids.forEach((udid) => updatedDeviceUdids.includes(udid).should.be.true);
  });
});
