// import BasePlugin from '@appium/base-plugin';
// import log from './logger';
// import * as devices from './Devices';
// import AsyncLock from 'async-lock';
// import { waitUntil, TimeoutError } from 'async-wait-until';
// import { androidCapabilities, iOSCapabilities } from './CapabilityManager';
// import { IDevice } from './interfaces/IDevice';
// import { Platform } from './types/Platform';
// import logger from './logger';
// import { router } from './app';

// let noOfSessionRequests = 0;
// const commandsQueueGuard = new AsyncLock();
// class DevicePlugin extends BasePlugin {
//   constructor(pluginName: string, opts: any) {
//     super(pluginName, opts);
//   }

//   static get argsConstraints() {
//     return {
//       Platform: {
//         isString: true,
//       },
//     };
//   }

//   public static updateServer(expressApp: any) {
//     expressApp.use('/device-farm', router);
//     log.info(
//       'Device Farm Plugin will be served at http://localhost:4723/device-farm'
//     );
//     log.info(
//       'If the appium server is started with different port other than 4723, then use the correct port number to access the device farm dashboard'
//     );
//   }

//   async createSession(
//     next: () => any,
//     driver: any,
//     jwpDesCaps: any,
//     jwpReqCaps: any,
//     caps: { firstMatch: any[]; alwaysMatch: any }
//   ) {
//     let freeDevice = {} as IDevice;
//     await commandsQueueGuard.acquire('DeviceManager', async () => {
//       const firstMatch = Object.assign(
//         {},
//         caps.firstMatch[0],
//         caps.alwaysMatch
//       );
//       await devices.fetchDevices(this.cliArgs);
//       const firstMatchPlatform: Platform =
//         firstMatch['platformName'].toLowerCase();
//       freeDevice = devices.getFreeDevice(firstMatch);
//       logger.info(`Found Device ${JSON.stringify(freeDevice)}`);
//       const assignedDevice = await _assignCapabilitiesAndBlockDevice(
//         freeDevice,
//         firstMatch,
//         firstMatchPlatform,
//         caps
//       );
//       if (!assignedDevice) {
//         noOfSessionRequests++;
//         try {
//           const timeout =
//             firstMatch['appium:deviceAvailabilityTimeout'] || 180000;
//           const intervalBetweenAttempts =
//             firstMatch['appium:deviceRetryInterval'] || 10000;
//           await waitUntil(
//             async () => {
//               log.info('Waiting for free device');
//               freeDevice = devices.getFreeDevice(firstMatchPlatform);
//               return freeDevice !== undefined;
//             },
//             { timeout, intervalBetweenAttempts }
//           );
//           await _assignCapabilitiesAndBlockDevice(
//             freeDevice,
//             firstMatch,
//             firstMatchPlatform,
//             caps
//           );
//           noOfSessionRequests--;
//         } catch (e) {
//           if (e instanceof TimeoutError) {
//             throw new Error('Timeout waiting for device to be free');
//           }
//         }
//       }
//     });
//     const session = await next();
//     if (session.error) {
//       devices.unblockDevice(freeDevice, freeDevice.platform);
//       log.info(
//         `Device UDID ${freeDevice.udid} unblocked. Reason: Session failed to create`
//       );
//     } else {
//       logger.info(
//         `Updating Device ${freeDevice.udid} with session ID ${session.value[0]}`
//       );
//       devices.updateDevice(freeDevice, session.value[0]);
//     }
//     return session;
//   }

//   async deleteSession(next: () => any, driver: any, args: any) {
//     const blockedDevice: IDevice = devices.getDeviceForSession(args);
//     log.info(
//       `Unblocking device UDID: ${blockedDevice.udid} from session ${args}`
//     );
//     devices.updateDevice(blockedDevice, args);
//     devices.unblockDevice(blockedDevice, blockedDevice.platform);
//     log.info(
//       `Deleting Session and device UDID ${blockedDevice.udid} is unblocked`
//     );
//     await next();
//   }
// }

// async function _assignCapabilitiesAndBlockDevice(
//   freeDevice: IDevice,
//   firstMatch: { [x: string]: any },
//   firstMatchPlatform: string,
//   caps: any
// ) {
//   if (freeDevice && firstMatchPlatform == 'android') {
//     await androidCapabilities(caps, freeDevice);
//     devices.blockDevice(freeDevice, firstMatchPlatform);
//     log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
//     return true;
//   } else if (freeDevice && firstMatchPlatform == 'ios') {
//     if (firstMatch['appium:iPhoneOnly']) {
//       freeDevice = devices.getFreeDevice(firstMatch, {
//         simulator: 'iPhone',
//       });
//     } else if (firstMatch['appium:iPadOnly']) {
//       freeDevice = devices.getFreeDevice(firstMatch, {
//         simulator: 'iPad',
//       });
//     }
//     await iOSCapabilities(caps, freeDevice);
//     devices.blockDevice(freeDevice, firstMatchPlatform);
//     log.info(`Device UDID ${freeDevice.udid} is blocked for execution.`);
//     return true;
//   }
//   return false;
// }

// function numberOfPendingSessionRequests() {
//   return noOfSessionRequests;
// }

// export { DevicePlugin, numberOfPendingSessionRequests };
