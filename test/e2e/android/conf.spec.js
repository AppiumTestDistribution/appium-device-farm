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
  'df:build': 'DeviceFarm BuildName 4',
  'df:options': {
    record_video: true,
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
    await driver.executeScript('devicefarm: setSessionName', [{ name: 'DeviceFarm SliderTest' }]);
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~logins').click();
  });

  afterEach(async function () {
    if (driver) {
      await driver.executeScript('devicefarm: setSessionStatus', [
        {
          status: this.currentTest.state,
        },
      ]);
      await driver.deleteSession();
      driver = null;
    }
  });
});
