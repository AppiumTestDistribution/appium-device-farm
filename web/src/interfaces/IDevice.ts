export interface IDevice {
  name: string;
  udid: string;
  sdk: string;
  deviceType: 'simulator' | 'emulator' | 'real';
  offline: boolean;
  busy: boolean;
  platform: 'ios' | 'android';
  realDevice: boolean;
}
