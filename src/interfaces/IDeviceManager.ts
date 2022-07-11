import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(includeSimulators: boolean, existingDeviceDetails: Array<IDevice>): Promise<IDevice[]>;
}
