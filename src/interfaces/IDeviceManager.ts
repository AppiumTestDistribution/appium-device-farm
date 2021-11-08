import { IDevice } from './IDevice';

export interface IDeviceManager {
  getDevices(): Promise<IDevice[]>;
}
