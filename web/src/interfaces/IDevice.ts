export interface IDevice {
  name: string;
  udid: string;
  sdk: string;
  deviceType: 'simulator' | 'emulator' | 'real';
  offline: boolean;
  busy: boolean;
  platform: 'ios' | 'android';
  realDevice: boolean;
  dashboard_link?: string;
  total_session_count?: number;
}
