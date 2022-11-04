import axios from 'axios';
import { IDevice } from '../interfaces/IDevice';
import log from '../logger';
import { CloudArgs } from '../types/CloudArgs';

export default class RemoteAndroidDeviceManager {
  private host: any;
  private deviceState: any;

  constructor(host: CloudArgs, deviceState: IDevice[]) {
    this.host = host;
    this.deviceState = deviceState;
  }
  async getDevices() {
    log.info('Fetching remote android devices');
    const remoteDevices = (await axios.get(`${this.host}/device-farm/api/devices/android`)).data;
    remoteDevices.filter((device: any) => {
      delete device['meta'];
      delete device['$loki'];
      this.deviceState.push(
        Object.assign({
          ...device,
          host: `${this.host}`,
        })
      );
    });
    return this.deviceState;
  }
}
