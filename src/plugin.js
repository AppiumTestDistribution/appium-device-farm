import BasePlugin from '@appium/base-plugin';
import ADB from 'appium-adb';
let portfinder = require('portfinder');
const NodeCache = require('node-cache');
const deviceCache = new NodeCache();

let connectedDevices;
let freePort;
portfinder.basePort = 60535;
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
    const adb = await ADB.createADB();
    connectedDevices = await adb.getConnectedDevices();
    const deviceState = [];
    connectedDevices.forEach((device) =>
      deviceState.push(
        Object.assign({
          key: device.udid,
          val: { busy: false, state: device.state },
        })
      )
    );

    deviceCache.mset(deviceState);
    const freeDevice = deviceCache
      .keys()
      .find((key) => deviceCache.get(key).busy === false);
    if (freeDevice) {
      caps.firstMatch[0]['appium:deviceName'] = freeDevice;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
    } else {
      throw new Error('No free device available');
    }

    const session = await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
    if (!session.error) {
      deviceCache.set(freeDevice, {
        busy: true,
        state: deviceCache.get(freeDevice).state,
      });
      console.log('====================================');
      console.log(deviceCache.get(freeDevice));
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
