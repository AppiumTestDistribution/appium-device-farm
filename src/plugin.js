import BasePlugin from '@appium/base-plugin';
import AndroidDeviceManager from './AndroidDeviceManager';
const getPort = require('get-port');
import log from './logger';
import Device from './Devices';

let devices;
let instance = false;

export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
    if (instance === false) {
      return (async () => {
        let androidDevices = new AndroidDeviceManager();
        let connectedDevices = await androidDevices.getDevices();
        devices = new Device(connectedDevices);
        instance = true;
      })();
    }
  }

  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    const freeDevice = devices.getFreeDevice();
    if (freeDevice) {
      caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
      caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
      caps.firstMatch[0]['appium:systemPort'] = await getPort();
      devices.blockDevice(freeDevice);
      log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
    } else {
      throw new Error('No free device is available to create session');
    }
    this.session = await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
    if (this.session.error) {
      devices.unblockDevice(freeDevice);
      log.info(
        `Device UDID ${freeDevice.udid} unblocked. Reason: Session failed to create`
      );
    } else {
      devices.updateDevice(freeDevice, this.session.value[0]);
    }
    return this.session;
  }

  async deleteSession(next, driver, args) {
    const blockedDevice = devices.getDeviceForSession(args);
    log.info(`Unblocking device UDID: ${blockedDevice.udid}`);
    devices.updateDevice(blockedDevice, null);
    devices.unblockDevice(blockedDevice);
    log.info(
      `Deleting Session and device UDID ${blockedDevice.udid} is unblocked`
    );
    await next();
  }
}
