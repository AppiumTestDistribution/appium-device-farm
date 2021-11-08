import Simctl from 'node-simctl';
import { flatten } from 'lodash';
import { utilities as IOSUtils } from 'appium-ios-device';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { isMac } from '../helpers';
import { asyncForEach } from '../helpers';

export class IOSDeviceManager implements IDeviceManager {
  /**
   * Method to get all ios devices and simulators
   *
   * @returns {Promise<Array<IDevice>>}
   */
  async getDevices(): Promise<IDevice[]> {
    if (!isMac()) {
      return [];
    } else {
      return flatten(await Promise.all([this.getRealDevices(), this.getSimulators()]));
    }
  }

  /**
   * Method to get all ios real devices
   *
   * @returns {Promise<Array<IDevice>>}
   */
  private async getRealDevices(): Promise<Array<IDevice>> {
    const deviceState: Array<IDevice> = [];
    const devices = await IOSUtils.getConnectedDevices();
    await asyncForEach(devices, async (udid: string) => {
      let [sdk, name] = await Promise.all([
        IOSUtils.getOSVersion(udid),
        IOSUtils.getDeviceName(udid),
      ]);
      deviceState.push(
        Object.assign({
          udid,
          sdk,
          name,
          busy: false,
          realDevice: true,
          deviceType: 'real',
          platform: 'ios',
        })
      );
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
