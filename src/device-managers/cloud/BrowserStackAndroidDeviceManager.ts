import axios from 'axios';
import { assign } from 'lodash';
import { IDevice } from '../../interfaces/IDevice';

export default class BrowserStackAndroidDeviceManager {
  private host: any;
  private deviceState: any;

  constructor(host: string, deviceState: IDevice[]) {
    this.host = host;
    this.deviceState = deviceState;
  }

  async getDevices() {
    const auth =
      'Basic ' +
      Buffer.from(process.env.BS_USERNAME + ':' + process.env.BS_PASSWORD).toString('base64');
    const response = await axios('https://api-cloud.browserstack.com/app-automate/devices.json', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: auth,
        Cookie: 'tracking_id=656a0f7f-4eef-4aad-8757-ed3e7039eb5f',
      },
    });
    const androidDevices = (await response.data).filter((device: any) => device.os === 'android');
    const result = androidDevices.map(() =>
      Object.assign({}, ...androidDevices, { host: this.host.url })
    );
    this.deviceState.push(...result);
    return this.deviceState;
  }
}
