import { utilities } from 'appium-ios-device';
import log from './logger';
import { asyncForEach } from './helpers';
import { IDevice } from './interfaces/IDevice';

export default class IOSDeviceManager {
  async getConnectedDevices() {
    return await utilities.getConnectedDevices();
  }

  async getOSVersion(udid: string) {
    return await utilities.getOSVersion(udid);
  }

  async getDeviceName(udid: string) {
    return await utilities.getDeviceName(udid);
  }

  async getDevices(): Promise<Array<IDevice>> {
    let deviceState: Array<IDevice> = [];
    log.info('Fetching iOS Devices');
    const devices = await this.getConnectedDevices();
    await asyncForEach(devices, async (udid: string) => {
      deviceState.push(
        Object.assign({
          udid,
          sdk: await this.getOSVersion(udid),
          name: await this.getDeviceName(udid),
          busy: false,
          realDevice: true,
          platform: 'ios',
          brand: 'Apple',
          manufacturer: 'Apple',
          model: await this.getDeviceName(udid),
        })
      );
    });
    return deviceState;
  }
}
