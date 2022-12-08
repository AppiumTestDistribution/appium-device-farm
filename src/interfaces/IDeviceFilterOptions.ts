import { Platform } from '../types/Platform';
import { DeviceType } from '../types/DeviceType';

export interface IDeviceFilterOptions {
  platform?: Platform;
  platformVersion?: string;
  name?: string;
  busy?: boolean;
  offline?: boolean;
  udid?: any[];
  deviceType?: DeviceType;
  minSDK: number;
}
