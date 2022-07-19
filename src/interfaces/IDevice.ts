import { Platform } from '../types/Platform';

export interface IDevice {
  name: string;
  udid: string;
  state: string;
  sdk: string;
  platform: Platform;
  deviceType: string;
  busy: boolean;
  realDevice: boolean;
  session_id?: string;
  offline?: boolean;
  mjpegServerPort?: number;
  last_cmd_exec_at?: number;
}
