/* eslint-disable no-prototype-builtins */
import 'reflect-metadata';
import commands from './commands/index';
import BasePlugin from '@appium/base-plugin';
import { createRouter } from './app';
import { IDevice } from './interfaces/IDevice';
import {
  CreateSessionResponseInternal,
  ISessionCapability,
  W3CNewSessionResponse,
  W3CNewSessionResponseError,
} from './interfaces/ISessionCapability';
import AsyncLock from 'async-lock';
import {
  setSimulatorState,
  unblockDevice,
  unblockDeviceMatchingFilter,
  updatedAllocatedDevice,
} from './data-service/device-service';
import {
  addNewPendingSession,
  removePendingSession,
} from './data-service/pending-sessions-service';
import {
  allocateDeviceForSession,
  setupCronReleaseBlockedDevices,
  setupCronUpdateDeviceList,
  deviceType,
  initializeStorage,
  isIOS,
  refreshSimulatorState,
  setupCronCheckStaleDevices,
  updateDeviceList,
  setupCronCleanPendingSessions,
  removeStaleDevices,
} from './device-utils';
import { DeviceFarmManager } from './device-managers';
import { Container } from 'typedi';
import log from './logger';
import { v4 as uuidv4 } from 'uuid';
import axios, { AxiosError } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import {
  nodeUrl,
  spinWith,
  stripAppiumPrefixes,
  isDeviceFarmRunning,
  hasCloudArgument,
} from './helpers';
import { addProxyHandler, registerProxyMiddlware } from './proxy/wd-command-proxy';
import ChromeDriverManager from './device-managers/ChromeDriverManager';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { addCLIArgs } from './data-service/pluginArgs';
import Cloud from './enums/Cloud';
import { ADB } from 'appium-adb';
import { DefaultPluginArgs, IPluginArgs } from './interfaces/IPluginArgs';
import NodeDevices from './device-managers/NodeDevices';
import { IDeviceFilterOptions } from './interfaces/IDeviceFilterOptions';
import { PluginConfig, ServerArgs } from '@appium/types';
import { SESSION_MANAGER } from './sessions/SessionManager';
import { LocalSession } from './sessions/LocalSession';
import { CloudSession } from './sessions/CloudSession';
import { RemoteSession } from './sessions/RemoteSession';
import { DASHBORD_EVENT_MANAGER } from './dashboard/event-manager';
import { getDeviceFarmCapabilities } from './CapabilityManager';
import ip from 'ip';
import _ from 'lodash';
import SessionType from './enums/SessionType';
import { DeviceFarmSession, DeviceFarmSessionOptions } from './sessions/DeviceFarmSession';
import { ADTDatabase } from './data-service/db';

const commandsQueueGuard = new AsyncLock();
const DEVICE_MANAGER_LOCK_NAME = 'DeviceManager';
let platform: any;
let androidDeviceType: any;
let iosDeviceType: any;
let hasEmulators: any;
let proxy: any;

class DevicePlugin extends BasePlugin {
  static nodeBasePath = '';
  private pluginArgs: IPluginArgs = Object.assign({}, DefaultPluginArgs);
  public static NODE_ID: string;
  public static IS_HUB = false;

  constructor(pluginName: string, cliArgs: any) {
    super(pluginName, cliArgs);
    // here, CLI Args are already pluginArgs. Different case for updateServer
    log.debug(`📱 Plugin Args: ${JSON.stringify(cliArgs)}`);
    // plugin args will assign undefined value as well for bindHostOrIp
    this.pluginArgs = Object.assign({}, DefaultPluginArgs, this.cliArgs as unknown as IPluginArgs);
    // not pretty but will do for now
    if (this.pluginArgs.bindHostOrIp === undefined) {
      this.pluginArgs.bindHostOrIp = ip.address();
    }
  }

  onUnexpectedShutdown(driver: any, cause: any) {
    const deviceFilter = {
      session_id: driver.sessionId ? driver.sessionId : undefined,
      udid: driver.caps && driver.caps.udid ? driver.caps.udid : undefined,
    } as unknown as IDeviceFilterOptions;

    if (this.pluginArgs.hub !== undefined) {
      // send unblock request to hub. Should we unblock the whole devices from this node?
      new NodeDevices(this.pluginArgs.hub).unblockDevice(deviceFilter);
    } else {
      unblockDeviceMatchingFilter(deviceFilter);
    }

    log.info(
      `Unblocking device mapped with filter ${JSON.stringify(
        deviceFilter,
      )} onUnexpectedShutdown from server`,
    );
  }

  public static async updateServer(
    expressApp: any,
    httpServer: any,
    cliArgs: ServerArgs,
  ): Promise<void> {
    // cliArgs are here is not pluginArgs yet as it contains the whole CLI argument for Appium! Different case for our plugin constructor
    log.debug(`📱 Update server with CLI Args: ${JSON.stringify(cliArgs)}`);
    const pluginConfigs = cliArgs.plugin as PluginConfig;
    let pluginArgs: IPluginArgs;
    if (pluginConfigs['device-farm'] !== undefined) {
      pluginArgs = Object.assign(
        {},
        DefaultPluginArgs,
        pluginConfigs['device-farm'] as unknown as IPluginArgs,
      );
    } else {
      pluginArgs = Object.assign({}, DefaultPluginArgs);
    }
    DevicePlugin.NODE_ID = uuidv4();
    log.info('Cli Args: ' + JSON.stringify(cliArgs));

    // I'm transferring the CLI Args to pluginArgs here.
    DevicePlugin.nodeBasePath = cliArgs.basePath;

    if (pluginArgs.bindHostOrIp === undefined) {
      pluginArgs.bindHostOrIp = ip.address();
    }

    log.debug(`📱 Update server with Plugin Args: ${JSON.stringify(pluginArgs)}`);

    if (pluginArgs.removeDevicesFromDatabaseBeforeRunningThePlugin) {
      log.info(
        '🔴 Removing all devices from database before running the plugin. You asked for it!',
      );
      await initializeStorage();
      (await ADTDatabase.DeviceModel).removeDataOnly();
    }

    platform = pluginArgs.platform;
    androidDeviceType = pluginArgs.androidDeviceType;
    iosDeviceType = pluginArgs.iosDeviceType;
    if (pluginArgs.proxy !== undefined) {
      log.info(`Adding proxy for axios: ${JSON.stringify(pluginArgs.proxy)}`);
      proxy = pluginArgs.proxy;
    } else {
      log.info('proxy is not required for axios');
    }
    hasEmulators = pluginArgs.emulators && pluginArgs.emulators.length > 0;

    expressApp.use('/device-farm', createRouter(pluginArgs));
    registerProxyMiddlware(expressApp, cliArgs);

    if (!platform)
      throw new Error(
        '🔴 🔴 🔴 Specify --plugin-device-farm-platform from CLI as android,iOS or both or use appium server config. Please refer 🔗 https://github.com/appium/appium/blob/master/packages/appium/docs/en/guides/config.md 🔴 🔴 🔴',
      );

    if (hasEmulators && pluginArgs.platform.toLowerCase() === 'android') {
      log.info('Emulators will be booted!!');
      const adb = await ADB.createADB({});
      const array = pluginArgs.emulators || [];
      const promiseArray = array.map(async (arr: any) => {
        await Promise.all([await adb.launchAVD(arr.avdName, arr)]);
      });
      await Promise.all(promiseArray);
    }

    const chromeDriverManager =
      pluginArgs.skipChromeDownload === false ? await ChromeDriverManager.getInstance() : undefined;
    iosDeviceType = DevicePlugin.setIncludeSimulatorState(pluginArgs, iosDeviceType);
    const deviceTypes = { androidDeviceType, iosDeviceType };
    const deviceManager = new DeviceFarmManager(
      platform,
      deviceTypes,
      cliArgs.port,
      pluginArgs,
      DevicePlugin.NODE_ID,
    );
    Container.set(DeviceFarmManager, deviceManager);
    if (chromeDriverManager) Container.set(ChromeDriverManager, chromeDriverManager);

    await addCLIArgs(cliArgs);
    await initializeStorage();

    log.info(
      `📣📣📣 Device Farm Plugin will be served at 🔗 http://${pluginArgs.bindHostOrIp}:${cliArgs.port}/device-farm with id ${DevicePlugin.NODE_ID}`,
    );

    log.debug(`What is my pluginArgs: ${JSON.stringify(pluginArgs)}`);
    log.debug(`What is my hubArgument: ${JSON.stringify(pluginArgs.hub)}`);

    if (!_.isNil(pluginArgs.hub)) {
      log.info(`📣📣📣 I'm a node and my hub is ${pluginArgs.hub}`);
      // hub may have been restarted, so let's send device list regularly
      await setupCronUpdateDeviceList(
        pluginArgs.bindHostOrIp,
        pluginArgs.hub,
        pluginArgs.sendNodeDevicesToHubIntervalMs,
      );
    } else {
      DevicePlugin.IS_HUB = true;
      log.info(`📣📣📣 I'm a hub and I'm listening on ${pluginArgs.bindHostOrIp}:${cliArgs.port}`);
    }
    if (pluginArgs.cloud == undefined) {
      // check for stale nodes
      await setupCronCheckStaleDevices(
        pluginArgs.checkStaleDevicesIntervalMs,
        pluginArgs.bindHostOrIp,
      );
      // and release blocked devices
      await setupCronReleaseBlockedDevices(
        pluginArgs.checkBlockedDevicesIntervalMs,
        pluginArgs.newCommandTimeoutSec,
      );
      // and clean up pending sessions
      await setupCronCleanPendingSessions(
        pluginArgs.checkBlockedDevicesIntervalMs,
        pluginArgs.deviceAvailabilityTimeoutMs + 10000,
      );
      // unblock all devices on node/hub restart
      await unblockDeviceMatchingFilter({});

      // remove stale devices
      await removeStaleDevices(pluginArgs.bindHostOrIp);
    } else {
      log.info('📣📣📣 Cloud runner sessions dont require constant device checks');
    }

    const devicesUpdates = await updateDeviceList(pluginArgs.bindHostOrIp, pluginArgs.hub);
    if (isIOS(pluginArgs) && deviceType(pluginArgs, 'simulated')) {
      await setSimulatorState(devicesUpdates);
      await refreshSimulatorState(pluginArgs, cliArgs.port, DevicePlugin.NODE_ID);
    }
  }

  private static setIncludeSimulatorState(pluginArgs: IPluginArgs, deviceTypes: string) {
    if (hasCloudArgument(pluginArgs)) {
      deviceTypes = 'real';
      log.info('ℹ️ Skipping Simulators as per the configuration ℹ️');
    }
    return deviceTypes;
  }

  static async waitForRemoteDeviceFarmToBeRunning(host: string) {
    await spinWith(
      `Waiting for device farm server ${host} to be up and running\n`,
      async () => {
        return await isDeviceFarmRunning(host);
      },
      (msg: any) => {
        throw new Error(`Failed: ${msg}`);
      },
    );
  }

  async createSession(
    next: () => any,
    driver: any,
    jwpDesCaps: any,
    jwpReqCaps: any,
    caps: ISessionCapability,
  ) {
    log.debug(`📱 pluginArgs: ${JSON.stringify(this.pluginArgs)}`);
    log.debug(`Receiving session request at host: ${this.pluginArgs.bindHostOrIp}`);
    const pendingSessionId = uuidv4();
    log.debug(`📱 Creating temporary session capability_id: ${pendingSessionId}`);
    const {
      alwaysMatch: requiredCaps = {}, // If 'requiredCaps' is undefined, set it to an empty JSON object (#2.1)
      firstMatch: allFirstMatchCaps = [{}], // If 'firstMatch' is undefined set it to a singleton list with one empty object (#3.1)
    } = caps;
    stripAppiumPrefixes(requiredCaps);
    stripAppiumPrefixes(allFirstMatchCaps);
    await addNewPendingSession({
      ...Object.assign({}, caps.firstMatch[0], caps.alwaysMatch),
      capability_id: pendingSessionId,
      // mark the insertion date
      createdAt: new Date().getTime(),
    });

    /**
     *  Wait untill a free device is available for the given capabilities
     */
    const deviceAndCaps = await commandsQueueGuard.acquire(
      DEVICE_MANAGER_LOCK_NAME,
      async (): Promise<{device: IDevice, capability: ISessionCapability}> => {
        try {
          return await allocateDeviceForSession(
            caps,
            this.pluginArgs.deviceAvailabilityTimeoutMs,
            this.pluginArgs.deviceAvailabilityQueryIntervalMs,
            this.pluginArgs,
          );
        } catch (err) {
          await removePendingSession(pendingSessionId);
          throw err;
        }
      },
    );

    // allocated device
    const device = deviceAndCaps.device;
    // updated caps
    caps = deviceAndCaps.capability;

    let session: CreateSessionResponseInternal | W3CNewSessionResponseError | Error;
    const isRemoteOrCloudSession =
      !device.nodeId ||
      device.nodeId !== DevicePlugin.NODE_ID ||
      (device.hasOwnProperty('cloud') && _.isNil(device.cloud));

    log.debug(
      `allocated device.nodeId: ${device.nodeId} vs pluginArgs.nodeId: ${DevicePlugin.NODE_ID}`,
    );

    log.debug(
      `device.host: ${device.host} and pluginArgs.bindHostOrIp: ${this.pluginArgs.bindHostOrIp}`,
    );

    if (!_.isNil(this.pluginArgs.hub)) {
      // I am a node, create the session on the same node
      log.debug('📱 Creating session on the same node');
      session = await next();
    } else {
      // I am a hub.
      // Check whether the device is on the same node or not.
      if (isRemoteOrCloudSession) {
        // If the device is not on the same node, forward the session request.
        log.debug(`📱 Need to forward session request to ${device.host}`);
        // Unless preventSessionForwarding is set to true
        if (this.pluginArgs.preventSessionForwarding) {
          session = new Error(
            `Requested device is available on the node. However, session forwarding is disabled. Please enable it by setting "preventSessionForwarding" to false in plugin args`,
          );
        } else {
          session = await this.forwardSessionRequest(device, caps);
        }
      } else {
        // If the device is on the same node, create the session on the same node.
        log.debug('📱 Creating session on the hub');
        session = await next();
      }
    }

    // non-forwarded session can also be an error
    log.debug('📱 Session response: ', JSON.stringify(session));

    log.debug(`📱 Removing pending session with capability_id: ${pendingSessionId}`);
    await removePendingSession(pendingSessionId);

    // Do we have valid session response?
    if (this.isCreateSessionResponseInternal(session)) {
      log.debug('📱 Session response is CreateSessionResponseInternal');

      const sessionId = (session as CreateSessionResponseInternal).value[0];
      const sessionResponse = (session as CreateSessionResponseInternal).value[1];
      const deviceFarmCapabilities = getDeviceFarmCapabilities(caps);

      log.info(`📱 Device UDID ${device.udid} blocked for session ${sessionId}`);
      await updatedAllocatedDevice(device, {
        busy: true,
        session_id: sessionId,
        lastCmdExecutedAt: new Date().getTime(),
        sessionStartTime: new Date().getTime(),
      });
      if (isRemoteOrCloudSession) {
        addProxyHandler(sessionId, device.host);
      }

      let sessionInstance: DeviceFarmSession;
      const sessionOptions: DeviceFarmSessionOptions = {
        sessionId,
        device,
        sessionResponse,
        deviceFarmOption: deviceFarmCapabilities,
      };
      const nodeWebdriverUrl = nodeUrl(device, DevicePlugin.nodeBasePath);
      if (device.nodeId === DevicePlugin.NODE_ID) {
        sessionInstance = new LocalSession({
          ...sessionOptions,
          driver,
        });
      } else if (device.hasOwnProperty('cloud')) {
        sessionInstance = new CloudSession({
          ...sessionOptions,
          baseUrl: nodeWebdriverUrl,
        });
      } else {
        sessionInstance = new RemoteSession({
          ...sessionOptions,
          baseUrl: nodeWebdriverUrl,
        });
      }

      const isDashboardEnabled = !!this.pluginArgs.enableDashboard;
      const shouldSaveLogs = sessionInstance.getType() !== SessionType.CLOUD;

      if (isDashboardEnabled && shouldSaveLogs) {
        log.debug(
          `Adding the session ${sessionInstance.getId()} with type ${sessionInstance.getType()} to session map`,
        );
        SESSION_MANAGER.addSession(sessionInstance.getId(), sessionInstance);

        if (DevicePlugin.IS_HUB) {
          await DASHBORD_EVENT_MANAGER.onSessionStarted(
            deviceFarmCapabilities,
            sessionInstance,
            device,
          );
        }
      } else {
        log.debug(
          `Not adding the session ${sessionInstance.getId()} with type ${sessionInstance.getType()} to session map. DashboardEnabled: ${isDashboardEnabled}, shouldSaveLogs: ${shouldSaveLogs}`,
        );
      }

      log.info(`📱 Updating Device ${device.udid} with session ID ${sessionId}`);
    } else {
      // assume session is an error
      await unblockDevice(device.udid, device.host);
      log.info(`📱 Device UDID ${device.udid} unblocked. Reason: Failed to create session`);

      this.throwProperError(session, device.host);
    }

    return session;
  }

  throwProperError(session: any, host: string) {
    if (session instanceof Error) {
      throw session;
    } else if (session.hasOwnProperty('error')) {
      const errorMessage = (session as W3CNewSessionResponseError).error;
      if (errorMessage) {
        throw new Error(errorMessage);
      } else {
        throw new Error(
          `Unknown error while creating session: ${JSON.stringify(
            session,
          )}. \nBetter look at appium log on the node: ${host}`,
        );
      }
    } else {
      throw new Error(
        `Unknown error while creating session: ${JSON.stringify(
          session,
        )}. \nBetter look at appium log on the node: ${host}`,
      );
    }
  }

  // type guard for CreateSessionResponseInternal
  private isCreateSessionResponseInternal(
    something: any,
  ): something is CreateSessionResponseInternal {
    return (
      something.hasOwnProperty('value') &&
      something.value.length === 3 &&
      something.value[0] &&
      something.value[1] &&
      something.value[2]
    );
  }

  private async forwardSessionRequest(
    device: IDevice,
    caps: ISessionCapability,
  ): Promise<CreateSessionResponseInternal | Error> {
    const remoteUrl = `${nodeUrl(device, DevicePlugin.nodeBasePath)}/session`;
    let capabilitiesToCreateSession = { capabilities: caps };

    if (device.hasOwnProperty('cloud') && device.cloud.toLowerCase() === Cloud.LAMBDATEST) {
      capabilitiesToCreateSession = Object.assign(capabilitiesToCreateSession, {
        desiredCapabilities: capabilitiesToCreateSession.capabilities.alwaysMatch,
      });
    }

    log.info(
      `Creating session with desiredCapabilities: "${JSON.stringify(capabilitiesToCreateSession)}"`,
    );

    const config: any = {
      method: 'post',
      url: remoteUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: capabilitiesToCreateSession,
    };

    //log.info(`Add proxy to axios config only if it is set: ${JSON.stringify(proxy)}`);
    if (proxy != undefined) {
      log.info(`Added proxy to axios config: ${JSON.stringify(proxy)}`);
      config.httpsAgent = new HttpsProxyAgent(proxy);
      config.httpAgent = new HttpProxyAgent(proxy);
      config.proxy = false;
    }

    log.info(`With axios config: "${JSON.stringify(config)}"`);
    const createdSession: W3CNewSessionResponse | Error = await this.invokeSessionRequest(config);

    if (createdSession instanceof Error) {
      return createdSession;
    } else {
      return {
        protocol: 'W3C',
        value: [createdSession.value.sessionId, createdSession.value.capabilities, 'W3C'],
      };
    }
  }

  async invokeSessionRequest(config: any): Promise<W3CNewSessionResponse | Error> {
    let sessionDetails: W3CNewSessionResponse | null = null;
    let errorMessage: string | null = null;
    try {
      const response = await axios(config);
      log.debug('remote node response', JSON.stringify(response.data));

      // Appium endpoint returns session details w3c format: https://github.com/jlipps/simple-wd-spec?tab=readme-ov-file#new-session
      sessionDetails = response.data as unknown as W3CNewSessionResponse;

      // check if we have error in response by checking sessionDetails.value type
      if ('error' in sessionDetails.value) {
        log.error(`Error while creating session: ${sessionDetails.value.error}`);
        errorMessage = sessionDetails.value.error as string;
      }
    } catch (error: AxiosError<any> | any) {
      log.debug(`Received error from remote node: ${JSON.stringify(error)}`);
      if (error instanceof AxiosError) {
        errorMessage = JSON.stringify(error.response?.data);
      } else {
        errorMessage = error;
      }
    }

    // Actually errorMessage will be empty when axios is getting peer connection error/disconnected.
    // So, let's invert the situation and return error when sessionDetails is null
    if (_.isNil(sessionDetails)) {
      log.error(`Error while creating session: ${errorMessage}`);
      if (_.isNil(errorMessage)) {
        errorMessage = 'Unknown error while creating session';
      }
      return new Error(errorMessage);
    } else {
      log.debug(
        `📱 Session received with details: ${JSON.stringify(
          !sessionDetails ? {} : sessionDetails,
        )}`,
      );

      if (this.isW3CNewSessionResponse(sessionDetails)) {
        return sessionDetails as W3CNewSessionResponse;
      } else {
        return new Error(`Unknown error while creating session: ${JSON.stringify(sessionDetails)}`);
      }
    }
  }

  private isW3CNewSessionResponse(something: any): something is W3CNewSessionResponse {
    return (
      something.hasOwnProperty('value') &&
      something.value.hasOwnProperty('sessionId') &&
      something.value.hasOwnProperty('capabilities')
    );
  }

  async deleteSession(next: () => any, driver: any, sessionId: any) {
    await unblockDeviceMatchingFilter({ session_id: sessionId });
    log.info(`📱 Unblocking the device that is blocked for session ${sessionId}`);
    return await next();
  }
}

Object.assign(DevicePlugin.prototype, commands);
export { DevicePlugin };
