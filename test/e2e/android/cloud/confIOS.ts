import { pluginE2EHarness } from '@appium/plugin-test-support';
import path from 'path';
import { remote } from 'webdriverio';
import { ensureAppiumHome, HUB_APPIUM_PORT, PLUGIN_PATH } from '../../e2ehelper';
import ip from 'ip';
import { Options } from '@wdio/types';

const APPIUM_HOST = ip.address();
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'info',
};
const capabilities = {
  platformName: 'ios',
  'appium:app': 'bs://a46a2773fdddf08758c5db6e4b02cf9743f3055d',
  'bstack:options': {
    projectName: 'Login',
    buildName: '1.1',
    sessionName: 'LoginTest',
  },
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
    let textButton = await driver.$('~Text Button');
    await textButton.waitForDisplayed({ timeout: 30000 });
    await textButton.click();
  });

  afterEach(async () => await driver.deleteSession());
});
