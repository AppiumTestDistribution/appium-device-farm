import { IDevice } from '../../interfaces/IDevice';
import RemoteAndroidDeviceManager from '../RemoteAndroidDeviceManager';
import BrowserStackCloudAndroidDeviceManager from '../cloud/browserstack/BrowserStackAndroidDeviceManager';
import { isObject } from 'lodash';
import Cloud from '../../enums/Cloud';
import { CloudArgs } from '../../types/CloudArgs';
export class DeviceFactory {
  public static deviceInstance(host: CloudArgs, deviceState: IDevice[]) {
    if (isObject(host) && host.cloudName === Cloud.BROWSERSTACK) {
      return new BrowserStackCloudAndroidDeviceManager(host, deviceState);
    } else {
      return new RemoteAndroidDeviceManager(host, deviceState);
    }
  }
}
