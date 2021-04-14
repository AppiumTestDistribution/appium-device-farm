import { findIndex, remove } from 'lodash';
import eventEmitter from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';
import log from './logger';
import schedule from 'node-schedule';
import SimulatorManager from './SimulatorManager';
import { isMac } from './helpers';

let actualDevices;
let instance = false;
let devices;

export default class Devices {
  constructor(devices) {
    actualDevices = devices;
  }
  initADB() {
    log.info('Starting & initializing the listen to device changes');
    let rule = new schedule.RecurrenceRule();
    rule.second = [0, 10, 20, 30, 40, 50];
    schedule.scheduleJob(rule, async function () {
      let androidDeviceManager = new AndroidDeviceManager();
      let iOSDeviceManager = new IOSDeviceManager();
      const connectedAndroidDevices = await androidDeviceManager.getDevices();
      const connectedIOSDevices = await iOSDeviceManager.getDevices();
      eventEmitter.emit('ConnectedDevices', {
        emittedDevices: Object.assign(
          connectedAndroidDevices,
          connectedIOSDevices
        ),
      });
    });
  }

  getFreeDevice(platform, options) {
    log.info(`Finding Free Device for Platform ${platform}, ${actualDevices}`);
    if (options) {
      return actualDevices.find(
        (device) =>
          device.busy === false &&
          device.platform.toLowerCase() === platform &&
          device.name.includes(options.simulator)
      );
    } else {
      return actualDevices.find(
        (device) =>
          device.busy === false && device.platform.toLowerCase() === platform
      );
    }
  }

  blockDevice(freeDevice) {
    return actualDevices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = true), true)
    );
  }

  unblockDevice(blockedDevice) {
    return actualDevices.find(
      (device) =>
        device.udid === blockedDevice.udid && ((device.busy = false), true)
    );
  }

  updateDevice(freeDevice, sessionId) {
    const device = actualDevices.find(
      (device) => device.udid === freeDevice.udid
    );
    const deviceIndex = findIndex(actualDevices, { udid: freeDevice.udid });
    actualDevices[deviceIndex] = Object.assign(device, { sessionId });
  }

  getDeviceForSession(sessionId) {
    return actualDevices.find((device) => device.sessionId === sessionId);
  }
}

export async function fetchDevices() {
  if (instance === false) {
    let simulators;
    let connectedIOSDevices;
    let connectedAndroidDevices;
    let simulatorManager = new SimulatorManager();
    let androidDevices = new AndroidDeviceManager();
    let iosDevices = new IOSDeviceManager();
    if (isMac()) {
      simulators = await simulatorManager.getSimulators();
      connectedIOSDevices = await iosDevices.getDevices();
      connectedAndroidDevices = await androidDevices.getDevices();
      devices = new Devices(
        Object.assign(simulators, connectedAndroidDevices, connectedIOSDevices)
      );
    } else {
      devices = new Devices(await androidDevices.getDevices());
    }

    instance = true;
    devices.initADB();
    eventEmitter.on('ConnectedDevices', function (data) {
      const { emittedDevices } = data;
      emittedDevices.forEach((emittedDevice) => {
        const actualDevice = actualDevices.find(
          (actualDeviceState) => actualDeviceState.udid === emittedDevice.udid
        );
        const deviceIndex = findIndex(emittedDevices, {
          udid: emittedDevice.udid,
        });
        emittedDevices[deviceIndex] = Object.assign({
          busy: !!actualDevice?.busy,
          state: emittedDevice.state,
          udid: emittedDevice.udid,
          sessionId: actualDevice?.sessionId ?? null,
          platform: emittedDevice.platform,
          realDevice: emittedDevice.realDevice,
          sdk: emittedDevice.sdk,
        });
      });
      remove(
        actualDevices,
        (device) =>
          device.platform === 'android' ||
          (device.platform === 'iOS' && device.realDevice === true)
      );
      actualDevices.push(...emittedDevices);
      log.info(`Master Device List ${JSON.stringify(actualDevices)}`);
    });
  }
  return devices;
}

export function listAllDevices() {
  return actualDevices;
}
