import { ATDRepository } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import log from '../logger';
import semver from 'semver';
import debugLog from '../debugLog';
import { Device, DeviceTags, TeamDevice } from '@prisma/client';
import { prisma } from '../prisma';
import getUuid from 'uuid-by-string';
import { DevicePlugin } from '../plugin';

export function generateDeviceId(device: {
  platform: string;
  realDevice?: boolean;
  real?: boolean;
  nodeId?: string;
  udid: string;
}) {
  if (device.realDevice || device.real || device.platform === 'ios') {
    return getUuid(device.udid);
  } else {
    return getUuid(`${device.nodeId}-${device.udid}`);
  }
}

export async function setUtilizationTime(id: string, utilizationTime: number) {
  await prisma.device.update({
    where: { id },
    data: {
      usage: utilizationTime,
    },
  });
}

export async function removeDevicesForNodes(nodeIds: string[]) {
  (await ATDRepository.DeviceModel)
    .chain()
    .find({ nodeId: { $in: nodeIds } })
    .remove();

  await prisma.device.updateMany({
    where: {
      nodeId: {
        in: nodeIds,
      },
    },
    data: {
      isActive: false,
    },
  });
}

export async function removeDevice(devices: IDevice[]) {
  const deviceIds = devices.map((d) => generateDeviceId(d));

  await prisma.device.updateMany({
    where: {
      id: {
        in: deviceIds,
      },
    },
    data: {
      isActive: false,
    },
  });

  for await (const device of devices) {
    log.info(`Removing device ${device.udid} from host ${device.host} from device list.`);
    (await ATDRepository.DeviceModel)
      .chain()
      .find({ udid: device.udid, host: { $contains: device.host } })
      .remove();
  }
}

export async function addNewDevice(devices: IDevice[], host?: string): Promise<IDevice[]> {
  /**
   * If the newly identified devices are not in the database, then add them to the database
   */
  const savedDevices = await prisma.device.findMany();
  const devicesToAdd = devices
    .map((d) => {
      d.id = d.id ?? generateDeviceId(d);
      return d;
    })
    .filter((device) => !savedDevices.some((savedDevice) => savedDevice.id === device.id))
    .map(
      (device) =>
        ({
          id: device.id,
          name: device.name,
          udid: device.udid,
          host: device.host,
          platform: device.platform,
          version: device.sdk,
          nodeId: device.nodeId,
          real: device.realDevice,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: null,
          isActive: true,
        }) as Device,
    );

  const alreadyAddedDevices = devices
    .map((d) => {
      d.id = d.id ?? generateDeviceId(d);
      return d;
    })
    .filter((device) => savedDevices.some((savedDevice) => savedDevice.id === device.id));

  await prisma.device.updateMany({
    where: {
      id: {
        in: alreadyAddedDevices.map((d) => generateDeviceId(d)),
      },
    },
    data: {
      isActive: true,
    },
  });

  await prisma.device.createMany({
    data: devicesToAdd,
  });

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

  await updateDeviceDetails();
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

export async function updateDeviceDetails() {
  /**
   * Update the Latest Simulator state in DB
   */
  const deviceTagList: Array<Device> = await prisma.device.findMany();
  for await (const device of deviceTagList) {
    (await ATDRepository.DeviceModel)
      .chain()
      .find({ id: generateDeviceId(device) })
      .update(function (d: IDevice) {
        d.name = device.name ?? d.name;
        d.tags = device.tags?.split(',').filter(Boolean) || [];
        d.totalUtilizationTimeMilliSec = device.usage;
      });
  }
}

export async function getAllDevices(filterOptions?: { userId?: string }): Promise<IDevice[]> {
  const devices = (await ATDRepository.DeviceModel).chain().find().data();
  if (filterOptions?.userId) {
    return filterDeviceForUser(filterOptions.userId, devices);
  }
  return devices;
}

export async function getTeamDevicesForUser(userId: string): Promise<TeamDevice[]> {
  const userTeams = await prisma.teamMember.findMany({
    where: {
      userId: userId,
    },
    include: {
      team: true,
    },
  });

  const teamDevices = await prisma.teamDevice.findMany({
    where: {
      teamId: {
        in: userTeams.map((ut) => ut.team.id),
      },
      device: {
        isFlagged: false,
      },
    },
    include: {
      device: true,
    },
  });

  return teamDevices;
}

export async function filterDeviceForUser(
  userId: string,
  filteredDevices: IDevice[],
): Promise<IDevice[]> {
  const teamDevices = await getTeamDevicesForUser(userId);
  const devicesWithAccess = teamDevices.map((td) => td.deviceId);
  return filteredDevices.filter((d) => devicesWithAccess.includes(d.id || generateDeviceId(d)));
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
          const exhaustiveCheck = key;
          break;
      }
    });

  // if (filterOptions.deviceType === 'simulator') {
  //   filter.state = 'Booted'; // Needs a fix
  // }
  if (filter.udid) {
    const askedDevice: Array<any> = deviceModel.chain().find({ udid: filter.udid }).data();
    if (askedDevice.length && askedDevice[0].userBlocked) {
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
  if (filterOptions.userId) {
    const filteredDevices = await filterDeviceForUser(filterOptions.userId, matchingDevices);
    debugLog(
      `filtered devices for user ${filterOptions.userId}: ${JSON.stringify(filteredDevices)}`,
    );
    // Sort devices by total utilization time in ascending order (least used first)
    return filteredDevices.sort(
      (d1, d2) => d1.totalUtilizationTimeMilliSec - d2.totalUtilizationTimeMilliSec,
    );
  }
  return matchingDevices.sort(
    (d1, d2) => d1.totalUtilizationTimeMilliSec - d2.totalUtilizationTimeMilliSec,
  );
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
      device.session_id = undefined;
      device.sessionResponse = undefined;
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
        if (DevicePlugin.IS_HUB) {
          await setUtilizationTime(generateDeviceId(device), totalUtilization);
        }
        deviceModel.findAndUpdate(
          (data: IDevice) => {
            return data.udid === device.udid && data.host === device.host;
          },
          function (device: IDevice) {
            debugLog(`Unblocking device ${device.udid} from host ${device.host}`);
            device.session_id = undefined;
            device.sessionResponse = undefined;
            device.busy = false;
            device.userBlocked = false;
            device.lastCmdExecutedAt = undefined;
            device.sessionStartTime = 0;
            device.totalUtilizationTimeMilliSec = totalUtilization;
            device.newCommandTimeout = undefined;
            device.activeUser = undefined;
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
export async function updateDeviceName(host: string, udid: string, name: string): Promise<boolean> {
  const deviceModel = await ATDRepository.DeviceModel;
  const device = deviceModel.chain().find({ udid: udid, host: host }).data()[0];

  if (device) {
    deviceModel
      .chain()
      .find({ udid: udid, host: host })
      .update(function (device: IDevice) {
        device.name = name;
      });
    log.info(`Updated name for device ${udid} to ${name}`);
    return true;
  }

  log.warn(`Device ${udid} not found for name update`);
  return false;
}
