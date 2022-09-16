import { IDevice } from '../../interfaces/IDevice';
import BrowserStackCapabilityManager from '../cloud/browserstack/capability/BrowserStackCapabilityManager';
import Cloud from '../../enums/Cloud';
export default class CapabilityFactory {
  public static getCapability(capability: any, device: IDevice) {
    if (device.cloud == Cloud.BROWSERSTACK) {
      return new BrowserStackCapabilityManager(capability, device);
    } else {
      throw new Error('Cloud not supported');
    }
  }
}
