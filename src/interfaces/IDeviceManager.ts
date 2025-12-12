import { IDevice } from './IDevice';
import { DeviceTypeToInclude } from './IPluginArgs';

export interface IDeviceManager {
  getDevices(
    deviceTypes: { androidDeviceType: DeviceTypeToInclude; iosDeviceType: DeviceTypeToInclude },
    existingDeviceDetails: Array<IDevice>,
  ): Promise<IDevice[]>;

  uninstallApp?(device: IDevice, bundleId: string): Promise<void>;
}
