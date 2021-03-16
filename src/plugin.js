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
      deviceState.push(Object.assign({}, { busy: false }, device))
    );
    deviceCache.mset([{ key: 'android', val: deviceState }]);
    const { udid } = deviceCache
      .get('android')
      .find((device) => device.busy === false);
    if (connectedDevices.length > 0) {
      caps.firstMatch[0]['appium:deviceName'] = udid;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
    }
    return await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
  }

  async getFreePort() {
    await portfinder.getPort(function (err, port) {
      freePort = port;
    });
  }
}
