import { utilities as IOSUtils, services } from 'appium-ios-device';
import { getDeviceInfo } from 'appium-ios-device/build/lib/utilities';
import Simctl from 'node-simctl';
import os from 'os';
import path from 'path';
import { addNewDevice, generateDeviceId, removeDevice } from '../data-service/device-service';
import { startTunnel } from '../goIOSTracker';
import { asyncForEach, getFreePort } from '../helpers';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { DeviceTypeToInclude, IDerivedDataPath, IPluginArgs } from '../interfaces/IPluginArgs';
import log from '../logger';
import Devices from './cloud/Devices';
import { IOSDeviceInfoMap } from './IOSDeviceType';
import { IosTracker } from './iOSTracker';
import NodeDevices from './NodeDevices';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { flatten, isEmpty } = require('lodash');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs-extra');
interface IDeviceInfo {
  ProductType?: string;
  ProductName?: string;
  DeviceClass?: string;
  DeviceName?: string;
  [key: string]: any; // For other properties that might exist
}

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

  private getDevicePlatformName(
    name: string,
    productType?: string,
    width?: string,
    height?: string,
    deviceInfo?: IDeviceInfo,
  ) {
    const nameLower = name?.toLowerCase() || '';
    const productTypeLower = productType?.toLowerCase() || '';

    // First check ProductType for definitive identification (most reliable)
    if (productTypeLower.includes('appletv')) {
      return 'tvos';
    }

    if (
      productTypeLower.includes('iphone') ||
      productTypeLower.includes('ipad') ||
      productTypeLower.includes('ipod')
    ) {
      return 'ios';
    }

    // If ProductType is not definitive, check device name patterns
    // Check for iOS devices by name first (higher priority)
    if (nameLower.includes('iphone') || nameLower.includes('ipad') || nameLower.includes('ipod')) {
      return 'ios';
    }

    // Then check for Apple TV devices by name (more specific patterns)
    // Only consider it tvOS if it's clearly an Apple TV device
    if (
      nameLower.includes('apple tv') ||
      (nameLower.startsWith('tv') &&
        !nameLower.includes('iphone') &&
        !nameLower.includes('ipad') &&
        !nameLower.includes('ipod'))
    ) {
      return 'tvos';
    }

    // For unknown devices (like "Appium"), try to determine based on device characteristics
    // Use ideviceinfo data for more accurate detection
    if (deviceInfo) {
      const { ProductName, DeviceClass, DeviceName } = deviceInfo;

      // Check ProductName for Apple TV indicators
      if (ProductName && ProductName.toLowerCase().includes('apple tv')) {
        return 'tvos';
      }

      // Check DeviceClass for Apple TV indicators
      if (DeviceClass && DeviceClass.toLowerCase().includes('tv')) {
        return 'tvos';
      }

      // Check DeviceName for Apple TV indicators
      if (DeviceName && DeviceName.toLowerCase().includes('apple tv')) {
        return 'tvos';
      }
    }

    // Fallback to aspect ratio detection if ideviceinfo doesn't provide clear info
    if (width && height) {
      const widthNum = parseInt(width);
      const heightNum = parseInt(height);

      if (widthNum > 0 && heightNum > 0) {
        const aspectRatio = widthNum / heightNum;

        // Apple TV devices typically have 16:9 aspect ratio (1.78)
        // Common Apple TV resolutions: 1920x1080 (1.78), 3840x2160 (1.78)
        // iOS devices have different aspect ratios:
        // - iPhone: ~0.46 (portrait), ~2.17 (landscape)
        // - iPad: ~0.75 (portrait), ~1.33 (landscape)

        // 16:9 aspect ratio is exactly 1.777... (16/9)
        // Allow very small tolerance for rounding errors only
        if (aspectRatio >= 1.776 && aspectRatio <= 1.778) {
          // Very close to exact 16:9 aspect ratio suggests Apple TV
          return 'tvos';
        } else {
          // Any other aspect ratio suggests iOS device
          return 'ios';
        }
      }
    }

    // If we still can't determine, default to iOS for backward compatibility
    return 'ios';
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
    this.trackIOSDevices(pluginArgs);
    if (process.env.GO_IOS) {
      await startTunnel();
    }
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
        deviceState.push(deviceInfo);
      }
    });
    return deviceState;
  }

  trackIOSDevices(pluginArgs: IPluginArgs) {
    const iosTracker = IosTracker.getInstance();
    iosTracker.on('attached', async (udid: string) => {
      log.info(`Attached iOS device ${udid}`);
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
    log.info(`Getting device info for ${udid}`);
    let host;
    if (pluginArgs.remoteMachineProxyIP) {
      host = pluginArgs.remoteMachineProxyIP;
    } else {
      host = `http://${pluginArgs.bindHostOrIp}:${hostPort}`;
    }
    const wdaLocalPort = await getFreePort(pluginArgs.portRange);
    const mjpegServerPort = await getFreePort(pluginArgs.portRange);
    const totalUtilizationTimeMilliSec = 0;
    const [sdk, name] = await Promise.all([this.getOSVersion(udid), this.getDeviceName(udid)]);
    const deviceInfo = await getDeviceInfo(udid);
    const { ProductType } = deviceInfo;
    const modelInfo = this.findKeyByValue(ProductType) || { Width: '', Height: '' };
    const platform = this.getDevicePlatformName(
      name,
      ProductType,
      modelInfo.Width,
      modelInfo.Height,
      deviceInfo,
    );

    // Generate goIOSAgentPort if GO_IOS environment variable is set
    const goIOS = process.env.GO_IOS;
    const goIOSAgentPort = goIOS ? await getFreePort(pluginArgs.portRange) : undefined;

    return Object.assign({
      id: generateDeviceId({
        udid: udid,
        realDevice: true,
        nodeId: this.nodeId,
        platform: platform,
      } as any),
      wdaLocalPort,
      mjpegServerPort,
      udid,
      sdk,
      name,
      busy: false,
      realDevice: true,
      deviceType: 'real',
      platform: platform,
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
      ...(goIOSAgentPort && { goIOSAgentPort }),
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
      const wdaLocalPort = await getFreePort(this.pluginArgs.portRange);
      const mjpegServerPort = await getFreePort(this.pluginArgs.portRange);
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
          platform: this.getDevicePlatformName(
            device.name,
            productModel,
            modelInfo.Width,
            modelInfo.Height,
            undefined,
          ),
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

  public async uninstallApp(device: IDevice, bundleId: string) {
    try {
      if (device.realDevice) {
        log.info(`Uninstalling ${bundleId} from real device ${device.udid}`);
        const installationService = await services.startInstallationProxyService(device.udid);
        try {
          await installationService.uninstallApplication(bundleId);
        } catch (err) {
          log.warn(`Could not uninstall app ${bundleId} from ${device.udid}: ${err}`);
        } finally {
          installationService.close();
        }
      } else {
        log.info(`Uninstalling ${bundleId} from simulator ${device.udid}`);

        const { exec } = require('child_process');
        const util = require('util');
        const execAsync = util.promisify(exec);
        await execAsync(`xcrun simctl uninstall ${device.udid} ${bundleId}`);
      }
      log.info(`Uninstalled app ${bundleId} from device ${device.udid}`);
    } catch (err: any) {
      log.warn(`Failed to uninstall app ${bundleId} from device ${device.udid}. Error: ${err.message}`);
    }
  }
}