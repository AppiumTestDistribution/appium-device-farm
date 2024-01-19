import { getAllDevices } from '../data-service/device-service';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { DeviceTypeToInclude, IPluginArgs } from '../interfaces/IPluginArgs';
import log from '../logger';
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
      log.debug('Initializing device managers for both android and ios');
      this.deviceManagers.push(new AndroidDeviceManager(pluginArgs, hostPort, this.nodeId));
      this.deviceManagers.push(new IOSDeviceManager(pluginArgs, hostPort, this.nodeId));
    } else if (platform.toLowerCase() === 'android') {
      log.debug('Initializing device managers for android');
      this.deviceManagers.push(new AndroidDeviceManager(pluginArgs, hostPort, this.nodeId));
    } else if (platform.toLowerCase() === 'ios') {
      log.debug('Initializing device managers for ios');
      this.deviceManagers.push(new IOSDeviceManager(pluginArgs, hostPort, this.nodeId));
    }
  }

  /**
   * Update list of devices by merging new devices with existing devices data.
   * Busy state of existing devices will be preserved.
   * @param existingDeviceDetails 
   * @returns 
   */
  public async getDevices(): Promise<IDevice[]> {
    const  existingDeviceDetails = await getAllDevices();
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
