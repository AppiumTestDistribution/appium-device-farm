import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { Platform } from '../types/Platform';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';

export class DeviceFarmManager {
  private deviceManagers: Array<IDeviceManager> = [];
  private includeSimulators: boolean;
  private cliArgs: any;

  constructor({
    platform,
    includeSimulators,
    cliArgs,
  }: {
    platform: Platform | 'both';
    includeSimulators: boolean | true;
    cliArgs: any;
  }) {
    this.includeSimulators = includeSimulators;
    this.cliArgs = cliArgs;
    if (platform === 'both') {
      this.deviceManagers.push(new AndroidDeviceManager());
      this.deviceManagers.push(new IOSDeviceManager());
    } else if (platform === 'android') {
      this.deviceManagers.push(new AndroidDeviceManager());
    } else if (platform === 'ios') {
      this.deviceManagers.push(new IOSDeviceManager());
    }
  }

  public async getDevices(existingDeviceDetails?: Array<IDevice>): Promise<IDevice[]> {
    const devices: IDevice[] = [];
    for (const deviceManager of this.deviceManagers) {
      devices.push(
        ...(await deviceManager.getDevices(
          this.includeSimulators,
          existingDeviceDetails || [],
          this.cliArgs
        ))
      );
    }
    return devices;
  }
}
