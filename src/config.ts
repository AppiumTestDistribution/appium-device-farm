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
  sessionAssetsPath: path.join(basePath, 'assets', 'sessions'),
  takeScreenshotsFor: ['click', 'setUrl', 'setValue', 'performActions'],
};
