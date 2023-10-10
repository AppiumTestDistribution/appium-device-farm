import Simctl from 'node-simctl';
import { flatten, isEmpty } from 'lodash';
import { utilities as IOSUtils } from 'appium-ios-device';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { getFreePort, hasCloud, hasHub, isMac } from '../helpers';
import { asyncForEach } from '../helpers';
import log from '../logger';
import os from 'os';
import path from 'path';
import { getUtilizationTime } from '../device-utils';
import fs from 'fs-extra';
import logger from '../logger';
import Devices from './cloud/Devices';
import ip from 'ip';
import NodeDevices from './NodeDevices';
import { GoIosTracker } from './iOSTracker';
import { addNewDevice, removeDevice } from '../data-service/device-service';

export default class IOSDeviceManager implements IDeviceManager {
  /**
   * Method to get all ios devices and simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  async getDevices(
    deviceTypes: { iosDeviceType: string },
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<IDevice[]> {
    if (!isMac()) {
      return [];
    } else {
      if (deviceTypes.iosDeviceType === 'real') {
        return flatten(await Promise.all([this.getRealDevices(existingDeviceDetails, cliArgs)]));
      } else if (deviceTypes.iosDeviceType === 'simulated') {
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
    return name.toLowerCase().includes('tv') ? 'tvos' : 'ios';
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
    if (hasCloud(cliArgs)) {
      const cloud = new Devices(cliArgs.plugin['device-farm'].cloud, deviceState, 'ios');
      return await cloud.getDevices();
    } else {
      await this.fetchLocalIOSDevices(existingDeviceDetails, deviceState, cliArgs);
    }
    return deviceState;
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
        const deviceInfo = await this.getDeviceInfo(udid, cliArgs);
        deviceState.push(deviceInfo);
      }
    });
    const goIosTracker = new GoIosTracker();
    await goIosTracker.start();
    goIosTracker.on('device-connected', async (message) => {
      const deviceAttached = [await this.getDeviceInfo(message.id, cliArgs)];
      const hubExists = hasHub(cliArgs);
      if (hubExists) {
        logger.info(`Updating Hub with iOS device ${message.id}`);
        const nodeDevices = new NodeDevices(cliArgs.plugin['device-farm'].hub);
        await nodeDevices.postDevicesToHub(deviceAttached, 'add');
      } else {
        logger.info(`iOS device with udid ${message.id} plugged! updating device list...`);
        addNewDevice(deviceAttached);
      }
    });
    goIosTracker.on('device-removed', async (message) => {
      const deviceRemoved: any = { udid: message.id, host: ip.address() };
      const hubExists = hasHub(cliArgs);
      if (hubExists) {
        logger.info(`iOS device with udid ${message.id} unplugged! updating hub device list...`);
        const nodeDevices = new NodeDevices(cliArgs.plugin['device-farm'].hub);
        await nodeDevices.postDevicesToHub(deviceRemoved, 'remove');
      } else {
        logger.info(`iOS device with udid ${message.id} unplugged! updating device list...`);
        removeDevice(deviceRemoved);
      }
    });
  }

  private async getDeviceInfo(udid: string, cliArgs: any) {
    let host;
    if (Object.hasOwn(cliArgs.plugin['device-farm'], 'proxyIP')) {
      host = `${cliArgs.plugin['device-farm'].proxyIP}`;
    } else {
      host = `http://${ip.address()}:${cliArgs.port}`;
    }
    const wdaLocalPort = await getFreePort();
    const mjpegServerPort = await getFreePort();
    const totalUtilizationTimeMilliSec = await getUtilizationTime(udid);
    const [sdk, name] = await Promise.all([this.getOSVersion(udid), this.getDeviceName(udid)]);
    return Object.assign({
      wdaLocalPort,
      mjpegServerPort,
      udid,
      sdk,
      name,
      busy: false,
      realDevice: true,
      deviceType: 'real',
      platform: this.getDevicePlatformName(name),
      host,
      totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
      sessionStartTime: 0,
      derivedDataPath: this.derivedDataPath(cliArgs, udid, true),
    });
  }

  /**
   * Method to get all ios simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  public async getSimulators(cliArgs: any): Promise<Array<IDevice>> {
    const simulators: Array<IDevice> = [];
    const hubExists = hasHub(cliArgs);
    await this.fetchLocalSimulators(simulators, cliArgs);
    simulators.sort((a, b) => (a.state > b.state ? 1 : -1));
    if (hubExists) {
      logger.info('Updating Hub with Simulators');
      const nodeDevices = new NodeDevices(cliArgs.plugin['device-farm'].hub);
      await nodeDevices.postDevicesToHub(simulators, 'add');
    }
    return simulators;
  }

  public async fetchLocalSimulators(simulators: IDevice[], cliArgs: any) {
    const flattenValued: any = await this.getLocalSims();
    let filteredSimulators: Array<IDevice> = [];
    const hasUserGivenSimulators = Object.hasOwn(cliArgs.plugin['device-farm'], 'simulators');
    if (hasUserGivenSimulators) {
      filteredSimulators = flattenValued.filter((device: IDevice) =>
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
          host: `http://${ip.address()}:${cliArgs.port}`,
          totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
          sessionStartTime: 0,
          derivedDataPath: this.derivedDataPath(cliArgs, device.udid, false),
        })
      );
    });
  }

  private async getLocalSims() {
    try {
      const simctl = await new Simctl();
      const iOSSimulators = flatten(Object.values(await simctl.getDevices(null, 'iOS'))).length > 1;
      const tvSimulators = flatten(Object.values(await simctl.getDevices(null, 'tvOS'))).length > 1;

      let iosSimulators: any = [];
      let tvosSimulators: any = [];
      if (iOSSimulators) {
        iosSimulators = flatten(
          Object.values((await simctl.getDevicesByParsing('iOS')) as Array<IDevice>)
        );
      } else {
        console.log('No iOS simulators found!');
      }

      if (tvSimulators) {
        tvosSimulators = flatten(
          Object.values((await simctl.getDevicesByParsing('tvOS')) as Array<IDevice>)
        );
      } else {
        console.log('No tvOS simulators found!');
      }
      return [...iosSimulators, ...tvosSimulators];
    } catch (error) {
      console.error(error);
    }
  }
}
