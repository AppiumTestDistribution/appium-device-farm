import * as os from 'os';
import * as path from 'path';
const basePath = path.join(os.homedir(), '.cache', 'appium-device-farm');

export interface Config {
  cacheDir: string;
  databasePath: string;
  videoSavePath: string;
  screenshotSavePath: string;
  logFilePath: string;
  takeScreenshotsFor: Array<string>;
}

export const config = {
  cacheDir: basePath,
  databasePath: `${basePath}/device-farm.db`,
  videoSavePath: path.join(basePath, 'videos'),
  screenshotSavePath: path.join(basePath, 'screen-shots'),
  logFilePath: path.join(basePath, 'appium-device-farm.log'),
  takeScreenshotsFor: ['click', 'setUrl', 'setValue', 'performActions'],
};
