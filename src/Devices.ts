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
      const androidDeviceManager = new AndroidDeviceManager();
      const iOSDeviceManager = new IOSDeviceManager();
      const connectedAndroidDevices: Array<IDevice> =
        await androidDeviceManager.getDevices();
      const connectedIOSDevices: Array<IDevice> =
        await iOSDeviceManager.getDevices();
      eventEmitter.emit('ConnectedDevices', {
        emittedDevices: Object.assign(
          connectedAndroidDevices,
          connectedIOSDevices
        ),
      });
    });
  }

  private isDeviceBusy = (device: IDevice) => device.busy;
  private devicePlatForm = (device: IDevice) => device.platform.toLowerCase();
  private findDeviceAndSetState = (currentDevice: IDevice, state: boolean) =>
    actualDevices.find(
      (device) =>
        device.udid === currentDevice.udid && ((device.busy = state), true)
    ) as IDevice;

  getFreeDevice(platform: Platform, options?: IOptions): IDevice {
    log.info(`Finding Free Device for Platform ${platform}`);

    const deviceState = (device: IDevice) => {
      return (
        !this.isDeviceBusy(device) && this.devicePlatForm(device) === platform
      );
    };

    if (options) {
      return actualDevices.find(
        (device) =>
          deviceState.call(this, device) &&
          device.name.includes(options.simulator)
      ) as IDevice;
    } else {
      return actualDevices.find((device) =>
        deviceState.call(this, device)
      ) as IDevice;
    }
  }

  blockDevice = (freeDevice: IDevice): IDevice =>
    this.findDeviceAndSetState(freeDevice, true) as IDevice;

  unblockDevice = (blockedDevice: IDevice): IDevice =>
    this.findDeviceAndSetState(blockedDevice, false);

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

export async function fetchDevices(): Promise<Devices> {
  const udids = process.env.UDIDS;
  if (!instance) {
    log.info('Fetching all connected devices');
    let simulators: Array<IDevice>;
    let connectedIOSDevices: Array<IDevice>;
    let connectedAndroidDevices: Array<IDevice>;
    const simulatorManager = new SimulatorManager();
    const androidDevices = new AndroidDeviceManager();
    const iosDevices = new IOSDeviceManager();
    if (isMac()) {
      simulators = await simulatorManager.getSimulators();
      connectedIOSDevices = await iosDevices.getDevices();
      connectedAndroidDevices = await androidDevices.getDevices();
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
        const availableDevices = await androidDevices.getDevices();
        const filteredDevices = findUserSpecifiesDevices(
          userSpecifiedUDIDS,
          availableDevices
        );
        devices = new Devices(filteredDevices);
      } else {
        devices = new Devices(await androidDevices.getDevices());
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

export function listAllDevices(): Array<IDevice> {
  return actualDevices;
}

export function listAllAndroidDevices() {
  return actualDevices.filter((device) => device.platform === 'android');
}

export function listAlliOSDevices() {
  return actualDevices.filter((device) => device.platform === 'ios');
}
