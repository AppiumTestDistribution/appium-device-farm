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

  async getDevices(actualDevices: Array<IDevice>): Promise<Array<IDevice>> {
    let deviceState: Array<IDevice> = [];
    log.info('Fetching iOS Devices');
    const devices = await this.getConnectedDevices();
    let sdk = '';
    let name = '';
    await asyncForEach(devices, async (udid: string) => {
      let value = actualDevices ? actualDevices[0] : null;
        if(!actualDevices.find(i => i.udid === udid)){
          sdk = await this.getOSVersion(udid);
          name = await this.getDeviceName(udid);
        }
        else if(value){
          sdk = actualDevices.find(i => i.udid === udid)?.sdk as string;
          name = actualDevices.find(i => i.udid === udid)?.name as string;
        }
      deviceState.push(
        Object.assign({
          udid: udid,
          sdk: sdk,
          name: name,
          busy: false,
          realDevice: true,
          platform: 'ios',
        })
      );
    });
    return deviceState;
  }
}
