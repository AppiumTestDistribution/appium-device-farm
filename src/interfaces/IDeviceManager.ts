import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(
    deviceTypes: string,
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<IDevice[]>;
}
