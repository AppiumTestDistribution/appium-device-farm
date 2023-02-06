/* eslint-disable no-prototype-builtins */
import { isMac, checkIfPathIsAbsolute } from './helpers';
import { ServerCLI } from './types/CLIArgs';
import { Platform } from './types/Platform';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
import waitUntil from 'async-wait-until';
import { ISessionCapability } from './interfaces/ISessionCapability';
import { IDeviceFilterOptions } from './interfaces/IDeviceFilterOptions';
import { IDevice } from './interfaces/IDevice';
import { Container } from 'typedi';
import { DeviceFarmManager } from './device-managers';
import {
  updateDevice,
  unblockDevice,
  saveDevices,
  getAllDevices,
  getDevice,
} from './data-service/device-service';
import logger from './logger';
import DevicePlatform from './enums/Platform';
import _ from 'lodash';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { LocalStorage } from 'node-persist';
import CapabilityManager from './device-managers/cloud/CapabilityManager';

const DEVICE_AVAILABILITY_TIMEOUT = 180000;
const DEVICE_AVAILABILITY_QUERY_INTERVAL = 10000;
const customCapability = {
  deviceTimeOut: 'appium:deviceAvailabilityTimeout',
  deviceQueryInteval: 'appium:deviceRetryInterval',
  iphoneOnly: 'appium:iPhoneOnly',
  ipadOnly: 'appium:iPadOnly',
  udids: 'appium:udids',
  minSDK: 'appium:minSDK',
};

let timer: any;
let cronTimerToReleaseBlockedDevices: any;

export const getDeviceTypeFromApp = (app: string) => {
  /* If the test is targeting safarim, then app capability will be empty */
  if (!app) {
    return;
  }
  return app.endsWith('app') || app.endsWith('zip') ? 'simulator' : 'real';
};

export function isAndroid(cliArgs: ServerCLI) {
  return cliArgs.Platform.toLowerCase() === DevicePlatform.ANDROID;
}

export function isIOS(cliArgs: ServerCLI) {
  return isMac() && cliArgs.Platform.toLowerCase() === DevicePlatform.IOS;
}

export function isAndroidAndIOS(cliArgs: ServerCLI) {
  return isMac() && cliArgs.Platform.toLowerCase() === DevicePlatform.BOTH;
}

export function isDeviceConfigPathAbsolute(path: string) {
  if (checkIfPathIsAbsolute(path)) {
    return true;
  } else {
    throw new Error(`Device Config Path ${path} should be absolute`);
  }
}

/**
 * For given capability, wait untill a free device is available from the database
 * and update the capability json with required device informations
 * @param capability
 * @returns
 */
export async function allocateDeviceForSession(capability: ISessionCapability): Promise<IDevice> {
  const firstMatch = Object.assign({}, capability.firstMatch[0], capability.alwaysMatch);
  console.log(firstMatch);
  const filters = getDeviceFiltersFromCapability(firstMatch);
  logger.info(JSON.stringify(filters));

  const timeout = firstMatch[customCapability.deviceTimeOut] || DEVICE_AVAILABILITY_TIMEOUT;
  const newCommandTimeout = firstMatch['appium:newCommandTimeout'] || undefined;
  const intervalBetweenAttempts =
    firstMatch[customCapability.deviceQueryInteval] || DEVICE_AVAILABILITY_QUERY_INTERVAL;

  try {
    await waitUntil(
      async () => {
        const maxSessions = await getDeviceManager().getMaxSessionCount();
        if (maxSessions !== undefined && (await getBusyDevicesCount()) === maxSessions) {
          logger.info(
            `Waiting for session available, already at max session count of: ${maxSessions}`
          );
          return false;
        } else logger.info('Waiting for free device');
        return (await getDevice(filters)) != undefined;
      },
      { timeout, intervalBetweenAttempts }
    );
  } catch (err) {
    throw new Error(`No device found for filters: ${JSON.stringify(filters)}`);
  }
  const device = getDevice(filters);
  logger.info(`📱 Device found: ${JSON.stringify(device)}`);
  updateDevice(device, { busy: true, newCommandTimeout: newCommandTimeout });
  logger.info(`📱 Blocking device ${device.udid} for new session`);
  await updateCapabilityForDevice(capability, device);
  return device;
}

export async function updateCapabilityForDevice(capability: any, device: IDevice) {
  if (!device.hasOwnProperty('cloud')) {
    if (device.platform.toLowerCase() == DevicePlatform.ANDROID) {
      await androidCapabilities(capability, device);
    } else {
      await iOSCapabilities(capability, device);
    }
  } else {
    logger.info('Updating cloud Capability for Device');
    return new CapabilityManager(capability, device).getCapability();
  }
}

/**
 * Sets up node-persist storage in local cache
 * @returns storage
 */
export async function initlializeStorage() {
  const basePath = path.join(os.homedir(), '.cache', 'appium-device-farm', 'storage');
  await fs.promises.mkdir(basePath, { recursive: true });
  const storage = require('node-persist');
  const localStorage = storage.create({ dir: basePath });
  await localStorage.init();
  Container.set('LocalStorage', localStorage);
}

function getStorage() {
  return Container.get('LocalStorage') as LocalStorage;
}

/**
 * Gets utlization time for a device from storage
 * Returns 0 if the device has not been used an thus utilization time has not been saved
 * @param udid
 * @returns number
 */
export async function getUtilizationTime(udid: string) {
  const value = await getStorage().getItem(udid);
  if (value !== undefined) {
    return value;
  }
  return 0;
}

/**
 * Sets utilization time for a device to storage
 * @param udid
 * @param utilizationTime
 */
export async function setUtilizationTime(udid: string, utilizationTime: number) {
  await getStorage().setItem(udid, utilizationTime);
}

/**
 * Method to get the device filters from the custom session capability
 * This filter will be used as in the query to find the free device from the databse
 * @param capability
 * @returns IDeviceFilterOptions
 */
export function getDeviceFiltersFromCapability(capability: any): IDeviceFilterOptions {
  const platform: Platform = capability['platformName'].toLowerCase();
  const udids = capability[customCapability.udids]
    ? capability[customCapability.udids].split(',').map(_.trim)
    : process.env.UDIDS?.split(',').map(_.trim);
  /* Based on the app file extension, we will decide whether to run the
   * test on real device or simulator.
   *
   * Applicaple only for ios.
   */
  const deviceType =
    platform == DevicePlatform.IOS && isMac()
      ? getDeviceTypeFromApp(capability['appium:app'] as string)
      : undefined;
  let name = '';
  if (capability[customCapability.ipadOnly]) {
    name = 'iPad';
  } else if (capability[customCapability.iphoneOnly]) {
    name = 'iPhone';
  }
  return {
    platform,
    platformVersion: capability['appium:platformVersion']
      ? capability['appium:platformVersion']
      : undefined,
    name,
    deviceType,
    udid: udids?.length ? udids : undefined,
    busy: false,
    minSDK: capability[customCapability.minSDK] ? capability[customCapability.minSDK] : undefined,
  };
}

/**
 * Helper methods to manage devices
 */
function getDeviceManager() {
  return Container.get(DeviceFarmManager) as DeviceFarmManager;
}

export async function getBusyDevicesCount() {
  const allDevices = await getAllDevices();
  return allDevices.filter((device) => {
    return device.busy === true;
  }).length;
}

export async function updateDeviceList() {
  const devices = await getDeviceManager().getDevices(getAllDevices());
  saveDevices(devices);
}

export async function refreshDeviceList() {
  if (timer) {
    clearInterval(timer);
  }
  await updateDeviceList();
  timer = setInterval(async () => {
    await updateDeviceList();
  }, 10000);
}

export async function releaseBlockedDevices() {
  const allDevices = await getAllDevices();
  const busyDevices = allDevices.filter((device) => {
    return device.busy === true && device.host.includes('127.0.0.1');
  });
  busyDevices.forEach(function (device) {
    const currentEpoch = new Date().getTime();
    const timeout = device.newCommandTimeout != undefined ? device.newCommandTimeout : 60;
    if (
      device.lastCmdExecutedAt != undefined &&
      (currentEpoch - device.lastCmdExecutedAt) / 1000 > timeout
    ) {
      console.log(
        `📱 Found Device with udid ${device.udid} has no activity for more than ${timeout} seconds`
      );
      const sessionId = device.session_id;
      if (sessionId !== undefined) {
        unblockDevice(sessionId);
        logger.info(
          `📱 Unblocked device with udid ${device.udid} mapped to sessionId ${sessionId} as there is no activity from client for more than ${timeout} seconds`
        );
      }
    }
  });
}

export async function cronReleaseBlockedDevices() {
  if (cronTimerToReleaseBlockedDevices) {
    clearInterval(cronTimerToReleaseBlockedDevices);
  }
  await releaseBlockedDevices();
  cronTimerToReleaseBlockedDevices = setInterval(async () => {
    await releaseBlockedDevices();
  }, 30000);
}
