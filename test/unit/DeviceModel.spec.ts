import { expect } from 'chai';
import sinon from 'sinon';
import { ATDRepository } from '../../src/data-service/db';
import {
  addNewDevice,
  getAllDevices,
  removeDevice,
  setSimulatorState,
} from '../../src/data-service/device-service';
import { IDevice } from '../../src/interfaces/IDevice';
import { prisma } from '../../src/prisma';
import { deviceMock } from './fixtures/devices';
var sandbox = sinon.createSandbox();

describe('Model Test', async () => {
  before('Add device collection', async () => {
    // Insert a Node record for foreign key constraint in both LokiJS and Prisma
    const nodeModel =
      (await ATDRepository.db).getCollection('nodes') ||
      (await ATDRepository.db).addCollection('nodes');
    nodeModel.insert({
      id: 'test-node-id',
      name: 'Test Node',
      host: 'localhost',
      os: 'linux',
      jwtSecretToken: 'secret',
      isHub: false,
      isOnline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Also create the node in Prisma database for foreign key constraint
    await prisma.node.upsert({
      where: { id: 'test-node-id' },
      update: {},
      create: {
        id: 'test-node-id',
        name: 'Test Node',
        host: 'localhost',
        os: 'linux',
        jwtSecretToken: 'secret',
        isHub: false,
        isOnline: true,
      },
    });

    (await ATDRepository.DeviceModel).removeDataOnly();
    expect((await ATDRepository.DeviceModel).chain().find().data().length).to.be.equal(0);
    expect(deviceMock.length).to.be.greaterThanOrEqual(1);
    const result = (await ATDRepository.DeviceModel).insert(deviceMock);
    (await ATDRepository.db).saveDatabase();
    (await ATDRepository.DeviceModel)
      .chain()
      .find()
      .data()
      .length.should.be.equal(deviceMock.length);
  });

  after('clean', async () => {
    sandbox.restore();
    // Clean up Prisma database
    await prisma.device.deleteMany({});
    await prisma.node.deleteMany({});
  });

  it('Should remove device from old pool when new poll call does not have the device', async () => {
    const findDevice = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: 'emulator-5570' })
      .data();
    expect(findDevice.length).to.be.equal(1);
    await removeDevice(findDevice);
    const updatedDeviceList = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: 'emulator-5570' })
      .data();
    expect(updatedDeviceList).to.deep.equal([]);
  });

  it('Should update new device polled into the existing device list', async () => {
    const newDeviceList = [
      {
        id: 'dev-new-1',
        name: 'emulator-9994',
        real: false,
        busy: false,
        state: 'device',
        udid: 'emulator-9994',
        platform: 'android',
        host: 'unknown',
        nodeId: 'test-node-id',
        sdk: '1.0',
      },
    ] as unknown as IDevice[];

    await addNewDevice(newDeviceList);

    const updatedDeviceList = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: 'emulator-9994' })
      .data();
    expect(updatedDeviceList.length).to.be.greaterThanOrEqual(1);
  });

  it('Should update the ios simulator state from shutdown to booted', async () => {
    const newDeviceList = [
      {
        id: 'dev-new-2',
        name: 'emulator-5554',
        real: false,
        busy: false,
        state: 'device',
        udid: 'emulator-5554',
        platform: 'android',
        offline: false,
        host: 'unknown',
        nodeId: 'test-node-id',
        sdk: '1.0',
      },
      {
        id: 'dev-new-3',
        name: 'emulator-5556',
        real: false,
        busy: false,
        state: 'device',
        udid: 'emulator-5556',
        platform: 'android',
        offline: false,
        host: 'unknown',
        nodeId: 'test-node-id',
        sdk: '1.0',
      },
      {
        id: 'dev-new-4',
        name: 'iPad Air',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888',
        state: 'Shutdown',
        deviceType: 'simulator',
        sdk: '13.5',
        platform: 'ios',
        busy: true,
        real: false,
        realDevice: false,
        offline: false,
        host: 'unknown',
        nodeId: 'test-node-id',
      },
      {
        id: 'dev-new-5',
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        deviceType: 'simulator',
        sdk: '13.5',
        platform: 'ios',
        busy: false,
        real: false,
        realDevice: false,
        offline: false,
        host: 'unknown',
        nodeId: 'test-node-id',
      },
    ] as unknown as IDevice[];
    await setSimulatorState(newDeviceList);
    const updatedDeviceList = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888' })
      .data();
    expect(updatedDeviceList[0].state).to.be.equal('Shutdown');
  });

  it('Should handle concurrent update to device list', async () => {
    // create bunch of devices using loop
    let newDeviceList = [] as unknown as IDevice[];
    for (let i = 0; i < 10; i++) {
      newDeviceList.push({
        id: `dev-loop-${i}`,
        name: `emulator-${i}`,
        real: false,
        busy: false,
        state: 'device',
        udid: `emulator-${i}`,
        platform: 'android',
        offline: false,
        host: 'unknown',
        nodeId: 'test-node-id',
        sdk: '1.0',
      } as unknown as IDevice);
    }

    // create a function to add new device with random delay to simulate concurrent calls from multiple nodes
    const delayedAddDevice = async (newDeviceList: IDevice[]) => {
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
      for (const device of newDeviceList) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));
        await addNewDevice([device]);
      }
    };

    const existingDevices = await getAllDevices();

    // create some parallel calls to addNewDevice
    await Promise.all([delayedAddDevice(newDeviceList), delayedAddDevice(existingDevices)]);

    // verify that all devices are added to the db
    const updatedDeviceList = (await ATDRepository.DeviceModel)
      .chain()
      .find({ platform: 'android' })
      .data();

    // every newDeviceList should be listed under updatedDeviceList
    // map udid only to make it simple
    const addedDeviceUdids = newDeviceList.map((device) => device.udid);
    const updatedDeviceUdids = updatedDeviceList.map((device) => device.udid);
    addedDeviceUdids.forEach((udid) => updatedDeviceUdids.includes(udid).should.be.true);
  });
});
