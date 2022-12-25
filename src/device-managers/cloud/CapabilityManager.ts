import Cloud from '../../enums/Cloud';
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
    if(this.freeDevice.cloud.toLowerCase() === Cloud.PCLOUDY) {
      this.capabilities.alwaysMatch['pCloudy_ApiKey'] = process.env.PCLOUDY_APIKEY;
      this.capabilities.alwaysMatch['pCloudy_Username'] = process.env.PCLOUDY_USERNAME;
    }
    return this.capabilities;
  }
}
