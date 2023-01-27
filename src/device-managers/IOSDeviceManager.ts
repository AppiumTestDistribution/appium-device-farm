import Simctl from 'node-simctl';
import { flatten, isObject, isEmpty } from 'lodash';
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
import { getUtilizationTime } from '../device-utils';
import fs from 'fs-extra';
import logger from '../logger';

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

  private getDevicePlatformName(name: string) {
    return (name.toLowerCase().includes("tv") ? "tvos" : "ios");
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

  private derivedDataPath(cliArgs: any, udid: string, realDevice: boolean) {
    const derivedDataPath = cliArgs.plugin['device-farm'].derivedDataPath;

    function derivedPathExtracted(tmpPath: string, derivedDataPath: any) {
      if (derivedDataPath !== undefined) {
        fs.copySync(derivedDataPath, tmpPath);
      } else {
        if (!fs.existsSync(tmpPath)) {
          logger.info(`DerivedDataPath for UDID ${udid} not set, so falling back to ${tmpPath}`);
          logger.info(
            `WDA will be build once and will use WDA Runner from path ${tmpPath}, second test run will skip the build process`
          );
          fs.mkdirSync(tmpPath, { recursive: true });
        }
      }
    }

    if (derivedDataPath) {
      if (typeof derivedDataPath !== 'object')
        throw new Error('DerivedData Path should be able Object');
      const tmpPath = path.join(
        os.homedir(),
        `Library/Developer/Xcode/DerivedData/WebDriverAgent-${udid}`
      );
      if (realDevice) {
        derivedPathExtracted(tmpPath, derivedDataPath.device);
      } else {
        derivedPathExtracted(tmpPath, derivedDataPath.simulator);
      }
      return tmpPath;
    } else {
      return path.join(os.homedir(), `Library/Developer/Xcode/DerivedData/WebDriverAgent-${udid}`);
    }
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
        const totalUtilizationTimeMilliSec = await getUtilizationTime(udid);
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
            platform: this.getDevicePlatformName(name),
            host: `http://127.0.0.1:${cliArgs.port}`,
            totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
            sessionStartTime: 0,
            derivedDataPath: this.derivedDataPath(cliArgs, udid, true),
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
    const flattenValued: Array<IDevice> = await this.getLocalSims();
    let filteredSimulators: Array<IDevice> = [];
    const hasUserGivenSimulators = Object.hasOwn(cliArgs.plugin['device-farm'], 'simulators');
    if (hasUserGivenSimulators) {
      filteredSimulators = flattenValued.filter((device) =>
        cliArgs.plugin['device-farm'].simulators.some(
          (simulator: IDevice) => device.name === simulator.name && device.sdk === simulator.sdk
        )
      );
    }
    const buildSimulators = !isEmpty(filteredSimulators) ? filteredSimulators : flattenValued;
    await asyncForEach(buildSimulators, async (device: IDevice) => {
      const wdaLocalPort = await getFreePort();
      const mjpegServerPort = await getFreePort();
      const totalUtilizationTimeMilliSec = await getUtilizationTime(device.udid);
      simulators.push(
        Object.assign({
          ...device,
          wdaLocalPort,
          mjpegServerPort,
          busy: false,
          realDevice: false,
          platform: this.getDevicePlatformName(device.name),
          deviceType: 'simulator',
          host: `http://127.0.0.1:${cliArgs.port}`,
          totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
          sessionStartTime: 0,
          derivedDataPath: this.derivedDataPath(cliArgs, device.udid, false),
        })
      );
    });
  }

  private async getLocalSims() {
    const iosSimulators = flatten(
      Object.values((await new Simctl().getDevicesByParsing('iOS')) as Array<IDevice>)
    );
    const tvosSimulators = flatten(
      Object.values((await new Simctl().getDevicesByParsing('tvOS')) as Array<IDevice>)
    );
    return [...iosSimulators, ...tvosSimulators]
  }
}
