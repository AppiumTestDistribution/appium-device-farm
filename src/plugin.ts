import BasePlugin from '@appium/base-plugin';
import log from './logger';
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
};

let timer: any;

export class DevicePlugin extends BasePlugin {
  constructor(pluginName: string, opts: any) {
    super(pluginName, opts);
  }

  static get argsConstraints() {
    return {
      Platform: {
        isString: true,
      },
    };
  }

  public static async updateServer(expressApp: any): Promise<void> {
    expressApp.use('/device-farm', router);
    log.info('Device Farm Plugin will be served at http://localhost:4723/device-farm');
    log.info(
      'If the appium server is started with different port other than 4723, then use the correct port number to access the device farm dashboard'
    );
    await refreshDeviceList();
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
      log.info(`Device UDID ${device.udid} unblocked. Reason: Session failed to create`);
    } else {
      await updateDevice(device, {
        busy: true,
        session_id: session.value[0],
      });
      logger.info(`Updating Device ${device.udid} with session ID ${session.value[0]}`);
    }
    return session;
  }

  async deleteSession(next: () => any, driver: any, sessionId: any) {
    await unblockDevice(sessionId);
    log.info(`Unblocking the device that is blocked for session ${sessionId}`);
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
          log.info('Waiting for free device');
          return (await getDevice(filters)) != undefined;
        },
        { timeout, intervalBetweenAttempts }
      );
    } catch (err) {
      throw new Error(`No device found for filters: ${JSON.stringify(filters)}`);
    }
    const device = await getDevice(filters);
    log.info(`Device found: ${JSON.stringify(device)}`);
    await updateDevice(device, { busy: true });
    log.info(`Blocking device ${device.udid} for new session`);
    await DevicePlugin.updateCapabilityForDevice(capability, device);
    return device;
  }

  private static async updateCapabilityForDevice(capability: any, device: IDevice) {
    if (device.platform.toLowerCase() == 'ios') {
      await iOSCapabilities(capability, device);
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
    const udids = process.env.UDIDS?.split(',');
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
  log.info(`Device list updated: ${JSON.stringify(devices.map((d) => d.name))}`);
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
