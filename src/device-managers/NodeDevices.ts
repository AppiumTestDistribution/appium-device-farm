import axios from 'axios';
import log from '../logger';
import { CloudArgs } from '../types/CloudArgs';

export default class NodeDevices {
  private host: any;

  constructor(host: CloudArgs) {
    this.host = host;
  }

  async postDevicesToHub(data: any) {
    log.info(`Fetching remote android devices ${this.host}/device-farm/api/register`);
    await axios.post(`${this.host}/device-farm/api/register`, data);
  }
}
