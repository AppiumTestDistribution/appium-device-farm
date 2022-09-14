import { IDevice } from '../../../interfaces/IDevice';
import Devices from './Devices';

function filteriOSByOS(device: any) {
  return device.os == 'ios';
}

function filteriOSByPlatform(device: any) {
  return device.platform == 'ios';
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
    devices.getDevices(filteriOSByOS, filteriOSByPlatform);
  }
}
