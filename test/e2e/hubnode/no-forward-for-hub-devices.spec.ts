import { expect } from 'chai';
// we are using custom plugin harness as we want to run two instance of device-farm simultaneously
import { pluginE2EHarness } from '../plugin-harness';
import { remote } from 'webdriverio';
import {
  HUB_APPIUM_PORT,
  NODE_APPIUM_PORT,
  PLUGIN_PATH,
  ensureAppiumHome,
  ensureHubConfig,
  ensureNodeConfig,
} from '../e2ehelper';
import { Options } from '@wdio/types';
import axios from 'axios';
import { default as chaiAsPromised } from 'chai-as-promised';
import * as chai from 'chai';
import { default_hub_config, default_node_config } from '../e2ehelper';
chai.use(chaiAsPromised);

let driver: any;

const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: default_hub_config.bindHostOrIp,
  port: HUB_APPIUM_PORT,
  logLevel: 'info',
  path: '/',
};

let hubReady = false;
let nodeReady = false;

const capabilities = {
  'appium:automationName': 'UiAutomator2',
  'appium:app': 'https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_android.apk',
  platformName: 'android',
  'appium:deviceName': '',
  'appium:uiautomator2ServerInstallTimeout': 90000,
} as unknown as WebdriverIO.Capabilities;

const NEW_COMMAND_TIMEOUT_SECS = 10;

describe('E2E Forward Request - No Forward for Hub Devices', () => {
  // dump hub config into a file
  const hub_config_file = ensureHubConfig(
    {
      newCommandTimeoutSec: NEW_COMMAND_TIMEOUT_SECS,
      removeDevicesFromDatabaseBeforeRunningThePlugin: true,
      preventSessionForwarding: true,
      platform: 'android',
    },
    'hub-no-forward-request',
  );

  // dump node config into a file
  const node_config_file = ensureNodeConfig(
    {
      removeDevicesFromDatabaseBeforeRunningThePlugin: true,
      platform: 'ios',
    },
    'node-no-forward-request',
  );

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome('hub', true);

  const APPIUM_HOME_NODE = ensureAppiumHome('node', true);

  console.log(`Hub config file: ${hub_config_file}`);

  // run hub
  const hubProcess = pluginE2EHarness({
    before: undefined,
    after: global.after,
    configFile: hub_config_file,
    pluginName: 'device-farm',
    host: default_hub_config.bindHostOrIp,
    port: HUB_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  // run node
  const nodeProcess = pluginE2EHarness({
    before: undefined,
    after: global.after,
    configFile: node_config_file,
    pluginName: 'device-farm',
    port: NODE_APPIUM_PORT,
    host: default_node_config.bindHostOrIp,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME_NODE!,
  });

  async function waitForHubAndNode() {
    if (!hubReady) {
      console.log('Waiting for hub to be ready');
      await hubProcess.startPlugin();
      hubReady = true;
    }

    if (!nodeReady) {
      console.log('Waiting for node to be ready');
      await nodeProcess.startPlugin();
      nodeReady = true;
    }
  }

  it('should not forward request for device in the hub itself', async () => {
    await waitForHubAndNode();
    if (default_hub_config.bindHostOrIp == default_node_config.bindHostOrIp) {
      it.skip('node and hub should not be using the same host');
    }

    const initialDevices = (
      await axios.get(
        `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`,
      )
    ).data;

    // all devices must have nodeId
    expect(initialDevices.filter((device: any) => device.nodeId === undefined).length).to.equal(0);

    const androidDevices = initialDevices.filter((device: any) => device.platform === 'android');

    console.log(`androidDevices: ${JSON.stringify(androidDevices)}`);

    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);

    const allDevices = (
      await axios.get(
        `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`,
      )
    ).data;

    const busyDevice = allDevices.filter((device: any) => device.busy);

    // check device status
    const newAllDevices = (
      await axios.get(
        `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`,
      )
    ).data;

    const newBusyDevice = newAllDevices.filter(
      (device: any) => device.udid === busyDevice[0].udid && device.host === busyDevice[0].host,
    );

    // device should be busy
    expect(newBusyDevice[0].busy).to.be.true;
  });

  afterEach(async function () {
    if (driver !== undefined) {
      await driver.deleteSession();
      driver = undefined;
    }
  });
});
