export interface IDeviceFilter {
  platform: {
    android: boolean;
    ios: boolean;
  };

  state: {
    ready: boolean;
    offline: boolean;
    busy: boolean;
  };

  name: string;
  version?: string;
  deviceType?: 'simulator' | 'emulator' | 'real';
  versions?: string[];
  tags?: string[];
}
