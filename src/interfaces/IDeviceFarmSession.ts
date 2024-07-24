import ADB from 'appium-adb';
import { IDevice } from './IDevice';
import SessionType from '../enums/SessionType';

export type IDeviceFarmSessionOptions = {
  sessionId: string;
  deviceFarmCapabilities: Record<string, any>;
  device: IDevice;
  sessionResponse: Record<string, any>;
  pluginNodeId: string;
  driver: any;
  adb: ADB;
};

export type IBeforeSessionCreateEventOptions = {
  device: IDevice;
  sessionType: SessionType;
  caps: any;
};

export type IAfterSessionDeletedEventOptions = {
  sessionId: string;
  device?: IDevice;
};
