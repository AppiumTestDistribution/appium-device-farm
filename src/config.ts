import * as os from 'os';
import * as path from 'path';
import { Config } from './types/Config';
const basePath = path.join(os.homedir(), '.cache', 'appium-device-farm');

export const config: Config = {
  cacheDir: basePath,
  databasePath: `${basePath}/device-farm.db`,
  sessionAssetsPath: path.join(basePath, 'assets', 'sessions'),
  takeScreenshotsFor: ['click', 'setUrl', 'setValue', 'performActions'],
};
