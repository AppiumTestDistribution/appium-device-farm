import { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';
import { DeviceModel } from '../../src/data-service/db';
import {
  updateDeviceList,
  allocateDeviceForSession,
  initializeStorage,
} from '../../src/device-utils';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import ip from 'ip';
import waitUntil from 'async-wait-until';

const pluginArgs = Object.assign(DefaultPluginArgs, { remote: [ `http://${ip.address()}:4723` ], skipChromeDownload: true })

describe('Android Test', () => {
  it('Allocate free device and verify the device state is busy in db', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager('android', 'both', 4723, Object.assign(DefaultPluginArgs, pluginArgs));
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub
    await updateDeviceList(hub);
    const capabilities = {
      alwaysMatch: {
        platformName: 'android',
        'appium:app': '/Downloads/VodQA.apk',
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    const devices = await allocateDeviceForSession(capabilities);
    const allDeviceIds = DeviceModel.chain().find({ udid: devices.udid }).data();
    expect(allDeviceIds[0].busy).to.be.true;
  });

  it('Allocate second free device and verify both the device state is busy in db', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager('android', 'both', 4723, Object.assign(DefaultPluginArgs, pluginArgs));
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList();
    const capabilities = {
      alwaysMatch: {
        platformName: 'android',
        'appium:app': '/Downloads/VodQA.apk',
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };

    // wait until there are two devices and both are not offline
    let devices = [];
    waitUntil(async () => {
      await updateDeviceList();
      devices = await deviceManager.getDevices();
      
      return devices.length === 2 && devices.every(device => !device.offline);
    })
    
    await allocateDeviceForSession(capabilities);
    const allDeviceIds = DeviceModel.chain().find().data();
    allDeviceIds.forEach((device) => expect(device.busy).to.be.true);
  });

  it('Finding a device should throw error when all devices are busy', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager('android', 'both', 4723, pluginArgs);
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub
    await updateDeviceList(hub);
    const capabilities = {
      alwaysMatch: {
        platformName: 'android',
        'appium:app': '/Downloads/VodQA.apk',
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    await allocateDeviceForSession(capabilities).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'No device found for filters: {"platform":"android","name":"","busy":false,"userBlocked":false}'
        )
    );
  });
});
