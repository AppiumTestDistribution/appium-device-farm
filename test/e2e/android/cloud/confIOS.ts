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
  logLevel: 'info',
};
const capabilities = {
  platformName: 'ios',
  'appium:app': process.env.BS_IOS_CLOUD_APP ?? 'bs://6585528cee5f3b2700b54250c12d81bd7f235a3c',
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
