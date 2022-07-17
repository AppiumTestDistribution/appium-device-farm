import { Platform } from '../types/Platform';
import { DeviceType } from '../types/DeviceType';

export interface IDeviceFilterOptions {
  platform?: Platform;
  name?: string;
  busy?: boolean;
  offline?: boolean;
  udid?: any[];
  deviceType?: DeviceType;
  minSDK: number;
}
