import { IDevice } from './interfaces/IDevice';
import {
  always,
  assoc,
  compose,
  cond,
  curry,
  endsWith,
  filter,
  map,
  propEq,
  when,
} from 'ramda';

export const isDeviceBusy = (device: IDevice) => device.busy;
export const devicePlatForm = (device: IDevice) =>
  device.platform.toLowerCase();
export const alter = curry((state, udid, platform, cache) => {
  const device: Array<IDevice> = cache.get(platform) as Array<IDevice>;
  const alteredDeviceMap = map(
    when(propEq('udid', udid), assoc('busy', state)),
    device
  );
  cache.set(platform, alteredDeviceMap);
});
export const filterRealDevices = curry((isRealDevice: boolean, devices) =>
  filter(compose(propEq('realDevice', isRealDevice)))(devices)
);

export const findiOSPlatform = cond([
  [endsWith('app'), always({ simulator: true })],
  [endsWith('ipa'), always({ realDevice: true })],
  [endsWith('zip'), always({ simulator: true })],
]);
