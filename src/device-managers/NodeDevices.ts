import axios from 'axios';
import log from '../logger';
import { DeviceUpdate } from '../types/DeviceUpdate';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import { IDevice } from '../interfaces/IDevice';
import { ATDRepository } from '../data-service/db';

export default class NodeDevices {
  private host: string;

  constructor(host: any) {
    this.host = host;
  }

  async updateDeviceInfoToHub(udid: string, deviceInfo: any) {
    log.info('Updating device with proxySession Information');
    try {
      const status = (
        await axios.post(`${this.host}/device-farm/api/updateDeviceInfo`, {
          udid,
          ...deviceInfo,
        })
      ).status;
      if (status === 200) {
        log.info('Updated device with proxySession Information');
      } else {
        log.warn('Something went wrong!!');
      }
    } catch (error) {
      log.error(`Unable to update device with proxySession Information. Reason: ${error}`);
    }
  }

  async postDevicesToHub(devices: IDevice[] | DeviceUpdate[], arg: string) {
    // DeviceWithPath -> new device
    // DeviceUpdate -> removed device
    log.info(`Updating remote android devices ${this.host}/device-farm/api/register`);
    try {
      const status = (
        await axios.post(`${this.host}/device-farm/api/register`, devices, {
          params: {
            type: arg,
          },
        })
      ).status;
      if (status === 200) {
        if (arg === 'add') {
          devices.forEach((device: any) => {
            log.info(`Pushed devices to hub ${device.udid} ${device.mjpegServerPort}`);
          });
        } else {
          devices.forEach((device: any) => {
            log.info(`Removed device and pushed information to hub ${device.udid}`);
          });
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
