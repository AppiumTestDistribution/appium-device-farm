import axios from 'axios';
import log from '../logger';
import { DeviceWithPath } from '@devicefarmer/adbkit';
import { DeviceUpdate } from '../types/DeviceUpdate';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';

export default class NodeDevices {
  private host: string;

  constructor(host: string) {
    this.host = host;
  }

  async postDevicesToHub(devices: DeviceWithPath[] | DeviceUpdate[], arg: 'add' | 'remove') {
    // DeviceWithPath -> new device
    // DeviceUpdate -> removed device
    const deviceFarmHost = this.host.replace(/\/wd\/hub$/, '');
    log.info(`Updating remote android devices ${deviceFarmHost}/device-farm/api/register`);
    try {
      const status = (
        await axios.post(`${deviceFarmHost}/device-farm/api/register`, devices, {
          params: {
            type: arg,
          },
        })
      ).status;
      if (status === 200) {
        if (arg.toLowerCase() === 'add') {
          log.info(`Pushed devices to hub ${JSON.stringify(devices)}`);
        } else {
          log.info(`Removed device and pushed information to hub ${JSON.stringify(devices)}`);
        }
      } else {
        log.warn('Something went wrong!!');
      }
    } catch (error) {
      log.error(`Unable to push devices update to hub. Reason: ${error}`);
    }
  }

  async unblockDevice(filter: IDeviceFilterOptions) {
    log.info(`Unblocking device ${this.host}/device-farm/api/unblock`);
    try {
      const status = (
        await axios.post(`${this.host}/device-farm/api/unblock`, filter, {
          params: {
            type: 'unblock',
          },
        })
      ).status;
      if (status === 200) {
        log.info(`Unblocked device with filter: ${filter}`);
      } else {
        log.warn('Something went wrong!!');
      }
    } catch (error) {
      log.error(`Unable to unblock device. Reason: ${error}`);
    }
  }
}
