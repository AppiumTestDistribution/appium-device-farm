import Simctl from 'node-simctl';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { flatten, isEmpty } = require('lodash');
import { utilities as IOSUtils } from 'appium-ios-device';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach, getFreePort } from '../helpers';
import log from '../logger';
import os from 'os';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');
import Devices from './cloud/Devices';
import NodeDevices from './NodeDevices';
import { IosTracker } from './iOSTracker';
import { addNewDevice, generateDeviceId, removeDevice } from '../data-service/device-service';
import { DeviceTypeToInclude, IDerivedDataPath, IPluginArgs } from '../interfaces/IPluginArgs';
import { getDeviceInfo } from 'appium-ios-device/build/lib/utilities';
import { IOSDeviceInfoMap } from './IOSDeviceType';
import { exec } from 'child_process';
import semver from 'semver';

export default class IOSDeviceManager implements IDeviceManager {
  constructor(
    private pluginArgs: IPluginArgs,
    private hostPort: number,
    private nodeId: string,
  ) {}
  /**
   * Method to get all ios devices and simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  async getDevices(
    deviceTypes: { iosDeviceType: DeviceTypeToInclude },
    existingDeviceDetails: Array<IDevice>,
  ): Promise<IDevice[]> {
    if (this.pluginArgs.cloud != undefined) {
      const devices: IDevice[] = [];
      const cloud = new Devices(this.pluginArgs.cloud, devices, 'ios');
      return await cloud.getDevices();
    } else {
      if (deviceTypes.iosDeviceType === 'real') {
        return flatten(
          await Promise.all([
            this.getRealDevices(existingDeviceDetails, this.pluginArgs, this.hostPort),
          ]),
        );
      } else if (deviceTypes.iosDeviceType === 'simulated') {
        const simulators = flatten(await Promise.all([this.getSimulators()]));
        log.debug(`Simulators: ${JSON.stringify(simulators)}`);
        return simulators;
      } else {
        // return both real and simulated devices
        log.debug('Getting both real and simulated devices');
        return flatten(
          await Promise.all([
            this.getRealDevices(existingDeviceDetails, this.pluginArgs, this.hostPort),
            this.getSimulators(),
          ]),
        );
      }
    }
  }

  async getConnectedDevices(): Promise<Array<string>> {
    try {
      const devices: string[] = await IOSUtils.getConnectedDevices();
      return devices;
    } catch (error) {
      log.error(error);
      return [];
    }
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
    pluginArgs: IPluginArgs,
    hostPort: number,
  ): Promise<Array<IDevice>> {
    let deviceState: Array<IDevice> = [];
    if (this.pluginArgs.cloud !== undefined) {
      const cloud = new Devices(this.pluginArgs.cloud, deviceState, 'ios');
      return await cloud.getDevices();
    } else {
      deviceState = await this.fetchLocalIOSDevices(existingDeviceDetails, pluginArgs, hostPort);
    }
    const returnDevices = deviceState.filter((device) => device.realDevice === true);
    return returnDevices;
  }

  private prepareDerivedDataPath(
    derivedDataPath: IDerivedDataPath | undefined,
    udid: string,
    realDevice: boolean,
  ): string {
    function derivedPathExtracted(tmpPath: string, theDerivedDataPath?: string) {
      if (theDerivedDataPath !== undefined) {
        fs.copySync(theDerivedDataPath, tmpPath);
      } else {
        if (!fs.existsSync(tmpPath)) {
          log.info(`DerivedDataPath for UDID ${udid} not set, so falling back to ${tmpPath}`);
          log.info(
            `WDA will be build once and will use WDA Runner from path ${tmpPath}, second test run will skip the build process`,
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
        `Library/Developer/Xcode/DerivedData/WebDriverAgent-${udid}`,
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
    pluginArgs: IPluginArgs,
    hostPort: number,
  ): Promise<IDevice[]> {
    const devices = await this.getConnectedDevices();
    const deviceState: IDevice[] = [];
    await asyncForEach(devices, async (udid: string) => {
      const existingDevice = existingDeviceDetails.find((device) => device.udid === udid);
      if (existingDevice) {
        log.info(`IOS Device details for ${udid} already available`);
        deviceState.push({
          ...existingDevice,
          busy: false,
          userBlocked: false,
        });
      } else {
        log.debug(`Getting device info for ${udid}`);
        const deviceInfo = await this.getDeviceInfo(udid, pluginArgs, hostPort);
        const goIOS = process.env.GO_IOS;
        if (goIOS && semver.satisfies(deviceInfo.sdk, '>=17.0.0')) {
          //Check for version above 17+ and presence for Go IOS
          try {
            log.info('Running go-ios agent');
            const startTunnel = `${goIOS} tunnel start --userspace --udid=${udid}`;
            exec(startTunnel, (error, stdout, stderr) => {
              console.log(`stdout: ${stdout}`);
              console.error(`stderr: ${stderr}`);
            });
          } catch (err) {
            log.error(err);
          }
        }
        deviceState.push(deviceInfo);
      }
    });
    // might as well track devices
    await this.trackIOSDevices(pluginArgs);

    return deviceState;
  }

  async trackIOSDevices(pluginArgs: IPluginArgs) {
    const iosTracker = IosTracker.getInstance();
    iosTracker.on('attached', async (udid: string) => {
      const deviceAttached = await this.getDeviceInfo(udid, pluginArgs, this.hostPort);
      const deviceTracked: IDevice = {
        ...deviceAttached,
        nodeId: this.nodeId,
      };
      if (pluginArgs.hub !== undefined) {
        log.info(`Updating Hub with iOS device ${udid}`);
        const nodeDevices = new NodeDevices(pluginArgs.hub);
        await nodeDevices.postDevicesToHub([deviceTracked], 'add');
      }
      // add device to local list
      log.info(`iOS device with udid ${udid} plugged! updating device list...`);
      await addNewDevice([deviceTracked], pluginArgs.bindHostOrIp);
    });
    iosTracker.on('detached', async (udid: string) => {
      const deviceRemoved: any = [{ udid, host: pluginArgs.bindHostOrIp }];
      if (pluginArgs.hub !== undefined) {
        log.info(`iOS device with udid ${udid} unplugged! updating hub device list...`);
        const nodeDevices = new NodeDevices(pluginArgs.hub);
        await nodeDevices.postDevicesToHub(deviceRemoved, 'remove');
      }

      // remove device from local list
      log.info(`iOS device with udid ${udid} unplugged! updating device list...`);
      await removeDevice(deviceRemoved);
    });
  }

  private async getDeviceInfo(
    udid: string,
    pluginArgs: IPluginArgs,
    hostPort: number,
  ): Promise<IDevice> {
    let host;
    if (pluginArgs.remoteMachineProxyIP) {
      host = pluginArgs.remoteMachineProxyIP;
    } else {
      host = `http://${pluginArgs.bindHostOrIp}:${hostPort}`;
    }
    const wdaLocalPort = await getFreePort();
    const mjpegServerPort = await getFreePort();
    const totalUtilizationTimeMilliSec = 0;
    const [sdk, name] = await Promise.all([this.getOSVersion(udid), this.getDeviceName(udid)]);
    const { ProductType } = await getDeviceInfo(udid);
    const modelInfo = this.findKeyByValue(ProductType) || { Width: '', Height: '' };
    return Object.assign({
      id: generateDeviceId({
        udid: udid,
        realDevice: true,
        nodeId: this.nodeId,
        platform: 'ios',
      } as any),
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
      wdaBundleId: '',
      productModel: ProductType,
      totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
      sessionStartTime: 0,
      width: modelInfo.Width,
      height: modelInfo.Height,
      tags: [],
      webDriverAgentHost: `http://${pluginArgs.bindHostOrIp}`,
      webDriverAgentUrl: `http://${pluginArgs.bindHostOrIp}:${wdaLocalPort}`,
    });
  }

  /**
   * Method to get all ios simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  public async getSimulators(): Promise<Array<IDevice>> {
    const simulators = await this.fetchLocalSimulators();
    simulators.sort((a, b) => (a.state > b.state ? 1 : -1));

    // should not be here, but we need to update the hub with simulators
    if (this.pluginArgs.hub !== undefined) {
      log.info('Updating Hub with Simulators');
      const nodeDevices = new NodeDevices(this.pluginArgs.hub);
      await nodeDevices.postDevicesToHub(simulators, 'add');
    }

    return simulators;
  }

  public async fetchLocalSimulators() {
    log.debug('Fetching local simulators');
    const returnedSimulators: IDevice[] = [];
    const { simctl, list } = await this.createSimctlInstance();
    const flattenValued = await this.getLocalSims(simctl, list);
    let filteredSimulators: Array<IDevice> = [];
    const localPluginArgs = this.pluginArgs;
    if (this.pluginArgs.simulators !== undefined) {
      filteredSimulators = flattenValued.filter((device: IDevice) =>
        localPluginArgs.simulators.some(
          (simulator: IDevice) => device.name === simulator.name && device.sdk === simulator.sdk,
        ),
      );
    }
    if (this.pluginArgs.bootedSimulators) {
      filteredSimulators = flattenValued.filter((device) => {
        return device.state === 'Booted';
      });
    }
    //log.debug(`Filtered Simulators: ${JSON.stringify(filteredSimulators)}`);

    const buildSimulators = !isEmpty(filteredSimulators) ? filteredSimulators : flattenValued;
    //log.debug(`Build Simulators: ${JSON.stringify(buildSimulators)}`);
    const deviceTypes = await list.devicetypes;
    for await (const device of buildSimulators) {
      const productModel = IOSDeviceManager.getProductModel(deviceTypes, device);
      const wdaLocalPort = await getFreePort();
      const mjpegServerPort = await getFreePort();
      const totalUtilizationTimeMilliSec = 0;
      const modelInfo = this.findKeyByValue(productModel) || { Width: '', Height: '' };
      returnedSimulators.push(
        Object.assign({
          ...device,
          id: generateDeviceId({
            udid: device.udid,
            realDevice: false,
            nodeId: this.nodeId,
            platform: 'ios',
          } as any),
          wdaLocalPort,
          mjpegServerPort,
          busy: false,
          realDevice: false,
          platform: this.getDevicePlatformName(device.name),
          deviceType: 'simulator',
          host: `http://${this.pluginArgs.bindHostOrIp}:${this.hostPort}`,
          totalUtilizationTimeMilliSec: totalUtilizationTimeMilliSec,
          sessionStartTime: 0,
          productModel,
          width: modelInfo.Width,
          height: modelInfo.Height,
          derivedDataPath: this.prepareDerivedDataPath(
            this.pluginArgs.derivedDataPath,
            device.udid,
            false,
          ),
          preBuildWDAPath: this.pluginArgs.preBuildWDAPath,
          tags: [],
          nodeId: this.nodeId,
        }),
      );
    }

    return returnedSimulators;
  }

  static getProductModel(deviceTypes: any, device: IDevice) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (device.platform === 'tvOS') {
      return undefined;
    } else {
      return deviceTypes.filter(
        (deviceType: any) => deviceType.identifier === device.deviceTypeIdentifier,
      )[0]?.modelIdentifier;
    }
  }

  findKeyByValue(model: string): any {
    if (model !== undefined) {
      for (const [key, value] of Object.entries(IOSDeviceInfoMap)) {
        if (model === key) {
          return value;
        }
      }
    }
  }

  private async getLocalSims(simctl: any, list: any): Promise<Array<IDevice>> {
    try {
      const runtimes = list.runtimes;
      const unAavailableRuntimes = runtimes
        .filter((runtime: any) => !runtime.isAvailable)
        .map((runtime: any) => runtime.name);
      if (unAavailableRuntimes.length > 0) {
        log.error(`The following runtimes are not available: ${unAavailableRuntimes.join(', ')}`);
      }

      const iOSSimulators = flatten(Object.values(await simctl.getDevices(null, 'iOS'))).length > 0;
      const tvSimulators = flatten(Object.values(await simctl.getDevices(null, 'tvOS'))).length > 0;

      log.debug(`iOS Simulators: ${iOSSimulators}`);
      log.debug(`tvOS Simulators: ${tvSimulators}`);

      let iosSimulators: any = [];
      let tvosSimulators: any = [];
      if (iOSSimulators) {
        iosSimulators = flatten(
          Object.values((await simctl.getDevices(null, 'iOS')) as Array<IDevice>),
        );
      } else {
        log.info('No iOS simulators found!');
      }

      if (tvSimulators) {
        tvosSimulators = flatten(
          Object.values((await simctl.getDevicesByParsing('tvOS')) as Array<IDevice>),
        );
      } else {
        log.info('No tvOS simulators found!');
      }
      return [...iosSimulators, ...tvosSimulators];
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  private async createSimctlInstance() {
    const simctl = new Simctl();
    // list runtimes and log availability errors
    const list = await simctl.list();
    return { simctl, list };
  }
}
