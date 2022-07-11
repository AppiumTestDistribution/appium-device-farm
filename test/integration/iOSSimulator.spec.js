import { expect } from 'chai';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';

import { DevicePlugin, updateDeviceList } from '../../src/plugin';
import { DeviceModel } from '../../src/data-service/db';

import Simctl from 'node-simctl';

const simctl = new Simctl();
const name = 'My Device Name';

describe('IOS Simulator Test', () => {
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

describe.skip('Boot simulator test', async () => {
  before('Boot simulator', async () => {
    const version = (await simctl.list()).runtimes[0].version;
    simctl.udid = await simctl.createDevice(name, 'iPhone X', version);
    await simctl.bootDevice();
    await simctl.startBootMonitor({ timeout: 160000 });
  });

  it('Should pick Booted simulator when app path has .app', async () => {
    const deviceManager = new DeviceFarmManager({
      platform: 'ios',
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
    const device = await DevicePlugin.allocateDeviceForSession(capabilities);
    const allocatedSimulator = DeviceModel.chain().find({ udid: device.udid }).data();
    expect(allocatedSimulator[0].state).to.be.equal('Booted');
  });
  after('Delete simulator', async () => {
    await simctl.deleteDevice(simctl.udid);
  });
});
