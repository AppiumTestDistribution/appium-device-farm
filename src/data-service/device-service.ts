import { ATDRepository } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import log from '../logger';
import { setUtilizationTime } from '../device-utils';
import semver from 'semver';
import debugLog from '../debugLog';
import { DeviceTags } from '@prisma/client';
import { prisma } from '../prisma';
// import { setDeviceState, setDeviceStateWhenUnplugged } from '../modules/device-control/DeviceHelper';

export async function removeDevice(devices: { udid: string; host: string }[]) {
  for await (const device of devices) {
    log.info(`Removing device ${device.udid} from host ${device.host} from device list.`);
    (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid, host: { $contains: device.host } })
      .remove();
  }
  //await setDeviceStateWhenUnplugged();
}

export async function addNewDevice(devices: IDevice[], host?: string): Promise<IDevice[]> {
  /**
   * If the newly identified devices are not in the database, then add them to the database
   */
  const addedDevices = devices.map(async function (
    device: IDevice & { $loki?: number; meta?: object },
  ) {
    // make sure all devices have host
    if (device.host === undefined && host !== undefined) {
      device.host = host;
    }

    // make sure all devices have default values from IDevice
    device = Object.assign(
      {
        userBlocked: false,
        offline: false,
      } as unknown as Partial<IDevice>,
      device,
    );

    const isDeviceAlreadyPresent = (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid, host: device.host })
      .data();
    if (isDeviceAlreadyPresent.length === 0) {
      delete device['$loki'];
      delete device['meta'];
      try {
        (await ATDRepository.DeviceModel).insert({
          ...device,
        });
        return device;
      } catch (error) {
        log.warn(`Unable to add device "${device.udid}" to database. Reason: ${error}`);
      }
    } else {
      debugLog(`Device "${device.udid}" already exists in database`);
    }
  });

  // nasty hack to remove undefined values from array while satisfying typescript checker
  const result = (await Promise.all(addedDevices)).filter((device): device is IDevice =>
    Boolean(device),
  );
  log.debug(`Added ${result.length} new devices to local database`);

  debugLog(`Added devices: ${JSON.stringify(result)}`);
  // for (const iDevice of result) {
  //   await setDeviceState(iDevice);
  // }
  debugLog(
    `All devices: ${JSON.stringify((await ATDRepository.DeviceModel).chain().find().data())}`,
  );

  await updateDeviceTags();
  return result;
}

export async function setSimulatorState(devices: Array<IDevice>) {
  /**
   * Update the Latest Simulator state in DB
   */
  for await (const device of devices) {
    const allDevices = (await ATDRepository.DeviceModel).chain().find().data();
    if (allDevices.length != 0 && device.deviceType === 'simulator') {
      const { state } = allDevices.find((d: IDevice) => d.udid === device.udid);
      if (state !== device.state) {
        log.info(
          `Updating Simulator status from ${state} to ${device.state} for device ${device.udid}`,
        );
        (await ATDRepository.DeviceModel)
          .chain()
          .find({ udid: device.udid })
          .update(function (d: IDevice) {
            d.state = device.state;
          });
      }
    }
  }
}

export async function updateDeviceTags() {
  /**
   * Update the Latest Simulator state in DB
   */
  const deviceTagList: Array<DeviceTags> = await prisma.deviceTags.findMany();
  for await (const tagData of deviceTagList) {
    (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: tagData.udid, host: tagData.host })
      .update(function (d: IDevice) {
        d.tags = tagData.tags?.split(',').filter(Boolean) || [];
      });
  }
}

export async function getAllDevices(): Promise<IDevice[]> {
  return (await ATDRepository.DeviceModel).chain().find().data();
}

/**
 * Find devices matching filter options
 * @param filterOptions IDeviceFilterOptions
 * @returns IDevice[]
 */
export async function getDevices(filterOptions: IDeviceFilterOptions): Promise<IDevice[]> {
  // host, userBlocked must not be undefined
  const basicFilter = { host: { $ne: undefined }, userBlocked: { $ne: undefined } };
  const deviceModel = await ATDRepository.DeviceModel;
  let results = deviceModel.chain().find(basicFilter);
  const filter = {} as any;

  // for every keys in filterOptions, add it to the filter or modify the results query
  type FilterOptionsKey = keyof IDeviceFilterOptions;
  const filterOptionKeys = Object.keys(filterOptions) as FilterOptionsKey[];
  debugLog(filterOptionKeys);
  filterOptionKeys
    .filter((key) => filterOptions[key] !== undefined)
    .forEach((key: FilterOptionsKey) => {
      switch (key) {
        case 'platform':
          filter.platform = filterOptions.platform;
          break;
        case 'platformVersion':
          log.debug(`platformVersion: ${filterOptions.platformVersion}`);
          // eslint-disable-next-line no-case-declarations
          const coercedPlatformVersion = semver.coerce(filterOptions.platformVersion);

          results = results.where(function (obj: IDevice) {
            const coercedSDK = semver.coerce(obj.sdk);
            // log.debug(`coerced obj SDK: ${coercedSDK}`);
            if (coercedSDK && coercedPlatformVersion) {
              /*log.debug(
                `coerced obj SDK: ${coercedSDK} == coercedPlatformVersion: ${coercedPlatformVersion}`,
              );*/
              return semver.eq(coercedSDK, coercedPlatformVersion);
            }
            return false;
          });
          break;
        case 'name':
          // only is name is not empty nor undefined
          if (filterOptions.name !== undefined && filterOptions.name.trim() !== '')
            filter.name = { $contains: filterOptions.name.trim() };
          else filter.name = { $ne: undefined };
          break;
        case 'busy':
          filter.busy = filterOptions.busy;
          break;
        case 'offline':
          filter.offline = filterOptions.offline;
          break;
        case 'userBlocked':
          filter.userBlocked = filterOptions.userBlocked;
          break;
        case 'udid':
          // udid is an array
          if (filterOptions.udid && filterOptions.udid.length > 0)
            filter.udid = { $in: filterOptions.udid };
          break;
        case 'deviceType':
          filter.deviceType = filterOptions.deviceType;
          break;
        case 'session_id':
          filter.session_id = filterOptions.session_id;
          break;
        case 'filterByHost':
          filter.host = filterOptions.filterByHost;
          break;
        case 'minSDK':
          if (semver.coerce(filterOptions.minSDK)) {
            // log.debug(`minSDK: ${filterOptions.minSDK}`);
            const coercedMinSDK = semver.coerce(filterOptions.minSDK);
            results = results.where(function (obj: IDevice) {
              const coercedSDK = semver.coerce(obj.sdk);

              if (coercedSDK && coercedMinSDK) {
                // log.debug(`coerced obj SDK: ${coercedSDK} >= coercedMinSDK: ${coercedMinSDK}`);
                return semver.gte(coercedSDK, coercedMinSDK);
              }
              return false;
            });
          }
          break;
        case 'maxSDK':
          if (semver.coerce(filterOptions.maxSDK)) {
            // log.debug(`maxSDK: ${filterOptions.maxSDK}`);
            const coercedMaxSDK = semver.coerce(filterOptions.maxSDK);
            results = results.where(function (obj: IDevice) {
              const coercedSDK = semver.coerce(obj.sdk);
              // log.debug(`coerced obj SDK: ${coercedSDK}`);
              if (coercedSDK && coercedMaxSDK) {
                return semver.lte(coercedSDK, coercedMaxSDK);
              }
              return false;
            });
          }
          break;
        case 'tags':
          filter.tags = { $containsAny: filterOptions.tags };
          break;
        default:
          // do not remove this line as it will help us to know if we have missed any filter options
          // eslint-disable-next-line no-case-declarations
          const exhaustiveCheck: never = key;
          break;
      }
    });

  // if (filterOptions.deviceType === 'simulator') {
  //   filter.state = 'Booted'; // Needs a fix
  // }
  if (filter.udid) {
    const askedDevice: Array<any> = deviceModel.chain().find({ udid: filter.udid }).data();
    if (askedDevice[0].userBlocked) {
      delete filter.busy;
      delete filter.userBlocked;
    }
  }

  log.info(`Updated devices with filter: ${JSON.stringify(filter)}`);
  const matchingDevices = results.find(filter).data();
  // use the following debugging tools to debug this function
  debugLog(`basic filter: ${JSON.stringify(basicFilter)}`);
  debugLog(`all devices: ${JSON.stringify(deviceModel.chain().find().data())}`);
  debugLog(
    `basic filter applied devices: ${JSON.stringify(deviceModel.chain().find(basicFilter).data())}`,
  );
  debugLog(`filter: ${JSON.stringify(filter)}`);
  debugLog(`results: ${JSON.stringify(matchingDevices)}`);

  return matchingDevices;
}

/**
 * Find device matching the filter options
 * @param filterOptions IDeviceFilterOptions
 * @returns IDevice | undefined
 */
export async function getDevice(filterOptions: IDeviceFilterOptions): Promise<IDevice | undefined> {
  const devices = await getDevices(filterOptions);
  // log.debug(`getDevice devices: ${JSON.stringify(devices)}`);
  if (devices.length === 0) {
    return undefined;
  } else {
    return devices[0];
  }
}

export async function updatedAllocatedDevice(device: IDevice, updateData: Partial<IDevice>) {
  log.info(`Updating allocated device: "${JSON.stringify(device)}"`);
  (await ATDRepository.DeviceModel)
    .chain()
    .find({ udid: device.udid, host: device.host })
    .update(function (device: IDevice) {
      Object.assign(device, {
        ...updateData,
      });
    });
  const updatedDevicestatus = (await ATDRepository.DeviceModel)
    .chain()
    .find({ udid: device.udid, host: device.host })
    .data();
  log.info(`Updated allocated device: "${JSON.stringify(updatedDevicestatus)}"`);
}

export async function updateCmdExecutedTime(sessionId: string) {
  (await ATDRepository.DeviceModel)
    .chain()
    .find({ session_id: sessionId })
    .update(function (device: IDevice) {
      log.debug(`Updating lastCmdExecutedAt for device ${device.udid} in session ${sessionId}`);
      device.lastCmdExecutedAt = new Date().getTime();
    });
}

/**
 * Apply user blocking device. Device busy status will not be affected.
 * @param udid string
 * @param host string
 */
export async function userBlockDevice(udid: string, host: string) {
  // we are requiring host as emulator/simulator name may be the same for different hosts
  (await ATDRepository.DeviceModel)
    .chain()
    .find({ udid: udid, host: host })
    .update(function (device: IDevice) {
      device.userBlocked = true;
    });
}

export async function userUnblockDevice(udid: string, host: string) {
  // we are requiring host as emulator/simulator name may be the same for different hosts
  (await ATDRepository.DeviceModel)
    .chain()
    .find({ udid: udid, host: host })
    .update(function (device: IDevice) {
      device.userBlocked = false;
      device.busy = false;
    });
}

/**
 * Block device from being allocated to a session. Device busy status will be set to true.
 * @param udid
 * @param host
 */
export async function blockDevice(udid: string, host: string) {
  // we are requiring host as emulator/simulator name may be the same for different hosts
  (await ATDRepository.DeviceModel)
    .chain()
    .find({ udid: udid, host: host })
    .update(function (device: IDevice) {
      device.busy = true;
      device.lastCmdExecutedAt = undefined;
    });
}

export async function unblockDevice(udid: string, host: string) {
  await unblockDeviceMatchingFilter({ udid, host });
}

export async function unblockDeviceMatchingFilter(filter: object) {
  const deviceModel = await ATDRepository.DeviceModel;
  let devices;
  if (Object.keys(filter).length === 0) {
    devices = deviceModel.chain().find().data();
  } else {
    devices = deviceModel.chain().find(filter).data();
  }

  if (devices !== undefined) {
    debugLog(`Found ${devices.length} devices to unblock with filter ${JSON.stringify(filter)}`);

    await Promise.all(
      devices.map(async (device) => {
        const sessionStart = device.sessionStartTime;
        const currentTime = new Date().getTime();
        let utilization = currentTime - sessionStart;
        // no session time recorded means device was never used
        if (sessionStart === 0) {
          utilization = 0;
        }
        const totalUtilization = device.totalUtilizationTimeMilliSec + utilization;
        await setUtilizationTime(device.udid, totalUtilization);
        deviceModel.findAndUpdate(
          (data: IDevice) => {
            return data.udid === device.udid && data.host === device.host;
          },
          function (device: IDevice) {
            debugLog(`Unblocking device ${device.udid} from host ${device.host}`);
            device.session_id = undefined;
            device.busy = false;
            device.userBlocked = false;
            device.lastCmdExecutedAt = undefined;
            device.sessionStartTime = 0;
            device.totalUtilizationTimeMilliSec = totalUtilization;
            device.newCommandTimeout = undefined;
          },
        );

        debugLog(`Unblocked device ${device.udid} from host ${device.host}`);
      }),
    ).catch((error) => {
      log.error(`Unable to unblock device. Reason: ${error}`);
    });
  } else {
    log.warn(`Unable to find device to unblock with filter ${JSON.stringify(filter)}`);
  }
}
