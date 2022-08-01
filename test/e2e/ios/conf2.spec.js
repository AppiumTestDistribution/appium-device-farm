import { remote } from 'webdriverio';

const APPIUM_HOST = 'localhost';
const APPIUM_PORT = 4723;
const WDIO_PARAMS = {
  connectionRetryCount: 220000,
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
  let browser;
  beforeEach(async () => {
    browser = await remote({ ...WDIO_PARAMS, capabilities });
  });

  it('iOS veritical swipe', async () => {
    await browser.$('~login').click();
    await browser.$('~verticalSwipe').click();
    await browser.pause(2000);
  });

  afterEach(async () => await browser.deleteSession());
});
