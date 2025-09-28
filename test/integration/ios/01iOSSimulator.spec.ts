import { expect } from 'chai';
import { Container } from 'typedi';
import { DeviceFarmManager } from '../../../src/device-managers';

import { ATDRepository } from '../../../src/data-service/db';
import {
  allocateDeviceForSession,
  cleanPendingSessions,
  initializeStorage,
  updateDeviceList,
} from '../../../src/device-utils';

import ip from 'ip';
import { flatten } from 'lodash';
import Simctl from 'node-simctl';
import { v4 as uuidv4 } from 'uuid';
import { unblockDeviceMatchingFilter } from '../../../src/data-service/device-service';
import { addCLIArgs } from '../../../src/data-service/pluginArgs';
import { DefaultPluginArgs } from '../../../src/interfaces/IPluginArgs';
import { sessionRequestMap } from '../../../src/proxy/wd-command-proxy';
import { serverCliArgs } from '../cliArgs';

const simctl = new Simctl();
const name = 'My Device Name';
const NODE_ID = uuidv4();
const REQUEST_ID = uuidv4();

sessionRequestMap.set(REQUEST_ID, {} as any);

const pluginArgs = Object.assign({}, DefaultPluginArgs, {
  remote: [`http://${ip.address()}:4723`],
  iosDeviceType: 'both',
});

async function markSimulatorsAsBooted() {
  const deviceModel = await ATDRepository.DeviceModel;
  // mark simulators as booted
  deviceModel.findAndUpdate({ platform: 'ios', deviceType: 'simulator' }, (device) => {
    device.state = 'Booted';
  });

  //const simulators = (await ADTDatabase.DeviceModel).chain().find({ platform: 'ios', deviceType: 'simulator' }).data()
  //console.log('simulators: ', simulators);
}

async function initDeviceFarm(iosDeviceType: string) {
  const pluginArgs = Object.assign({}, DefaultPluginArgs, {
    remote: [`http://${ip.address()}:4723`],
    iosDeviceType: iosDeviceType,
  });
  await initializeStorage();
  const deviceManager = new DeviceFarmManager(
    'ios',
    {
      iosDeviceType: 'simulated',
      androidDeviceType: 'real',
    },
    4723,
    Object.assign(pluginArgs, { maxSessions: 1 }),
    NODE_ID,
  );
  expect(deviceManager.getMaxSessionCount()).to.be.eql(1);
  Container.set(DeviceFarmManager, deviceManager);
  const hub = pluginArgs.hub;
  await updateDeviceList(pluginArgs.bindHostOrIp, hub);
  await markSimulatorsAsBooted();
  await unblockDeviceMatchingFilter({});
  await cleanPendingSessions(0);
}

describe('Max sessions CLI argument test', () => {
  before('Add Args', async () => {
    (await ATDRepository.DeviceModel).removeDataOnly();
    await addCLIArgs(serverCliArgs);

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
    await initDeviceFarm('simulated');
  });

  it('Allocate first device without issue', async () => {
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
    const device = await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs);

    const allDeviceIds = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid })
      .data();
    expect(allDeviceIds[0].busy).to.be.true;
  });

  it('Should throw error if the app does not match with device type', async () => {
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
    await allocateDeviceForSession(
      REQUEST_ID,
      capabilities,
      6000,
      100,
      Object.assign({}, pluginArgs, { iosDeviceType: 'simulated' }),
    ).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'iosDeviceType value is set to "simulated" but app provided is not suitable for simulator device.',
        ),
    );
  });

  it('Throw error when all sessions occupied', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'ios',
      { iosDeviceType: 'simulated', androidDeviceType: 'real' },
      4723,
      Object.assign(pluginArgs, { maxSessions: 1 }),
      NODE_ID,
    );
    // set all devices to busy
    const allDevices = await deviceManager.getDevices();
    for await (const device of allDevices) {
      (await ATDRepository.DeviceModel)
        .chain()
        .find({ platform: 'ios' })
        .update((device) => {
          device.busy = true;
        });
    }

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
    await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs).catch(
      (error) =>
        expect(error)
          .to.be.an('error')
          .with.property(
            'message',
            'No device matching request.. Device request: {"platform":"ios","deviceType":"simulator"}',
          ),
    );
  });
});

describe('IOS Simulator Test', () => {
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
    await unblockDeviceMatchingFilter({});
  });

  it('Should find free iPhone simulator when app path has .app extension and set busy status to true', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'ios',
      { iosDeviceType: 'both', androidDeviceType: 'real' },
      4723,
      pluginArgs,
      NODE_ID,
    );
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub;
    await updateDeviceList(pluginArgs.bindHostOrIp, hub);
    await markSimulatorsAsBooted();
    await unblockDeviceMatchingFilter({});
    await cleanPendingSessions(0);

    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'df:iPhoneOnly': true,
        'df:deviceAvailabilityTimeout': 1800,
        'df:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    // console.log('devices: ', await deviceManager.getDevices())
    const device = await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs);
    const allocatedSimulator = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid })
      .data();
    const foundSimulator = allocatedSimulator[0];
    expect(foundSimulator.busy).to.be.true;
    expect(foundSimulator.name).to.match(/^iPhone/);
    expect(foundSimulator.wdaLocalPort).to.match(/[0-9]/);
  });

  it('Should find free Apple TV simulator and set busy status to true', async function () {
    if (process.env.CI) {
      await initializeStorage();
      const deviceManager = new DeviceFarmManager(
        'ios',
        { iosDeviceType: 'both', androidDeviceType: 'real' },
        4723,
        pluginArgs,
        NODE_ID,
      );
      Container.set(DeviceFarmManager, deviceManager);
      const hub = pluginArgs.hub;
      await updateDeviceList(pluginArgs.bindHostOrIp, hub);
      await markSimulatorsAsBooted();
      await unblockDeviceMatchingFilter({});
      await cleanPendingSessions(0);

      const capabilities = {
        alwaysMatch: {
          platformName: 'tvOS',
          'appium:deviceAvailabilityTimeout': 1800,
          'appium:deviceRetryInterval': 100,
        },
        firstMatch: [{}],
      };
      const device = await allocateDeviceForSession(
        REQUEST_ID,
        capabilities,
        6000,
        1000,
        pluginArgs,
      );

      const allocatedSimulator = (await ATDRepository.DeviceModel)
        .chain()
        .find({ udid: device.udid })
        .data();
      const foundSimulator = allocatedSimulator[0];
      expect(foundSimulator.busy).to.be.true;
      expect(foundSimulator.name).to.match(/^Apple TV/);
      expect(foundSimulator.wdaLocalPort).to.match(/[0-9]/);
    } else {
      this.skip();
    }
  });
});

describe('iPad Simulator Test', () => {
  const IPAD_NODE_ID = uuidv4();

  before(async () => {
    // Create Node record in Prisma database for foreign key constraint
    const { prisma } = await import('../../../src/prisma');
    await prisma.node.upsert({
      where: { id: IPAD_NODE_ID },
      update: {},
      create: {
        id: IPAD_NODE_ID,
        name: 'Test Node iPad',
        host: 'localhost',
        os: 'ios',
        jwtSecretToken: 'test-token',
      },
    });
  });

  after(async () => {
    // Clean up test data
    const { prisma } = await import('../../../src/prisma');
    await prisma.device.deleteMany({ where: { nodeId: IPAD_NODE_ID } });
    await prisma.node.delete({ where: { id: IPAD_NODE_ID } }).catch(() => {
      // Ignore error if node doesn't exist
    });
  });

  beforeEach('Release devices', async () => {
    await unblockDeviceMatchingFilter({});
  });

  it('Should find free iPad simulator when app path has .app extension and set busy status to true', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'ios',
      { iosDeviceType: 'both', androidDeviceType: 'real' },
      4723,
      pluginArgs,
      IPAD_NODE_ID,
    );
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub;
    await updateDeviceList(pluginArgs.bindHostOrIp, hub);
    await markSimulatorsAsBooted();
    await unblockDeviceMatchingFilter({});
    await cleanPendingSessions(0);

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
    // console.log('devices: ', await deviceManager.getDevices())
    const device = await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs);

    const allocatedSimulator = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid })
      .data();
    const foundSimulator = allocatedSimulator[0];
    console.log('foundSimulator: ', foundSimulator);
    expect(foundSimulator.busy).to.be.true;
    expect(foundSimulator.name).to.match(/^(iPad|My Device Name)/);
    expect(foundSimulator.wdaLocalPort).to.match(/[0-9]/);
  });
});

describe('Boot simulator test', async () => {
  before('Boot simulator', async () => {
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

    const list = await simctl.list();
    const version = list.runtimes[0].version;
    const devices = flatten(Object.keys(list.devices).map((key) => list.devices[key]));
    //console.log('devices: ', devices);
    // find device is isAvailable=true

    const availableDevices = devices.filter((device: any) => device.isAvailable);
    //console.log('availableDevices: ', availableDevices);
    // find device name starts with iPhone
    const iphone = availableDevices.find((device: any) => device.name.startsWith('iPhone'));

    simctl.udid = await simctl.createDevice(name, iphone.name, version);
    await simctl.bootDevice();
    await simctl.startBootMonitor({ timeout: 160000 });
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
    await unblockDeviceMatchingFilter({});
  });

  it('Should pick Booted simulator when app path has .app', async () => {
    await initializeStorage();
    const deviceManager = new DeviceFarmManager(
      'ios',
      { iosDeviceType: 'both', androidDeviceType: 'real' },
      4723,
      Object.assign({}, DefaultPluginArgs, pluginArgs),
      NODE_ID,
    );
    Container.set(DeviceFarmManager, deviceManager);
    const hub = pluginArgs.hub;
    await updateDeviceList(pluginArgs.bindHostOrIp, hub);
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    const devices = await deviceManager.getDevices();
    const device = await allocateDeviceForSession(REQUEST_ID, capabilities, 6000, 1000, pluginArgs);
    const allocatedSimulator = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid })
      .data();
    expect(allocatedSimulator[0].state).to.be.equal('Booted');
  });
  after('Delete simulator', async () => {
    //if (simctl.udid) await simctl.deleteDevice(simctl.udid);
  });
});
