import DevicePlatform from '../../../enums/Platform';
import { IDevice } from '../../../interfaces/IDevice';
import Devices from './Devices';

function filteriOSByOS(device: any) {
  return device.os == DevicePlatform.IOS;
}

function filteriOSByPlatform(device: any) {
  return device.platform == DevicePlatform.IOS;
}

export default class BrowserStackIOSDeviceManager {
  private host: any;
  private deviceState: any;

  constructor(host: object, deviceState: IDevice[]) {
    this.host = host;
    this.deviceState = deviceState;
  }

  async getDevices() {
    const devices = new Devices(this.host, this.deviceState);
    return devices.getDevices(filteriOSByOS, filteriOSByPlatform);
  }
}
