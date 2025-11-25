import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { Config } from './types/Config';

const basePath = path.join(os.homedir(), '.cache', 'appium-device-farm');
const deviceFarmHome = getDeviceFarmHome();

function getDeviceFarmHome() {
  let deviceFarmHome = basePath;
  if (process.env.DEVICE_FARM_HOME) {
    deviceFarmHome = process.env.DEVICE_FARM_HOME;
  }
  if (!fs.existsSync(deviceFarmHome)) {
    fs.mkdirSync(deviceFarmHome, { recursive: true });
  }
  console.info('Using Metadata Path: ', deviceFarmHome);
  return deviceFarmHome;
}

export function getServerMetadata() {
  const metaFile = path.join(getDeviceFarmHome(), 'metadata.json');
  const defaultMetadata = {
    id: uuid(),
  };
  if (fs.existsSync(metaFile)) {
    const metadata = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
    if (!metadata || !metadata.id) {
      fs.writeFileSync(metaFile, JSON.stringify(Object.assign(defaultMetadata, metadata)));
      return {
        ...defaultMetadata,
        ...metadata,
      };
    }
    return metadata;
  } else {
    fs.writeFileSync(metaFile, JSON.stringify(defaultMetadata));
  }
  return defaultMetadata;
}

export const config: Config = {
  cacheDir: deviceFarmHome,
  databasePath: `${deviceFarmHome}/device-farm-latest.db?connection_limit=1`,
  sessionAssetsPath: path.join(deviceFarmHome, 'assets', 'sessions'),
  takeScreenshotsFor: ['click', 'setUrl', 'setValue', 'performActions'],
  appsPath: path.join(deviceFarmHome, 'assets'),
  serverMetadata: { id: '' },
  goIOSTunnelInfoPort: 0,
};
