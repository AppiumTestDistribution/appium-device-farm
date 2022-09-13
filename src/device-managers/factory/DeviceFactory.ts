import { IDevice } from '../../interfaces/IDevice';
import RemoteAndroidDeviceManager from '../RemoteAndroidDeviceManager';
import BrowserStackCloudAndroidDeviceManager from '../cloud/browserstack/BrowserStackAndroidDeviceManager';
export class DeviceFactory {
  public static deviceInstance(host: any, deviceState: IDevice[]) {
    if (host instanceof Object) {
      return new BrowserStackCloudAndroidDeviceManager(host, deviceState);
    } else {
      return new RemoteAndroidDeviceManager(host, deviceState);
    }
  }
}
