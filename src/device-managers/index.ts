import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { DeviceTypeToInclude, IPluginArgs } from '../interfaces/IPluginArgs';
import { Platform } from '../types/Platform';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';

export class DeviceFarmManager {
  private deviceManagers: IDeviceManager[] = [];
  private nodeId: string;

  constructor(
    platform: Platform | 'both',
    private deviceTypes: {
      androidDeviceType: DeviceTypeToInclude;
      iosDeviceType: DeviceTypeToInclude;
    },
    hostPort: number,
    private pluginArgs: IPluginArgs,
    nodeId: string,
  ) {
    this.deviceTypes = deviceTypes;
    this.nodeId = nodeId;
    if (platform.toLowerCase() === 'both') {
      this.deviceManagers.push(new AndroidDeviceManager(pluginArgs, hostPort, nodeId));
      this.deviceManagers.push(new IOSDeviceManager(pluginArgs, hostPort, nodeId));
    } else if (platform.toLowerCase() === 'android') {
      this.deviceManagers.push(new AndroidDeviceManager(pluginArgs, hostPort, nodeId));
    } else if (platform.toLowerCase() === 'ios') {
      this.deviceManagers.push(new IOSDeviceManager(pluginArgs, hostPort, nodeId));
    }
  }

  public async getDevices(existingDeviceDetails?: Array<IDevice>): Promise<IDevice[]> {
    const devices: IDevice[] = [];
    for (const deviceManager of this.deviceManagers) {
      devices.push(
        ...(await deviceManager.getDevices(this.deviceTypes, existingDeviceDetails || [])).map(
          (device) => {
            return {
              ...device,
              nodeId: !device.cloud ? this.nodeId : undefined,
            };
          },
        ),
      );
    }
    return devices;
  }

  public getMaxSessionCount(): number {
    return this.pluginArgs.maxSessions;
  }

  public async deviceInstances() {
    return this.deviceManagers;
  }
}
