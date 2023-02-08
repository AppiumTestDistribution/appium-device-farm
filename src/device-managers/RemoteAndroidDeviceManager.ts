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

  //Needs rename
  async getDevices(options: any = {}) {
    log.info('Fetching remote android devices');
    await axios.post(`${this.host}/device-farm/api/register`, options);
  }
}
