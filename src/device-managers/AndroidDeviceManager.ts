import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort, isCloud, isHub } from '../helpers';
import { ADB, getSdkRootFromEnv } from 'appium-adb';
import log from '../logger';
import _ from 'lodash';
import { fs } from '@appium/support';
import ChromeDriverManager from './ChromeDriverManager';
import { Container } from 'typedi';
import { getUtilizationTime } from '../device-utils';
import Adb from '@devicefarmer/adbkit';
import { AbortController } from 'node-abort-controller';
import asyncWait from 'async-wait-until';
import logger from '../logger';
import ip from 'ip';
import NodeDevices from './NodeDevices';
import { addNewDevice, removeDevice } from '../data-service/device-service';
import Devices from './cloud/Devices';
import { DeviceModel } from '../data-service/db';

export default class AndroidDeviceManager implements IDeviceManager {
  private adb: any;
  private adbAvailable = true;
  private abortControl: Map<string, AbortController> = new Map();

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
    deviceTypes: { androidDeviceType: string },
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<any> {
    if (!this.adbAvailable) {
      return [];
    }
    const deviceState: Array<IDevice> = [];
    try {
      if (isCloud(cliArgs)) {
        const cloud = new Devices(cliArgs.plugin['device-farm'].cloud, deviceState, 'android');
        return await cloud.getDevices();
      } else {
        await this.fetchAndroidDevices(deviceState, existingDeviceDetails, cliArgs);
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
    cliArgs: any
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
              devicestate.udid === device.udid && devicestate.adbRemoteHost === device.adbRemoteHost
          )
        ) {
          const existingDevice = existingDeviceDetails.find(
            (dev) => dev.udid === device.udid && dev.host.includes(ip.address())
          );
          if (existingDevice) {
            log.info(`Android Device details for ${device.udid} already available`);
            deviceState.push({
              ...existingDevice,
              busy: false,
            });
          } else {
            log.info(`Android Device details for ${device.udid} not available. So querying now.`);
            const deviceInfo = await this.deviceInfo(device, adbInstance, cliArgs);
            deviceState.push(deviceInfo[0]);
          }
        }
      });
    }
    return deviceState;
  }

  private async deviceInfo(device: any, adbInstance: any, cliArgs: any) {
    const systemPort = await getFreePort();
    const totalUtilizationTimeMilliSec = await getUtilizationTime(device.udid);
    const [sdk, realDevice, name, chromeDriverPath] = await Promise.all([
      this.getDeviceVersion(adbInstance, device.udid),
      this.isRealDevice(adbInstance, device.udid),
      this.getDeviceName(adbInstance, device.udid),
      this.getChromeVersion(adbInstance, device.udid, cliArgs),
    ]);
    const host = adbInstance.adbHost != null ? adbInstance.adbHost : ip.address();
    return [
      {
        adbRemoteHost: adbInstance.adbHost,
        adbPort: adbInstance.adbPort,
        systemPort,
        sdk,
        realDevice,
        name,
        busy: false,
        state: device.state,
        udid: device.udid,
        platform: 'android',
        deviceType: realDevice ? 'real' : 'emulator',
        host: `http://${host}:${cliArgs.port}`,
        totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
        sessionStartTime: 0,
        chromeDriverPath,
      },
    ] as Array<IDevice>;
  }

  private async getAdb(): Promise<any> {
    try {
      if (!this.adb) {
        this.adb = await ADB.createADB();
      }
    } catch (e) {
      this.adbAvailable = false;
    }
    return this.adb;
  }

  async waitBootComplete(originalADB: any, udid: string) {
    return await asyncWait(
      async () => {
        try {
          const bootStatus = (await this.getDeviceProperty(
            originalADB,
            udid,
            'init.svc.bootanim'
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
      }
    );
  }

  public async getConnectedDevices(cliArgs: any) {
    const deviceList = new Map();
    const originalADB = await this.getAdb();
    deviceList.set(originalADB, await originalADB.getConnectedDevices());
    const client = Adb.createClient();
    const originalADBTracking = async () => {
      try {
        const tracker = await client.trackDevices();
        tracker.on('add', async (device: any) => {
          const clonedDevice = _.cloneDeep(device);
          Object.assign(clonedDevice, { udid: clonedDevice['id'], state: clonedDevice['type'] });
          if (device.state != 'offline') {
            logger.info(`Device ${clonedDevice.udid} was plugged`);
            this.initiateAbortControl(clonedDevice.udid);
            await this.waitBootComplete(originalADB, clonedDevice.udid);
            this.cancelAbort(clonedDevice.udid);
            const trackedDevice: Array<IDevice> = await this.deviceInfo(
              clonedDevice,
              originalADB,
              cliArgs
            );
            logger.info(`Adding device ${clonedDevice.udid} to list!`);
            const hubExists = isHub(cliArgs);
            if (hubExists) {
              logger.info(`Updating Hub with device ${clonedDevice.udid}`);
              const nodeDevices = new NodeDevices(cliArgs.plugin['device-farm'].hub);
              await nodeDevices.postDevicesToHub(trackedDevice, 'add');
            } else {
              addNewDevice(trackedDevice);
            }
          }
        });
        tracker.on('remove', async (device) => {
          const clonedDevice = _.cloneDeep(device);
          Object.assign(clonedDevice, { udid: clonedDevice['id'], host: ip.address() });
          const hubExists = isHub(cliArgs);
          if (hubExists) {
            logger.info(`Removing device from Hub with device ${clonedDevice.udid}`);
            const nodeDevices = new NodeDevices(cliArgs.plugin['device-farm'].hub);
            await nodeDevices.postDevicesToHub(clonedDevice, 'remove');
          } else {
            logger.warn(
              `Removing device ${clonedDevice.udid} from list as the device was unplugged!`
            );
            removeDevice(clonedDevice);
            this.abort(clonedDevice.udid);
          }
        });
        tracker.on('end', () => console.log('Tracking stopped'));
      } catch (err: any) {
        console.error('Something went wrong:', err.stack);
      }
    };
    originalADBTracking();
    const adbRemote = cliArgs.plugin['device-farm'].adbRemote;
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
        const remoteAdbTracking = async () => {
          try {
            const tracker = await remoteAdb.trackDevices();
            tracker.on('add', async (device: any) => {
              const clonedDevice = _.cloneDeep(device);
              Object.assign(clonedDevice, {
                udid: clonedDevice['id'],
                state: clonedDevice['type'],
              });
              if (device.state != 'offline') {
                logger.info(`Device ${clonedDevice.udid} was plugged in host ${adbHost}`);
                this.initiateAbortControl(clonedDevice.udid);
                await this.waitBootComplete(cloneAdb, clonedDevice.udid);
                this.cancelAbort(clonedDevice.udid);
                const trackedDevice: Array<IDevice> = await this.deviceInfo(
                  clonedDevice,
                  cloneAdb,
                  cliArgs
                );
                logger.info(`Adding device ${clonedDevice.udid} to list!`);
                addNewDevice(trackedDevice);
              }
            });
            tracker.on('remove', async (device) => {
              const clonedDevice = _.cloneDeep(device);
              Object.assign(clonedDevice, { udid: clonedDevice['id'], host: adbHost });
              logger.warn(
                `Removing device ${clonedDevice.udid} from ${adbHost} list as the device was unplugged!`
              );
              removeDevice(clonedDevice);
              this.abort(clonedDevice.udid);
            });
            tracker.on('end', () => console.log('Tracking stopped'));
          } catch (err: any) {
            console.error('Something went wrong:', err.stack);
          }
        };
        remoteAdbTracking();
      });
    }
    return deviceList;
  }

  public async getChromeVersion(adbInstance: any, udid: string, cliArgs: any) {
    if (cliArgs.plugin['device-farm'].skipChromeDownload) {
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

  private async getDeviceVersion(adbInstance: any, udid: string) {
    return await this.getDeviceProperty(adbInstance, udid, 'ro.build.version.release');
  }

  private async getDeviceProperty(adbInstance: any, udid: string, prop: string) {
    return await (await adbInstance).adbExec(['-s', udid, 'shell', 'getprop', prop]);
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
        `Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported. ${docMsg}`
      );
    }

    if (!(await fs.exists(sdkRoot))) {
      throw new Error(
        `The Android SDK root folder '${sdkRoot}' does not exist on the local file system. ${docMsg}`
      );
    }
    const stats = await fs.stat(sdkRoot);
    if (!stats.isDirectory()) {
      throw new Error(`The Android SDK root '${sdkRoot}' must be a folder. ${docMsg}`);
    }
    return sdkRoot;
  }

  private getDeviceName = async (adbInstance: any, udid: string) =>
    await (
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
