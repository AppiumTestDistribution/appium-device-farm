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
  waitForCondition,
} from '../e2ehelper';
import { Options } from '@wdio/types';
import axios from 'axios';
import { default as chaiAsPromised } from 'chai-as-promised';
import * as chai from 'chai';
import { hub_config, node_config } from '../e2ehelper';
chai.use(chaiAsPromised);

let driver: any;

const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: hub_config.bindHostOrIp,
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

describe('E2E Forward Request - Prevent Forwarding', () => {
  // dump hub config into a file
  const hub_config_file = ensureHubConfig({
    newCommandTimeoutSec: NEW_COMMAND_TIMEOUT_SECS,
    preventSessionForwarding: true,
    removeDevicesFromDatabaseBeforeRunningThePlugin: true,
    platform: 'ios',
  });

  // dump node config into a file
  const node_config_file = ensureNodeConfig({
    hub: `http://${hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/wd/hub`,
    removeDevicesFromDatabaseBeforeRunningThePlugin: true,
    platform: 'android',
    sendNodeDevicesToHubIntervalMs: 1000,
  });

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
    host: hub_config.bindHostOrIp,
    port: HUB_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
    appiumLogFile: './hub-prevent-forward.log',
  });

  // run node
  const nodeProcess = pluginE2EHarness({
    before: undefined,
    after: global.after,
    configFile: node_config_file,
    pluginName: 'device-farm',
    port: NODE_APPIUM_PORT,
    host: node_config.bindHostOrIp,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME_NODE!,
    appiumLogFile: './node-prevent-forward.log',
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

  it('can not forward session when preventSessionForwarding is set to false', async () => {
    await waitForHubAndNode();
    if (hub_config.bindHostOrIp == node_config.bindHostOrIp) {
      it.skip('node and hub should not be using the same host');
    }

    const initialDevices = (
      await axios.get(`http://${hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`)
    ).data;

    // all devices must have nodeId
    expect(initialDevices.filter((device: any) => device.nodeId === undefined).length).to.equal(0);

    console.log(`Waiting for android devices to be available`);
    // wait until there are android devices
    await waitForCondition(
      async () => {
        // use axios to get the devices
        const res = await axios.get(
          `http://${hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`,
        );
        return res.data.filter((device: any) => device.platform === 'android').length > 0;
      },
      20000,
      1000,
    );

    // all android devices coming from node
    const androidDevices = initialDevices.filter((device: any) => device.platform === 'android');
    const nodeDevices = initialDevices.filter((device: any) =>
      device.host.includes(node_config.bindHostOrIp) && device.platform === 'android',
    );

    console.log(`initialDevices: ${JSON.stringify(initialDevices)}`);
    console.log(`androidDevices: ${JSON.stringify(androidDevices)}`);
    console.log(`nodeDevices: ${JSON.stringify(nodeDevices)}`);

    // there should be android devices
    expect(androidDevices.length).to.be.greaterThan(0);

    // android devices and node devices should be equal
    expect(androidDevices.length).to.equal(nodeDevices.length);

    expect(remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO)).to.eventually.throw();

    const allDevices = (
      await axios.get(`http://${hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`)
    ).data;

    const busyDevice = allDevices.filter((device: any) => device.busy);

    // no device should be busy
    expect(busyDevice.length).to.equal(0);
  });

  afterEach(async function () {
    if (driver !== undefined) {
      await driver.deleteSession();
      driver = undefined;
    }
  });
});
