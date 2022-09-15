import DevicePlatform from '../../../enums/Platform';
import { IDevice } from '../../../interfaces/IDevice';
import Devices from './Devices';

function filterAndroidByOS(device: any) {
  return device.os === DevicePlatform.ANDROID;
}

function filterAndroidByPlatform(device: any) {
  return device.platform === DevicePlatform.ANDROID;
}
export default class BrowserStackAndroidDeviceManager {
  private host: any;
  private deviceState: any;

  constructor(host: object, deviceState: IDevice[]) {
    this.host = host;
    this.deviceState = deviceState;
  }

  async getDevices() {
    const devices = new Devices(this.host, this.deviceState);
    return devices.getDevices(filterAndroidByOS, filterAndroidByPlatform);
  }
}
