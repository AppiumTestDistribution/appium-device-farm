import BasePlugin from '@appium/base-plugin';
import AndroidDeviceManager from './AndroidDeviceManager';
let portfinder = require('portfinder');
import log from './logger';

let freePort;
let freeDevice;
let deviceState;
let instance = false;
portfinder.basePort = 60535;
portfinder.highestPort = 60888;
export default class DevicePlugin extends BasePlugin {
  constructor() {
    super();
    if (instance === false) {
      return (async () => {
        let androidDevices = new AndroidDeviceManager();
        deviceState = await androidDevices.getDevices();
        instance = true;
      })();
    }
  }
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
    freeDevice = deviceState.find((device) => device.busy === false);
    if (freeDevice) {
      caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
      caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
      deviceState.find(
        (device) =>
          device.udid === freeDevice.udid && ((device.busy = true), true)
      );
      log.info(
        `Device UDID ${freeDevice.udid} locked from stack ${JSON.stringify(
          deviceState
        )}`
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
    log.info(
      `Deleting Session and device UDID ${
        freeDevice.udid
      } unblocked from stack ${JSON.stringify(deviceState)}`
    );
    await next();
  }
}
