import { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';

import { DevicePlugin, updateDeviceList } from '../../src/plugin';
import { DeviceModel } from '../../src/data-service/db';

describe('IOS Test', () => {
  it('Throw error when no device is found for given capabilities', async () => {
    const deviceManager = new DeviceFarmManager({
      platform: 'iOS',
    });
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList();
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.ipa',
        'appium:iPhoneOnly': true,
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    await DevicePlugin.allocateDeviceForSession(capabilities).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'No device found for filters: {"platform":"ios","name":"iPhone","deviceType":"real","busy":false,"offline":false}'
        )
    );
  });

  it('Should find free iPhone simulator when app path has .app extension and set busy status to true', async () => {
    const deviceManager = new DeviceFarmManager({
      platform: 'ios',
    });
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList();
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:iPhoneOnly': true,
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    const device = await DevicePlugin.allocateDeviceForSession(capabilities);
    const allocatedSimulator = DeviceModel.chain().find({ udid: device.udid }).data();
    expect(allocatedSimulator[0].busy).to.be.true;
    expect(allocatedSimulator[0].name).to.match(/^iPhone/);
  });

  it('Should find free iPad simulator when app path has .app extension and set busy status to true', async () => {
    const deviceManager = new DeviceFarmManager({
      platform: 'ios',
    });
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList();
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:iPadOnly': true,
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    const device = await DevicePlugin.allocateDeviceForSession(capabilities);
    const allocatedSimulator = DeviceModel.chain().find({ udid: device.udid }).data();
    expect(allocatedSimulator[0].busy).to.be.true;
    expect(allocatedSimulator[0].name).to.match(/^iPad/);
  });
});
