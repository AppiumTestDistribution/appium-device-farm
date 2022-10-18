import axios from 'axios';
import { IDevice } from '../interfaces/IDevice';
import log from '../logger';
import { CloudArgs } from '../types/CloudArgs';

export default class RemoteIOSDeviceManager {
  private host: any;
  private deviceState: any;

  constructor(host: CloudArgs, deviceState: IDevice[]) {
    this.host = host;
    this.deviceState = deviceState;
  }
  async getDevices() {
    log.info('Fetching remote iOS devices');
    const remoteDevices = (await axios.get(`${this.host}/device-farm/api/devices/ios`)).data;
    remoteDevices.filter((device: any) => {
      if (device.deviceType === 'real') {
        delete device['meta'];
        delete device['$loki'];
        this.deviceState.push(
          Object.assign({
            ...device,
            totalUtilizationTimeMilliSec: 0,
            sessionStartTime: 0,
            host: `${this.host}`,
          })
        );
      }
    });
  }

  private async getSimulators(host: string, simulators: IDevice[]) {
    const remoteDevices = (await axios.get(`${host}/device-farm/api/devices/ios`)).data;
    remoteDevices.filter((device: any) => {
      if (device.deviceType === 'simulator') {
        delete device['meta'];
        delete device['$loki'];
        simulators.push(
          Object.assign({
            ...device,
            totalUtilizationTimeMilliSec: 0,
            sessionStartTime: 0,
            host: `${host}`,
          })
        );
      }
    });
  }
}
