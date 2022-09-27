import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort } from '../helpers';
import { ADB, getSdkRootFromEnv } from 'appium-adb';
import log from '../logger';
import _, { isObject } from 'lodash';
import { fs } from '@appium/support';
import { DeviceFactory } from './factory/DeviceFactory';
export default class AndroidDeviceManager implements IDeviceManager {
  private adb: any;
  private adbAvailable = true;

  async getDevices(
    deviceTypes: string,
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<any> {
    if (!this.adbAvailable) {
      return [];
    }
    const deviceState: Array<IDevice> = [];
    const hosts = cliArgs.plugin['device-farm'].remote;
    try {
      for (const host of hosts) {
        if (!isObject(host) && host.includes('127.0.0.1')) {
          return await this.fetchLocalAndroidDevices(deviceState, existingDeviceDetails, cliArgs);
        } else {
          return await this.fetchRemoteAndroidDevices(host, deviceState, 'android');
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async fetchRemoteAndroidDevices(host: any, deviceState: IDevice[], platform: string) {
    const devices = DeviceFactory.deviceInstance(host, deviceState, platform);
    return devices?.getDevices();
  }

  private async fetchLocalAndroidDevices(
    deviceState: IDevice[],
    existingDeviceDetails: IDevice[],
    cliArgs: any
  ) {
    await this.requireSdkRoot();
    const connectedDevices = await this.getConnectedDevices();
    await asyncForEach(connectedDevices, async (device: IDevice) => {
      if (!deviceState.find((devicestate) => devicestate.udid === device.udid)) {
        const existingDevice = existingDeviceDetails.find(
          (dev) => dev.udid === device.udid && dev.host.includes('127.0.0.1')
        );
        if (existingDevice) {
          log.info(`Android Device details for ${device.udid} already available`);
          deviceState.push({
            ...existingDevice,
            busy: false,
          });
        } else {
          log.info(`Android Device details for ${device.udid} not available. So querying now.`);
          const systemPort = await getFreePort();
          const [sdk, realDevice, name] = await Promise.all([
            this.getDeviceVersion(device.udid),
            this.isRealDevice(device.udid),
            this.getDeviceName(device.udid),
          ]);

          deviceState.push({
            systemPort,
            sdk,
            realDevice,
            name,
            busy: false,
            state: device.state,
            udid: device.udid,
            platform: 'android',
            deviceType: realDevice ? 'real' : 'emulator',
            host: `http://127.0.0.1:${cliArgs.port}`,
          });
        }
      }
    });
    return deviceState;
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

  public async getConnectedDevices() {
    return await (await this.getAdb()).getConnectedDevices();
  }

  private async getDeviceVersion(udid: string) {
    return await this.getDeviceProperty(udid, 'ro.build.version.release');
  }

  private async getDeviceProperty(udid: string, prop: string) {
    return await (await this.getAdb()).adbExec(['-s', udid, 'shell', 'getprop', prop]);
  }

  private async isRealDevice(udid: string): Promise<boolean> {
    const character = await this.getDeviceProperty(udid, 'ro.build.characteristics');
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

  private getDeviceName = async (udid: string) =>
    await this.getDeviceProperty(udid, 'ro.product.name');
}
