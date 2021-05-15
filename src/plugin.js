import BasePlugin from '@appium/base-plugin';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
import log from './logger';
import { fetchDevices } from './Devices';
import AsyncLock from 'async-lock';
import { waitUntil, TimeoutError } from 'async-wait-until';

let devices;
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
    this.commandsQueueGuard = new AsyncLock();
  }

  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    let freeDevice;
    await this.commandsQueueGuard.acquire('DeviceManager', async function () {
      let firstMatch = Object.assign({}, caps.firstMatch[0], caps.alwaysMatch);
      devices = await fetchDevices();
      let firstMatchPlatform = firstMatch['platformName'];
      freeDevice = devices.getFreeDevice(firstMatchPlatform);
      if (freeDevice && firstMatchPlatform == 'android') {
        await androidCapabilities(caps, freeDevice);
        devices.blockDevice(freeDevice);
        log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
      } else if (freeDevice && firstMatchPlatform == 'ios') {
        if (firstMatch['appium:iPhoneOnly']) {
          freeDevice = devices.getFreeDevice(firstMatchPlatform, {
            simulator: 'iPhone',
          });
        } else if (firstMatch['appium:iPadOnly']) {
          freeDevice = devices.getFreeDevice(firstMatchPlatform, {
            simulator: 'iPad',
          });
        }
        await iOSCapabilities(caps, freeDevice);
        devices.blockDevice(freeDevice);
        log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
      } else {
        try {
          await waitUntil(
            async () => {
              log.info('Waiting for free device');
              freeDevice = devices.getFreeDevice(firstMatchPlatform);
              return freeDevice !== undefined;
            },
            { timeout: 60000, intervalBetweenAttempts: 1000 }
          );
        } catch (e) {
          if (e instanceof TimeoutError) {
            throw new Error('Timeout waiting for device to be free');
          }
        }
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
