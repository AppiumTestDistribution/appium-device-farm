import { IDevice } from './IDevice';

export type IDeviceFarmSessionOptions = {
  sessionId: string;
  deviceFarmCapabilities: Record<string, any>;
  device: IDevice;
  sessionResponse: Record<string, any>;
  pluginNodeId: string;
  driver: any;
};
