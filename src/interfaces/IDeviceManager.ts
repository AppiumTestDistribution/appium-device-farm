import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(existingDeviceDetails: Array<IDevice>): Promise<IDevice[]>;
}
