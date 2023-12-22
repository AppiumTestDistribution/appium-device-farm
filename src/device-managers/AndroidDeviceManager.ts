import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort } from '../helpers';
import { ADB, getSdkRootFromEnv } from 'appium-adb';
import log from '../logger';
import _ from 'lodash';
import { fs } from '@appium/support';
import ChromeDriverManager from './ChromeDriverManager';
import { Container } from 'typedi';
import { getUtilizationTime } from '../device-utils';
import Adb, { DeviceWithPath } from '@devicefarmer/adbkit';
import { AbortController } from 'node-abort-controller';
import asyncWait from 'async-wait-until';
import ip from 'ip';
import NodeDevices from './NodeDevices';
import { addNewDevice, removeDevice } from '../data-service/device-service';
import Devices from './cloud/Devices';
import { DeviceTypeToInclude, IPluginArgs } from '../interfaces/IPluginArgs';
import { IDevice } from '../interfaces/IDevice';
import { DeviceUpdate } from '../types/DeviceUpdate';
import { v4 as uuidv4 } from 'uuid';

export default class AndroidDeviceManager implements IDeviceManager {
  private adb: any;
  private adbAvailable = true;
  private abortControl: Map<string, AbortController> = new Map();

  constructor(
    private pluginArgs: IPluginArgs,
    private hostPort: number,
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
  ): Promise<any> {
    if (!this.adbAvailable) {
      return [];
    }
    const deviceState: Array<IDevice> = [];
    try {
      if (this.pluginArgs.cloud != undefined) {
        const cloud = new Devices(this.pluginArgs.cloud, deviceState, 'android');
        return await cloud.getDevices();
      } else {
        await this.fetchAndroidDevices(deviceState, existingDeviceDetails, this.pluginArgs);
      }
      if (deviceTypes.androidDeviceType === 'real') {
        return deviceState.filter((device) => {
          return device.deviceType === 'real';
        });
      } else if (deviceTypes.androidDeviceType === 'simulated') {
        return deviceState.filter((device) => {
          return device.deviceType === 'emulator';
        });
        // return both real and simulated (emulated) devices
      } else {
        return deviceState;
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async fetchAndroidDevices(
    deviceState: IDevice[],
    existingDeviceDetails: IDevice[],
    cliArgs: any,
  ) {
    await this.requireSdkRoot();
    const connectedDevices = await this.getConnectedDevices(cliArgs);
    for (const [adbInstance, devices] of connectedDevices) {
      await asyncForEach(devices, async (device: IDevice) => {
        device.adbRemoteHost =
          adbInstance.adbRemoteHost === null ? ip.address() : adbInstance.adbRemoteHost;
        if (
          !deviceState.find(
            (devicestate) =>
              devicestate.udid === device.udid &&
              devicestate.adbRemoteHost === device.adbRemoteHost,
          )
        ) {
          const existingDevice = existingDeviceDetails.find(
            (dev) => dev.udid === device.udid && dev.host.includes(ip.address()),
          );
          if (existingDevice) {
            log.info(`Android Device details for ${device.udid} already available`);
            deviceState.push({
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
                deviceState.push(deviceInfo);
              }
            } else {
              log.info(`Device ${device.udid} is not in "device" state. So, ignoring.`);
            }
          }
        }
      });
    }
    return deviceState;
  }

  private async deviceInfo(
    device: any,
    adbInstance: any,
    pluginArgs: IPluginArgs,
    hostPort: number,
  ): Promise<IDevice | undefined> {
    const systemPort = await getFreePort();
    const totalUtilizationTimeMilliSec = await getUtilizationTime(device.udid);
    let deviceInfo;

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
      host = `http://${ip.address()}:${hostPort}`;
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
      nodeId: pluginArgs.nodeId || uuidv4(),
    };
  }

  private async getAdb(): Promise<any> {
    try {
      if (!this.adb) {
        this.adb = await ADB.createADB({});
      }
    } catch (e) {
      this.adbAvailable = false;
    }
    return this.adb;
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
    const originalADB = await this.getAdb();
    deviceList.set(originalADB, await originalADB.getConnectedDevices());
    const client = Adb.createClient();
    const originalADBTracking = this.createLocalAdbTracker(client, originalADB);
    originalADBTracking();
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
        const remoteAdbTracking = this.createRemoteAdbTracker(remoteAdb, originalADB, adbHost);
        remoteAdbTracking();
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
      if (this.pluginArgs.hub != undefined) {
        log.info(`Updating Hub with device ${newDevice.udid}`);
        const nodeDevices = new NodeDevices(this.pluginArgs.hub);
        await nodeDevices.postDevicesToHub([trackedDevice], 'add');
      } else {
        addNewDevice([trackedDevice]);
      }
    }
  }

  public createLocalAdbTracker(adbClient: any, originalADB: any) {
    const pluginArgs = this.pluginArgs;
    const adbTracker = async () => {
      try {
        const tracker = await adbClient.trackDevices();
        tracker.on('add', async (device: DeviceWithPath) => {
          this.onDeviceAdded(originalADB, device);
        });
        tracker.on('remove', async (device: DeviceWithPath) => {
          await this.onDeviceRemoved(device, pluginArgs);
        });
        tracker.on('change', async (device: DeviceWithPath) => {
          if (device.type === 'offline' || device.type === 'unauthorized') {
            await this.onDeviceRemoved(device, pluginArgs);
          } else {
            this.onDeviceAdded(originalADB, device);
          }
        });
        tracker.on('end', () => log.info('Tracking stopped'));
      } catch (err: any) {
        log.error('Something went wrong:', err.stack);
      }
    };

    return adbTracker;
  }

  private async onDeviceRemoved(device: DeviceWithPath, pluginArgs: IPluginArgs) {
    const clonedDevice: DeviceUpdate = {
      udid: device['id'],
      host: ip.address(),
      state: device.type,
    };
    if (pluginArgs.hub != undefined) {
      const nodeDevices = new NodeDevices(pluginArgs.hub);
      await nodeDevices.postDevicesToHub([clonedDevice], 'remove');
    } else {
      removeDevice([clonedDevice]);
      this.abort(clonedDevice.udid);
    }
  }

  private createRemoteAdbTracker(adbClient: any, originalADB: any, adbHost: string) {
    const pluginArgs = this.pluginArgs;
    const adbTracking = async () => {
      try {
        const tracker = await adbClient.trackDevices();
        tracker.on('add', async (device: DeviceWithPath) => {
          this.onDeviceAdded(originalADB, device);
        });
        tracker.on('remove', async (device: DeviceWithPath) => {
          this.onDeviceRemoved(device, pluginArgs);
        });
        tracker.on('change', async (device: DeviceWithPath) => {
          if (device.type === 'offline' || device.type === 'unauthorized') {
            log.info(`Device ${device.id} is ${device.type}. Removing from list`);
            await this.onDeviceRemoved(device, pluginArgs);
          } else {
            this.onDeviceAdded(originalADB, device);
          }
        });
        tracker.on('end', () => console.log('Tracking stopped'));
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
