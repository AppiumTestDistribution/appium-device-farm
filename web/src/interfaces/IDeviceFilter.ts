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
}
