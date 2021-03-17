import BasePlugin from '@appium/base-plugin';
import ADB from 'appium-adb';
let portfinder = require('portfinder');

let deviceState = [];
let freePort;
portfinder.basePort = 60535;
class DevicePlugin extends BasePlugin {
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
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
    console.log('====================================');
    console.log('deviceState before session creation');
    console.log(deviceState);
    console.log('====================================');
    const { udid } = deviceState.find((device) => device.busy === false);
    console.log('====================================');
    console.log(`free device found is ${udid}`);
    console.log('====================================');
    if (udid) {
      caps.firstMatch[0]['appium:udid'] = udid;
      caps.firstMatch[0]['appium:deviceName'] = udid;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
    } else {
      throw new Error('No free device available');
    }
    const session = await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
    if (!session.error) {
      deviceState.find(
        (device) => device.udid === udid && ((device.busy = true), true)
      );
      console.log('====================================');
      console.log('deviceState after session creation');
      console.log(deviceState);
      console.log('====================================');
    } else {
      console.log(session, 'driver failed');
    }
    return session;
  }

  async getFreePort() {
    await portfinder.getPort(function (err, port) {
      freePort = port;
    });
  }
}

export default DevicePlugin;
