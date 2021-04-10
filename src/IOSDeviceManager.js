import { utilities } from 'appium-ios-device';
import log from './logger';
import { asyncForEach } from './helpers';

export default class IOSDeviceManager {
  async getConnectedDevices() {
    return await utilities.getConnectedDevices();
  }

  async getOSVersion(udid) {
    return await utilities.getOSVersion(udid);
  }

  async getDeviceName(udid) {
    return await utilities.getDeviceName(udid);
  }

  async getDevices() {
    let deviceState = [];
    log.info('Fetching iOS Devices');
    const devices = await this.getConnectedDevices();
    await asyncForEach(devices, async (udid) => {
      deviceState.push(
        Object.assign({
          udid,
          sdk: await this.getOSVersion(udid),
          name: await this.getDeviceName(udid),
          busy: false,
          realDevice: true,
          platform: 'iOS',
        })
      );
    });
    return deviceState;
  }
}
