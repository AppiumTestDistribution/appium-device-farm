import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(
    includeSimulators: boolean,
    existingDeviceDetails: Array<IDevice>,
    cliArgs: any
  ): Promise<IDevice[]>;
}
