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
    const capsToUpdate = this.capabilities.firstMatch? this.capabilities.firstMatch[0] : this.capabilities.alwaysMatch;
    const entries = Object.entries(this.freeDevice.capability);
    entries.map(([key, val]) => {
      capsToUpdate[`appium:${key}`] = val;
    });
    if (this.freeDevice.cloud.toLowerCase() === Cloud.PCLOUDY) {
      capsToUpdate['appium:pCloudy_ApiKey'] = process.env.CLOUD_KEY;
      capsToUpdate['appium:pCloudy_Username'] = process.env.CLOUD_USERNAME;
    }
    return this.capabilities;
  }
}
