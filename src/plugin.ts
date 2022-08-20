import 'reflect-metadata';
import commands from './commands/index';
import BasePlugin from '@appium/base-plugin';
import { router } from './app';
import { IDevice } from './interfaces/IDevice';
import { ISessionCapability } from './interfaces/ISessionCapability';
import AsyncLock from 'async-lock';
import { updateDevice, unblockDevice } from './data-service/device-service';
import {
  addNewPendingSession,
  removePendingSession,
} from './data-service/pending-sessions-service';
import {
  refreshDeviceList,
  cronReleaseBlockedDevices,
  allocateDeviceForSession,
} from './device-utils';
import { DeviceFarmManager } from './device-managers';
import { Container } from 'typedi';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';

const commandsQueueGuard = new AsyncLock();
const DEVICE_MANAGER_LOCK_NAME = 'DeviceManager';

class DevicePlugin extends BasePlugin {
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
    console.log(cliArgs);
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
      cliArgs,
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
          const device: IDevice = await allocateDeviceForSession(caps);
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

  async deleteSession(next: () => any, driver: any, sessionId: any) {
    await unblockDevice(sessionId);
    logger.info(`📱 Unblocking the device that is blocked for session ${sessionId}`);
    return await next();
  }
}

Object.assign(DevicePlugin.prototype, commands);
export { DevicePlugin };
