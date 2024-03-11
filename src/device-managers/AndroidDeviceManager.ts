import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort } from '../helpers';
import { ADB, getSdkRootFromEnv } from 'appium-adb';
import log from '../logger';
import _ from 'lodash';
import { fs } from '@appium/support';
import ChromeDriverManager from './ChromeDriverManager';
import { Container } from 'typedi';
import { getUtilizationTime } from '../device-utils';
import Adb, { Client, DeviceWithPath } from '@devicefarmer/adbkit';
import { AbortController } from 'node-abort-controller';
import asyncWait from 'async-wait-until';
import NodeDevices from './NodeDevices';
import { addNewDevice, removeDevice } from '../data-service/device-service';
import Devices from './cloud/Devices';
import { DeviceTypeToInclude, IPluginArgs } from '../interfaces/IPluginArgs';
import { IDevice } from '../interfaces/IDevice';
import { DeviceUpdate } from '../types/DeviceUpdate';
import Tracker from '@devicefarmer/adbkit/dist/src/adb/tracker';
import {
  allowRecordingPermissions,
  bringStreamingActivityToBack,
  checkIfStreamingAppIsInstalled,
  forwardPort,
  installStreamingApp,
  removeAllPortForwarding,
  startStreamingActivity,
} from '../modules/androidStreaming';

async function streamAndroid(
  adbInstance: any,
  device: { udid: string; state: string },
  systemPort: number,
) {
  if (!(await checkIfStreamingAppIsInstalled(adbInstance, device.udid))) {
    log.info('Streaming app is not installed. Installing now');
    await installStreamingApp(adbInstance, device.udid);
  }
  await allowRecordingPermissions(adbInstance, device.udid);
  await startStreamingActivity(adbInstance, device.udid);
  await bringStreamingActivityToBack(adbInstance, device.udid);
  await forwardPort(adbInstance, device.udid, systemPort);
}

export default class AndroidDeviceManager implements IDeviceManager {
  private adb: ADB | undefined;
  private adbAvailable = true;
  private abortControl: Map<string, AbortController> = new Map();
  private tracker?: Tracker = undefined;
  private remoteTrackers: { id: string; tracker: Tracker }[] = [];
  constructor(
    private pluginArgs: IPluginArgs,
    private hostPort: number,
    private nodeId: string,
  ) {}

  private initiateAbortControl(deviceUdid: string) {
    const control = new AbortController();
    this.abortControl.set(deviceUdid, control);
    return control;
  }

  private abort(deviceUdid: string) {
    this.abortControl.get(deviceUdid)?.abort();
  }

  private cancelAbort(deviceUdid: string) {
    if (this.abortControl.has(deviceUdid)) {
      this.abortControl.delete(deviceUdid);
    }
  }

  async getDevices(
    deviceTypes: { androidDeviceType: DeviceTypeToInclude },
    existingDeviceDetails: Array<IDevice>,
  ): Promise<IDevice[]> {
    if (!this.adbAvailable) {
      log.info('adb is not available. So, returning empty list');
      return [];
    }
    let devices: IDevice[] = [];
    try {
      if (this.pluginArgs.cloud != undefined) {
        const cloud = new Devices(this.pluginArgs.cloud, devices, 'android');
        return await cloud.getDevices();
      } else {
        devices = await this.fetchAndroidDevices(existingDeviceDetails, this.pluginArgs);
        log.info(`Found ${devices.length} android devices`);
      }

      if (deviceTypes.androidDeviceType === 'real') {
        return devices.filter((device) => {
          return device.deviceType === 'real';
        });
      } else if (deviceTypes.androidDeviceType === 'simulated') {
        return devices.filter((device) => {
          return device.deviceType === 'emulator';
        });
        // return both real and simulated (emulated) devices
      } else {
        return devices;
      }
    } catch (e) {
      log.error(`Error while getting android devices. Error: ${e}`);
    }
    return [];
  }

  private async fetchAndroidDevices(existingDeviceDetails: IDevice[], pluginArgs: IPluginArgs) {
    await this.requireSdkRoot();
    const availableDevices: IDevice[] = [];
    const connectedDevices = await this.getConnectedDevices(pluginArgs);
    //log.debug(`fetchAndroidDevices: ${JSON.stringify(connectedDevices)}`);

    for (const [adbInstance, devices] of connectedDevices) {
      for await (const device of devices) {
        await removeAllPortForwarding(adbInstance, device.udid);
      }
    }
    for (const [adbInstance, devices] of connectedDevices) {
      log.debug(
        `fetchAndroidDevices from host: ${adbInstance.adbHost}. Found ${devices.length} android devices`,
      );
      for await (const device of devices) {
        // log.info(`Checking device ${device.udid}`);
        device.adbRemoteHost =
          adbInstance.adbRemoteHost === null
            ? this.pluginArgs.bindHostOrIp
            : adbInstance.adbRemoteHost;
        if (
          !availableDevices.find(
            (existingDevice: IDevice) =>
              existingDevice.udid === device.udid &&
              existingDevice.adbRemoteHost === device.adbRemoteHost,
          )
        ) {
          const existingDevice = existingDeviceDetails.find(
            (dev) => dev.udid === device.udid && dev.host.includes(this.pluginArgs.bindHostOrIp),
          );
          if (existingDevice) {
            log.info(`Android Device details for ${device.udid} already available`);
            availableDevices.push({
              ...existingDevice,
              busy: false,
            });
          } else {
            log.info(`Android Device details for ${device.udid} not available. So querying now.`);
            // device may have changed the status since the last time we queried
            // we want to avoid device with offline or unauthorized status
            if (device.state === 'device') {
              const deviceInfo = await this.deviceInfo(
                device,
                adbInstance,
                this.pluginArgs,
                this.hostPort,
              );
              if (!deviceInfo) {
                log.info(`Cannot get device info for ${device.udid}. Skipping`);
              } else {
                availableDevices.push(deviceInfo);
              }
            } else {
              log.info(`Device ${device.udid} is not in "device" state. So, ignoring.`);
            }
          }
        } else {
          // log.info(`Device ${device.udid} is already in list. So, ignoring.`);
          // log.debug(`Current list of devices: ${JSON.stringify(availableDevices)}`);
        }
      }
    }

    return availableDevices;
  }

  private async deviceInfo(
    device: { udid: string; state: string },
    adbInstance: any,
    pluginArgs: IPluginArgs,
    hostPort: number,
  ): Promise<IDevice | undefined> {
    const systemPort = await getFreePort();
    const totalUtilizationTimeMilliSec = await getUtilizationTime(device.udid);
    let deviceInfo;
    await streamAndroid(adbInstance, device, systemPort);

    try {
      deviceInfo = await Promise.all([
        this.getDeviceVersion(adbInstance, device.udid),
        this.isRealDevice(adbInstance, device.udid),
        this.getDeviceName(adbInstance, device.udid),
        this.getChromeVersion(adbInstance, device.udid, pluginArgs),
      ]);
    } catch (error) {
      log.info(`Error while getting device info for ${device.udid}. Error: ${error}`);
      return undefined;
    }

    const [sdk, realDevice, name, chromeDriverPath] = deviceInfo;

    // if cliArgs contains skipChromeDownload, then chromeDriverPath will be undefined
    if (!pluginArgs.skipChromeDownload && chromeDriverPath === undefined) {
      log.info(`Cannot get chromeDriverPath for ${device.udid}. Skipping`);
      return undefined;
    }

    // Except for chromeDriverPath, all other info is mandatory
    if (_.isNil(sdk) || _.isNil(realDevice) || _.isNil(name)) {
      log.info(`Cannot get device info for ${device.udid}. Skipping`);
      return undefined;
    }

    let host;
    if (adbInstance.adbHost != null) {
      host = `http://${adbInstance.adbHost}:${adbInstance.adbPort}`;
    } else if (pluginArgs.remoteMachineProxyIP !== undefined) {
      host = `${pluginArgs.remoteMachineProxyIP}`;
    } else {
      host = `http://${pluginArgs.bindHostOrIp}:${hostPort}`;
    }
    return {
      adbRemoteHost: adbInstance.adbHost,
      adbPort: adbInstance.adbPort,
      systemPort,
      sdk: sdk ?? 'unknown',
      realDevice,
      name: name ?? 'unknown',
      busy: false,
      state: device.state,
      udid: device.udid,
      platform: 'android',
      deviceType: realDevice ? 'real' : 'emulator',
      host,
      totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
      sessionStartTime: 0,
      chromeDriverPath,
      userBlocked: false,
    };
  }

  private async getAdb(): Promise<any> {
    try {
      if (!this.adb) {
        this.adb = await ADB.createADB({});
        const client = Adb.createClient();
        this.tracker = await client.trackDevices();
        const originalADBTracking = this.createLocalAdbTracker(this.tracker, this.adb);
        await originalADBTracking();
      }
    } catch (e) {
      this.adbAvailable = false;
    }
    return { adbInstance: this.adb, adbTracker: this.tracker };
  }

  async waitBootComplete(originalADB: any, udid: string): Promise<boolean | undefined> {
    return await asyncWait(
      async () => {
        try {
          const bootStatus = (await this.getDeviceProperty(
            originalADB,
            udid,
            'init.svc.bootanim',
          )) as any;
          if (!_.isNil(bootStatus) && !_.isEmpty(bootStatus) && bootStatus == 'stopped') {
            console.log('Boot Completed!', udid);
            return true;
          }
        } catch (err) {
          return false;
        }
      },
      {
        intervalBetweenAttempts: 2000,
        timeout: 60 * 1000,
      },
    );
  }

  public async getConnectedDevices(pluginArgs: IPluginArgs) {
    const deviceList = new Map();
    const { adbInstance: originalADB } = await this.getAdb();
    deviceList.set(originalADB, await originalADB.getConnectedDevices());
    const adbRemote = pluginArgs.adbRemote;
    if (adbRemote !== undefined && adbRemote.length > 0) {
      await asyncForEach(adbRemote, async (value: any) => {
        const adbRemoteValue = value.split(':');
        const adbHost = adbRemoteValue[0];
        const adbPort = adbRemoteValue[1] || 5037;
        const cloneAdb = originalADB.clone({
          remoteAdbHost: adbHost,
          adbPort,
        });
        deviceList.set(cloneAdb, await cloneAdb.getConnectedDevices());
        const remoteAdb = Adb.createClient({
          host: adbHost,
          port: adbPort,
        });
        const remoteAdbTracking = await this.createRemoteAdbTracker(
          remoteAdb,
          originalADB,
          adbRemoteValue,
        );
        await remoteAdbTracking();
      });
    }
    return deviceList;
  }

  public async onDeviceAdded(originalADB: any, device: DeviceWithPath) {
    const newDevice = { udid: device.id, state: device.type };
    log.info(`Device ${newDevice.udid} was plugged. Detail: ${JSON.stringify(newDevice)}`);
    if (newDevice.state != 'offline') {
      log.info(`Device ${newDevice.udid} was plugged`);
      this.initiateAbortControl(newDevice.udid);
      let bootCompleted = false;
      try {
        await this.waitBootComplete(originalADB, newDevice.udid);
        bootCompleted = true;
      } catch (error) {
        log.info(`Device ${newDevice.udid} boot did not complete. Error: ${error}`);
      }

      if (!bootCompleted) {
        log.info(`Device ${newDevice.udid} boot did not complete in time. Ignoring`);
        return;
      }

      this.cancelAbort(newDevice.udid);
      const trackedDevice = await this.deviceInfo(
        newDevice,
        originalADB,
        this.pluginArgs,
        this.hostPort,
      );

      if (!trackedDevice) {
        log.info(`Cannot get device info for ${newDevice.udid}. Skipping`);
        return;
      }

      log.info(`Adding device ${newDevice.udid} to list!`);
      const deviceTracked = {
        ...trackedDevice,
        nodeId: this.nodeId,
      };
      if (this.pluginArgs.hub != undefined) {
        log.info(`Updating Hub with device ${newDevice.udid}`);
        const nodeDevices = new NodeDevices(this.pluginArgs.hub);
        await nodeDevices.postDevicesToHub([deviceTracked], 'add');
      }

      // node also need a copy of devices, otherwise it cannot serve requests
      await addNewDevice([deviceTracked], this.pluginArgs.bindHostOrIp);
    }
  }

  public createLocalAdbTracker(tracker: Tracker, originalADB: any) {
    const pluginArgs = this.pluginArgs;
    const adbTracker = async () => {
      try {
        tracker.on('add', async (device: DeviceWithPath) => {
          await this.onDeviceAdded(originalADB, device);
        });
        tracker.on('remove', async (device: DeviceWithPath) => {
          await this.onDeviceRemoved(device, pluginArgs);
        });
        tracker.on('change', async (device: DeviceWithPath) => {
          if (device.type === 'offline' || device.type === 'unauthorized') {
            await this.onDeviceRemoved(device, pluginArgs);
          } else {
            await this.onDeviceAdded(originalADB, device);
          }
        });
        tracker.on('end', () => {
          log.info('Tracking stopped');
        });
      } catch (err: any) {
        log.error('Something went wrong:', err.stack);
      }
    };

    return adbTracker;
  }

  private async onDeviceRemoved(device: DeviceWithPath, pluginArgs: IPluginArgs) {
    const clonedDevice: DeviceUpdate = {
      udid: device['id'],
      host: pluginArgs.bindHostOrIp,
      state: device.type,
    };
    if (pluginArgs.hub != undefined) {
      const nodeDevices = new NodeDevices(pluginArgs.hub);
      await nodeDevices.postDevicesToHub([clonedDevice], 'remove');
    }

    // node also need a copy of devices, otherwise it cannot serve requests
    await removeDevice([clonedDevice]);
    this.abort(clonedDevice.udid);
  }

  /**
   * Return and cache a tracker for remote adb. If tracker already exists for the given id, return the existing one.
   * @param adbClient
   * @param originalADB
   * @param id
   * @returns
   */
  private async createRemoteAdbTracker(adbClient: Client, originalADB: Client, id: string) {
    let remoteTracker: Tracker;
    // get tracker from remoteTracker list if already exists
    const existingTracker = this.remoteTrackers.find((tracker) => tracker.id === id);
    if (!existingTracker) {
      const newTracker = await adbClient.trackDevices();
      this.remoteTrackers.push({ id, tracker: newTracker });
      remoteTracker = newTracker;
    } else {
      remoteTracker = existingTracker.tracker;
    }
    const pluginArgs = this.pluginArgs;
    const adbTracking = async () => {
      try {
        remoteTracker.on('add', async (device: DeviceWithPath) => {
          await this.onDeviceAdded(originalADB, device);
        });
        remoteTracker.on('remove', async (device: DeviceWithPath) => {
          await this.onDeviceRemoved(device, pluginArgs);
        });
        remoteTracker.on('change', async (device: DeviceWithPath) => {
          if (device.type === 'offline' || device.type === 'unauthorized') {
            log.info(`Device ${device.id} is ${device.type}. Removing from list`);
            await this.onDeviceRemoved(device, pluginArgs);
          } else {
            await this.onDeviceAdded(originalADB, device);
          }
        });
        remoteTracker.on('end', () => console.log('Tracking stopped'));
      } catch (err: any) {
        console.error('Something went wrong:', err.stack);
      }
    };

    return adbTracking;
  }

  public async getChromeVersion(adbInstance: any, udid: string, pluginArgs: IPluginArgs) {
    if (pluginArgs.skipChromeDownload) {
      log.warn('skipChromeDownload server arg is set; skipping Chromedriver installation.');
      log.warn('Android web/hybrid testing will not be possible without Chromedriver.');
      return;
    }
    log.debug('Getting package info for chrome');
    const chromeDriverManager = Container.get(ChromeDriverManager);
    let versionName = '';
    try {
      const stdout = await (
        await adbInstance
      ).adbExec(['-s', udid, 'shell', 'dumpsys', 'package', 'com.android.chrome']);
      const versionNameMatch = new RegExp(/versionName=([\d+.]+)/).exec(stdout);
      if (versionNameMatch) {
        versionName = versionNameMatch[1];
        versionName = versionName.split('.')[0];
        return await chromeDriverManager.downloadChromeDriver(versionName);
      }
    } catch (err: any) {
      log.warn(`Error '${err.message}' while dumping package info`);
    }
  }

  public async downloadChromeDriver(version: any) {
    const instance = await ChromeDriverManager.getInstance();
    return await instance.downloadChromeDriver(version);
  }

  private async getDeviceVersion(adbInstance: any, udid: string): Promise<string | undefined> {
    return await this.getDeviceProperty(adbInstance, udid, 'ro.build.version.release');
  }

  private async getDeviceProperty(
    adbInstance: any,
    udid: string,
    prop: string,
  ): Promise<string | undefined> {
    try {
      return await (await adbInstance).adbExec(['-s', udid, 'shell', 'getprop', prop]);
    } catch (error) {
      log.error(`Error while getting device property "${prop}" for ${udid}. Error: ${error}`);
    }
  }

  private async isRealDevice(adbInstance: any, udid: string): Promise<boolean> {
    const character = await this.getDeviceProperty(adbInstance, udid, 'ro.build.characteristics');
    return character !== 'emulator';
  }

  private async requireSdkRoot() {
    const sdkRoot = getSdkRootFromEnv();
    const docMsg =
      'Read https://developer.android.com/studio/command-line/variables for more details';

    if (_.isEmpty(sdkRoot)) {
      throw new Error(
        `Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported. ${docMsg}`,
      );
    }

    if (!(await fs.exists(sdkRoot!))) {
      throw new Error(
        `The Android SDK root folder '${sdkRoot}' does not exist on the local file system. ${docMsg}`,
      );
    }
    const stats = await fs.stat(sdkRoot!);
    if (!stats.isDirectory()) {
      throw new Error(`The Android SDK root '${sdkRoot}' must be a folder. ${docMsg}`);
    }
    return sdkRoot;
  }

  private getDeviceName = async (adbInstance: any, udid: string): Promise<string | undefined> => {
    let deviceName = await this.getDeviceProperty(await adbInstance, udid, 'ro.product.name');

    if (!deviceName || (deviceName && deviceName.trim() === '')) {
      // If the device name is null or empty, try to get it from the Bluetooth manager.
      deviceName = await (
        await adbInstance
      ).adbExec([
        '-s',
        udid,
        'shell',
        'dumpsys',
        'bluetooth_manager',
        '|',
        'grep',
        'name:',
        '|',
        'cut',
        '-c9-',
      ]);
    }
    return deviceName;
  };
}
