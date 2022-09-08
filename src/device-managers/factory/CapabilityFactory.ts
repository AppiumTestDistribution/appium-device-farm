import { IDevice } from '../../interfaces/IDevice';
import BrowserStackCapabilityManager from '../cloud/capability/BrowserStackCapabilityManager';

export default class CapabilityFactory {
  public static getCapability(capability: any, device: IDevice) {
    if (device.cloud === 'browserstack') {
      return new BrowserStackCapabilityManager(capability, device);
    } else {
      throw new Error('Cloud not supported');
    }
  }
}
