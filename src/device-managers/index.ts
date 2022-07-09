import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { Platform } from '../types/Platform';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';

export class DeviceFarmManager {
  private deviceManagers: Array<IDeviceManager> = [];
  private includeSimulators: Boolean;

  constructor({ platform, includeSimulators }: { platform: Platform | 'both', includeSimulators: Boolean | true }) {
    console.log('In Con', platform);
    this.includeSimulators = includeSimulators;
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
      devices.push(...(await deviceManager.getDevices(this.includeSimulators, existingDeviceDetails || [])));
    }
    return devices;
  }
}
