import Simctl from 'node-simctl';
import { flatten } from 'lodash';
import { utilities as IOSUtils } from 'appium-ios-device';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { getFreePort, isMac } from '../helpers';
import { asyncForEach } from '../helpers';
import log from '../logger';

export default class IOSDeviceManager implements IDeviceManager {
  /**
   * Method to get all ios devices and simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  async getDevices(
    includeSimulators: boolean,
    existingDeviceDetails: Array<IDevice>
  ): Promise<IDevice[]> {
    if (!isMac()) {
      return [];
    } else {
      if (includeSimulators) {
        return flatten(
          await Promise.all([this.getRealDevices(existingDeviceDetails), this.getSimulators()])
        );
      } else {
        return flatten(await Promise.all([this.getRealDevices(existingDeviceDetails)]));
      }
    }
  }

  async getConnectedDevices() {
    return await IOSUtils.getConnectedDevices();
  }

  async getOSVersion(udid: string) {
    return await IOSUtils.getOSVersion(udid);
  }

  async getDeviceName(udid: string) {
    return await IOSUtils.getDeviceName(udid);
  }

  /**
   * Method to get all ios real devices
   *
   * @returns {Promise<Array<IDevice>>}
   */
  private async getRealDevices(existingDeviceDetails: Array<IDevice>): Promise<Array<IDevice>> {
    const deviceState: Array<IDevice> = [];
    const devices = await this.getConnectedDevices();
    await asyncForEach(devices, async (udid: string) => {
      const existingDevice = existingDeviceDetails.find((device) => device.udid === udid);
      if (existingDevice) {
        log.info(`IOS Device details for ${udid} already available`);
        deviceState.push({
          ...existingDevice,
          busy: false,
        });
      } else {
        log.info(`IOS Device details for ${udid} not available. So querying now.`);
        const wdaLocalPort = await getFreePort();
        const [sdk, name] = await Promise.all([this.getOSVersion(udid), this.getDeviceName(udid)]);
        deviceState.push(
          Object.assign({
            wdaLocalPort,
            udid,
            sdk,
            name,
            busy: false,
            realDevice: true,
            deviceType: 'real',
            platform: 'ios',
          })
        );
      }
    });
    return deviceState;
  }

  /**
   * Method to get all ios simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  private async getSimulators(): Promise<Array<IDevice>> {
    const simulators: Array<IDevice> = flatten(
      Object.values((await new Simctl().getDevicesByParsing('iOS')) as Array<IDevice>)
    ).map((device) => {
      return {
        ...device,
        busy: false,
        realDevice: false,
        platform: 'ios',
        deviceType: 'simulator',
      };
    });
    simulators.sort((a, b) => (a.state > b.state ? 1 : -1));
    return simulators;
  }
}
