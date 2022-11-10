import { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';
import { DeviceModel } from '../../src/data-service/db';
import { updateDeviceList, allocateDeviceForSession } from '../../src/device-utils';

const cliArgs = {
  platform: 'android',
  deviceTypes: 'both',
  cliArgs: {
    port: 4723,
    plugin: { 'device-farm': { remote: ['http://127.0.0.1:4723'], skipChromeDownload: true } },
  },
};
describe('Android Test', () => {
  it('Allocate free device and verify the device state is busy in db', async () => {
    const deviceManager = new DeviceFarmManager(cliArgs);
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
    const devices = await allocateDeviceForSession(capabilities);
    const allDeviceIds = DeviceModel.chain().find({ udid: devices.udid }).data();
    expect(allDeviceIds[0].busy).to.be.true;
  });

  it('Allocate second free device and verify both the device state is busy in db', async () => {
    const deviceManager = new DeviceFarmManager(cliArgs);
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
    await allocateDeviceForSession(capabilities);
    const allDeviceIds = DeviceModel.chain().find().data();
    allDeviceIds.forEach((device) => expect(device.busy).to.be.true);
  });

  it('Finding a device should throw error when all devices are busy', async () => {
    const deviceManager = new DeviceFarmManager(cliArgs);
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
    await allocateDeviceForSession(capabilities).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'No device found for filters: {"platform":"android","name":"","busy":false}'
        )
    );
  });
});
