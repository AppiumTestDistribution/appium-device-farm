import ADB from 'appium-adb';
import log from './logger';
import { asyncForEach } from './helpers';
import { IDevice } from './interfaces/IDevice';

let adbInstance = false;
let adb: any;
export default class AndroidDeviceMananger {
  async getDevices(actualDevices: Array<IDevice>): Promise<Array<IDevice>> {
    let deviceState: Array<IDevice> = [];
    log.info('Fetching Android Devices');
    const connectedDevices = await this.getConnectedDevices();
    let sdk = '';
    let realDevice = false;
    let name = '';
    await asyncForEach(
      connectedDevices,
      async (device: { udid: any; state: any }) => {
        let value = actualDevices ? actualDevices[0] : null;
        if(!actualDevices.find(i => i.udid === device.udid)){
          sdk = await this.getDeviceVersion(device.udid);
          realDevice = await this.isRealDevice(device.udid);
          name = await this.getDeviceName(device.udid);
        }
        else if(value){
          sdk = actualDevices.find(i => i.udid === device.udid)?.sdk as string;
          realDevice = actualDevices.find(i => i.udid === device.udid)?.realDevice as boolean;
          name = actualDevices.find(i => i.udid === device.udid)?.name as string;
        }
          deviceState.push(
            Object.assign({
              busy: false,
              state: device.state,
              udid: device.udid,
              platform: 'android',
              sdk: sdk,
              realDevice: realDevice,
              name: name,
            })
          );
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
}
