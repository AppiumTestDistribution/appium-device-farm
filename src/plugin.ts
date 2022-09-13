/* eslint-disable no-prototype-builtins */
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
import axios from 'axios';
import { isObject } from 'lodash';
import { stripAppiumPrefixes } from './helpers';

import { addProxyHandler, registerProxyMiddlware } from './wd-command-proxy';
import ora from 'ora';
import { hubUrl } from './helpers';
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
    let remote;
    registerProxyMiddlware(expressApp);
    if (cliArgs.plugin && cliArgs.plugin['device-farm']) {
      platform = cliArgs.plugin['device-farm'].platform.toLowerCase();
      remote = cliArgs.plugin['device-farm'].remote;
    }
    expressApp.use('/device-farm', router);
    if (!platform)
      throw new Error(
        '🔴 🔴 🔴 Specify --plugin-device-farm-platform from CLI as android,iOS or both or use appium server config. Please refer 🔗 https://github.com/appium/appium/blob/master/packages/appium/docs/en/guides/config.md 🔴 🔴 🔴'
      );
    if (!remote) cliArgs.plugin['device-farm'].remote = ['http://127.0.0.1'];
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
    await Promise.all(
      cliArgs.plugin['device-farm'].remote.map(async (url: any) => {
        if (!isObject(url) && !url.includes('127.0.0.1')) {
          await spinWith(
            `Waiting for node server ${url} to be up and running\n`,
            async () => {
              await axios({
                method: 'get',
                url: `${url}/device-farm`,
                timeout: 30000,
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            },
            (msg: any) => {
              throw new Error(`Failed: ${msg}`);
            }
          );
        }
      })
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
    const {
      alwaysMatch: requiredCaps = {}, // If 'requiredCaps' is undefined, set it to an empty JSON object (#2.1)
      firstMatch: allFirstMatchCaps = [{}], // If 'firstMatch' is undefined set it to a singleton list with one empty object (#3.1)
    } = caps;
    stripAppiumPrefixes(requiredCaps);
    stripAppiumPrefixes(allFirstMatchCaps);
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
    let session;
    if (!device.host.includes('127.0.0.1')) {
      const remoteUrl = hubUrl(device);
      let sessionDetails: any;
      try {
        await spinWith('Creating remote session', async () => {
          sessionDetails = //change to give the entire URL
            (
              await axios.post(remoteUrl, {
                capabilities: caps,
              })
            ).data;
          if (sessionDetails.value.error)
            throw new Error(`Failed ❌ ${sessionDetails.value.error}`);
        });

        session = {
          protocol: 'W3C',
          value: [sessionDetails.value.sessionId, sessionDetails.value.capabilities, 'W3C'],
        };
      } catch (err: any) {
        await updateDevice(device, { busy: false });
        logger.info(
          `📱 Device UDID ${device.udid} unblocked. Reason: Remote Session failed to create`
        );
        throw new Error(
          `${err}, Please check the remote appium server log to know the reason for failure`
        );
      }
    } else {
      session = await next();
    }

    await removePendingSession(pendingSessionId);

    if (session.error) {
      await updateDevice(device, { busy: false });
      logger.info(`📱 Device UDID ${device.udid} unblocked. Reason: Session failed to create`);
    } else {
      const sessionId = session.value[0];
      await updateDevice(device, {
        busy: true,
        session_id: sessionId,
        lastCmdExecutedAt: new Date().getTime(),
      });
      if (!device.host.includes('127.0.0.1')) {
        addProxyHandler(sessionId, device.host);
      }
      logger.info(`📱 Updating Device ${device.udid} with session ID ${sessionId}`);
    }
    return session;
  }

  async deleteSession(next: () => any, driver: any, sessionId: any) {
    unblockDevice(sessionId);
    logger.info(`📱 Unblocking the device that is blocked for session ${sessionId}`);
    return await next();
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
async function spinWith(msg: string, fn: () => any, callback = (msg: string) => {}) {
  const spinner = ora(msg).start();
  let res;
  try {
    res = await fn();
    spinner.succeed();
    return res;
  } catch (err) {
    spinner.fail();
    spinner.color = 'red';
    if (callback) callback(msg);
  }
}

Object.assign(DevicePlugin.prototype, commands);
export { DevicePlugin };
