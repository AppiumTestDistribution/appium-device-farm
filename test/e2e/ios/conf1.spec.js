import { remote } from 'webdriverio';
import { WDIO_PARAMS, iOSCapabilities } from 'webdriver../wdio.config';

describe('Plugin1 Test', () => {
  let driver;
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, iOSCapabilities });
  });

  it('iOS veritical swipe', async () => {
    await driver.$('~login').click();
    await driver.$('~verticalSwipe').click();
    await driver.pause(2000);
  });

  afterEach(async () => await driver.deleteSession());
});
