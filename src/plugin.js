import BasePlugin from '@appium/base-plugin';
import ADB from 'appium-adb';
let portfinder = require('portfinder');

let connectedDevices;
let freePort;
portfinder.basePort = 60535;
class DevicePlugin extends BasePlugin {
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
    const adb = await ADB.createADB();
    connectedDevices = await adb.getConnectedDevices();
    let deviceState = [];
    connectedDevices.forEach((device) =>
      deviceState.push(
        Object.assign({ busy: false, state: device.state, udid: device.udid })
      )
    );
    const { udid } = deviceState.find((device) => device.busy === false);
    if (udid) {
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
