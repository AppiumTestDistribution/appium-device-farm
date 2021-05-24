import { Platform } from '../types/Platform';

export interface IDevice {
  name: string;
  udid: string;
  state: string;
  sdk: string;
  platform: Platform;
  busy: boolean;
  realDevice: boolean;
  sessionId: string;
}
