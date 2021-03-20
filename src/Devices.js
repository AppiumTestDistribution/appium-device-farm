import _ from 'lodash';
import { eventEmitter } from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
const schedule = require('node-schedule');
let devices;

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
  console.log('New Device List', devices);
});

export default class Devices {
  constructor(foundDevice) {
    devices = foundDevice;
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
    console.log('------', devices);
    return devices.find((device) => device.busy === false);
  }

  blockDevice(freeDevice) {
    return devices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = true), true)
    );
  }

  unblockDevice(freeDevice) {
    return devices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = false), true)
    );
  }

  updateDevice(freeDevice, sessionId) {
    const device = devices.find((device) => device.udid === freeDevice.udid);
    const deviceIndex = _.findIndex(devices, { udid: freeDevice.udid });
    devices[deviceIndex] = Object.assign(device, { sessionId });
  }

  getDeviceForSession(sessionId) {
    return devices.find((device) => device.sessionId === sessionId);
  }
}
