import 'reflect-metadata';
import BasePlugin from '@appium/base-plugin';
import { router } from './app';
import { IDevice } from './interfaces/IDevice';
import { ISessionCapability } from './interfaces/ISessionCapability';
import AsyncLock from 'async-lock';
import { Platform } from './types/Platform';
import {
  saveDevices,
  getAllDevices,
  getDevice,
  updateDevice,
  unblockDevice,
  updateCmdExecutedTime,
} from './data-service/device-service';
import {
  addNewPendingSession,
  removePendingSession,
} from './data-service/pending-sessions-service';
import { getDeviceTypeFromApp } from './device-utils';
import { DeviceFarmManager } from './device-managers';
import { IDeviceFilterOptions } from './interfaces/IDeviceFilterOptions';
import { Container } from 'typedi';
import logger from './logger';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
import waitUntil from 'async-wait-until';
import { isMac } from './helpers';
import { v4 as uuidv4 } from 'uuid';

const commandsQueueGuard = new AsyncLock();
const DEVICE_MANAGER_LOCK_NAME = 'DeviceManager';
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
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName: string, cliArgs: any) {
    super(pluginName, cliArgs);
  }

  onUnexpectedShutdown(driver: any, cause: any) {
    unblockDevice(driver.sessionId);
    logger.info(
      `Unblocking device mapped with sessionId ${driver.sessionId} onUnexpectedShutdown from server`
    );
  }

  public static async updateServer(expressApp: any, httpServer: any, cliArgs: any): Promise<void> {
    let platform;
    if (cliArgs.plugin && cliArgs.plugin['device-farm']) {
      platform = cliArgs.plugin['device-farm'].platform.toLowerCase();
    }
    expressApp.use('/device-farm', router);
    if (!platform)
      throw new Error(
        '🔴 🔴 🔴 Specify --plugin-device-farm-platform from CLI as android,iOS or both or use appium server config. Please refer 🔗 https://github.com/appium/appium/blob/master/packages/appium/docs/en/guides/config.md 🔴 🔴 🔴'
      );
    let includeSimulators = true;
    // eslint-disable-next-line no-prototype-builtins
    if (cliArgs.plugin['device-farm'].hasOwnProperty('include-simulators')) {
      includeSimulators = cliArgs.plugin['device-farm']['include-simulators'];
    }
    if (includeSimulators === false)
      logger.info('❌ Skipping Simulators as per the confifuration ❌');
    const deviceManager = new DeviceFarmManager({
      platform,
      includeSimulators,
    });
    Container.set(DeviceFarmManager, deviceManager);
    logger.info(
      `📣📣📣 Device Farm Plugin will be served at 🔗 http://localhost:${cliArgs.port}/device-farm`
    );
    await refreshDeviceList();
    await cronReleaseBlockedDevices();
  }

  async createSession(
    next: () => any,
    driver: any,
    jwpDesCaps: any,
    jwpReqCaps: any,
    caps: ISessionCapability
  ) {
    const pendingSessionId = uuidv4();
    await addNewPendingSession({
      ...Object.assign({}, caps.firstMatch[0], caps.alwaysMatch),
      capability_id: pendingSessionId,
    });

    /**
     *  Wait untill a free device is available for the given capabilities
     */
    const device = await commandsQueueGuard.acquire(
      DEVICE_MANAGER_LOCK_NAME,
      async (): Promise<IDevice> => {
        await refreshDeviceList();
        try {
          const device: IDevice = await DevicePlugin.allocateDeviceForSession(caps);
          return device;
        } catch (err) {
          await removePendingSession(pendingSessionId);
          throw err;
        }
      }
    );

    const session = await next();
    await removePendingSession(pendingSessionId);

    if (session.error) {
      await updateDevice(device, { busy: false });
      logger.info(`📱 Device UDID ${device.udid} unblocked. Reason: Session failed to create`);
    } else {
      await updateDevice(device, {
        busy: true,
        session_id: session.value[0],
        lastCmdExecutedAt: new Date().getTime(),
      });
      logger.info(`📱 Updating Device ${device.udid} with session ID ${session.value[0]}`);
    }
    return session;
  }

  async handle(next: () => any, driver: any, commandName: string, ...args: any) {
    logger.info(`Received ${commandName} request on driver - ${driver}`);
    await updateCmdExecutedTime(driver.sessionId);
    return await next();
  }

  async deleteSession(next: () => any, driver: any, sessionId: any) {
    await unblockDevice(sessionId);
    logger.info(`📱 Unblocking the device that is blocked for session ${sessionId}`);
    return await next();
  }

  /**
   * For given capability, wait untill a free device is available from the database
   * and update the capability json with required device informations
   * @param capability
   * @returns
   */
  static async allocateDeviceForSession(capability: ISessionCapability): Promise<IDevice> {
    const firstMatch = Object.assign({}, capability.firstMatch[0], capability.alwaysMatch);

    const filters = DevicePlugin.getDeviceFiltersFromCapability(firstMatch);
    logger.info(JSON.stringify(filters));

    const timeout = firstMatch[customCapability.deviceTimeOut] || DEVICE_AVAILABILITY_TIMEOUT;
    const intervalBetweenAttempts =
      firstMatch[customCapability.deviceQueryInteval] || DEVICE_AVAILABILITY_QUERY_INTERVAL;

    try {
      await waitUntil(
        async () => {
          logger.info('Waiting for free device');
          return (await getDevice(filters)) != undefined;
        },
        { timeout, intervalBetweenAttempts }
      );
    } catch (err) {
      throw new Error(`No device found for filters: ${JSON.stringify(filters)}`);
    }
    const device = getDevice(filters);
    logger.info(`📱 Device found: ${JSON.stringify(device)}`);
    updateDevice(device, { busy: true });
    logger.info(`📱 Blocking device ${device.udid} for new session`);
    await DevicePlugin.updateCapabilityForDevice(capability, device);
    return device;
  }

  private static async updateCapabilityForDevice(capability: any, device: IDevice) {
    if (device.platform.toLowerCase() == 'ios') {
      await iOSCapabilities(capability, device);
      updateDevice(device, {
        mjpegServerPort: capability.firstMatch[0]['appium:mjpegServerPort'],
      });
    } else {
      await androidCapabilities(capability, device);
    }
  }

  /**
   * Method to get the device filters from the custom session capability
   * This filter will be used as in the query to find the free device from the databse
   * @param capability
   * @returns IDeviceFilterOptions
   */
  static getDeviceFiltersFromCapability(capability: any): IDeviceFilterOptions {
    const platform: Platform = capability['platformName'].toLowerCase();
    const udids = capability[customCapability.udids]
      ? capability[customCapability.udids].split(',')
      : process.env.UDIDS?.split(',');
    /* Based on the app file extension, we will decide whether to run the
     * test on real device or simulator.
     *
     * Applicaple only for ios.
     */
    const deviceType =
      platform == 'ios' && isMac()
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
      name,
      deviceType,
      udid: udids?.length ? udids : undefined,
      busy: false,
      offline: false,
      minSDK: capability[customCapability.minSDK] ? capability[customCapability.minSDK] : undefined,
    };
  }
}

/**
 * Helper methods to manage devices
 */
function getDeviceManager() {
  return Container.get(DeviceFarmManager) as DeviceFarmManager;
}

export async function updateDeviceList() {
  const devices = await getDeviceManager().getDevices(getAllDevices());
  logger.info(`📱 Device list updated: ${JSON.stringify(devices.map((d) => d.name))}`);
  saveDevices(devices);
}

async function refreshDeviceList() {
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
    return device.busy === true;
  });
  busyDevices.forEach(function (device) {
    const currentEpoch = new Date().getTime();
    if (
      device.lastCmdExecutedAt != undefined &&
      (currentEpoch - device.lastCmdExecutedAt) / 1000 > 100
    ) {
      console.log(
        `📱 Found Device with udid ${device.udid} has no activity for more than 100 seconds`
      );
      const sessionId = device.session_id;
      if (sessionId !== undefined) {
        unblockDevice(sessionId);
        logger.info(
          `📱 Unblocked device with udid ${device.udid} mapped to sessionId ${sessionId} as there is no activity from client for more than 100 seconds`
        );
      }
    }
  });
}

async function cronReleaseBlockedDevices() {
  if (cronTimerToReleaseBlockedDevices) {
    clearInterval(cronTimerToReleaseBlockedDevices);
  }
  await releaseBlockedDevices();
  cronTimerToReleaseBlockedDevices = setInterval(async () => {
    await releaseBlockedDevices();
  }, 30000);
}
