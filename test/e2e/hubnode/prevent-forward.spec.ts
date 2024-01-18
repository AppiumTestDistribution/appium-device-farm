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
import { default_hub_config, default_node_config } from '../e2ehelper';
import _ from 'lodash';
import waitUntil from 'async-wait-until';
chai.use(chaiAsPromised);
chai.config.truncateThreshold = 0;

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

describe('E2E Forward Request - Prevent Forwarding', () => {
  // dump hub config into a file
  const hub_config_file = ensureHubConfig(
    {
      newCommandTimeoutSec: NEW_COMMAND_TIMEOUT_SECS,
      preventSessionForwarding: true,
      removeDevicesFromDatabaseBeforeRunningThePlugin: true,
      platform: 'ios',
      iosDeviceType: 'real',
    },
    'hub-prevent-forward',
  );

  // dump node config into a file
  const node_config_file = ensureNodeConfig(
    {
      hub: `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/wd/hub`,
      removeDevicesFromDatabaseBeforeRunningThePlugin: true,
      platform: 'android',
      sendNodeDevicesToHubIntervalMs: 1000,
      preventSessionForwarding: true,
    },
    'node-prevent-forward',
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
    appiumLogFile: './hub-prevent-forward.log',
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

  it('can not forward session when preventSessionForwarding is set to true', async () => {
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

    console.log(`Waiting for android devices to be available`);
    // wait until there are android devices from the node
    await waitForCondition(
      async () => {
        // use axios to get the devices
        const res = await axios.get(
          `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`,
        );

        const nodeDevices = res.data.filter(
          (device: any) =>
            device.host.includes(default_node_config.bindHostOrIp) && device.platform === 'android',
        );

        console.log(`nodeDevices: ${JSON.stringify(nodeDevices)}`);

        return nodeDevices.length > 0;
      },
      20000,
      1000,
    );

    // all android devices coming from node
    const androidDevices = initialDevices.filter((device: any) => device.platform === 'android');
    const nodeDevices = initialDevices.filter(
      (device: any) =>
        device.host.includes(default_node_config.bindHostOrIp) && device.platform === 'android',
    );

    // pre-requisite: there should be android devices
    expect(androidDevices.length).to.be.greaterThan(0);
    expect(nodeDevices.length).to.be.greaterThan(0);

    // the whole android devices should be coming from the node
    expect(androidDevices.length).to.equal(nodeDevices.length);
    try {
      driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);
      console.log(`driver: ${JSON.stringify(driver)}`);
      expect.fail('should not be able to forward session');
    } catch (ign: unknown) {
      expect(`${ign}`).to.include(
        'Requested device is available on the node. However, session forwarding is disabled. Please enable it by setting "preventSessionForwarding" to false in plugin args',
      );
    }

    const noBusyDevice = await waitUntil(async () => {
      const allDevices = (
        await axios.get(
          `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}/device-farm/api/device`,
        )
      ).data;

      const busyDevice = allDevices.filter((device: any) => device.busy);
      console.log(`PREVENT FORWARD: busyDevice: ${JSON.stringify(busyDevice)}`);

      return busyDevice.length == 0;
    });

    // no device should be busy
    expect(noBusyDevice).to.be.true;
  });

  afterEach(async function () {
    if (!_.isNil(driver)) {
      try {
        await driver.deleteSession();
      } catch (ign) {
        console.log(ign);
      }
      driver = undefined;
    }
  });
});
