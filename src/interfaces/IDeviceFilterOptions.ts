import { Platform } from '../types/Platform';
import { DeviceType } from '../types/DeviceType';

export interface IDeviceFilterOptions extends Record<string, unknown> {
  platform?: Platform;
  platformVersion?: string;
  name?: string;
  busy?: boolean;
  offline?: boolean;
  userBlocked?: boolean;
  udid?: string[];
  deviceType?: DeviceType;
  minSDK?: string;
  maxSDK?: string;
  session_id?: string;
  filterByHost?: string;
  tags?: string[];
}
