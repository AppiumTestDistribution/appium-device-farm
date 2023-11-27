export interface IPluginArgs {
  platform: 'ios' | 'android' | 'both';
  iosDeviceType: 'simulated' | 'real' | 'both';
  androidDeviceType: 'simulated' | 'real' | 'both';
  skipChromeDownload: boolean;
  /** Hub ip address and port the node should register */
  hub?: string;
  /** Limit how many sessions can be active at a time. */
  maxSessions: number;
  /**
   * DriveDataPath of WDA to speed iOS test run.
   * eg: {'simulator': 'PathtoDrivedDataPath', 'device': 'PathtoDrivedDataPath'}
   */
  derivedDataPath?: string;
  /**
   * ADB Remote host and port as array, eg: ["remoteMachine1IP:adbPort", "remoteMachine2IP:adbPort"]
   */
  adbRemote: string[];
  /** For remote execution if the node machine is behind proxy. eg: http://remoteMachineProxyIP:proxyPort */
  proxyIp?: string;
  /**
   * The name of Android emulator to run the test on. The names of currently installed emulators could be listed using avdmanager list avd command.
   * If the emulator with the given name is not running then it is going to be launched on automated session startup.
   */
  emulators?: string[];
  /** How long to wait for free device before giving up */
  deviceAvailabilityTimeoutMs: number;
  deviceAvailabilityQueryIntervalMs: number;
  sendNodeDevicesToHubIntervalMs: number;
  checkStaleDevicesIntervalMs: number;
  checkBlockedDevicesIntervalMs: number;
  /** NEW_COMMAND_TIMEOUT capability to use when none is set from the client */
  newCommandTimeoutSec: number;
}

export const DefaultPluginArgs: IPluginArgs = {
  platform: 'both',
  iosDeviceType: 'both',
  androidDeviceType: 'both',
  skipChromeDownload: true,
  hub: undefined,
  maxSessions: 8,
  derivedDataPath: undefined,
  adbRemote: [],
  proxyIp: undefined,
  emulators: [],
  deviceAvailabilityTimeoutMs: 300000,
  deviceAvailabilityQueryIntervalMs: 10000,
  sendNodeDevicesToHubIntervalMs: 30000,
  checkStaleDevicesIntervalMs: 30000,
  checkBlockedDevicesIntervalMs: 30000,
  newCommandTimeoutSec: 60,
};
