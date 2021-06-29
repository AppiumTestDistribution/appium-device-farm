import ADB from 'appium-adb';
import log from './logger';
import { asyncForEach } from './helpers';
import { IDevice } from './interfaces/IDevice';

let adbInstance: boolean = false;
let adb: any;
export default class AndroidDeviceMananger {
  async getDevices(): Promise<Array<IDevice>> {
    let deviceState: Array<IDevice> = [];
    log.info('Fetching Android Devices');
    const connectedDevices = await this.getConnectedDevices();
    await asyncForEach(
      connectedDevices,
      async (device: { udid: any; state: any }) => {
        if (
          !deviceState.find((devicestate) => devicestate.udid === device.udid)
        ) {
          deviceState.push(
            Object.assign({
              busy: false,
              state: device.state,
              udid: device.udid,
              platform: 'android',
              sdk: await this.getDeviceVersion(device.udid),
              realDevice: await this.isRealDevice(device.udid),
              name: await this.getDeviceName(device.udid),
              model: await this.getDeviceModel(device.udid),
              manufacturer: await this.getDeviceManufacturer(device.udid),
              brand: await this.getDeviceBrand(device.udid),
            })
          );
        }
      }
    );
    log.info(`Android Devices found ${JSON.stringify(deviceState)}`);
    return deviceState;
  }

  async createADB(): Promise<void> {
    if (!adbInstance) {
      adb = await ADB.createADB();
      adbInstance = true;
    }
  }

  async getConnectedDevices() {
    await this.createADB();
    return await adb.getConnectedDevices();
  }

  async getDeviceVersion(udid: string) {
    await this.createADB();
    return await this.getDeviceProperty(udid, 'ro.build.version.release');
  }

  async getDeviceProperty(udid: string, prop: string) {
    return await adb.adbExec(['-s', udid, 'shell', 'getprop', prop]);
  }

  async isRealDevice(udid: string): Promise<boolean> {
    await this.createADB();
    const character = await this.getDeviceProperty(
      udid,
      'ro.build.characteristics'
    );
    return character !== 'emulator';
  }

  async getDeviceName(udid: string) {
    await this.createADB();
    return await this.getDeviceProperty(udid, 'ro.product.name');
  }

  async getDeviceModel(udid: string) {
    await this.createADB();
    return await this.getDeviceProperty(udid, 'ro.product.model');
  }

  async getDeviceManufacturer(udid: string) {
    await this.createADB();
    return await this.getDeviceProperty(udid, 'ro.product.manufacturer');
  }
  async getDeviceBrand(udid: string) {
    await this.createADB();
    return await this.getDeviceProperty(udid, 'ro.product.brand');
  }
}
