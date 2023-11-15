import axios from 'axios';
import log from '../logger';
import { IDevice } from '../interfaces/IDevice';

export default class NodeDevices {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  async postDevicesToHub(devices: Array<IDevice>, arg: string) {
    log.info(`Updating remote android devices ${this.host}/device-farm/api/register`);
    const status = (
      await axios.post(`${this.host}/device-farm/api/register`, devices, {
        params: {
          type: arg,
        },
      })
    ).status;
    if (status === 200) {
      if (arg === 'add') {
        log.info(`Pushed devices to hub ${JSON.stringify(devices)}`);
      } else {
        log.info(`Removed device and pushed information to hub ${JSON.stringify(devices)}`);
      }
    } else {
      log.warn('Something went wrong!!');
    }
  }
}
