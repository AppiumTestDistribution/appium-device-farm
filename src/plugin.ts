import BasePlugin from '@appium/base-plugin';
import log from './logger';
import Devices, { fetchDevices } from './Devices';
import AsyncLock from 'async-lock';
import { waitUntil, TimeoutError } from 'async-wait-until';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
import { IDevice } from './interfaces/IDevice';

let devices: Devices;
let commandsQueueGuard = new AsyncLock();
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName: string) {
    super(pluginName);
  }

  async createSession(
    next: () => any,
    driver: any,
    jwpDesCaps: any,
    jwpReqCaps: any,
    caps: { firstMatch: any[]; alwaysMatch: any }
  ) {
    let freeDevice: IDevice;
    await commandsQueueGuard.acquire('DeviceManager', async function () {
      let firstMatch = Object.assign({}, caps.firstMatch[0], caps.alwaysMatch);
      devices = await fetchDevices();
      let firstMatchPlatform = firstMatch['platformName'];
      freeDevice = devices.getFreeDevice(firstMatchPlatform);
      const assignedDevice = await _assignCapabilitiesAndBlockDevice(
        freeDevice,
        firstMatch,
        firstMatchPlatform,
        caps
      );
      if (!assignedDevice) {
        try {
          const timeout =
            firstMatch['appium:deviceAvailabilityTimeout'] || 180000;
          const intervalBetweenAttempts =
            firstMatch['appium:deviceRetryInterval'] || 10000;
          await waitUntil(
            async () => {
              log.info('Waiting for free device');
              freeDevice = devices.getFreeDevice(firstMatchPlatform);
              return freeDevice !== undefined;
            },
            { timeout, intervalBetweenAttempts }
          );
          await _assignCapabilitiesAndBlockDevice(
            freeDevice,
            firstMatch,
            firstMatchPlatform,
            caps
          );
        } catch (e) {
          if (e instanceof TimeoutError) {
            throw new Error('Timeout waiting for device to be free');
          }
        }
      }
    });
    const session = await next();
    if (session.error) {
      devices.unblockDevice(freeDevice);
      log.info(
        `Device UDID ${freeDevice.udid} unblocked. Reason: Session failed to create`
      );
    } else {
      devices.updateDevice(freeDevice, session.value[0]);
    }
    return session;
  }

  async deleteSession(next: () => any, driver: any, args: any) {
    const blockedDevice: IDevice = devices.getDeviceForSession(args);
    log.info(
      `Unblocking device UDID: ${blockedDevice.udid} from session ${args}`
    );
    devices.updateDevice(blockedDevice);
    devices.unblockDevice(blockedDevice);
    log.info(
      `Deleting Session and device UDID ${blockedDevice.udid} is unblocked`
    );
    await next();
  }
}

async function _assignCapabilitiesAndBlockDevice(
  freeDevice: IDevice,
  firstMatch: { [x: string]: any },
  firstMatchPlatform: string,
  caps: any
) {
  if (freeDevice && firstMatchPlatform == 'android') {
    await androidCapabilities(caps, freeDevice);
    devices.blockDevice(freeDevice);
    log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
    return true;
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
    return true;
  }
  return false;
}
