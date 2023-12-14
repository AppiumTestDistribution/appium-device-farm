/* eslint-disable no-prototype-builtins */
import { isMac, checkIfPathIsAbsolute, isDeviceFarmRunning, cachePath, isAppiumRunningAt } from './helpers';
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
  getAllDevices,
  getDevice,
  setSimulatorState,
  addNewDevice,
  removeDevice,
  unblockDevice,
  blockDevice,
} from './data-service/device-service';
import log from './logger';
import DevicePlatform from './enums/Platform';
import _ from 'lodash';
import fs from 'fs';
import { LocalStorage } from 'node-persist';
import CapabilityManager from './device-managers/cloud/CapabilityManager';
import IOSDeviceManager from './device-managers/IOSDeviceManager';
import NodeDevices from './device-managers/NodeDevices';
import ip from 'ip';
import { IPluginArgs } from './interfaces/IPluginArgs';
import { PendingSessionsModel } from './data-service/db';

const customCapability = {
  deviceTimeOut: 'appium:deviceAvailabilityTimeout',
  deviceQueryInteval: 'appium:deviceRetryInterval',
  iphoneOnly: 'appium:iPhoneOnly',
  ipadOnly: 'appium:iPadOnly',
  udids: 'appium:udids',
  minSDK: 'appium:minSDK',
  maxSDK: 'appium:maxSDK',
};

let timer: any;
let cronTimerToReleaseBlockedDevices: any;
let cronTimerToUpdateDevices: any;
let cronTimerToCleanPendingSessions: any;

export const getDeviceTypeFromApp = (app: string): 'real' | 'simulator' | undefined => {
  /* If the test is targeting safarim, then app capability will be empty */
  if (!app) {
    return;
  }
  return app.endsWith('.app') || app.endsWith('.zip') ? 'simulator' : 'real';
};

export function isAndroid(cliArgs: ServerCLI): boolean {
  return cliArgs.Platform.toLowerCase() === DevicePlatform.ANDROID;
}

export function deviceType(pluginArgs: IPluginArgs, device: string): boolean {
  const iosDeviceType = pluginArgs.iosDeviceType;
  return iosDeviceType === device || iosDeviceType === 'both';
}

export function isIOS(pluginArgs: IPluginArgs): boolean {
  return isMac() && pluginArgs.platform.toLowerCase() === DevicePlatform.IOS;
}

export function isAndroidAndIOS(pluginArgs: IPluginArgs): boolean {
  return isMac() && pluginArgs.platform.toLowerCase() === DevicePlatform.BOTH;
}

export function isDeviceConfigPathAbsolute(path: string): boolean | undefined {
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
export async function allocateDeviceForSession(
  capability: ISessionCapability,
  deviceTimeOutMs: number,
  deviceQueryIntervalMs: number,
  pluginArgs: IPluginArgs,
): Promise<IDevice> {
  const firstMatch = Object.assign({}, capability.firstMatch[0], capability.alwaysMatch);
  log.debug(`firstMatch: ${JSON.stringify(firstMatch)}`);
  const filters = getDeviceFiltersFromCapability(firstMatch, pluginArgs);
  log.debug(`Device allocation request for filter: ${JSON.stringify(filters)}`);
  const timeout = firstMatch[customCapability.deviceTimeOut] || deviceTimeOutMs;
  const newCommandTimeout = firstMatch['appium:newCommandTimeout'] || undefined;
  const intervalBetweenAttempts =
    firstMatch[customCapability.deviceQueryInteval] || deviceQueryIntervalMs;

  try {
    await waitUntil(
      async () => {
        const maxSessions = getDeviceManager().getMaxSessionCount();
        if (maxSessions !== undefined && (await getBusyDevicesCount()) === maxSessions) {
          log.info(
            `Waiting for session available, already at max session count of: ${maxSessions}`,
          );
          return false;
        } else log.info('Waiting for free device');
        return (await getDevice(filters)) != undefined;
      },
      { timeout, intervalBetweenAttempts },
    );
  } catch (err) {
    throw new Error(`No device found for filters: ${JSON.stringify(filters)}`);
  }
  const device = getDevice(filters);
  if (device != undefined) {
    log.info(`📱 Device found: ${JSON.stringify(device)}`);
    blockDevice(device.udid, device.host);
    log.info(`📱 Blocking device ${device.udid} at host ${device.host} for new session`);
    await updateCapabilityForDevice(capability, device);
    return device;
  } else {
    throw new Error(`No device found for filters: ${JSON.stringify(filters)}`);
  }
}

export async function updateCapabilityForDevice(capability: any, device: IDevice) {
  if (!device.hasOwnProperty('cloud')) {
    if (device.platform.toLowerCase() == DevicePlatform.ANDROID) {
      await androidCapabilities(capability, device);
    } else {
      await iOSCapabilities(capability, device);
    }
  } else {
    log.info('Updating cloud capability for Device');
    return new CapabilityManager(capability, device).getCapability();
  }
}

/**
 * Sets up node-persist storage in local cache
 * @returns storage
 */
export async function initializeStorage() {
  const basePath = cachePath('storage');
  await fs.promises.mkdir(basePath, { recursive: true });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
  try {
    const value = await getStorage().getItem(udid);
    if (value !== undefined && value && !isNaN(value)) {
      return value;
    } else {
      //log.error(`Custom Exception: Utilizaiton time in cache is corrupted. Value = '${value}'.`);
    }
  } catch (err) {
    log.error(`Failed to fetch Utilization Time \n ${err}`);
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
export function getDeviceFiltersFromCapability(capability: any, pluginArgs: IPluginArgs): IDeviceFilterOptions {
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
    platform == DevicePlatform.IOS
      ? getDeviceTypeFromApp(capability['appium:app'] as string)
      : undefined;
  if (
    deviceType?.startsWith('sim') &&
    pluginArgs.iosDeviceType === 'real'
  ) {
    throw new Error(
      'iosDeviceType value is set to "real" but app provided is not suitable for real device.',
    );
  }
  if (
    deviceType?.startsWith('real') &&
    pluginArgs.iosDeviceType == 'simulated'
  ) {
    throw new Error(
      'iosDeviceType value is set to "simulated" but app provided is not suitable for simulator device.',
    );
  }
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
    udid: udids?.length ? udids : capability['appium:udid'],
    busy: false,
    userBlocked: false,
    minSDK: capability[customCapability.minSDK] ? capability[customCapability.minSDK] : undefined,
    maxSDK: capability[customCapability.maxSDK] ? capability[customCapability.maxSDK] : undefined,
  };
}

/**
 * Helper methods to manage devices
 */
function getDeviceManager() {
  return Container.get(DeviceFarmManager) as DeviceFarmManager;
}

export async function getBusyDevicesCount() {
  const allDevices = getAllDevices();
  return allDevices.filter((device) => {
    return device.busy;
  }).length;
}

export async function updateDeviceList(hubArgument?: string) {
  const devices: Array<IDevice> = await getDeviceManager().getDevices(getAllDevices());
  if (hubArgument) {
    const nodeDevices = new NodeDevices(hubArgument);
    try {
      await nodeDevices.postDevicesToHub(devices, 'add');
    } catch (error) {
      log.error(`Cannot send device list update. Reason: ${error}`);
    }
  }
  addNewDevice(devices);

  return devices;
}

export async function refreshSimulatorState(pluginArgs: IPluginArgs, hostPort: number) {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(async () => {
    const simulators = await new IOSDeviceManager(pluginArgs, hostPort).getSimulators();
    await setSimulatorState(simulators);
  }, 10000);
}

export async function setupCronCheckStaleDevices(
  intervalMs: number,
) {
  const nodeChecked: Array<string> = [];

  setInterval(async () => {
    const devices = new Set();

    const allDevices = getAllDevices();
    allDevices.forEach((device: IDevice) => {
      if (!device.host.includes(ip.address()) && !nodeChecked.includes(device.host)) {
        devices.add(device);
      }
    });

    const iterableSet = [...devices];
    const nodeConnections = iterableSet.map(async (device: any) => {
      nodeChecked.push(device.host);
      // use different function to check cloud devices
      if (device.hasOwnProperty('cloud')) {
        await isAppiumRunningAt(device.host);
      } else {
        await isDeviceFarmRunning(device.host);
      }
      return device.host;
    });

    const nodeConnectionsResult = await Promise.allSettled(nodeConnections);

    const nodeConnectionsSuccess = nodeConnectionsResult.filter(
      (result) => result.status === 'fulfilled',
    );
    const nodeConnectionsSuccessHost = nodeConnectionsSuccess.map((result: any) => result.value);
    const nodeConnectionsSuccessHostSet = new Set(nodeConnectionsSuccessHost);

    const nodeConnectionsFailureHostSet = new Set(
      [...devices].filter((device: any) => !nodeConnectionsSuccessHostSet.has(device.host)),
    );

    nodeConnectionsFailureHostSet.forEach((device: any) => {
      log.info(`Removing Device with udid (${device.udid}) because it is not available`);
      removeDevice(device);
      nodeChecked.splice(nodeChecked.indexOf(device.host), 1);
    });
  }, intervalMs);
}

export async function unblockCandidateDevices() {
  const allDevices = getAllDevices();
  const busyDevices = allDevices.filter((device) => {
    const isCandidate = device.busy && !device.userBlocked && device.lastCmdExecutedAt != undefined;
    // log.debug(`Checking if device ${device.udid} from ${device.host} is a candidate to be released: ${isCandidate}`);
    return isCandidate
  });
  return busyDevices;
}

export async function releaseBlockedDevices(newCommandTimeout: number) {
  const busyDevices = await unblockCandidateDevices();

  log.debug(`Found ${busyDevices.length} device candidates to be released`);

  busyDevices.forEach(function (device) {
    // need to keep this to make typescript happy. good thing tho.
    if (device.lastCmdExecutedAt == undefined) {
      return;
    }

    const currentEpoch = new Date().getTime();
    const timeoutSeconds =
      device.newCommandTimeout != undefined
        ? device.newCommandTimeout
        : newCommandTimeout;
    const timeSinceLastCmdExecuted = (currentEpoch - device.lastCmdExecutedAt) / 1000;
    if (timeSinceLastCmdExecuted > timeoutSeconds) {
      // unblock regardless of whether the device has session or not
      unblockDevice(device.udid, device.host);
    }
  });
}

export async function setupCronReleaseBlockedDevices(intervalMs: number, newCommandTimeoutSec: number) {
  if (cronTimerToReleaseBlockedDevices) {
    clearInterval(cronTimerToReleaseBlockedDevices);
  }
  await releaseBlockedDevices(newCommandTimeoutSec);
  cronTimerToReleaseBlockedDevices = setInterval(async () => {
    await releaseBlockedDevices(newCommandTimeoutSec);
  }, intervalMs);
}

export async function setupCronUpdateDeviceList(
  hubArgument: string,
  intervalMs: number,
) {
  if (cronTimerToUpdateDevices) {
    clearInterval(cronTimerToUpdateDevices);
  }
  log.info(
    `This node will send device list update to the hub (${hubArgument}) every ${intervalMs} ms`,
  );

  cronTimerToUpdateDevices = setInterval(async () => {
    if (await isDeviceFarmRunning(hubArgument)) {
      await updateDeviceList(hubArgument);
    } else {
      log.warn(`Not sending device update since hub ${hubArgument} is not running`);
    }
  }, intervalMs);
}

export async function setupCronCleanPendingSessions(intervalMs: number, timeoutMs: number) {
  log.info(`Hub will clean pending sessions every ${intervalMs} ms`);
  if (cronTimerToCleanPendingSessions) {
    clearInterval(cronTimerToCleanPendingSessions);
  }

  cronTimerToCleanPendingSessions = setInterval(async () => {
    log.debug(`Cleaning pending sessions...`);
    const pendingSessions = PendingSessionsModel.chain().find().data();
    const currentEpoch = new Date().getTime();
    const timedOutSessions = pendingSessions.filter((session) => {
      const timeSinceSessionCreated = (currentEpoch - session.createdAt) / 1000;
      return timeSinceSessionCreated > timeoutMs;
    });
    timedOutSessions.forEach((session) => {
      log.debug(`Removing pending session ${session.capability_id} because it has timed out`);
      PendingSessionsModel.remove(session);
    });
  }, intervalMs);
}
