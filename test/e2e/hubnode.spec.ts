import { expect } from 'chai';
import ip from 'ip';

import { pluginE2EHarness } from '@appium/plugin-test-support';
import { remote } from 'webdriverio';
import { HUB_APPIUM_PORT, NODE_APPIUM_PORT, PLUGIN_PATH, ensureAppiumHome, ensureHubConfig, ensureNodeConfig } from './e2ehelper';
import { Options } from '@wdio/types';
import axios from 'axios';

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
  "appium:automationName": "UiAutomator2",
  "appium:app": "https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_android.apk",
  "platformName": "android",
  "appium:deviceName": "",
  "appium:uiautomator2ServerInstallTimeout": 90000,
} as unknown as WebdriverIO.Capabilities

describe('E2E', () => {
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

  // run node
  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: node_config_file
    },
    pluginName: 'device-farm',
    port: NODE_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!
  })

  it('Vertical swipe test', async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);

    console.log(`Device UDID: ${await driver.capabilities.deviceUDID}`);
    await driver.performActions([
      {
        "type": "pointer",
        "id": "finger1",
        "parameters": {"pointerType": "touch"},
        "actions": [
          {"type": "pointerMove", "duration": 0, "x": 100, "y": 100},
          {"type": "pointerDown", "button": 0},
          {"type": "pause", "duration": 500},
          {"type": "pointerMove", "duration": 1000, "origin": "pointer", "x": -50, "y": 0},
          {"type": "pointerUp", "button": 0}
        ]
      }])
    console.log("Successfully swiped");
  });

  it('serve device-farm endpoint when test is still running', async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);

    // check device-farm endpoint using axios
    const res = await axios.get(`http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm`);
    expect(res.status).to.equal(200);
  })

  it('Clean pending session when session failed to start', async () => {
    // ask appium to launch non-existent app package and app activity
    const nonExistentAppCapabilities = {
      "appium:automationName": "UiAutomator2",
      "appium:appPackage": "com.nonexistent",
      "appium:appActivity": "com.nonexistent.MainActivity",
      "platformName": "android",
      "appium:deviceName": "",
      "appium:uiautomator2ServerInstallTimeout": 90000,
    } as unknown as WebdriverIO.Capabilities

    expect(async () => {
      driver = await remote({ ...WDIO_PARAMS, capabilities: nonExistentAppCapabilities } as Options.WebdriverIO);
    }).to.throw;

    // check device-farm endpoint using axios: /api/queues/length
    const res = await axios.get(`http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm/api/queues/length`);
    expect(res.status).to.equal(200);
    expect(res.data).to.equal(0);
  })


  afterEach(async function() {
    if (driver !== undefined) {
      await driver.deleteSession()
      driver = undefined;
    }
  });
});