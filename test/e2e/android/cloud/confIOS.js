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
  platformName: 'iOS',
  'appium:app': 'bs://444bd0308813ae0dc236f8cd461c02d3afa7901d',
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
    var textButton = await driver.$('~Text Button');
    await textButton.waitForDisplayed({ timeout: 30000 });
    await textButton.click();
  });

  afterEach(async () => await driver.deleteSession());
});
