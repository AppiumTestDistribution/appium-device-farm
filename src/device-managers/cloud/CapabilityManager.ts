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
    if(this.freeDevice.cloud.toLowerCase() !== Cloud.LAMBDATEST) {
      const entries = Object.entries(this.freeDevice.capability);
      if (!this.capabilities.alwaysMatch) {
        this.capabilities.alwaysMatch = {};
      }
  
      entries.map(([key, val]) => {
        this.capabilities.alwaysMatch[`appium:${key}`] = val;
      });
      if (this.freeDevice.cloud.toLowerCase() === Cloud.PCLOUDY) {
        this.capabilities.alwaysMatch['appium:pCloudy_ApiKey'] = process.env.CLOUD_KEY;
        this.capabilities.alwaysMatch['appium:pCloudy_Username'] = process.env.CLOUD_USERNAME;
      }
    }
    return this.capabilities;
  }
}
