import ADB from 'appium-adb';
import log from './logger';

let deviceState = [];
let adbInstance = null;
export default class AndroidDeviceMananger {
  async getDevices() {
    log.info('Fetching Android Devices');
    const connectedDevices = await this.getConnectedDevices();

    connectedDevices.forEach((device) => {
      if (
        !deviceState.find((devicestate) => devicestate.udid === device.udid)
      ) {
        deviceState.push(
          Object.assign({
            busy: false,
            state: device.state,
            udid: device.udid,
            platform: 'android',
          })
        );
      }
    });
    log.info(`Android Devices found ${JSON.stringify(deviceState)}`);
    return deviceState;
  }

  async createADB() {
    if (adbInstance === null) {
      this.adb = await ADB.createADB();
      adbInstance = true;
    }
  }
  async getConnectedDevices() {
    await this.createADB();
    return await this.adb.getConnectedDevices();
  }

  async getDeviceVersion(udid) {
    await this.createADB();
    return await this.adb.adbExec([
      '-s',
      udid,
      'shell',
      'getprop',
      'ro.build.version.release',
    ]);
  }
}
