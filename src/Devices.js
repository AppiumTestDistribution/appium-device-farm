import _ from 'lodash';
import { eventEmitter } from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
const schedule = require('node-schedule');

eventEmitter.on('ADB', function (data) {
  const { actual, emittedDevices } = data;
  function comparer(otherArray) {
    return function (current) {
      return (
        otherArray.filter(function (other) {
          return other.udid === current.udid;
        }).length === 0
      );
    };
  }
  const newDevice = emittedDevices.filter(comparer(actual));
  console.log('New Devices Detected', newDevice);
});

export default class Devices {
  constructor(devices) {
    this.devices = devices;
    this.initADB(devices);
  }

  initADB(devices) {
    console.log('Starting & initializing the timer');
    let rule = new schedule.RecurrenceRule();
    rule.second = [0, 10, 20, 30, 40, 50];
    schedule.scheduleJob(rule, async function () {
      let androidDevices = new AndroidDeviceManager();
      let deviceState = await androidDevices.getConnectedDevices();
      eventEmitter.emit('ADB', {
        actual: devices,
        emittedDevices: deviceState,
      });
    });
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
