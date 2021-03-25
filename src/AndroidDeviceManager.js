import ADB from 'appium-adb';
import log from './logger';

let deviceState = [];
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
          })
        );
      }
    });
    log.info(`Android Devices found ${JSON.stringify(deviceState)}`);
    return deviceState;
  }

  async getConnectedDevices() {
    const adb = await ADB.createADB();
    return await adb.getConnectedDevices();
  }
}
