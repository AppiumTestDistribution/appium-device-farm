import ADB from 'appium-adb';
import log from './logger';
import { asyncForEach } from './helpers';

let deviceState = [];
let adbInstance = null;
let adb;
export default class AndroidDeviceMananger {
  async getDevices() {
    log.info('Fetching Android Devices');
    const connectedDevices = await this.getConnectedDevices();
    await asyncForEach(connectedDevices, async(device) => {
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
            realDevice: await this.isRealDevice(device.udid)
          })
        );
      }
    });
    log.info(`Android Devices found ${JSON.stringify(deviceState)}`);
    return deviceState;
  }

  async createADB() {
    if (adbInstance === null) {
      adb = await ADB.createADB();
      adbInstance = true;
    }
  }
  async getConnectedDevices() {
    await this.createADB();
    console.log('ADB', adb);
    return await adb.getConnectedDevices();
  }

  async getDeviceVersion(udid) {
    await this.createADB();
    return await this.getDeviceProperty(udid, 'ro.build.version.release');
  }

  async getDeviceProperty(udid, prop) {
    return await adb.adbExec(['-s', udid, 'shell', 'getprop', prop]);
  }

  async isRealDevice(udid) {
    await this.createADB();
    const character = await this.getDeviceProperty(
      udid,
      'ro.build.characteristics'
    );
    return character !== 'emulator';
  }
}
