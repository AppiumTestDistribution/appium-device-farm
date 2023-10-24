/* eslint-disable no-prototype-builtins */
import 'reflect-metadata';
import commands from './commands/index';
import BasePlugin from '@appium/base-plugin';
import { router } from './app';
import { IDevice } from './interfaces/IDevice';
import { ISessionCapability } from './interfaces/ISessionCapability';
import AsyncLock from 'async-lock';
import {
  setSimulatorState,
  unblockDevice,
  updatedAllocatedDevice,
} from './data-service/device-service';
import {
  addNewPendingSession,
  removePendingSession,
} from './data-service/pending-sessions-service';
import {
  allocateDeviceForSession,
  checkNodeServerAvailability,
  cronReleaseBlockedDevices,
  deviceType,
  initlializeStorage,
  isIOS,
  refreshSimulatorState,
  updateDeviceList,
} from './device-utils';
import { DeviceFarmManager } from './device-managers';
import { Container } from 'typedi';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { hubUrl, isHub, spinWith, stripAppiumPrefixes } from './helpers';
import { addProxyHandler, registerProxyMiddlware } from './wd-command-proxy';
import ChromeDriverManager from './device-managers/ChromeDriverManager';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { addCLIArgs, getCLIArgs } from './data-service/pluginArgs';
import Cloud from './enums/Cloud';
import ip from 'ip';
import _ from 'lodash';
import { ServerCLI } from './types/CLIArgs';
import { ADB } from 'appium-adb';

const commandsQueueGuard = new AsyncLock();
const DEVICE_MANAGER_LOCK_NAME = 'DeviceManager';

class DevicePlugin extends BasePlugin {
  constructor(pluginName: string, cliArgs: any) {
    super(pluginName, cliArgs);
  }

  onUnexpectedShutdown(driver: any, cause: any) {
    const deviceFilter = {
      session_id: driver.sessionId ? driver.sessionId : undefined,
      udid: driver.caps && driver.caps.udid ? driver.caps.udid : undefined,
    };
    unblockDevice(deviceFilter);
    logger.info(
      `Unblocking device mapped with filter ${JSON.stringify(
        deviceFilter
      )} onUnexpectedShutdown from server`
    );
  }

  public static async updateServer(expressApp: any, httpServer: any, cliArgs: any): Promise<void> {
    let platform;
    let androidDeviceType;
    let iosDeviceType;
    let skipChromeDownload;
    let emulators;
    registerProxyMiddlware(expressApp);

    if (cliArgs.plugin && cliArgs.plugin['device-farm']) {
      platform = cliArgs.plugin['device-farm'].platform;
      androidDeviceType = cliArgs.plugin['device-farm'].androidDeviceType || 'both';
      iosDeviceType = cliArgs.plugin['device-farm'].iosDeviceType || 'both';
      skipChromeDownload = cliArgs.plugin['device-farm'].skipChromeDownload;
      emulators = Object.hasOwn(cliArgs.plugin['device-farm'], 'emulators');
    }

    expressApp.use('/device-farm', router);

    if (!platform)
      throw new Error(
        '🔴 🔴 🔴 Specify --plugin-device-farm-platform from CLI as android,iOS or both or use appium server config. Please refer 🔗 https://github.com/appium/appium/blob/master/packages/appium/docs/en/guides/config.md 🔴 🔴 🔴'
      );

    if (emulators && cliArgs.plugin['device-farm'].platform.toLowerCase() === 'android') {
      logger.info('Emulators will be booted!!');
      const adb = await ADB.createADB();
      const array = cliArgs.plugin['device-farm'].emulators;
      const promiseArray = array.map(async (arr: any) => {
        await Promise.all([await adb.launchAVD(arr.avdName, arr)]);
      });
      await Promise.all(promiseArray);
    }

    if (skipChromeDownload === undefined) cliArgs.plugin['device-farm'].skipChromeDownload = true;

    const chromeDriverManager =
      cliArgs.plugin['device-farm'].skipChromeDownload === false
        ? await ChromeDriverManager.getInstance()
        : undefined;
    iosDeviceType = DevicePlugin.setIncludeSimulatorState(cliArgs, iosDeviceType);
    const deviceTypes = { androidDeviceType, iosDeviceType };
    const deviceManager = new DeviceFarmManager({
      platform,
      deviceTypes,
      cliArgs,
    });
    Container.set(DeviceFarmManager, deviceManager);
    if (chromeDriverManager) Container.set(ChromeDriverManager, chromeDriverManager);

    await addCLIArgs(cliArgs);
    await initlializeStorage();

    logger.info(
      `📣📣📣 Device Farm Plugin will be served at 🔗 http://localhost:${cliArgs.port}/device-farm`
    );

    if (isHub(cliArgs)) {
      const hub = cliArgs.plugin['device-farm'].hub;
      await DevicePlugin.waitForRemoteHubServerToBeRunning(hub);
      await checkNodeServerAvailability();
    }

    const devicesUpdates = await updateDeviceList(cliArgs);
    if (isIOS(cliArgs) && deviceType(cliArgs, 'simulated')) {
      await setSimulatorState(devicesUpdates);
      await refreshSimulatorState(cliArgs);
    }
    await cronReleaseBlockedDevices();
  }

  private static setIncludeSimulatorState(cliArgs: any, deviceTypes: string) {
    const cloudExists = _.has(cliArgs, 'plugin["device-farm"].cloud');
    if (cloudExists) {
      deviceTypes = 'real';
      logger.info('ℹ️ Skipping Simulators as per the configuration ℹ️');
    }
    return deviceTypes;
  }

  static async waitForRemoteHubServerToBeRunning(host: string) {
    await spinWith(
      `Waiting for node server ${host} to be up and running\n`,
      async () => {
        await axios({
          method: 'get',
          url: `${host}/device-farm`,
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
        //await refreshDeviceList();
        try {
          return await allocateDeviceForSession(caps);
        } catch (err) {
          await removePendingSession(pendingSessionId);
          throw err;
        }
      }
    );
    let session;
    if (!device.host.includes(ip.address())) {
      const remoteUrl = hubUrl(device);
      let capabilitiesToCreateSession = { capabilities: caps };
      if (device.hasOwnProperty('cloud') && device.cloud.toLowerCase() === Cloud.LAMBDATEST) {
        capabilitiesToCreateSession = Object.assign(capabilitiesToCreateSession, {
          desiredCapabilities: capabilitiesToCreateSession.capabilities.alwaysMatch,
        });
      }
      logger.info(`Remote Host URL - ${remoteUrl}`);
      let sessionDetails: any;
      logger.info(
        `Creating cloud session with desiredCapabilities: "${JSON.stringify(
          capabilitiesToCreateSession
        )}"`
      );
      const config = {
        method: 'post',
        url: remoteUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: capabilitiesToCreateSession,
      };
      logger.info(`with config: "${JSON.stringify(config)}"`);
      try {
        const response = await axios(config);
        sessionDetails = response.data;
        if (Object.hasOwn(sessionDetails.value, 'error')) {
          this.unblockDeviceOnError(device, sessionDetails.value.error);
        }
      } catch (error: any) {
        if (error != undefined) this.unblockDeviceOnError(device, error);
      }

      session = {
        protocol: 'W3C',
        value: [sessionDetails.value.sessionId, sessionDetails.value.capabilities, 'W3C'],
      };
    } else {
      session = await next();
    }

    await removePendingSession(pendingSessionId);

    if (session.error) {
      await updatedAllocatedDevice(device, { busy: false });
      logger.info(`📱 Device UDID ${device.udid} unblocked. Reason: Session failed to create`);
    } else {
      const sessionId = session.value[0];
      await updatedAllocatedDevice(device, {
        busy: true,
        session_id: sessionId,
        lastCmdExecutedAt: new Date().getTime(),
        sessionStartTime: new Date().getTime(),
      });
      if (!device.host.includes(ip.address())) {
        addProxyHandler(sessionId, device.host);
      }
      logger.info(`📱 Updating Device ${device.udid} with session ID ${sessionId}`);
    }
    return session;
  }

  private unblockDeviceOnError(device: IDevice, error: any) {
    updatedAllocatedDevice(device, { busy: false });
    logger.info(
      `📱 Device UDID ${device.udid} unblocked. Reason: Remote Session failed to create. "${error}"`
    );
    throw new Error(
      `"${error}", Please check the remote appium server log to know the reason for failure`
    );
  }

  async deleteSession(next: () => any, driver: any, sessionId: any) {
    unblockDevice({ session_id: sessionId });
    logger.info(`📱 Unblocking the device that is blocked for session ${sessionId}`);
    return await next();
  }
}

Object.assign(DevicePlugin.prototype, commands);
export { DevicePlugin };
