import { IDevice } from '../../interfaces/IDevice';
import RemoteAndroidDeviceManager from '../RemoteAndroidDeviceManager';

export class DeviceFactory {
  public static deviceInstance(host: any, deviceState: IDevice[]) {
    if (host instanceof Object) {
      console.log('BS');
    } else {
      return new RemoteAndroidDeviceManager(host, deviceState);
    }
  }
}
