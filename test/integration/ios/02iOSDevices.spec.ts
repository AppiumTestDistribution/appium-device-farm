import { expect } from 'chai';
import ip from 'ip';
import { Container } from 'typedi';
import { DeviceFarmManager } from '../../../src/device-managers';

import { v4 as uuidv4 } from 'uuid';
import { ATDRepository } from '../../../src/data-service/db';
import { unblockDeviceMatchingFilter } from '../../../src/data-service/device-service';
import {
  allocateDeviceForSession,
  initializeStorage,
  updateDeviceList,
} from '../../../src/device-utils';
import { DefaultPluginArgs } from '../../../src/interfaces/IPluginArgs';
import { sessionRequestMap } from '../../../src/proxy/wd-command-proxy';

const pluginArgs = Object.assign({}, DefaultPluginArgs, {
  remote: [`http://${ip.address()}:4723`],
  iosDeviceType: 'both',
});
const NODE_ID = uuidv4();
const REQUEST_ID = uuidv4();

sessionRequestMap.set(REQUEST_ID, {} as any);

describe('IOS Test', () => {
  before(async () => {
    // Create Node record in Prisma database for foreign key constraint
    const { prisma } = await import('../../../src/prisma');
    await prisma.node.upsert({
      where: { id: NODE_ID },
      update: {},
      create: {
        id: NODE_ID,
        name: 'Test Node',
        host: 'localhost',
        os: 'ios',
        jwtSecretToken: 'test-token',
      },
    });
  });

  after(async () => {
    // Clean up test data
    const { prisma } = await import('../../../src/prisma');
    await prisma.device.deleteMany({ where: { nodeId: NODE_ID } });
    await prisma.node.delete({ where: { id: NODE_ID } }).catch(() => {
      // Ignore error if node doesn't exist
    });
  });

  beforeEach('Release devices', async () => {
    // unblock all otherwise it will stuck on max session count
    await unblockDeviceMatchingFilter({});
  });

  it('Throw error when no device is found for given capabilities', async () => {
    await initializeStorage();
    (await ATDRepository.CLIArgs)
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
      NODE_ID,
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
    await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs).catch(
      (error) =>
        expect(error)
          .to.be.an('error')
          .with.property(
            'message',
            'No device matching request.. Device request: {"platform":"ios","deviceType":"real"}',
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
      NODE_ID,
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
    await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs).catch(
      (error) =>
        expect(error)
          .to.be.an('error')
          .with.property(
            'message',
            'iosDeviceType value is set to "real" but app provided is not suitable for real device.',
          ),
    );
  });
});
