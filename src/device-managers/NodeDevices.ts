import axios from 'axios';
import log from '../logger';
import { CloudArgs } from '../types/CloudArgs';

export default class NodeDevices {
  private host: any;

  constructor(host: CloudArgs) {
    this.host = host;
  }

  async postDevicesToHub(data: any, arg: string) {
    log.info(`Updating remote android devices ${this.host}/device-farm/api/register`);
    const status = (
      await axios.post(`${this.host}/device-farm/api/register`, data, {
        params: {
          type: arg,
        },
      })
    ).status;
    if (status === 200) {
      if (arg === 'add') {
        log.info(`Pushed devices to hub ${JSON.stringify(data)}`);
      } else {
        log.info(`Removed device and pushed information to hub ${JSON.stringify(data)}`);
      }
    } else {
      log.warn('Something went wrong!!');
    }
  }
}
