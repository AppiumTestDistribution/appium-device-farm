import ChromeDriverManager from '../../src/device-managers/ChromeDriverManager';

describe('Chrome Driver Manager', function () {
  this.timeout(500000);
  it('Should fetch chrome driver for given version', async () => {
    const chromeDriverManager = await ChromeDriverManager.getInstance();
    const eightyThree = await chromeDriverManager.downloadChromeDriver(83);
    const eightyFour = await chromeDriverManager.downloadChromeDriver(84);
    console.log(eightyThree, eightyFour);
  });
});
