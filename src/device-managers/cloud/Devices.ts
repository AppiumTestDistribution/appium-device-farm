/* eslint-disable no-prototype-builtins */
import Cloud from '../../enums/Cloud';
import { IDevice } from '../../interfaces/IDevice';
import { CloudArgs } from '../../types/CloudArgs';

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
      if (this.isBrowserStack()) {
        cloudDeviceProperties = {
          name: d.deviceName,
          sdk: d['os_version'],
          udid: d.deviceName,
        };
      }
      if (this.isSauceLabs() || this.isLambdaTest()) {
        cloudDeviceProperties = {
          name: d.deviceName,
          sdk: d.platformVersion,
          udid: d.deviceName,
        };
      }
      if (this.isPCloudy()) {
        cloudDeviceProperties = {
          name: d?.pCloudy_DeviceFullName || d?.pCloudy_DeviceManufacturer,
          sdk: d?.pCloudy_DeviceVersion || d?.platformVersion,
          udid: d?.pCloudy_DeviceFullName || d?.pCloudy_DeviceManufacturer,
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

  private isBrowserStack() {
    return this.host.cloudName.toLowerCase() === Cloud.BROWSERSTACK;
  }

  private isPCloudy() {
    return this.host.cloudName.toLowerCase() === Cloud.PCLOUDY;
  }

  private isLambdaTest() {
    return this.host.cloudName.toLowerCase() === Cloud.LAMBDATEST;
  }

  private isSauceLabs() {
    return this.host.cloudName.toLowerCase() === Cloud.SAUCELABS;
  }
}
