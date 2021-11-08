import { curry, find, pipe, prop, propEq } from 'ramda';
import * as device from '../../src/Devices';

export const deviceState = (device) => pipe(find(propEq('udid', device)), prop('busy'));

export const sessionId = (device) => pipe(find(propEq('udid', device)), prop('sessionId'));

export async function findFreeDevice(firstMatch, cliArgs) {
  await device.fetchDevices(cliArgs);
  return device.getFreeDevice(firstMatch);
}

export const androidDevices = () => device.listAllAndroidDevices();
export const simulators = () => device.listiOSSimulators();
export const blockDevice = curry((devices, freeDevice, platform) => {
  device.blockDevice(freeDevice, platform);
  return devices();
});

export const unblockDevice = curry((devices, freeDevice, platform) => {
  device.unblockDevice(freeDevice, platform);
  return devices();
});

export const updateDevice = curry((devices, freeDevice, sessionId) => {
  device.updateDevice(freeDevice, sessionId);
  return devices();
});
