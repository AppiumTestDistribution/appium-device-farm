import ADB from 'appium-adb';

let deviceState = [];
export default class AndroidDeviceMananger {
  async getDevices() {
    console.log('In get devices');
    const adb = await ADB.createADB();
    const connectedDevices = await adb.getConnectedDevices();

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
    console.log(deviceState);
    return deviceState;
  }
}
