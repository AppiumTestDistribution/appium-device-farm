import { remote } from 'webdriverio';

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
  'appium:app': '/Users/saikrisv/Downloads/VodQA.apk',
};
let driver;
describe('Plugin Test', () => {
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });
  });

  it('Vertical swipe test', async () => {
    console.log(await driver.capabilities.deviceUDID);
     await driver.pause(2000);
    await driver.$('~login').click();
    await driver.$('~verticalSwipe').click();
    await driver.pause(2000);
  });

  afterEach(async () => await driver.deleteSession());
});
