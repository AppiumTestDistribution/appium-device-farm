import { remote } from 'webdriverio';
import { command } from 'webdriver';

const APPIUM_HOST = 'localhost';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'silent',
};
const capabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:iPhoneOnly': true,
  'appium:app': '/Users/saikrisv/Downloads/vodqa.zip',
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
