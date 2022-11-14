import {
  formatCdVersion,
  getChromedriverBinaryPath,
  getModuleRoot,
  getOsInfo,
} from '../chromeUtils';
import { ChromedriverStorageClient } from 'appium-chromedriver';

export default class ChromeDriverManager {
  private static instance: ChromeDriverManager;

  private readonly client: any;
  private readonly osInfo: any;
  private readonly mapping: any;
  private readonly tempDirectory: any;

  constructor(client: any, osInfo: any, mapping: any, tempDirectory: any) {
    this.client = client;
    this.osInfo = osInfo;
    this.mapping = mapping;
    this.tempDirectory = tempDirectory;
  }

  public static async getInstance() {
    const shouldParseNotes = true;
    if (!ChromeDriverManager.instance) {
      const tmpRoot = getModuleRoot();
      const osInfo = await getOsInfo();
      const client = new ChromedriverStorageClient({
        chromedriverDir: await getChromedriverBinaryPath(tmpRoot),
      });
      const mapping = await client.retrieveMapping(shouldParseNotes);
      return new ChromeDriverManager(client, osInfo, mapping, tmpRoot);
    }
    return Promise.resolve(ChromeDriverManager.instance);
  }

  public async downloadChromeDriver(version: any) {
    const osInfo1 = this.osInfo;
    const synchronizedDrivers = await this.client.syncDrivers({
      osInfo1,
      minBrowserVersion: [await formatCdVersion(version)],
    });
    const synchronizedDriversMapping = synchronizedDrivers.reduce((acc: any, x: any) => {
      const { version, minBrowserVersion } = this.mapping[x];
      acc[version] = minBrowserVersion;
      return acc;
    }, {});
    const versions = Object.keys(synchronizedDriversMapping);
    const latestVersion = `v${versions[versions.length - 1]}`;
    return `${await getChromedriverBinaryPath(this.tempDirectory)}/chromedriver_${
      this.osInfo.name
    }${this.osInfo.arch}_${latestVersion}`;
  }
}
