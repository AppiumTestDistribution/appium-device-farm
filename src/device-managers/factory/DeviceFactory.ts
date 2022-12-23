import { IDevice } from '../../interfaces/IDevice';
import RemoteAndroidDeviceManager from '../RemoteAndroidDeviceManager';
import RemoteIOSDeviceManager from '../RemoteIOSDeviceManager';
import { isObject } from 'lodash';
import Cloud from '../../enums/Cloud';
import { CloudArgs } from '../../types/CloudArgs';
import DevicePlatform from '../../enums/Platform';
import Devices from '../cloud/browserstack/Devices';

export class DeviceFactory {
  public static deviceInstance(host: CloudArgs, deviceState: IDevice[], platform: string) {
    if (isObject(host) && host.cloudName === Cloud.BROWSERSTACK) {
      return new Devices(host, deviceState, platform);
    } else if (platform == DevicePlatform.ANDROID) {
      return new RemoteAndroidDeviceManager(host, deviceState);
    } else {
      return new RemoteIOSDeviceManager(host, deviceState);
    }
  }
}
