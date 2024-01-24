import { pluginE2EHarness } from '@appium/plugin-test-support';
import path from 'path';
import { remote } from 'webdriverio';
import { ensureAppiumHome, HUB_APPIUM_PORT, PLUGIN_PATH } from '../../e2ehelper';
import ip from 'ip';
import { Options } from '@wdio/types';
import axios from 'axios';
import waitUntil from 'async-wait-until';

const APPIUM_HOST = ip.address();
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  logLevel: 'info',
};
const capabilities = {
  platformName: 'iOS',
  'appium:automationName': 'xcuitest',
  'appium:app': process.env.BS_IOS_CLOUD_APP ?? 'bs://444bd0308813ae0dc236f8cd461c02d3afa7901d',
  'bstack:options': {
    projectName: 'Login',
    buildName: '1.1',
    sessionName: 'LoginTest',
  },
  'appium:deviceName': 'iPhone 14',
};
let driver: any;
describe('Plugin Test', () => {
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
    driverName: 'xcuitest',
    driverSpec: 'appium-xcuitest-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  beforeEach(async () => {
    // wait until ios cloud devices are available
    await waitUntil(async () => {
      const devices = await axios.get(
        `http://${APPIUM_HOST}:${HUB_APPIUM_PORT}/device-farm/api/device/ios`,
      );
      const iosDevices = devices.data.filter(
        (device: any) => device.cloud === 'browserstack' && device.platform.toLowerCase() === 'ios',
      );
      console.log(`iOS devices: ${JSON.stringify(iosDevices)}`);
      return iosDevices.length > 0;
    }, 1000);

    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);
  });

  it('Vertical swipe test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    let textButton = await driver.$('~Text Button');
    await textButton.waitForDisplayed({ timeout: 30000 });
    await textButton.click();
  });

  afterEach(async () => {
    if (driver) {
      await driver.deleteSession();
      driver = null;
    }
  });
});
