import { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';

import { updateDeviceList, allocateDeviceForSession, initlializeStorage, getBusyDevicesCount } from '../../src/device-utils';
import { DeviceModel } from '../../src/data-service/db';

import Simctl from 'node-simctl';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';

const simctl = new Simctl();
const name = 'My Device Name';

const cliArgs = {
  platform: 'ios',
  deviceTypes: 'both',
  cliArgs: {
    port: 4723,
    plugin: { 'device-farm': { remote: ['http://127.0.0.1:4723'], maxSessions: 1 } },
  },
};
describe('Max sessions CLI argument test', () => {
  it('Allocate first device without issue', async () => {
    await initlializeStorage();
    const deviceManager = new DeviceFarmManager(cliArgs);
    expect(deviceManager.getMaxSessionCount()).to.be.eql(1);
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
    const devices = await allocateDeviceForSession(capabilities);
    const allDeviceIds = DeviceModel.chain().find({ udid: devices.udid }).data();
    expect(allDeviceIds[0].busy).to.be.true;
  });

  it('Throw error when all sessions occupied', async () => {
    await initlializeStorage();
    const deviceManager = new DeviceFarmManager(cliArgs);
    expect(await getBusyDevicesCount()).to.be.eql(1);
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
    await allocateDeviceForSession(capabilities).catch((error) =>
    expect(error)
      .to.be.an('error')
      .with.property(
        'message',
        'No device found for filters: {"platform":"ios","name":"iPhone","deviceType":"simulator","busy":false}'
      )
    );
  });
});

describe('IOS Simulator Test', () => {
  it('Should find free iPhone simulator when app path has .app extension and set busy status to true', async () => {
    await initlializeStorage();
    const deviceManager = new DeviceFarmManager({
      platform: 'ios',
      deviceTypes: 'both',
      cliArgs: {
        port: 4723,
        plugin: {
          'device-farm': {
            remote: ['http://127.0.0.1:4723'],
          },
        },
      },
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
    const device = await allocateDeviceForSession(capabilities);
    const allocatedSimulator = DeviceModel.chain().find({ udid: device.udid }).data();
    const foundSimulator = allocatedSimulator[0];
    expect(foundSimulator.busy).to.be.true;
    expect(foundSimulator.name).to.match(/^iPhone/);
    expect(foundSimulator.wdaLocalPort).to.match(/[0-9]/);
  });

  it('Should find free iPad simulator when app path has .app extension and set busy status to true', async () => {
    await initlializeStorage();
    const deviceManager = new DeviceFarmManager({
      platform: 'ios',
      deviceTypes: 'both',
      cliArgs: { port: 4723, plugin: { 'device-farm': { remote: ['http://127.0.0.1:4723'] } } },
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
    const device = await allocateDeviceForSession(capabilities);
    const allocatedSimulator = DeviceModel.chain().find({ udid: device.udid }).data();
    const foundSimulator = allocatedSimulator[0];
    expect(foundSimulator.busy).to.be.true;
    expect(foundSimulator.name).to.match(/^iPad/);
    expect(foundSimulator.wdaLocalPort).to.match(/[0-9]/);
  });
});

describe('Boot simulator test', async () => {
  before('Boot simulator', async () => {
    const version = (await simctl.list()).runtimes[0].version;
    simctl.udid = await simctl.createDevice(name, 'iPhone X', version);
    await simctl.bootDevice();
    await simctl.startBootMonitor({ timeout: 160000 });
  });

  it('Should pick Booted simulator when app path has .app', async () => {
    await initlializeStorage();
    const deviceManager = new DeviceFarmManager({
      platform: 'ios',
      deviceTypes: 'both',
      cliArgs: { port: 4723, plugin: { 'device-farm': { remote: ['http://127.0.0.1:4723'] } } },
    });
    Container.set(DeviceFarmManager, deviceManager);
    await updateDeviceList();
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    const device = await allocateDeviceForSession(capabilities);
    const allocatedSimulator = DeviceModel.chain().find({ udid: device.udid }).data();
    expect(allocatedSimulator[0].state).to.be.equal('Booted');
  });
  after('Delete simulator', async () => {
    await simctl.deleteDevice(simctl.udid);
  });
});
