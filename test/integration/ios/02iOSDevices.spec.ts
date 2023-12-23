import { expect } from 'chai';
import { DeviceFarmManager } from '../../../src/device-managers';
import { Container } from 'typedi';
import ip from 'ip';

import {
  updateDeviceList,
  allocateDeviceForSession,
  initializeStorage,
} from '../../../src/device-utils';
import { ADTDatabase } from '../../../src/data-service/db';
import { DefaultPluginArgs } from '../../../src/interfaces/IPluginArgs';
import { unblockDeviceMatchingFilter } from '../../../src/data-service/device-service';
const pluginArgs = Object.assign({}, DefaultPluginArgs, {
  remote: [`http://${ip.address()}:4723`],
  iosDeviceType: 'both',
});

describe('IOS Test', () => {
  beforeEach('Release devices', async () => {
    // unblock all otherwise it will stuck on max session count
    await unblockDeviceMatchingFilter({});
  });

  it('Throw error when no device is found for given capabilities', async () => {
    await initializeStorage();
    (await ADTDatabase.CLIArgs)
      .chain()
      .find()
      .update(function (d) {
        d.plugin['device-farm'].iosDeviceType = 'real';
      });
    const deviceManager = new DeviceFarmManager(
      'ios',
      { iosDeviceType: 'both', androidDeviceType: 'real' },
      4723,
      pluginArgs,
    );
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList(pluginArgs.bindHostOrIp);
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
    await allocateDeviceForSession(capabilities, 6000, 1000, pluginArgs).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'No device found for filters: {"platform":"ios","name":"iPhone","deviceType":"real","busy":false,"userBlocked":false}',
        ),
    );
  });

  it('Should throw error if the IPA does not match with device type real', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'ios',
      { iosDeviceType: 'both', androidDeviceType: 'real' },
      4723,
      pluginArgs,
    );
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList(pluginArgs.bindHostOrIp);
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.zip',
        'appium:iPhoneOnly': true,
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    await allocateDeviceForSession(capabilities, 6000, 1000, pluginArgs).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'iosDeviceType value is set to "real" but app provided is not suitable for real device.',
        ),
    );
  });
});
