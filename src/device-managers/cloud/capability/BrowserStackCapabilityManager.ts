import { IDevice } from '../../../interfaces/IDevice';

export default class BrowserStackCapabilityManager {
  private capabilities: any;
  private freeDevice: IDevice;
  constructor(capabilities: any, freeDevice: IDevice) {
    this.capabilities = capabilities;
    this.freeDevice = freeDevice;
  }

  getCapability() {
    this.capabilities.alwaysMatch['appium:deviceName'] = this.freeDevice.udid;
    this.capabilities.alwaysMatch['appium:platformVersion'] = this.freeDevice.sdk;
    return this.capabilities;
  }
}
