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
}
