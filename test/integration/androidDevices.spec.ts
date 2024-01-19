import chai, { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';
import { ADTDatabase } from '../../src/data-service/db';
import {
  updateDeviceList,
  allocateDeviceForSession,
  initializeStorage,
  cleanPendingSessions,
} from '../../src/device-utils';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import ip from 'ip';
import waitUntil from 'async-wait-until';
import { IDevice } from '../../src/interfaces/IDevice';
import { unblockDeviceMatchingFilter } from '../../src/data-service/device-service';
import chaiAsPromised from 'chai-as-promised';
import { v4 as uuidv4 } from 'uuid';

chai.use(chaiAsPromised);

const pluginArgs = Object.assign({}, DefaultPluginArgs, {
  remote: [`http://${ip.address()}:4723`],
  skipChromeDownload: true,
});

const capabilities = {
  alwaysMatch: {
    platformName: 'android',
    'appium:app': '/Downloads/VodQA.apk',
    'appium:deviceAvailabilityTimeout': 1800,
    'appium:deviceRetryInterval': 100,
  },
  firstMatch: [{}],
};

const NODE_ID = uuidv4();

describe('Android Test', () => {
  const deviceManager = new DeviceFarmManager(
    'android',
    { androidDeviceType: 'both', iosDeviceType: 'both' },
    4723,
    Object.assign(pluginArgs, {}),
    NODE_ID,
  );

  beforeEach(async () => {
    (await ADTDatabase.DeviceModel).removeDataOnly();
    // adb devices should return devices
    await expect(deviceManager.getDevices()).to.eventually.have.length.greaterThan(
      1,
      'No devices detected. Is adb running? Is there at least one device connected?',
    );
  });

  it('Allocate free device and verify the device state is busy in db', async () => {
    await initializeStorage();

    await deviceManager.getDevices();
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub;
    await updateDeviceList(pluginArgs.bindHostOrIp, hub);
    await cleanPendingSessions(0);
    await unblockDeviceMatchingFilter({});

    
    const devices = await allocateDeviceForSession(capabilities, 1000, 1000, pluginArgs);
    const allDeviceIds = (await ADTDatabase.DeviceModel)
      .chain()
      .find({ udid: devices.device.udid })
      .data();
    expect(allDeviceIds[0].busy).to.be.true;
  });

  it('Allocate second free device and verify both the device state is busy in db', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'android',
      { androidDeviceType: 'both', iosDeviceType: 'both' },
      4723,
      Object.assign({}, DefaultPluginArgs, pluginArgs),
      NODE_ID,
    );
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList(pluginArgs.bindHostOrIp);
    

    // wait until there are two devices and both are not offline
    let devices: IDevice[] = [];
    await waitUntil(async () => {
      await updateDeviceList(pluginArgs.bindHostOrIp);
      devices = await deviceManager.getDevices();

      return devices.length === 2 && devices.every((device: IDevice) => !device.offline && !device.busy);
    });

    expect(devices.length).to.be.equal(2);

    console.log('devices', devices);

    // grab first device
    const device = await allocateDeviceForSession(capabilities, 1000, 1000, pluginArgs);
    console.log('allocated device', device);

    devices = await deviceManager.getDevices();
    console.log('devices', devices);

    console.log(`capabilities: ${JSON.stringify(capabilities)}`);

    // expect 1 device to be busy
    expect(devices.filter((device) => device.busy).length).to.be.equal(1);

    await allocateDeviceForSession(capabilities, 1000, 1000, pluginArgs);
    const allDeviceIds = (await ADTDatabase.DeviceModel).chain().find().data();
    allDeviceIds.forEach((device) => expect(device.busy).to.be.true);
  });

  it('Finding a device should throw error when all devices are busy', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'android',
      { androidDeviceType: 'both', iosDeviceType: 'both' },
      4723,
      pluginArgs,
      NODE_ID,
    );
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub;
    await updateDeviceList(pluginArgs.bindHostOrIp, hub);
    
    // grab first device
    await allocateDeviceForSession(capabilities, 1000, 1000, pluginArgs);

    // grab second device
    await allocateDeviceForSession(capabilities, 1000, 1000, pluginArgs);

    // grab third device
    allocateDeviceForSession(capabilities, 1000, 1000, pluginArgs).catch((error) =>
      expect(error).to.be.an('error').with.property('message').contains('Device is busy or blocked.. Device request: {"platform":"android"'),
    );
  });
});
