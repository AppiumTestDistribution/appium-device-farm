import { IDevice } from './IDevice';
import { DeviceTypeToInclude, IPluginArgs } from './IPluginArgs';

export interface IDeviceManager {
  getDevices(
    deviceTypes: { androidDeviceType: DeviceTypeToInclude; iosDeviceType: DeviceTypeToInclude },
    existingDeviceDetails: Array<IDevice>
  ): Promise<IDevice[]>;
}
