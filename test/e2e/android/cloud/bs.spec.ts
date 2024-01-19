import { pluginE2EHarness } from '@appium/plugin-test-support';
import path from 'path';
import { remote } from 'webdriverio';
import { ensureAppiumHome, HUB_APPIUM_PORT, PLUGIN_PATH } from '../../e2ehelper';
import ip from 'ip';
import type { Options } from '@wdio/types';
import 'dotenv/config';
import axios from 'axios';
import { expect } from 'chai';
import { default as chaiAsPromised } from 'chai-as-promised';
import * as chai from 'chai';
chai.use(chaiAsPromised);

const APPIUM_HOST = ip.address();
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  logLevel: 'info',
};
const capabilities = {
  platformName: 'android',
  'appium:automationName': 'UiAutomator2',
  'bstack:options': {
    projectName: 'Login',
    buildName: '1.1',
    sessionName: 'LoginTest',
  },
} as unknown as WebdriverIO.Capabilities;
let driver: any;

describe('BrowserStack: Plugin Test', () => {
  // dump hub config into a file
  const hub_config_file = path.join(__dirname, '../../../../serverConfig/bs-config.json');

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome();

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
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);
  });

  it('Vertical swipe test', async () => {
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

  afterEach(async () => {
    if (driver) {
      try {
        await driver.deleteSession();
      } catch (ign) {
        console.log(ign);
      }

      driver = null;
    }
  });
});

describe('Browser Stack: Quirks', () => {
  // dump hub config into a file
  const hub_config_file = path.join(__dirname, '../../../../serverConfig/bs-config.json');

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome();

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
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  async function busyDevices() {
    const res = await axios.get(`http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm/api/device`);
    return res.data.filter((device: any) => device.busy === true);
  }
  it('handles empty session id when app is invalid', async () => {
    capabilities['appium:app'] = 'bs://invalid-app-id';
    const initialBusyDevices = await busyDevices();
    console.log(`initialBusyDevices: ${JSON.stringify(initialBusyDevices)}`);

    await expect(remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO)).to.be.rejected;

    const currentBusyDevices = await busyDevices();
    console.log(`currentBusyDevices: ${JSON.stringify(currentBusyDevices)}`);

    // the same number of devices should be busy
    expect(currentBusyDevices.length).to.equal(initialBusyDevices.length);

    // no cloud devices should be allocated
    const cloudDevices = currentBusyDevices.filter(
      (device: any) => device.cloud === 'browserstack',
    );
    expect(cloudDevices.length).to.equal(0);
  });

  afterEach(async () => {
    if (driver) {
      try {
        await driver.deleteSession();
      } catch (ign) {
        console.log(ign);
      }

      driver = null;
    }
  });
});
