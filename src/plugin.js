import BasePlugin from '@appium/base-plugin';
import AndroidDeviceManager from './AndroidDeviceManager';
import getPort from 'get-port';
import log from './logger';
import Devices from './Devices';
import SimulatorManager from './SimulatorManager';
import AsyncLock from 'async-lock';

let devices;
let instance = false;
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
    this.commandsQueueGuard = new AsyncLock();
  }

  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    async function fetchDevices() {
      if (instance === false) {
        let simulatorManager = new SimulatorManager();
        const simulators = await simulatorManager.getSimulators();
        let androidDevices = new AndroidDeviceManager();
        let connectedAndroidDevices = await androidDevices.getDevices();
        devices = new Devices(
          Object.assign(simulators, connectedAndroidDevices)
        );
        instance = true;
      }
    }
    let freeDevice;
    await this.commandsQueueGuard.acquire('DeviceManager', async function () {
      await fetchDevices();
      freeDevice = devices.getFreeDevice(caps.firstMatch[0]['platformName']);
      if (freeDevice) {
        caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
        caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
        caps.firstMatch[0]['appium:systemPort'] = await getPort();
        devices.blockDevice(freeDevice);
        log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
      } else {
        throw new Error('No free device is available to create session');
      }
    });

    this.session = await next();
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
    log.info(
      `Unblocking device UDID: ${blockedDevice.udid} from session ${args}`
    );
    devices.updateDevice(blockedDevice, null);
    devices.unblockDevice(blockedDevice);
    log.info(
      `Deleting Session and device UDID ${blockedDevice.udid} is unblocked`
    );
    await next();
  }
}
