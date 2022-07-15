import { remote } from 'webdriverio';
import { WDIO_PARAMS, androidCapabilities } from '../wdio.config';

describe('Plugin1 Test', () => {
  let driver;
  beforeEach(async () => {
    driver = await remote({ ...WDIO_PARAMS, capabilities: androidCapabilities });
  });

  it('Slider test', async () => {
    console.log(await driver.capabilities.deviceUDID);
    await driver.pause(2000);
    await driver.$('~login').click();
    await driver.$('~slider1').click();
    await driver.pause(2000);
  });

  afterEach(async () => await driver.deleteSession());
});
