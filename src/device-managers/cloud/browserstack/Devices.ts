/* eslint-disable no-prototype-builtins */
import { IDevice } from '../../../interfaces/IDevice';
import axios from 'axios';
import { CloudArgs } from '../../../types/CloudArgs';

export default class Devices {
  private host: any;
  private deviceState: any;
  constructor(host: CloudArgs, deviceState: IDevice[]) {
    this.host = host;
    this.deviceState = deviceState;
  }
  async getDevices(filterByOS: any, filterByPlatform: any) {
    if (!this.host.hasOwnProperty('devices')) {
      const auth =
        'Basic ' +
        Buffer.from(process.env.BS_USERNAME + ':' + process.env.BS_PASSWORD).toString('base64');
      const response = await axios('https://api-cloud.browserstack.com/app-automate/devices.json', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: auth,
        },
      });
      const devicesByOS = (await response.data).filter(filterByOS);
      const result = devicesByOS.map(() =>
        Object.assign({}, ...devicesByOS, { host: this.host.url })
      );
      this.deviceState.push(...result);
      return this.deviceState;
    } else {
      const devices = this.host.devices;
      const devicesByPlatform = devices.filter(filterByPlatform);
      const result = devicesByPlatform.map((d: any) =>
        Object.assign({}, ...devicesByPlatform, {
          host: this.host.url,
          busy: false,
          deviceType: 'real',
          name: d.device,
          sdk: d['os_version'],
          udid: d.device,
          cloud: this.host.cloudName,
        })
      );
      this.deviceState.push(...result);
      return this.deviceState;
    }
  }
}
