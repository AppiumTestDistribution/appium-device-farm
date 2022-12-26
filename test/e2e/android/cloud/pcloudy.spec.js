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
  automationName: 'UiAutomator2',
  newCommandTimeout: 600,
  launchTimeout: 90000,
  platformName: 'Android',
  autoGrantPermissions: true,
  pCloudy_DurationInMinutes: 10,
  pCloudy_WildNet: 'false',
  pCloudy_EnableVideo: 'true',
  pCloudy_EnablePerformanceData: 'true',
  pCloudy_EnableDeviceLogs: 'true',
  pCloudy_ApplicationName: 'pCloudy_Appium_Demo.apk',
  appPackage: 'com.pcloudy.appiumdemo',
  appActivity: 'com.ba.mobile.LaunchActivity'
};
let driver;
describe('Plugin Test', () => {
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities });
  });

  it('Vertical swipe test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.$('~login').click();
  });

  afterEach(async () => await driver.deleteSession());
});
