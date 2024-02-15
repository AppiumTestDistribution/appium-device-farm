import { remote } from 'webdriverio';

const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 31337;
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
  'df:options': {
    record_video: true,
    screenshot_on_failure: true,
  },
  'appium:app':
    'https://github.com/AppiumTestDistribution/appium-demo/blob/main/VodQA.apk?raw=true',
};
let driver;
describe('Plugin Test', () => {
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });
  });

  it('Vertical swipe test', async () => {
    await driver.executeScript('devicefarm: setSessionName', [{ name: 'SliderTest Example' }]);
    await driver.pause(20000);
    await driver.$('~login').click();
    await driver.$('~slider1').click();
  });

  afterEach(async function () {
    if (driver) {
      await driver.executeScript('devicefarm: setSessionStatus', [
        {
          status: this.currentTest.state, //passed or failed
        },
      ]);
      await driver.deleteSession();
      driver = null;
    }
  });
});
