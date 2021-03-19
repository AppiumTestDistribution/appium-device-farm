import _ from 'lodash';
export default class Devices {
  constructor(devices) {
    this.devices = devices;
  }

  getFreeDevice() {
    return this.devices.find((device) => device.busy === false);
  }

  blockDevice(freeDevice) {
    return this.devices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = true), true)
    );
  }

  unblockDevice(freeDevice) {
    return this.devices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = false), true)
    );
  }

  updateDevice(freeDevice, sessionId) {
    const device = this.devices.find(
      (device) => device.udid === freeDevice.udid
    );
    const deviceIndex = _.findIndex(this.devices, { udid: freeDevice.udid });
    this.devices[deviceIndex] = Object.assign(device, { sessionId });
  }

  getDeviceForSession(sessionId) {
    return this.devices.find((device) => device.sessionId === sessionId);
  }
}
