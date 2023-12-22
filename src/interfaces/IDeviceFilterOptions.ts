import { Platform } from '../types/Platform';
import { DeviceType } from '../types/DeviceType';

export interface IDeviceFilterOptions {
  platform?: Platform;
  platformVersion?: string;
  name?: string;
  busy?: boolean;
  offline?: boolean;
  userBlocked?: boolean;
  udid: string[];
  deviceType?: DeviceType;
  minSDK?: string;
  maxSDK?: string;
  session_id?: string;
}
