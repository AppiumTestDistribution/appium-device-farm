import { Options } from '@wdio/types';
import { remote } from 'webdriverio';
import ip from 'ip';
import { pluginE2EHarness } from '@appium/plugin-test-support';
import path from 'path';
import { ensureAppiumHome, HUB_APPIUM_PORT, PLUGIN_PATH } from '../../e2ehelper';

const APPIUM_HOST = ip.address();
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  logLevel: 'info',
};
const capabilities = {
  automationName: 'UiAutomator2',
  newCommandTimeout: 600,
  launchTimeout: 90000,
  platformName: 'Android',
  autoGrantPermissions: true,
  pCloudy_DurationInMinutes: 10,
  pCloudy_WildNet: 'false',
  pCloudy_EnableVideo: 'true',
  pCloudy_EnablePerformanceData: 'true',
  pCloudy_EnableDeviceLogs: 'true',
  pCloudy_ApplicationName: 'pCloudy_Appium_Demo.apk',
  appPackage: 'com.pcloudy.appiumdemo',
  appActivity: 'com.ba.mobile.LaunchActivity',
};
let driver: any;
describe('Plugin Test', () => {
  // dump hub config into a file
  const hub_config_file = path.join(__dirname, '../../../../serverConfig/pcloudy-config.json');

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
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~login').click();
  });

  afterEach(async () => await driver.deleteSession());
});
