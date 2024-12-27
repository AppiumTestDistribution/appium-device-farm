/* eslint-disable no-prototype-builtins */
import {
  cachePath,
  checkIfPathIsAbsolute,
  isAppiumRunningAt,
  isDeviceFarmRunning,
  isMac,
} from './helpers';
import { Platform } from './types/Platform';

#TODO
import {
  androidCapabilities,
  DEVICE_FARM_CAPABILITIES,
  getDeviceFarmCapabilities,
  iOSCapabilities,
} from './CapabilityManager';
import waitUntil from 'async-wait-until';
import { ISessionCapability } from './interfaces/ISessionCapability';
import { IDeviceFilterOptions } from './interfaces/IDeviceFilterOptions';
import { IDevice } from './interfaces/IDevice';
import { Container } from 'typedi';
import { DeviceFarmManager } from './device-managers';
import {
  addNewDevice,
  blockDevice,
  getAllDevices,
  getDevice,
  removeDevice,
  setSimulatorState,
  unblockDevice,
  updatedAllocatedDevice,
} from './data-service/device-service';
import log from './logger';
import DevicePlatform from './enums/Platform';
import _ from 'lodash';
import fs from 'fs';
import { LocalStorage } from 'node-persist';
import CapabilityManager from './device-managers/cloud/CapabilityManager';
import IOSDeviceManager from './device-managers/IOSDeviceManager';
import NodeDevices from './device-managers/NodeDevices';
import { IPluginArgs } from './interfaces/IPluginArgs';
import { ATDRepository } from './data-service/db';
import { v4 as uuidv4 } from 'uuid';
import debugLog from './debugLog';
import getPort from 'get-port';
import { sessionRequestMap } from './proxy/wd-command-proxy';

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

export function isAndroid(pluginArgs: IPluginArgs): boolean {
  return pluginArgs.platform.toLowerCase() === DevicePlatform.ANDROID;
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
  requestId: string,
  capability: ISessionCapability,
  deviceTimeOutMs: number,
  deviceQueryIntervalMs: number,
  pluginArgs: IPluginArgs,
): Promise<IDevice> {
  const firstMatch = Object.assign({}, capability.firstMatch[0], capability.alwaysMatch);
  debugLog(`firstMatch: ${JSON.stringify(firstMatch)}`);
  const deviceFarmCapabilities = getDeviceFarmCapabilities(capability);
  const filters = getDeviceFiltersFromCapability(firstMatch, deviceFarmCapabilities, pluginArgs);

  debugLog(`Device allocation request for filter: ${JSON.stringify(filters)}`);
  const timeout =
    deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.DEVICE_TIMEOUT] || deviceTimeOutMs;
  const intervalBetweenAttempts =
    deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.DEVICE_QUERY_INTERVAL] || deviceQueryIntervalMs;
  const liveVideo = _.isNil(deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.LIVE_VIDEO])
    ? true
    : JSON.parse(deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.LIVE_VIDEO]);

  try {
    await waitUntil(
      async () => {
        if (!sessionRequestMap.has(requestId)) {
          log.error(
            `Client has closed the connection for the new session request with id ${requestId}`,
          );
          throw new Error(
            `Client has closed the connection for the new session request with id ${requestId}`,
          );
        }
        const maxSessions = getDeviceManager().getMaxSessionCount();
        const busyDevicesCount = await getBusyDevicesCount();
        log.debug(`Max session count: ${maxSessions}, Busy device count: ${busyDevicesCount}`);
        if (maxSessions !== undefined && busyDevicesCount === maxSessions) {
          log.info(
            `Waiting for session available, already at max session count of: ${maxSessions}`,
          );
          return false;
        } else log.info(`Waiting for free device. Filter: ${JSON.stringify(filters)}}`);
        return (await getDevice(filters)) != undefined;
      },
      { timeout, intervalBetweenAttempts },
    );
  } catch (err) {
    // figure out whether the device is simply busy or non-existent
    // there's slight delay between last check and this check
    // so, it's possible that the device is not busy now
    const filterCopy = { ...filters };
    // remove the busy flag
    delete filterCopy.busy;
    // remove the userBlocked flag
    delete filterCopy.userBlocked;

    const possibleDevice = await getDevice(filterCopy);

    let failureReason = 'No device matching request.';
    if (possibleDevice?.busy || possibleDevice?.userBlocked) {
      failureReason = 'Device is busy or blocked.';
    }

    // provide friendly error message
    throw new Error(`${failureReason}. Device request: ${JSON.stringify(filterCopy)}`);
  }

  const device = await getDevice(filters);
  if (device != undefined) {
    // log.info(`📱 Device found: ${JSON.stringify(device)}`);
    await blockDevice(device.udid, device.host);
    log.info(`📱 Blocking device ${device.udid} at host ${device.host} for new session`);

    // FIXME: convert this into a return value
    await updateCapabilityForDevice(capability, device, { liveVideo });

    // update newCommandTimeout for the device.
    // This is required so it won't get unblocked by prematurely.
    let newCommandTimeout = firstMatch['appium:newCommandTimeout'];
    if (!newCommandTimeout) {
      newCommandTimeout = pluginArgs.newCommandTimeoutSec;
    }
    await updatedAllocatedDevice(device, { newCommandTimeout });

    return device;
  } else {
    throw new Error(`No device found for filters: ${JSON.stringify(filters)}`);
  }
}

/**
 * Adjust the capability for the device
 * @param capability
 * @param device
 * @returns
 */
export async function updateCapabilityForDevice(
  capability: any,
  device: IDevice,
  options: { liveVideo: boolean },
) {
  const mergedCapabilites = Object.assign(
    {},
    capability.alwaysMatch,
    capability.firstMatch[0] || {},
  );
  if (!device.hasOwnProperty('cloud')) {
    if (mergedCapabilites['appium:automationName']?.toLowerCase() === 'flutterintegration') {
      capability.firstMatch[0]['appium:flutterSystemPort'] = await getPort();
    }

    if (device.platform.toLowerCase() == DevicePlatform.ANDROID) {
      await androidCapabilities(capability, device, options);
    } else {
      await iOSCapabilities(capability, device, options);
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
  log.info('Initializing storage');
  const basePath = cachePath('storage');
  await fs.promises.mkdir(basePath, { recursive: true });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const storage = require('node-persist');
  const localStorage = storage.create({ dir: basePath });
  await localStorage.init();
  Container.set('LocalStorage', localStorage);
}

async function getStorage() {
  try {
    Container.get('LocalStorage');
  } catch (err) {
    log.error(`Failed to get LocalStorage: Error ${err}`);
    await initializeStorage();
  }
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
    const value = (await getStorage()).getItem(udid);
    if (value !== undefined && value && !isNaN(await value)) {
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
  await (await getStorage()).setItem(udid, utilizationTime);
}

/**
 * Method to get the device filters from the custom session capability
 * This filter will be used as in the query to find the free device from the databse
 * @param capability
 * @param deviceFarmCapabilities
 * @param pluginArgs
 * @returns IDeviceFilterOptions
 */
export function getDeviceFiltersFromCapability(
  capability: any,
  deviceFarmCapabilities: any,
  pluginArgs: IPluginArgs,
): IDeviceFilterOptions {
  const platform: Platform = capability['platformName'].toLowerCase();
  const udids = deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.UDIDS]
    ? deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.UDIDS].split(',').map(_.trim)
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

  if (deviceType?.startsWith('sim') && pluginArgs.iosDeviceType === 'real') {
    throw new Error(
      'iosDeviceType value is set to "real" but app provided is not suitable for real device.',
    );
  }

  if (deviceType?.startsWith('real') && pluginArgs.iosDeviceType == 'simulated') {
    throw new Error(
      'iosDeviceType value is set to "simulated" but app provided is not suitable for simulator device.',
    );
  }

  let name: string | undefined = undefined;
  if (deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.iPADONLY]) {
    name = 'iPad';
  } else if (deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.iPHONEONLY]) {
    name = 'iPhone';
  }
  let caps = {
    platform,
    platformVersion: capability['appium:platformVersion']
      ? capability['appium:platformVersion']
      : undefined,
    name,
    deviceType,
    udid: udids?.length ? udids : capability['appium:udid'],
    busy: false,
    userBlocked: false,
    filterByHost: deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.FILTER_BY_HOST],
    minSDK: deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.MIN_SDK]
      ? deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.MIN_SDK]
      : undefined,
    maxSDK: deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.MAX_SDK]
      ? deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.MAX_SDK]
      : undefined,
    tags: deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.TAGS]
      ? deviceFarmCapabilities[DEVICE_FARM_CAPABILITIES.TAGS]
      : undefined,
  };

  if (name !== undefined) {
    caps = { ...caps, name };
  }
  return caps;
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
    return device.busy;
  }).length;
}

export async function updateDeviceList(host: string, hubArgument?: string): Promise<any> {
  if (hubArgument) {
    if (await isDeviceFarmRunning(hubArgument)) {
      const devices: IDevice[] = await getDeviceManager().getDevices(await getAllDevices());
      if (devices.length === 0) {
        log.warn('No devices found');
        return [];
      }

      // log.debug(`Updating device list with ${JSON.stringify(devices)} devices`);

      // first thing first. Update device list in local list
      await addNewDevice(devices, host);
      const nodeDevices = new NodeDevices(hubArgument);
      try {
        await nodeDevices.postDevicesToHub(devices, 'add');
      } catch (error) {
        log.error(`Cannot send device list update. Reason: ${error}`);
      }
      return devices;
    } else {
      log.warn(
        `Not sending device update since hub ${hubArgument} is not running. Removing all devices from node`,
      );
      (await ATDRepository.DeviceModel).removeDataOnly();
    }
  } else {
    const devices: IDevice[] = await getDeviceManager().getDevices(await getAllDevices());
    if (devices.length === 0) {
      log.warn('No devices found');
      return [];
    }
    await addNewDevice(devices, host);
    return devices;
  }
}

export async function refreshSimulatorState(pluginArgs: IPluginArgs, hostPort: number) {
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(async () => {
    const simulators = await new IOSDeviceManager(pluginArgs, hostPort, uuidv4()).getSimulators();
    await setSimulatorState(simulators);
  }, 10000);
}

export async function setupCronCheckStaleDevices(intervalMs: number, currentHost: string) {
  setInterval(async () => {
    await removeStaleDevices(currentHost);
  }, intervalMs);
}

/**
 * Remove devices where the host is not alive nor defined.
 * @param currentHost current host ip address
 */
export async function removeStaleDevices(currentHost: string) {
  const allDevices = await getAllDevices();
  const nodeDevices = allDevices.filter((device) => {
    // devices that's not from this node ip address
    return device.host !== undefined && !device.host.includes(currentHost);
  });

  const devicesWithNoHost = nodeDevices.filter((device) => {
    return device.host === undefined;
  });

  const nodeHosts = nodeDevices
    .filter((device) => !device.hasOwnProperty('cloud'))
    .map((device) => device.host);
  const cloudHosts = nodeDevices
    .filter((device) => device.hasOwnProperty('cloud'))
    .map((device) => device.host);
  const aliveHosts = (await Promise.allSettled(
    nodeHosts.map(async (host) => {
      return {
        host: host,
        alive: await isDeviceFarmRunning(host),
      };
    }),
  )) as { status: 'fulfilled' | 'rejected'; value: { host: string; alive: boolean } }[];
  const aliveCloudHosts = (await Promise.allSettled(
    cloudHosts.map(async (host) => {
      return {
        host: host,
        alive: await isAppiumRunningAt(host),
      };
    }),
  )) as { status: 'fulfilled' | 'rejected'; value: { host: string; alive: boolean } }[];

  // summarize alive hosts
  const allAliveHosts = [...aliveHosts, ...aliveCloudHosts]
    .filter((item) => item.status === 'fulfilled' && item.value.alive)
    .map((item) => item.value.host);
  // stale devices are devices that's not alive
  const staleDevices = nodeDevices.filter((device) => !allAliveHosts.includes(device.host));
  await removeDevice(staleDevices.map((device) => ({ udid: device.udid, host: device.host })));
  if (staleDevices.length > 0) {
    log.debug(
      `Removing device with udid(s): ${staleDevices
        .map((device) => device.udid)
        .join(', ')} because the node is not alive`,
    );
  }

  // remove devices with no host
  await removeDevice(devicesWithNoHost.map((device) => ({ udid: device.udid, host: device.host })));
  if (devicesWithNoHost.length > 0) {
    log.debug(
      `Removing device with udid(s): ${devicesWithNoHost
        .map((device) => device.udid)
        .join(', ')} because the device has no host`,
    );
  }
}

export async function unblockCandidateDevices() {
  const allDevices = await getAllDevices();
  return allDevices.filter((device) => {
    // log.debug(`Checking if device ${device.udid} from ${device.host} is a candidate to be released: ${isCandidate}`);
    return device.busy && !device.userBlocked && device.lastCmdExecutedAt != undefined;
  });
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
      device.newCommandTimeout != undefined ? device.newCommandTimeout : newCommandTimeout;
    const timeSinceLastCmdExecuted = (currentEpoch - device.lastCmdExecutedAt) / 1000;
    if (timeSinceLastCmdExecuted > timeoutSeconds) {
      // unblock regardless of whether the device has session or not
      log.info(
        `Unblocking device ${device.udid} at host ${device.host} because it has been idle for ${timeSinceLastCmdExecuted} seconds`,
      );
      unblockDevice(device.udid, device.host);
    }
  });
}

export async function setupCronReleaseBlockedDevices(
  intervalMs: number,
  newCommandTimeoutSec: number,
) {
  if (cronTimerToReleaseBlockedDevices) {
    clearInterval(cronTimerToReleaseBlockedDevices);
  }
  await releaseBlockedDevices(newCommandTimeoutSec);
  cronTimerToReleaseBlockedDevices = setInterval(async () => {
    await releaseBlockedDevices(newCommandTimeoutSec);
  }, intervalMs);
}

export async function setupCronUpdateDeviceList(
  host: string,
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
    await updateDeviceList(host, hubArgument);
  }, intervalMs);
}

export async function cleanPendingSessions(timeoutMs: number) {
  const pendingSessions = (await ATDRepository.PendingSessionsModel).chain().find().data();
  const currentEpoch = new Date().getTime();
  const timedOutSessions = pendingSessions.filter((session) => {
    const timeSinceSessionCreated = currentEpoch - session.createdAt;
    log.debug(
      `Session queue ID:${session.capability_id} has been pending for ${timeSinceSessionCreated} ms`,
    );
    return timeSinceSessionCreated > timeoutMs;
  });
  if (timedOutSessions.length === 0) {
    log.debug('No pending sessions to clean');
  } else {
    log.debug(`Found ${timedOutSessions.length} pending sessions to clean`);
  }
  for await (const session of timedOutSessions) {
    log.debug(`Removing pending session ${session.capability_id} because it has timed out`);
    (await ATDRepository.PendingSessionsModel).remove(session);
  }
}

export async function setupCronCleanPendingSessions(intervalMs: number, timeoutMs: number) {
  log.info(
    `Hub will clean pending sessions every ${intervalMs} ms with pending session timeout: ${timeoutMs} ms`,
  );
  if (cronTimerToCleanPendingSessions) {
    clearInterval(cronTimerToCleanPendingSessions);
  }

  cronTimerToCleanPendingSessions = setInterval(async () => {
    log.debug('Cleaning pending sessions...');
    await cleanPendingSessions(timeoutMs);
  }, intervalMs);
}
