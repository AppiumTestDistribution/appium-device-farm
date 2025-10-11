import ip from 'ip';
import { IDevice } from './IDevice';

export interface AxiosProxy {
  protocol: string;
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
}

export interface CloudDevice {
  deviceName: string;
  os_version: string;
  platform: string;
}

export interface CloudConfig {
  cloudName: string;
  url: string;
  devices: CloudDevice[];
}

export interface IDerivedDataPath {
  simulator?: string;
  device?: string;
}

export type DeviceTypeToInclude = 'both' | 'real' | 'simulated';

export interface IPluginArgs {
  platform: 'ios' | 'android' | 'both' | 'none';
  iosDeviceType: DeviceTypeToInclude;
  androidDeviceType: DeviceTypeToInclude;
  skipChromeDownload: boolean;
  /** Hub ip address and port the node should register */
  hub?: string;
  /** Limit how many sessions can be active at a time. */
  maxSessions: number;
  /**
   * DriveDataPath of WDA to speed iOS test run.
   * eg: {'simulator': 'PathtoDrivedDataPath', 'device': 'PathtoDrivedDataPath'}
   */
  derivedDataPath?: IDerivedDataPath;
  /**
   * ADB Remote host and port as array, eg: ["remoteMachine1IP:adbPort", "remoteMachine2IP:adbPort"]
   */
  adbRemote: string[];
  /** For remote execution if the node machine is behind proxy. eg: http://remoteMachineProxyIP:proxyPort */
  remoteMachineProxyIP?: string | URL;
  /** Proxy for axios */
  proxy?: AxiosProxy;
  /**
   * The name of Android emulator to run the test on. The names of currently installed emulators could be listed using avdmanager list avd command.
   * If the emulator with the given name is not running then it is going to be launched on automated session startup.
   */
  emulators: string[];
  simulators: IDevice[];
  /** How long to wait for free device before giving up */
  deviceAvailabilityTimeoutMs: number;
  deviceAvailabilityQueryIntervalMs: number;
  sendNodeDevicesToHubIntervalMs: number;
  checkStaleDevicesIntervalMs: number;
  checkBlockedDevicesIntervalMs: number;
  /** NEW_COMMAND_TIMEOUT capability to use when none is set from the client */
  newCommandTimeoutSec: number;
  cloud?: CloudConfig;
  bindHostOrIp: string;
  enableDashboard: boolean;
  liveStreaming: boolean;
  wdaBundleId: string;
  preBuildWDAPath: string;

  // development purposes
  removeDevicesFromDatabaseBeforeRunningThePlugin?: boolean;
  bootedSimulators?: boolean;
  remoteConnectionTimeout?: number;

  //authentication
  enableAuthentication?: boolean;
  accessKey?: string;
  token?: string;

  //node
  nodeName?: string;
  systemPortRange?: string;
  wdaLocalPortRange?: string;
  mjpegServerPortRange?: string;
}

export const DefaultPluginArgs: IPluginArgs = {
  platform: 'none',
  iosDeviceType: 'both',
  androidDeviceType: 'both',
  skipChromeDownload: true,
  hub: undefined,
  maxSessions: 8,
  derivedDataPath: undefined,
  adbRemote: [],
  remoteMachineProxyIP: undefined,
  proxy: undefined,
  emulators: [],
  simulators: [],
  deviceAvailabilityTimeoutMs: 300000,
  deviceAvailabilityQueryIntervalMs: 10000,
  sendNodeDevicesToHubIntervalMs: 30000,
  checkStaleDevicesIntervalMs: 30000,
  checkBlockedDevicesIntervalMs: 30000,
  newCommandTimeoutSec: 60,
  cloud: undefined,
  bindHostOrIp: ip.address(),
  enableDashboard: false,
  removeDevicesFromDatabaseBeforeRunningThePlugin: false,
  remoteConnectionTimeout: 60000,
  liveStreaming: true,
  wdaBundleId: '',
  preBuildWDAPath: '',
};
