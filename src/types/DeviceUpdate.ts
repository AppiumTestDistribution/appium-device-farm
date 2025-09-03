export type DeviceUpdate = {
  udid: string;
  host: string;
  state: string;
  real: boolean;
  nodeId: string;
  platform: 'android' | 'ios';
};
