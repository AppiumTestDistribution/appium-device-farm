import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(
    deviceTypes: { androidDeviceType: string; iosDeviceType: string },
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any,
  ): Promise<IDevice[]>;
}
