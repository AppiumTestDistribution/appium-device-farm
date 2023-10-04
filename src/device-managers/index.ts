import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { Platform } from '../types/Platform';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';

export class DeviceFarmManager {
  private deviceManagers: Array<IDeviceManager> = [];
  private deviceTypes: { androidDeviceType: string; iosDeviceType: string };
  private cliArgs: any;
  private nodeId: string;

  constructor({
    platform,
    deviceTypes,
    cliArgs,
    nodeId,
  }: {
    platform: Platform | 'both';
    deviceTypes: { androidDeviceType: string; iosDeviceType: string };
    cliArgs: any;
    nodeId: string;
  }) {
    this.deviceTypes = deviceTypes;
    this.cliArgs = cliArgs;
    this.nodeId = nodeId;
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
        ...(
          await deviceManager.getDevices(
            this.deviceTypes,
            existingDeviceDetails || [],
            this.cliArgs
          )
        ).map((device) => {
          return {
            ...device,
            nodeId: !device.cloud ? this.nodeId : undefined,
          };
        })
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
