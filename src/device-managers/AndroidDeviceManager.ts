import { IDevice } from '../interfaces/IDevice';
import { IDeviceManager } from '../interfaces/IDeviceManager';
import { asyncForEach } from '../helpers';
import ADB from 'appium-adb';
import log from '../logger';

export default class AndroidDeviceManager implements IDeviceManager {
  private adb: any;
  private adbAvailable = true;

  async getDevices(existingDeviceDetails: Array<IDevice>): Promise<IDevice[]> {
    if (!this.adbAvailable) {
      return [];
    }
    const deviceState: Array<IDevice> = [];
    try {
      const connectedDevices = await this.getConnectedDevices();
      await asyncForEach(connectedDevices, async (device: { udid: string; state: any }) => {
        if (!deviceState.find((devicestate) => devicestate.udid === device.udid)) {
          const existingDevice = existingDeviceDetails.find((dev) => dev.udid === device.udid);
          if (existingDevice) {
            log.info(`Android Device details for ${device.udid} already available`);
            deviceState.push({
              ...existingDevice,
              busy: false,
            });
          } else {
            log.info(`Android Device details for ${device.udid} not available. So querying now.`);
            const [sdk, realDevice, name] = await Promise.all([
              this.getDeviceVersion(device.udid),
              this.isRealDevice(device.udid),
              this.getDeviceName(device.udid),
            ]);

            deviceState.push({
              sdk,
              realDevice,
              name,
              busy: false,
              state: device.state,
              udid: device.udid,
              platform: 'android',
              deviceType: realDevice ? 'real' : 'emulator',
            });
          }
        }
      });
    } catch (e) {
      console.log(e);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return deviceState;
    }
  }

  private async getAdb(): Promise<any> {
    try {
      if (!this.adb) {
        this.adb = await ADB.createADB();
      }
    } catch (e) {
      this.adbAvailable = false;
    }
    return this.adb;
  }

  public async getConnectedDevices() {
    return await (await this.getAdb()).getConnectedDevices();
  }

  private async getDeviceVersion(udid: string) {
    return await this.getDeviceProperty(udid, 'ro.build.version.release');
  }

  private async getDeviceProperty(udid: string, prop: string) {
    return await (await this.getAdb()).adbExec(['-s', udid, 'shell', 'getprop', prop]);
  }

  private async isRealDevice(udid: string): Promise<boolean> {
    const character = await this.getDeviceProperty(udid, 'ro.build.characteristics');
    return character !== 'emulator';
  }

  private getDeviceName = async (udid: string) =>
    await this.getDeviceProperty(udid, 'ro.product.name');
}
