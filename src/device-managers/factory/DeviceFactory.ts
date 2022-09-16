import { IDevice } from '../../interfaces/IDevice';
import RemoteAndroidDeviceManager from '../RemoteAndroidDeviceManager';
import RemoteIOSDeviceManager from '../RemoteIOSDeviceManager';

import BrowserStackCloudIOSDeviceManager from '../cloud/browserstack/BrowserStackIOSDeviceManager';
import BrowserStackCloudAndroidDeviceManager from '../cloud/browserstack/BrowserStackAndroidDeviceManager';

import { isObject } from 'lodash';
import Cloud from '../../enums/Cloud';
import { CloudArgs } from '../../types/CloudArgs';
import DevicePlatform from '../../enums/Platform';
export class DeviceFactory {
  public static deviceInstance(host: CloudArgs, deviceState: IDevice[], platform: string) {
    if (isObject(host) && host.cloudName === Cloud.BROWSERSTACK) {
      if (platform == DevicePlatform.ANDROID) {
        return new BrowserStackCloudAndroidDeviceManager(host, deviceState);
      } else if (platform == DevicePlatform.IOS) {
        return new BrowserStackCloudIOSDeviceManager(host, deviceState);
      }
    } else if (platform == DevicePlatform.ANDROID) {
      return new RemoteAndroidDeviceManager(host, deviceState);
    } else {
      return new RemoteIOSDeviceManager(host, deviceState);
    }
  }
}
