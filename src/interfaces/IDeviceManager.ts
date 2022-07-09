import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(includeSimulators: Boolean, existingDeviceDetails: Array<IDevice>): Promise<IDevice[]>;
}
