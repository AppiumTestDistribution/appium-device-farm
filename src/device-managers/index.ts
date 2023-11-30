import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { DeviceTypeToInclude, IPluginArgs } from '../interfaces/IPluginArgs';
import { Platform } from '../types/Platform';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';

export class DeviceFarmManager {
  private deviceManagers: IDeviceManager[] = [];
  private deviceTypes: { androidDeviceType: DeviceTypeToInclude; iosDeviceType: DeviceTypeToInclude };
  private cliArgs: any;

  constructor({
    platform,
    deviceTypes,
    cliArgs,
    pluginArgs
  }: {
    platform: Platform | 'both';
    deviceTypes: { androidDeviceType: DeviceTypeToInclude; iosDeviceType: DeviceTypeToInclude };
    cliArgs: any;
    pluginArgs: IPluginArgs;
  }) {
    this.deviceTypes = deviceTypes;
    this.cliArgs = cliArgs;
    if (platform.toLowerCase() === 'both') {
      this.deviceManagers.push(new AndroidDeviceManager(pluginArgs, cliArgs.port));
      this.deviceManagers.push(new IOSDeviceManager(pluginArgs, cliArgs.port));
    } else if (platform.toLowerCase() === 'android') {
      this.deviceManagers.push(new AndroidDeviceManager(pluginArgs, cliArgs.port));
    } else if (platform.toLowerCase() === 'ios') {
      this.deviceManagers.push(new IOSDeviceManager(pluginArgs, cliArgs.port));
    }
  }

  public async getDevices(existingDeviceDetails?: Array<IDevice>): Promise<IDevice[]> {
    const devices: IDevice[] = [];
    for (const deviceManager of this.deviceManagers) {
      devices.push(
        ...(await deviceManager.getDevices(
          this.deviceTypes,
          existingDeviceDetails || [],
          this.cliArgs,
        )),
      );
    }
    return devices;
  }

  public getMaxSessionCount(): number {
    return this.cliArgs.plugin['device-farm'].maxSessions;
  }

  public async deviceInstances() {
    return this.deviceManagers;
  }
}
