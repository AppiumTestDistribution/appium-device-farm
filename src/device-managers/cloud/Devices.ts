/* eslint-disable no-prototype-builtins */
import Cloud from '../../enums/Cloud';
import { IDevice } from '../../interfaces/IDevice';
import { CloudArgs } from '../../types/CloudArgs';

export default class Devices {
  private devices: any;
  private deviceState: any;
  private platform: any;
  private cloud: any;

  constructor(cloudArgs: CloudArgs, deviceState: IDevice[], platform: any) {
    this.devices = cloudArgs.devices;
    this.deviceState = deviceState;
    this.platform = platform;
    this.cloud = cloudArgs;
  }
  async getDevices() {
    const devicesByPlatform = this.devices.filter((value: any) => value.platform === this.platform);
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
        host: this.cloud.url,
        busy: false,
        deviceType: 'real',
        capability: d,
        cloud: this.cloud.cloudName,
        ...cloudDeviceProperties,
      });
    });
    this.deviceState.push(...result);
    return this.deviceState;
  }

  private isBrowserStack() {
    return this.cloud.cloudName.toLowerCase() === Cloud.BROWSERSTACK;
  }

  private isPCloudy() {
    return this.cloud.cloudName.toLowerCase() === Cloud.PCLOUDY;
  }

  private isLambdaTest() {
    return this.cloud.cloudName.toLowerCase() === Cloud.LAMBDATEST;
  }

  private isSauceLabs() {
    return this.cloud.cloudName.toLowerCase() === Cloud.SAUCELABS;
  }
}
