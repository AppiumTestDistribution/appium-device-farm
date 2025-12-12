import { remote } from 'webdriverio';

const APPIUM_HOST = '127.0.0.1';
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
  'df:options': {
    recordVideo: true,
    screenshotOnFailure: true,
    build: new Date().toISOString(),
    saveDeviceLogs: true,
    tags: ['team1', 'team22'],
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
    await driver.pause(3000);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: 100, y: 100 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 500 },
          { type: 'pointerMove', duration: 1000, origin: 'pointer', x: -50, y: 0 },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
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
