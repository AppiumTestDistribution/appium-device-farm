import BasePlugin from '@appium/base-plugin';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
import log from './logger';
import { fetchDevices } from './Devices';
import AsyncLock from 'async-lock';

let devices;
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
    this.commandsQueueGuard = new AsyncLock();
  }

  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    let freeDevice;
    await this.commandsQueueGuard.acquire('DeviceManager', async function () {
      devices = await fetchDevices();
      let firstMatch = caps.firstMatch[0];
      let firstMatchPlatform = firstMatch['platformName'];
      freeDevice = devices.getFreeDevice(firstMatchPlatform);
      if (freeDevice && firstMatchPlatform === 'android') {
        await androidCapabilities(caps, freeDevice);
        devices.blockDevice(freeDevice);
        log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
      } else if (freeDevice && firstMatchPlatform === 'ios') {
        if (firstMatch['appium:iPhoneOnly'] === 'true') {
          freeDevice = devices.getFreeDevice(firstMatchPlatform, {
            simulator: 'iPhone',
          });
        } else if (firstMatch['appium:iPadOnly'] === 'true') {
          freeDevice = devices.getFreeDevice(firstMatchPlatform, {
            simulator: 'iPad',
          });
        }
        await iOSCapabilities(caps, freeDevice);
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
