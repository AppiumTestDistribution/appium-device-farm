// eslint-disable-next-line @typescript-eslint/no-var-requires
import { pluginE2EHarness } from '@appium/plugin-test-support';
import axios from 'axios';
import { expect } from 'chai';
import ip from 'ip';
import { ATDRepository } from '../../src/data-service/db';
import NodeDevices from '../../src/device-managers/NodeDevices';
import { IDevice } from '../../src/interfaces/IDevice';
import {
  ensureAppiumHome,
  ensureHubConfig,
  ensureNodeConfig,
  HUB_APPIUM_PORT,
  NODE_APPIUM_PORT,
  PLUGIN_PATH,
} from './e2ehelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chai = require('chai'),
  // eslint-disable-next-line no-unused-vars
  should = chai.should();

describe('Basic Plugin Test', () => {
  // dump hub config into a file
  const hub_config_file = ensureHubConfig();
  // dump node config into a file
  const node_config_file = ensureNodeConfig();

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome();

  // Setup and cleanup for test database
  before(async () => {
    // Create the test node that will be used in the tests
    const { prisma } = await import('../../src/prisma');
    await prisma.node.upsert({
      where: { id: 'test-node-id' },
      update: {},
      create: {
        id: 'test-node-id',
        name: 'Test Node',
        host: 'http://127.2.1.41:4723',
        os: 'test',
        jwtSecretToken: 'test-secret',
        isHub: false,
        isOnline: true,
      },
    });
  });

  after(async () => {
    // Clean up test data
    const { prisma } = await import('../../src/prisma');
    await prisma.device.deleteMany({ where: { nodeId: 'test-node-id' } });
    await prisma.node.delete({ where: { id: 'test-node-id' } }).catch(() => {
      // Ignore error if node doesn't exist
    });
  });

  // run hub
  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: hub_config_file,
    },
    pluginName: 'device-farm',
    port: HUB_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver@4.0.0',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: node_config_file,
    },
    pluginName: 'device-farm',
    port: NODE_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver@4.0.0',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  const hub_url = `http://${ip.address()}:${HUB_APPIUM_PORT}`;

  it('Basic Plugin test', async () => {
    (await axios.get(`${hub_url}/device-farm`)).status.should.eql(200);
  });

  it('Basic Plugin API test', async () => {
    (await axios.get(`${hub_url}/device-farm/api/device`)).status.should.eql(200);
  });

  it('Add Android devices from node to hub', async () => {
    (await ATDRepository.DeviceModel).removeDataOnly();

    const nodeAndroidDevice = [
      {
        adbRemoteHost: null,
        adbPort: 5039,
        systemPort: 58296,
        sdk: '13',
        realDevice: false,
        name: 'sdk_gphone64_arm64',
        busy: false,
        state: 'device',
        udid: 'emulator-5551',
        platform: 'android',
        deviceType: 'emulator',
        host: 'http://127.2.1.41:4723',
        totalUtilizationTimeMilliSec: 7023014,
        sessionStartTime: 0,
        nodeId: 'test-node-id',
      } as unknown as IDevice,
    ];
    const nodeDevices = new NodeDevices(hub_url);
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const devices = (await axios.get(`${hub_url}/device-farm/api/device`)).data;
    devices.find((d: any) => d.udid === 'emulator-5551').should.to.be.an('object');
    nodeAndroidDevice[0].udid = 'emulator-5552';
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const updatedDeviceList = (await axios.get(`${hub_url}/device-farm/api/device`)).data;
    //updatedDeviceList.should.have.lengthOf(2);
    updatedDeviceList.find((d: any) => d.udid === 'emulator-5552').should.to.be.an('object');
  });

  it('Remove Android devices from node to hub', async () => {
    const nodeDevices = new NodeDevices(hub_url);
    const devices = (await axios.get(`${hub_url}/device-farm/api/device`)).data;
    const exptectedDevice = devices.find((d: any) => d.udid === 'emulator-5551');
    devices.find((d: any) => d.udid === 'emulator-5551').should.to.be.an('object');
    console.log('devices', exptectedDevice);
    await nodeDevices.postDevicesToHub(
      [{ udid: 'emulator-5551', host: '127.2.1.41' } as unknown as IDevice],
      'remove',
    );
    const updatedDeviceList = (await axios.get(`${hub_url}/device-farm/api/device`)).data;
    const find = updatedDeviceList.find((d: any) => d.udid === 'emulator-5551');
    expect(find).to.be.undefined;
  });
});
