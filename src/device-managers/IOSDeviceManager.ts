import Simctl from 'node-simctl';
import { flatten, isObject } from 'lodash';
import { utilities as IOSUtils } from 'appium-ios-device';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { getFreePort, isMac } from '../helpers';
import { asyncForEach } from '../helpers';
import log from '../logger';
import axios from 'axios';
import { DeviceFactory } from './factory/DeviceFactory';
import os from 'os';
import path from 'path';

export default class IOSDeviceManager implements IDeviceManager {
  /**
   * Method to get all ios devices and simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  async getDevices(
    deviceTypes: string,
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<IDevice[]> {
    if (!isMac()) {
      return [];
    } else {
      if (deviceTypes === 'real') {
        return flatten(await Promise.all([this.getRealDevices(existingDeviceDetails, cliArgs)]));
      } else if (deviceTypes === 'simulated') {
        return flatten(await Promise.all([this.getSimulators(cliArgs)]));
        // return both real and simulated devices
      } else {
        return flatten(
          await Promise.all([
            this.getRealDevices(existingDeviceDetails, cliArgs),
            this.getSimulators(cliArgs),
          ])
        );
      }
    }
  }

  async getConnectedDevices() {
    return await IOSUtils.getConnectedDevices();
  }

  async getOSVersion(udid: string) {
    return await IOSUtils.getOSVersion(udid);
  }

  async getDeviceName(udid: string) {
    return await IOSUtils.getDeviceName(udid);
  }

  /**
   * Method to get all ios real devices
   *
   * @returns {Promise<Array<IDevice>>}
   */
  private async getRealDevices(
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<Array<IDevice>> {
    const deviceState: Array<IDevice> = [];
    const hosts = cliArgs.plugin['device-farm'].remote;
    for (const host of hosts) {
      if (!isObject(host) && host.includes('127.0.0.1')) {
        await this.fetchLocalIOSDevices(existingDeviceDetails, deviceState, cliArgs);
      } else {
        await this.fetchRemoteIOSDevices(host, deviceState, 'ios');
      }
    }
    return deviceState;
  }

  private async fetchRemoteIOSDevices(host: any, deviceState: IDevice[], platform: string) {
    const devices = DeviceFactory.deviceInstance(host, deviceState, platform);
    return devices?.getDevices();
  }

  private async fetchLocalIOSDevices(
    existingDeviceDetails: IDevice[],
    deviceState: IDevice[],
    cliArgs: any
  ) {
    const devices = await this.getConnectedDevices();
    await asyncForEach(devices, async (udid: string) => {
      const existingDevice = existingDeviceDetails.find((device) => device.udid === udid);
      if (existingDevice) {
        log.info(`IOS Device details for ${udid} already available`);
        deviceState.push({
          ...existingDevice,
          busy: false,
        });
      } else {
        log.info(`IOS Device details for ${udid} not available. So querying now.`);
        const wdaLocalPort = await getFreePort();
        const mjpegServerPort = await getFreePort();
        const [sdk, name] = await Promise.all([this.getOSVersion(udid), this.getDeviceName(udid)]);
        deviceState.push(
          Object.assign({
            wdaLocalPort,
            mjpegServerPort,
            udid,
            sdk,
            name,
            busy: false,
            realDevice: true,
            deviceType: 'real',
            platform: 'ios',
            totalUtilizationTimeMilliSec: 0,
            sessionStartTime: 0,
            host: `http://127.0.0.1:${cliArgs.port}`,
            derivedDataPath: path.join(os.homedir(), `Library/Developer/Xcode/DerivedData/WebDriverAgent-${udid}`)
          })
        );
      }
    });
  }

  /**
   * Method to get all ios simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  private async getSimulators(cliArgs: any): Promise<Array<IDevice>> {
    const hosts = cliArgs.plugin['device-farm'].remote;
    const simulators: Array<IDevice> = [];
    for (const host of hosts) {
      if (!isObject(host) && host.includes('127.0.0.1')) {
        await this.fetchLocalSimulators(simulators, cliArgs);
      } else {
        await this.fetchRemoteSimulators(host, simulators);
      }
    }
    simulators.sort((a, b) => (a.state > b.state ? 1 : -1));
    return simulators;
  }

  private async fetchRemoteSimulators(host: string, simulators: IDevice[]) {
    const remoteDevices = (await axios.get(`${host}/device-farm/api/devices/ios`)).data;
    remoteDevices.filter((device: any) => {
      if (device.deviceType === 'simulator') {
        delete device['meta'];
        delete device['$loki'];
        simulators.push(
          Object.assign({
            ...device,
            host: `${host}`,
          })
        );
      }
    });
  }

  public async fetchLocalSimulators(simulators: IDevice[], cliArgs: any) {
    const flattenValued: Array<IDevice> = flatten(
      Object.values((await new Simctl().getDevicesByParsing('iOS')) as Array<IDevice>)
    );
    await asyncForEach(flattenValued, async (device: IDevice) => {
      const wdaLocalPort = await getFreePort();
      const mjpegServerPort = await getFreePort();
      simulators.push(
        Object.assign({
          ...device,
          wdaLocalPort,
          mjpegServerPort,
          busy: false,
          realDevice: false,
          platform: 'ios',
          deviceType: 'simulator',
          totalUtilizationTimeMilliSec: 0,
          sessionStartTime: 0,
          host: `http://127.0.0.1:${cliArgs.port}`,
          derivedDataPath: path.join(os.homedir(), `Library/Developer/Xcode/DerivedData/WebDriverAgent-${device.udid}`)
        })
      );
    });
  }
}
