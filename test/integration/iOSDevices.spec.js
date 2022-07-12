import { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';

import { DevicePlugin, updateDeviceList } from '../../src/plugin';

describe('IOS Test', () => {
  it('Throw error when no device is found for given capabilities', async () => {
    const deviceManager = new DeviceFarmManager({
      platform: 'iOS',
      includeSimulators: true,
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
});
