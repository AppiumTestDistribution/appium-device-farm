/* eslint-disable no-prototype-builtins */
import { IDevice } from '../../../interfaces/IDevice';
import { CloudArgs } from '../../../types/CloudArgs';
export default class Devices {
  private host: any;
  private deviceState: any;
  private platform: any;

  constructor(host: CloudArgs, deviceState: IDevice[], platform: any) {
    this.host = host;
    this.deviceState = deviceState;
    this.platform = platform;
  }
  async getDevices() {
    const devices = this.host.devices;
    const devicesByPlatform = devices.filter((value: any) => value.platform === this.platform);
    let cloudDeviceProperties: any;
    const result = devicesByPlatform.map((d: any) => {
      if (this.host.cloudName.toLowerCase() === 'browserstack') {
        cloudDeviceProperties = {
          name: d.deviceName,
          sdk: d['os_version'],
          udid: d.deviceName,
        };
      }
      return Object.assign({}, ...devicesByPlatform, {
        host: this.host.url,
        busy: false,
        deviceType: 'real',
        capability: d,
        cloud: this.host.cloudName,
        ...cloudDeviceProperties,
      });
    });
    this.deviceState.push(...result);
    return this.deviceState;
  }
}
