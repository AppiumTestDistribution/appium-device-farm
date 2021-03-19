import BasePlugin from '@appium/base-plugin';
import AndroidDeviceManager from './AndroidDeviceManager';
let portfinder = require('portfinder');
import log from './logger';
import Device from './Devices';

let freePort;
let freeDevice;
let devices;
let instance = false;
portfinder.basePort = 60535;
portfinder.highestPort = 60888;
export default class DevicePlugin extends BasePlugin {
  constructor() {
    super();
    if (instance === false) {
      return (async () => {
        let androidDevices = new AndroidDeviceManager();
        let deviceState = await androidDevices.getDevices();
        devices = new Device(deviceState);
        instance = true;
      })();
    }
  }
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
    freeDevice = devices.getFreeDevice();
    if (freeDevice) {
      caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
      caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
      devices.blockDevice(freeDevice);
      log.info(`Device UDID ${freeDevice.udid} blocked for execution.`);
    } else {
      throw new Error('No free device available');
    }
    this.session = await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
    if (this.session.error) {
      devices.unblockDevice(freeDevice);
      log.info(
        `Device UDID ${freeDevice.udid} unblocked. Reason: Session failed to create`
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
    devices.unblockDevice(freeDevice);
    log.info(`Deleting Session and device UDID ${freeDevice.udid} unblocked`);
    await next();
  }
}
