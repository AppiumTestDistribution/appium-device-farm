export interface IDevice {
  name: string;
  host: string;
  udid: string;
  sdk: string;
  systemPort: number;
  deviceType: 'simulator' | 'emulator' | 'real';
  offline: boolean;
  userBlocked?: boolean;
  busy: boolean;
  platform: 'ios' | 'tvos' | 'android';
  state?: 'Booted' | 'Shutdown' | 'Creating';
  realDevice: boolean;
  dashboard_link?: string;
  total_session_count?: number;
  totalUtilizationTimeMilliSec?: any;
  session_id?: number;
  liveStreaming: boolean;
  width: string;
  height: string;
  mjpegServerPort?: number;
  cloud?: string;
  tags: string[];
  sessionResponse?: Record<string, any>;
  utilization?: number;
  version?: string;
  location?: string;
  nodeId: string;
  activeUser?: {
    id: string;
    firstname: string;
    lastname: string;
  };
}
