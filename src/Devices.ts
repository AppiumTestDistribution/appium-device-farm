import eventEmitter, { emitDevices } from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';
import log from './logger';
import schedule from 'node-schedule';
import SimulatorManager from './SimulatorManager';
import { isMac, checkIfPathIsAbsolute } from './helpers';
import { IDevice } from './interfaces/IDevice';
import { IOptions } from './interfaces/IOptions';
import { propEq, map, assoc, when, concat, find, not } from 'ramda';
import logger from './logger';
import NodeCache from 'node-cache';
import { Platform } from './types/Platform';

import {
  findiOSPlatform,
  isDeviceBusy,
  alter,
  filterRealDevices,
  devicePlatForm,
} from './device-utils';
import { ServerCLI } from './types/CLIArgs';
import { flatten } from 'lodash';

const cache = new NodeCache();

let instance = false;
const simulatorManager = new SimulatorManager();
const androidDevices = new AndroidDeviceManager();
const iosDevices = new IOSDeviceManager();

export const emitConnectedDevices = (cliArgs: ServerCLI) => {
  log.info('Starting & initializing the listen to device changes');
  const rule = new schedule.RecurrenceRule();
  rule.second = [0, 10, 20, 30, 40, 50];
  schedule.scheduleJob(rule, async function () {
    const androidDeviceManager = new AndroidDeviceManager();
    const iOSDeviceManager = new IOSDeviceManager();
    if (isAndroid(cliArgs)) {
      const android: Array<IDevice> = await androidDeviceManager.getDevices();
      emitDevices({
        android,
      });
    } else if (isIOS(cliArgs)) {
      const ios: Array<IDevice> = await iOSDeviceManager.getDevices();
      emitDevices({
        ios,
      });
    } else if (isAndroidAndIOS(cliArgs)) {
      const android: Array<IDevice> = await androidDeviceManager.getDevices();
      const ios: Array<IDevice> = await iOSDeviceManager.getDevices();
      emitDevices({
        android,
        ios,
      });
    }
  });
};

export const getFreeDevice = (firstMatch: any, options?: IOptions): IDevice => {
  console.log(firstMatch);
  const platform: Platform = firstMatch['platformName'].toLowerCase();
  const app: string = firstMatch['appium:app'];
  const iosAppExtension: any = findiOSPlatform(app);
  log.info(`Finding Free Device for Platform ${platform}`);

  const deviceState = (device: IDevice, androidOrIOS: any) => {
    return (
      not(isDeviceBusy(device)) &&
      platform.includes(devicePlatForm(device)) &&
      androidOrIOS
    );
  };
  const iOSRealDevice = (device: IDevice) => device.realDevice;
  const iOSSimulator = (device: IDevice) => not(device.realDevice);
  const androidDevice = (device: IDevice) =>
    device.realDevice || not(device.realDevice);

  const device: Array<IDevice> = cache.get(platform) as Array<IDevice>;
  if (options) {
    return device.find(
      (device) =>
        deviceState.call(this, device, iOSSimulator(device)) &&
        device.name.includes(options.simulator)
    ) as IDevice;
  } else {
    if (iosAppExtension?.simulator) {
      logger.info('Find Free Simulator');
      return device.find((device) =>
        deviceState.call(this, device, iOSSimulator(device))
      ) as IDevice;
    } else if (iosAppExtension?.realDevice) {
      logger.info('Find Free iOS Device');
      return device.find((device) =>
        deviceState.call(this, device, iOSRealDevice(device))
      ) as IDevice;
    } else {
      logger.info('Find Free Android Device');
      return device.find((device) =>
        deviceState.call(this, device, androidDevice(device))
      ) as IDevice;
    }
  }
};

export const blockDevice = (freeDevice: IDevice, firstMatchPlatform: string) =>
  alter(true, freeDevice.udid, firstMatchPlatform, cache);

export const unblockDevice = (
  blockedDevice: IDevice,
  firstMatchPlatform: string
) => alter(false, blockedDevice.udid, firstMatchPlatform, cache);

export const updateDevice = (freeDevice: IDevice, sessionId?: string) => {
  const devices: Array<IDevice> = cache.get(
    freeDevice.platform
  ) as Array<IDevice>;
  logger.info(`Updating Device ${freeDevice.udid} with ${sessionId}`);
  const alteredDeviceMap = map(
    when(propEq('udid', freeDevice.udid), assoc('sessionId', sessionId)),
    devices
  );
  cache.set(freeDevice.platform, alteredDeviceMap);
};

export const getDeviceForSession = (sessionId: string): IDevice => {
  const device: any = cache.mget(['android', 'ios']);
  const mergedDevices = concat(device.android, device.ios);
  return find(propEq('sessionId', sessionId), mergedDevices) as IDevice;
};

function isAndroid(cliArgs: ServerCLI) {
  return cliArgs.Platform.toLowerCase() === 'android';
}

function isIOS(cliArgs: ServerCLI) {
  return isMac() && cliArgs.Platform.toLowerCase() === 'ios';
}

function isAndroidAndIOS(cliArgs: ServerCLI) {
  return isMac() && cliArgs.Platform.toLowerCase() === 'both';
}

function onIOSDeviceEmitted() {
  eventEmitter.on('ConnectedDevices', function (data) {
    const { emittedDevices } = data;
    const filterediOSDevice = emittedDevices.ios.filter(
      (element: IDevice) =>
        !listAlliOSDevices().some((o: IDevice) => o.udid === element.udid)
    );
    if (filterediOSDevice) {
      filterediOSDevice.forEach((device: IDevice) =>
        logger.info(`Found new device 📲 ${device.udid}, adding to master list`)
      );
    }
    cache.set('ios', concat(filterediOSDevice, listAlliOSDevices()));
  });
}

function onAndroidDevicesEmitted() {
  eventEmitter.on('ConnectedDevices', function (data) {
    const { emittedDevices } = data;
    const filteredAndroidDevice = emittedDevices.android.filter(
      (element: IDevice) =>
        !listAllAndroidDevices().some((o: IDevice) => o.udid === element.udid)
    );
    if (filteredAndroidDevice) {
      filteredAndroidDevice.forEach((device: IDevice) =>
        logger.info(`Found new device 📲 ${device.udid}, adding to master list`)
      );
    }
    cache.set(
      'android',
      concat(filteredAndroidDevice, listAllAndroidDevices())
    );
  });
}

const detectDevices = async (cliArgs: ServerCLI) => {
  if (isAndroid(cliArgs)) {
    logger.info('Finding Android devices');
    cache.set('android', await androidDevices.getDevices());
    emitConnectedDevices(cliArgs);
    onAndroidDevicesEmitted();
  } else if (isIOS(cliArgs)) {
    logger.info('Finding IOS devices');
    const simulators = await simulatorManager.getSimulators();
    const connectedIOSDevices = await iosDevices.getDevices();
    cache.set('ios', Object.assign(simulators, connectedIOSDevices));
    emitConnectedDevices(cliArgs);
    onIOSDeviceEmitted();
  } else if (isAndroidAndIOS(cliArgs)) {
    logger.info('Finding iOS and Android devices');
    const simulators = await simulatorManager.getSimulators();
    const connectedIOSDevices = await iosDevices.getDevices();
    const connectedAndroidDevices = await androidDevices.getDevices();
    cache.mset([
      { key: 'android', val: connectedAndroidDevices },
      { key: 'ios', val: Object.assign(simulators, connectedIOSDevices) },
    ]);
    emitConnectedDevices(cliArgs);
    onIOSDeviceEmitted();
    onAndroidDevicesEmitted();
  }
};
export const fetchDevices = async (cliArgs: ServerCLI) => {
  console.log('CLI Args', cliArgs);
  const udids = process.env.UDIDS;
  if (!instance) {
    log.info('Fetching all connected devices');
    if (udids) {
      const userSpecifiedUDIDS = (process.env.UDIDS as string).split(',');
      const availableDevices = await androidDevices.getDevices();
      const filteredDevices = findUserSpecifiesDevices(
        userSpecifiedUDIDS,
        availableDevices
      );
      cache.set('userSpecifiedUDIDS', filteredDevices);
    } else {
      await detectDevices(cliArgs);
    }
    instance = true;
  }
};

export function isDeviceConfigPathAbsolute(path: string) {
  if (checkIfPathIsAbsolute(path)) {
    return true;
  } else {
    throw new Error(`Device Config Path ${path} should be absolute`);
  }
}

export function findUserSpecifiesDevices(
  userSpecifiedUDIDS: Array<string>,
  availableDevices: Array<IDevice>
) {
  const filteredDevices: Array<IDevice> = [];
  userSpecifiedUDIDS.forEach((value) =>
    filteredDevices.push(
      availableDevices.find((device) => device.udid === value) as IDevice
    )
  );
  return filteredDevices;
}

function fetchDevicesFromUDIDS(
  simulators: Array<IDevice>,
  connectedAndroidDevices: Array<IDevice>,
  connectedIOSDevices: Array<IDevice>
) {
  const userSpecifiedUDIDS: Array<string> = (process.env.UDIDS as string).split(
    ','
  );
  const availableDevices: Array<IDevice> = Object.assign(
    simulators,
    connectedAndroidDevices,
    connectedIOSDevices
  );
  const filteredDevices = findUserSpecifiesDevices(
    userSpecifiedUDIDS,
    availableDevices
  );
  cache.set('filteredDevices', filteredDevices);
}

export function listAllDevices() {
  return flatten(Object.values(cache.mget(['android', 'ios'])))
}

export function listAllAndroidDevices(): any {
  return cache.get('android');
}

export function cachedDevices() {
  return cache;
}

export function listiOSSimulators() {
  const allIOS = cache.get('ios');
  return filterRealDevices(false, allIOS);
}

export function listAlliOSDevices(): any {
  const allIOS = cache.get('ios');
  return filterRealDevices(true, allIOS);
}
