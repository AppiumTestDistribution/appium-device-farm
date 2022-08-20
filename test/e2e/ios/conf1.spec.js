import { remote } from 'webdriverio';

const APPIUM_HOST = 'localhost';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 220000,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'info',
};
const capabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:iPhoneOnly': true,
  'appium:app': 'https://github.com/AppiumTestDistribution/appium-demo/blob/main/vodqa.zip?raw=true',
};
describe('Plugin1 Test', () => {
  let driver;
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });
  });

  it('iOS veritical swipe', async () => {
    await driver.$('~login').click();
    await driver.$('~verticalSwipe').click();
    await driver.pause(2000);
  });

  afterEach(async () => await driver.deleteSession());
});
