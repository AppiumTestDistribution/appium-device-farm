export interface IDevice {
  name: string;
  host: string;
  udid: string;
  sdk: string;
  systemPort: number;
  deviceType: 'simulator' | 'emulator' | 'real';
  offline: boolean;
  userBlocked: boolean;
  busy: boolean;
  platform: 'ios' | 'tvos' | 'android';
  realDevice: boolean;
  dashboard_link?: string;
  total_session_count?: number;
  totalUtilizationTimeMilliSec?: any;
  session_id?: number;
  liveStreaming: boolean;
  width: string;
  height: string;
  mjpegServerPort: number;
  productModel?: string;
}
