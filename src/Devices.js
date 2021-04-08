import { findIndex, remove } from 'lodash';
import eventEmitter from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';
import log from './logger';
import schedule from 'node-schedule';

let actualDevices;
export default class Devices {
  constructor(connectedDevices) {
    actualDevices = connectedDevices;
    this.initADB();
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
        });
      });
      remove(
        actualDevices,
        (device) =>
          device.platform === 'android' ||
          (device.platform === 'ios' && device.realDevice)
      );
      actualDevices.push(...emittedDevices);
      log.info(`Master Device List ${JSON.stringify(actualDevices)}`);
    });
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
    log.info(`Finding Free Device for Platform ${platform}`);
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

export function listAllDevices() {
  return actualDevices;
}
