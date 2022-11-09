import ChromeDriverManager from '../../src/device-managers/ChromeDriverManager';
import { fs } from '@appium/support';
import { getModuleRoot, getChromedriverBinaryPath } from '../../src/chromeUtils';

describe('Chrome Driver Manager', function () {
  this.timeout(500000);
  it('Should fetch chrome driver for given version', async () => {
    const chromeDriverManager = await ChromeDriverManager.getInstance();
    const eightyThree = await chromeDriverManager.downloadChromeDriver(83);
    const eightyFour = await chromeDriverManager.downloadChromeDriver(84);
    (await fs.readdir(getChromedriverBinaryPath(getModuleRoot()))).length.should.be.eql(2);
    console.log(eightyThree, eightyFour);
  });
});
