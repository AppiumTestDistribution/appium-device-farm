import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort } from '../helpers';
import { ADB, getSdkRootFromEnv } from 'appium-adb';
import log from '../logger';
import _, { isObject } from 'lodash';
import { fs } from '@appium/support';
import { DeviceFactory } from './factory/DeviceFactory';
import ChromeDriverManager from './ChromeDriverManager';

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
          await this.fetchLocalAndroidDevices(deviceState, existingDeviceDetails, cliArgs);
        } else {
          await this.fetchRemoteAndroidDevices(host, deviceState, 'android');
        }
      }
      if (deviceTypes === 'real') {
        return deviceState.filter((device) => {
          return device.deviceType === 'real';
        });
      } else if (deviceTypes === 'simulated') {
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
    const chromeDriverManager =
      cliArgs.plugin['device-farm'].skipChromeDownload === false
        ? await ChromeDriverManager.getInstance()
        : undefined;
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
          const [sdk, realDevice, name, chromeDriverPath] = await Promise.all([
            this.getDeviceVersion(device.udid),
            this.isRealDevice(device.udid),
            this.getDeviceName(device.udid),
            this.getChromeVersion(device.udid, cliArgs, chromeDriverManager),
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
            totalUtilizationTimeMilliSec: 0,
            sessionStartTime: 0,
            chromeDriverPath,
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

  public async getChromeVersion(udid: string, cliArgs: any, chromeDriverManager: any) {
    if (cliArgs.plugin['device-farm'].skipChromeDownload) {
      log.warn(
        'APPIUM_SKIP_CHROMEDRIVER_INSTALL environment variable is set; skipping Chromedriver installation.'
      );
      log.warn('Android web/hybrid testing will not be possible without Chromedriver.');
      return;
    }
    log.debug('Getting package info for chrome');
    let versionName = '';
    try {
      const stdout = await (
        await this.getAdb()
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
