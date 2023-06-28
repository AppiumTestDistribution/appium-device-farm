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
  platformName: 'android',
  'appium:app': 'bs://6b27ca8387cbd29e429f5fea9595edf8460eff60',
  'bstack:options': {
    projectName: 'Login',
    buildName: '1.1',
    sessionName: 'LoginTest',
  },
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
