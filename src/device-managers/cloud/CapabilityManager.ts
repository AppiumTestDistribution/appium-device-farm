import { IDevice } from '../../interfaces/IDevice';

export default class CapabilityManager {
  private capabilities: any;
  private freeDevice: IDevice;
  constructor(capabilities: any, freeDevice: IDevice) {
    this.capabilities = capabilities;
    this.freeDevice = freeDevice;
  }

  getCapability() {
    const entries = Object.entries(this.freeDevice.capability);
    entries.map(([key, val]) => {
      this.capabilities.alwaysMatch[`appium:${key}`] = val;
    });
    return this.capabilities;
  }
}
