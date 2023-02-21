import ChromeDriverManager from '../../src/device-managers/ChromeDriverManager';
import { fs } from '@appium/support';
import { getModuleRoot, getChromedriverBinaryPath } from '../../src/chromeUtils';

describe('Chrome Driver Manager', function () {
  this.timeout(500000);
  it.skip('Should fetch chrome driver for given version', async () => {
    const chromeDriverManager = await ChromeDriverManager.getInstance();
    await chromeDriverManager.downloadChromeDriver(83);
    await chromeDriverManager.downloadChromeDriver(84);
    (await fs.readdir(await getChromedriverBinaryPath(getModuleRoot()))).length.should.be.eql(3);
  });
});
