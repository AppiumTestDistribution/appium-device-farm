import os from 'os';
import path from 'path';
import log from './logger';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function isMac() {
  return os.type() === 'Darwin';
}

export function checkIfPathIsAbsolute(configPath) {
  return path.isAbsolute(configPath);
}

export async function assignCapabilitiesAndBlockDevice(
  devices,
  freeDevice,
  firstMatch,
  firstMatchPlatform,
  caps
) {
  if (freeDevice && firstMatchPlatform == 'android') {
    await androidCapabilities(caps, freeDevice);
    devices.blockDevice(freeDevice);
    log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
    return true;
  } else if (freeDevice && firstMatchPlatform == 'ios') {
    if (firstMatch['appium:iPhoneOnly']) {
      freeDevice = devices.getFreeDevice(firstMatchPlatform, {
        simulator: 'iPhone',
      });
    } else if (firstMatch['appium:iPadOnly']) {
      freeDevice = devices.getFreeDevice(firstMatchPlatform, {
        simulator: 'iPad',
      });
    }
    await iOSCapabilities(caps, freeDevice);
    devices.blockDevice(freeDevice);
    log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
    return true;
  }
  return false;
}
