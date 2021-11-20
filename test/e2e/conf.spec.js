import { remote } from 'webdriverio';
import { command } from 'webdriver';

const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'silent',
};
const capabilities = {
  platformName: 'Android',
  'appium:uiautomator2ServerInstallTimeout': '50000',
  'appium:automationName': 'UIAutomator2',
  'appium:app': '/Users/saikrishna/Downloads/VodQA.apk',
  'appium:newCommandTimeout': 10,
};
describe('Plugin Test', () => {
  it('Basic Plugin test', async () => {
    const driver = await remote({ ...WDIO_PARAMS, capabilities });
    await driver.$('~login').click();
    await driver.$('~verticalSwipe').click();
    await driver.deleteSession();
  });
});
