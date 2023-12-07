// eslint-disable-next-line @typescript-eslint/no-var-requires
import NodeDevices from '../../src/device-managers/NodeDevices';


var chai = require('chai'),
  // eslint-disable-next-line no-unused-vars
  should = chai.should();
import { expect } from 'chai';
import axios from 'axios';
import { HUB_APPIUM_PORT, NODE_APPIUM_PORT, PLUGIN_PATH, ensureAppiumHome, ensureHubConfig, ensureNodeConfig } from './e2ehelper';
import { pluginE2EHarness } from '@appium/plugin-test-support';
import ip from 'ip';
import { IDevice } from '../../src/interfaces/IDevice';
import { DeviceModel } from '../../src/data-service/db';

describe('Basic Plugin Test', () => {
  // dump hub config into a file
  const hub_config_file = ensureHubConfig();

  // dump node config into a file
  const node_config_file = ensureNodeConfig();

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome();

  // run hub
  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: hub_config_file
    },
    pluginName: 'device-farm',
    port: HUB_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!
  })

  const hub_url = `http://${ip.address()}:${HUB_APPIUM_PORT}`;

  it('Basic Plugin test', async () => {
    (await axios.get(`${hub_url}/device-farm`)).status.should.eql(200);
  });

  it('Basic Plugin API test', async () => {
    (await axios.get(`${hub_url}/device-farm/api/devices`)).status.should.eql(200);
  });

  it('Add Android devices from node to hub', async () => {
    DeviceModel.removeDataOnly();
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
      } as unknown as IDevice,
    ];
    let nodeDevices = new NodeDevices(hub_url);
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const devices = (await axios.get(`${hub_url}/device-farm/api/devices`)).data;
    devices.find((d: any) => d.udid === 'emulator-5551').should.to.be.an('object');
    nodeAndroidDevice[0].udid = 'emulator-5552';
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const updatedDeviceList = (await axios.get(`${hub_url}/device-farm/api/devices`))
      .data;
    //updatedDeviceList.should.have.lengthOf(2);
    updatedDeviceList.find((d: any) => d.udid === 'emulator-5552').should.to.be.an('object');
  });

  it('Remove Android devices from node to hub', async () => {
    let nodeDevices = new NodeDevices(hub_url);
    const devices = (await axios.get(`${hub_url}/device-farm/api/devices`)).data;
    const exptectedDevice = devices.find((d: any) => d.udid === 'emulator-5551');
    devices.find((d: any) => d.udid === 'emulator-5551').should.to.be.an('object');
    console.log('devices', exptectedDevice);
    await nodeDevices.postDevicesToHub([{ udid: 'emulator-5551', host: '127.2.1.41' } as unknown as IDevice], 'remove');
    const updatedDeviceList = (await axios.get(`${hub_url}/device-farm/api/devices`))
      .data;
    let find = updatedDeviceList.find((d: any) => d.udid === 'emulator-5551');
    expect(find).to.be.undefined;
  });
});
