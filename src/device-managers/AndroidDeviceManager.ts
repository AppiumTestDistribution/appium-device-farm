import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort } from '../helpers';
import { ADB, getSdkRootFromEnv } from 'appium-adb';
import log from '../logger';
import _ from 'lodash';
import { fs } from '@appium/support';
import axios from 'axios';

export default class AndroidDeviceManager implements IDeviceManager {
  private adb: any;
  private adbAvailable = true;

  async getDevices(
    includeSimulators: boolean,
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<IDevice[]> {
    if (!this.adbAvailable) {
      return [];
    }
    const deviceState: Array<IDevice> = [];
    try {
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
      // eslint-disable-next-line no-prototype-builtins
      if (cliArgs?.plugin['device-farm']?.hasOwnProperty('remote')) {
        const host = cliArgs.plugin['device-farm'].remote[0];
        log.info('Fetching remote android devices');
        const remoteDevices = (await axios.get(`${host}/device-farm/api/devices/android`)).data;
        remoteDevices.filter((device: any) => {
          delete device['meta'];
          delete device['$loki'];
          deviceState.push(
            Object.assign({
              ...device,
              host: `${host}`,
            })
          );
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      if (includeSimulators === false) {
        const devices = deviceState.filter(function (d) {
          return d.realDevice === true;
        });
        // eslint-disable-next-line no-unsafe-finally
        return devices;
      }
      // eslint-disable-next-line no-unsafe-finally
      return deviceState;
    }
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
