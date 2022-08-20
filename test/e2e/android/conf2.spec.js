import { remote } from 'webdriverio';

const APPIUM_HOST = 'localhost';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'info',
};
const capabilities = {
  platformName: 'Android',
  'appium:uiautomator2ServerInstallTimeout': '50000',
  'appium:automationName': 'UIAutomator2',
  'appium:app':
    'https://github.com/AppiumTestDistribution/appium-demo/blob/main/VodQA.apk?raw=true',
};
describe('Plugin1 Test', () => {
  let driver;
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });
  });

  it('Slider test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.pause(2000);
    await driver.$('~login').click();
    await driver.$('~slider1').click();
    await driver.pause(2000);
  });

  afterEach(async () => await driver.deleteSession());
});
