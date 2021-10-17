import { findIndex, remove } from 'lodash';
import eventEmitter from './events';
import AndroidDeviceManager from './AndroidDeviceManager';
import IOSDeviceManager from './IOSDeviceManager';
import log from './logger';
import schedule from 'node-schedule';
import SimulatorManager from './SimulatorManager';
import { isMac, checkIfPathIsAbsolute } from './helpers';
import { IDevice } from './interfaces/IDevice';
import { IOptions } from './interfaces/IOptions';
import { Platform } from './types/Platform';

let actualDevices: Array<IDevice>;
let instance = false;
let devices: Devices;

export default class Devices {
  constructor(devices: Array<IDevice>) {
    actualDevices = devices;
  }
  emitConnectedDevices() {
    log.info('Starting & initializing the listen to device changes');
    const rule = new schedule.RecurrenceRule();
    rule.second = [0, 10, 20, 30, 40, 50];
    schedule.scheduleJob(rule, async function () {
      let androidDeviceManager = new AndroidDeviceManager();
      let iOSDeviceManager = new IOSDeviceManager();
      const connectedAndroidDevices: Array<IDevice> = await androidDeviceManager.getDevices(actualDevices);
      const connectedIOSDevices: Array<IDevice> = await iOSDeviceManager.getDevices(actualDevices);
      eventEmitter.emit('ConnectedDevices', {
        emittedDevices: Object.assign(
          connectedAndroidDevices,
          connectedIOSDevices
        ),
      });
    });
  }

  getFreeDevice(platform: Platform, options?: IOptions): IDevice {
    log.info(`Finding Free Device for Platform ${platform}`);
    if (options) {
      return actualDevices.find(
        (device) =>
          !device.busy &&
          device.platform.toLowerCase() === platform &&
          device.name.includes(options.simulator)
      ) as IDevice;
    } else {
      return actualDevices.find(
        (device) => !device.busy && device.platform.toLowerCase() === platform
      ) as IDevice;
    }
  }

  blockDevice(freeDevice: IDevice): IDevice {
    return actualDevices.find(
      (device) =>
        device.udid === freeDevice.udid && ((device.busy = true), true)
    ) as IDevice;
  }

  unblockDevice(blockedDevice: IDevice): IDevice {
    return actualDevices.find(
      (device) =>
        device.udid === blockedDevice.udid && ((device.busy = false), true)
    ) as IDevice;
  }

  updateDevice(freeDevice: IDevice, sessionId?: string) {
    const device = actualDevices.find(
      (device) => device.udid === freeDevice.udid
    );
    const deviceIndex = findIndex(actualDevices, { udid: freeDevice.udid });
    actualDevices[deviceIndex] = Object.assign(device, { sessionId });
  }

  getDeviceForSession(sessionId: string): IDevice {
    return actualDevices.find(
      (device) => device.sessionId === sessionId
    ) as IDevice;
  }
}

export function isDeviceConfigPathAbsolute(path: string) {
  if (checkIfPathIsAbsolute(path)) {
    return true;
  } else {
    throw new Error(`Device Config Path ${path} should be absolute`);
  }
}

export function findUserSpecifiesDevices(
  userSpecifiedUDIDS: Array<string>,
  availableDevices: Array<IDevice>
) {
  const filteredDevices: Array<IDevice> = [];
  userSpecifiedUDIDS.forEach((value) =>
    filteredDevices.push(
      availableDevices.find((device) => device.udid === value) as IDevice
    )
  );
  return filteredDevices;
}

function fetchDevicesFromUDIDS(
  simulators: Array<IDevice>,
  connectedAndroidDevices: Array<IDevice>,
  connectedIOSDevices: Array<IDevice>
): Devices {
  const userSpecifiedUDIDS: Array<string> = (process.env.UDIDS as string).split(
    ','
  );
  const availableDevices: Array<IDevice> = Object.assign(
    simulators,
    connectedAndroidDevices,
    connectedIOSDevices
  );
  const filteredDevices = findUserSpecifiesDevices(
    userSpecifiedUDIDS,
    availableDevices
  );
  return new Devices(filteredDevices);
}

export async function fetchDevices() {
  const udids = process.env.UDIDS;
  if (instance === false) {
    log.info('Fetching all connected devices');
    let simulators: Array<IDevice>;
    let connectedIOSDevices: Array<IDevice>;
    let connectedAndroidDevices: Array<IDevice>;
    const simulatorManager = new SimulatorManager();
    const androidDevices = new AndroidDeviceManager();
    const iosDevices = new IOSDeviceManager();
    if (isMac()) {
      simulators = await simulatorManager.getSimulators();
      connectedIOSDevices = await iosDevices.getDevices(actualDevices);
      connectedAndroidDevices = await androidDevices.getDevices(actualDevices);
      if (udids) {
        devices = fetchDevicesFromUDIDS(
          simulators,
          connectedAndroidDevices,
          connectedIOSDevices
        );
      } else {
        devices = new Devices(
          Object.assign(
            simulators,
            connectedAndroidDevices,
            connectedIOSDevices
          )
        );
        devices.emitConnectedDevices();
      }
    } else {
      if (udids) {
        const userSpecifiedUDIDS = (process.env.UDIDS as string).split(',');
        const availableDevices = await androidDevices.getDevices(actualDevices);
        const filteredDevices = findUserSpecifiesDevices(
          userSpecifiedUDIDS,
          availableDevices
        );
        devices = new Devices(filteredDevices);
      } else {
        devices = new Devices(await androidDevices.getDevices(actualDevices));
        devices.emitConnectedDevices();
      }
    }

    instance = true;
    eventEmitter.on('ConnectedDevices', function (data) {
      const { emittedDevices } = data;
      emittedDevices.forEach((emittedDevice: IDevice) => {
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
          (device.platform === 'ios' && device.realDevice)
      );
      actualDevices.push(...emittedDevices);
    });
  }
  return devices;
}

export function listAllDevices() {
  return actualDevices;
}

export function listAllAndroidDevices() {
  return actualDevices.filter((device) => device.platform === 'android');
}

export function listAlliOSDevices() {
  return actualDevices.filter((device) => device.platform === 'ios');
}
