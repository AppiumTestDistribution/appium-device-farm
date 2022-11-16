import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { Platform } from '../types/Platform';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';

export class DeviceFarmManager {
  private deviceManagers: Array<IDeviceManager> = [];
  private deviceTypes: string;
  private cliArgs: any;

  constructor({
    platform,
    deviceTypes,
    cliArgs,
  }: {
    platform: Platform | 'both';
    deviceTypes: string | 'both';
    cliArgs: any;
  }) {
    this.deviceTypes = deviceTypes.toLowerCase();
    this.cliArgs = cliArgs;
    if (platform.toLowerCase() === 'both') {
      this.deviceManagers.push(new AndroidDeviceManager());
      this.deviceManagers.push(new IOSDeviceManager());
    } else if (platform.toLowerCase() === 'android') {
      this.deviceManagers.push(new AndroidDeviceManager());
    } else if (platform.toLowerCase() === 'ios') {
      this.deviceManagers.push(new IOSDeviceManager());
    }
  }

  public async getDevices(existingDeviceDetails?: Array<IDevice>): Promise<IDevice[]> {
    const devices: IDevice[] = [];
    for (const deviceManager of this.deviceManagers) {
      devices.push(
        ...(await deviceManager.getDevices(
          this.deviceTypes,
          existingDeviceDetails || [],
          this.cliArgs
        ))
      );
    }
    return devices;
  }
}
