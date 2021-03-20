import _ from 'lodash';
import { eventEmitter } from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
import log from './logger';

const schedule = require('node-schedule');
let devices;
let mergedDevices;
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
  let temp = [];
  newDevice.forEach((device) =>
    temp.push(Object.assign({ busy: false }, device))
  );
  log.info(`New Devices Detected ${newDevice}`);
  mergedDevices = temp.concat(devices);
  temp.splice(0, temp.length);
  log.info(`Master Device List ${JSON.stringify(mergedDevices)}`);
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
    console.log('------', mergedDevices);
    return mergedDevices.find((device) => device.busy === false);
  }

  blockDevice(freeDevice) {
    return mergedDevices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = true), true)
    );
  }

  unblockDevice(freeDevice) {
    return mergedDevices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = false), true)
    );
  }

  updateDevice(freeDevice, sessionId) {
    const device = mergedDevices.find(
      (device) => device.udid === freeDevice.udid
    );
    const deviceIndex = _.findIndex(mergedDevices, { udid: freeDevice.udid });
    mergedDevices[deviceIndex] = Object.assign(device, { sessionId });
  }

  getDeviceForSession(sessionId) {
    return mergedDevices.find((device) => device.sessionId === sessionId);
  }
}
