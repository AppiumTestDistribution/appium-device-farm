import BasePlugin from '@appium/base-plugin';
import AndroidDeviceManager from './AndroidDeviceManager';
let portfinder = require('portfinder');

let freePort;
let freeDevice;
let deviceState;
let instance = false;
portfinder.basePort = 60535;
portfinder.highestPort = 60888;
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
    if (instance === false) {
      return (async () => {
        let androidDevices = new AndroidDeviceManager();
        deviceState = await androidDevices.getDevices();
        instance = true;
        console.log('Instance', instance);
      })();
    }
  }
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
    console.log('====================================');
    console.log('deviceState before session creation');
    console.log(deviceState);
    console.log('====================================');
    freeDevice = deviceState.find((device) => device.busy === false);
    console.log('====================================');
    console.log(`free device found is ${freeDevice}`);
    console.log('====================================');
    if (freeDevice) {
      caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
      caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
      deviceState.find(
        (device) =>
          device.udid === freeDevice.udid && ((device.busy = true), true)
      );
    } else {
      throw new Error('No free device available');
    }
    this.session = await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
    if (!this.session.error) {
      deviceState.find(
        (device) =>
          device.udid === freeDevice.udid && ((device.busy = false), true)
      );
      console.log('====================================');
      console.log('deviceState after session creation');
      console.log(deviceState);
      console.log('====================================');
    } else {
      console.log(this.session, 'driver failed');
    }
    return this.session;
  }

  async getFreePort() {
    await portfinder.getPort(
      {
        port: 3000, // minimum port
        stopPort: 3333, // maximum port
      },
      function (err, port) {
        freePort = port;
      }
    );
  }

  async deleteSession(next) {
    deviceState.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = false), true)
    );
    console.log(deviceState);
    await next();
  }
}
