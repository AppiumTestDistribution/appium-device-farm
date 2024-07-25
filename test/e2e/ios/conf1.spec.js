import { remote } from 'webdriverio';
const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 31337;
const WDIO_PARAMS = {
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'info',
};
const capabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:iPhoneOnly': true,
  'appium:bundleId': 'com.device.farm.wdioapp',
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
