import { expect } from 'chai';
import ip from 'ip';
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
  hub_config,
  node_config,
} from '../e2ehelper';
import { Options } from '@wdio/types';
import axios from 'axios';
import { default as chaiAsPromised } from 'chai-as-promised';
import * as chai from 'chai';
chai.use(chaiAsPromised);

let driver: any;

const APPIUM_HOST = ip.address();
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  logLevel: 'info',
};

const capabilities = {
  'appium:automationName': 'UiAutomator2',
  'appium:app': 'https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_android.apk',
  platformName: 'android',
  'appium:deviceName': '',
  'appium:uiautomator2ServerInstallTimeout': 90000,
} as unknown as WebdriverIO.Capabilities;

let hubReady = false;
let nodeReady = false;

describe('E2E Hub and Node', () => {
  console.log('Before all');
  // dump hub config into a file
  const hub_config_file = ensureHubConfig('android', 'real');

  // dump node config into a file
  const node_config_file = ensureNodeConfig();

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

  it('should have devices on the hub', async () => {
    await waitForHubAndNode();
    // check device-farm endpoint using axios
    const res = await axios.get(`http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm/api/devices`);
    // const res = await axios.get(`http://${APPIUM_HOST}:${NODE_APPIUM_PORT}/device-farm/api/devices`);
    expect(res.status).to.equal(200);
    expect(res.data.length).to.be.greaterThan(0);
    // one of the devices should be an android device from the node
    const androidDevices = res.data.filter((device: any) => device.platform === 'android');
    expect(androidDevices.length).to.be.greaterThan(0);
  });

  it('Vertical swipe test', async () => {
    await waitForHubAndNode();

    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);

    console.log(`Device UDID: ${await driver.capabilities.deviceUDID}`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 100, y: 100 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 500 },
          { type: 'pointerMove', duration: 1000, origin: 'pointer', x: -50, y: 0 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    console.log('Successfully swiped');
  });

  it('serve device-farm endpoint when test is still running', async () => {
    await waitForHubAndNode();

    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);

    // check device-farm endpoint using axios
    const res = await axios.get(`http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm`);
    expect(res.status).to.equal(200);
  });

  it('Clean pending session when session failed to start', async () => {
    await waitForHubAndNode();

    // ask appium to launch non-existent app package and app activity
    const nonExistentAppCapabilities = {
      'appium:automationName': 'UiAutomator2',
      'appium:appPackage': 'com.nonexistent',
      'appium:appActivity': 'com.nonexistent.MainActivity',
      platformName: 'android',
      'appium:deviceName': '',
      'appium:uiautomator2ServerInstallTimeout': 90000,
    } as unknown as WebdriverIO.Capabilities;

    await expect(
      remote({ ...WDIO_PARAMS, capabilities: nonExistentAppCapabilities } as Options.WebdriverIO),
    ).to.eventually.be.rejected;

    // check device-farm endpoint using axios: /api/queues/length
    const res = await axios.get(
      `http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm/api/queues/length`,
    );
    expect(res.status).to.equal(200);
    expect(res.data).to.equal(0);
  });

  it('Propagate error when session failed to be created', async () => {
    await waitForHubAndNode();

    // ask appium to launch non-existent app package and app activity
    const nonExistentAppCapabilities = {
      'appium:automationName': 'UiAutomator2',
      'appium:appPackage': 'com.nonexistent',
      'appium:appActivity': 'com.nonexistent.MainActivity',
      platformName: 'android',
      'appium:deviceName': '',
      'appium:uiautomator2ServerInstallTimeout': 90000,
    } as unknown as WebdriverIO.Capabilities;

    await expect(
      remote({ ...WDIO_PARAMS, capabilities: nonExistentAppCapabilities } as Options.WebdriverIO),
    ).to.eventually.be.rejectedWith(
      "An unknown server-side error occurred while processing the command. Original error: Error: Either provide 'app' option to install 'com.nonexistent' or consider setting 'noReset' to 'true' if 'com.nonexistent' is supposed to be preinstalled.",
    );
  });

  afterEach(async function () {
    if (driver !== undefined) {
      await driver.deleteSession();
      driver = undefined;
    }
  });
});
