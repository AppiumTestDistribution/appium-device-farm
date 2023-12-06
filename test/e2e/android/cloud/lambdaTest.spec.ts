import { pluginE2EHarness } from '@appium/plugin-test-support';
import path from 'path';
import { remote } from 'webdriverio';
import { ensureAppiumHome, HUB_APPIUM_PORT, PLUGIN_PATH } from '../../e2ehelper';
import ip from 'ip';
import { Options } from '@wdio/types';
import 'dotenv/config'


const APPIUM_HOST = ip.address();
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/',
  logLevel: 'info',
};
const capabilities = {
  platformName: 'Android',
  //'appium:isRealMobile': true,
  'appium:appiumVersion': '2.0',
  'appium:app': process.env.CLOUD_APP ?? 'lt://APP10160361451697712441620971',
  'appium:build': 'ATDDevs',
  'appium:name': 'Device-Farm Plugin',
  'appium:project': 'Appium Device Farm',
  'lt:options': {
    w3c: true,
  },
} as unknown as WebdriverIO.Capabilities;
let driver: any;
describe('Plugin Test', () => {
  // dump hub config into a file
  const hub_config_file = path.join(__dirname, '../../../../serverConfig/lt-config.json');

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
  
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities } as Options.WebdriverIO);
  });

  it('Vertical swipe test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~login').click();
  });

  afterEach(async () => await driver.deleteSession());
});
