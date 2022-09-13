import { IDevice } from '../../../interfaces/IDevice';
import Capabilities from '../../../enums/Capabilities';
export default class BrowserStackCapabilityManager {
  private capabilities: any;
  private freeDevice: IDevice;
  constructor(capabilities: any, freeDevice: IDevice) {
    this.capabilities = capabilities;
    this.freeDevice = freeDevice;
  }

  getCapability() {
    this.capabilities.alwaysMatch[Capabilities.DEVICE_NAME] = this.freeDevice.udid;
    this.capabilities.alwaysMatch[Capabilities.PLATFORM_VERSION] = this.freeDevice.sdk;
    return this.capabilities;
  }
}
