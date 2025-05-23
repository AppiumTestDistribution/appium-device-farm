import { Platform } from '../types/Platform';

export interface IDevice {
  id: string;
  systemPort: number;
  host: string;
  proxyPort?: number;
  proxyHost?: string;
  wdaLocalPort?: number;
  name: string;
  udid: string;
  state: string;
  sdk: string;
  platform: Platform;
  deviceType: string;
  busy: boolean;
  userBlocked: boolean;
  realDevice: boolean;
  session_id?: string;
  offline?: boolean;
  mjpegServerPort?: number;
  lastCmdExecutedAt?: number;
  totalUtilizationTimeMilliSec: number;
  sessionStartTime: number;
  newCommandTimeout?: number;
  cloud?: any;
  derivedDataPath?: string;
  chromeDriverPath?: any;
  capability?: any;
  adbRemoteHost: string;
  adbPort: number;
  nodeId?: string;
  width: string;
  height: string;
  liveStreaming?: boolean;
  wdaBundleId?: string;
  productModel?: string;
  deviceTypeIdentifier?: string;
  proxyUrl?: string;
  proxySessionId?: string;
  prebuiltWDAPath?: string;
  tags: Array<string>;
  webDriverAgentUrl?: string;
  webDriverAgentHost?: string;
  sessionResponse?: Record<string, any>;
  activeUser?: {
    id: string;
    firstname: string;
    lastname: string;
  };
}
