import { utilities } from 'appium-ios-device';
import log from './logger';

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
          OSVersion: await this.getOSVersion(udid),
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

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
