import BasePlugin from '@appium/base-plugin';
import log from './logger';
import * as devices from './Devices';
import AsyncLock from 'async-lock';
import { waitUntil, TimeoutError } from 'async-wait-until';
import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
import { IDevice } from './interfaces/IDevice';
import { Platform } from './types/Platform';
import logger from './logger';

let noOfSessionRequests = 0;
const commandsQueueGuard = new AsyncLock();
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName: string, opts: any) {
    super(pluginName, opts);
  }

  static get argsConstraints() {
    return {
      Platform: {
        isString: true,
      },
    };
  }

  async createSession(
    next: () => any,
    driver: any,
    jwpDesCaps: any,
    jwpReqCaps: any,
    caps: { firstMatch: any[]; alwaysMatch: any }
  ) {
    let freeDevice = {} as IDevice;
    await commandsQueueGuard.acquire('DeviceManager', async () => {
      const firstMatch = Object.assign(
        {},
        caps.firstMatch[0],
        caps.alwaysMatch
      );
      console.log('CLI Args', this.cliArgs);
      await devices.fetchDevices();
      const firstMatchPlatform: Platform =
        firstMatch['platformName'].toLowerCase();
      freeDevice = devices.getFreeDevice(firstMatchPlatform);
      const assignedDevice = await _assignCapabilitiesAndBlockDevice(
        freeDevice,
        firstMatch,
        firstMatchPlatform,
        caps
      );
      if (!assignedDevice) {
        noOfSessionRequests++;
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
          noOfSessionRequests--;
        } catch (e) {
          if (e instanceof TimeoutError) {
            throw new Error('Timeout waiting for device to be free');
          }
        }
      }
    });
    const session = await next();
    if (session.error) {
      devices.unblockDevice(freeDevice, freeDevice.platform);
      log.info(
        `Device UDID ${freeDevice.udid} unblocked. Reason: Session failed to create`
      );
    } else {
      logger.info(
        `Updating Device ${freeDevice.udid} with session ID ${session.value[0]}`
      );
      devices.updateDevice(freeDevice, session.value[0]);
    }
    return session;
  }

  async deleteSession(next: () => any, driver: any, args: any) {
    const blockedDevice: IDevice = devices.getDeviceForSession(args, 'android');
    log.info(
      `Unblocking device UDID: ${blockedDevice.udid} from session ${args}`
    );
    devices.updateDevice(blockedDevice, args);
    devices.unblockDevice(blockedDevice, blockedDevice.platform);
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
    devices.blockDevice(freeDevice, firstMatchPlatform);
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
    devices.blockDevice(freeDevice, firstMatchPlatform);
    log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
    return true;
  }
  return false;
}

export function numberOfPendingSessionRequests() {
  return noOfSessionRequests;
}
