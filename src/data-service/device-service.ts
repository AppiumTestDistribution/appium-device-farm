import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import log from '../logger';
import { setUtilizationTime } from '../device-utils';
import semver from 'semver';
import debugLog from '../debugLog';
import type { DeviceTags, Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { convertBigIntToNumber } from '../helpers';

type PrismaDeviceModel = NonNullable<Awaited<ReturnType<typeof prisma.device.findFirst>>>;

// Helper function to convert Prisma Device to IDevice
export function prismaToIDevice(device: PrismaDeviceModel | null): IDevice | null {
  if (!device) return null;
    // Convert tags string to array, handling empty strings and undefined values
    const tags = device.tags 
    ? device.tags.split(',').filter(Boolean)
    : [];
  return {
    ...device,
    lastCmdExecutedAt: device.lastCmdExecutedAt ? Number(device.lastCmdExecutedAt) : undefined,
    totalUtilizationTimeMilliSec: Number(device.totalUtilizationTimeMilliSec),
    sessionStartTime: Number(device.sessionStartTime),
    cloud: device.cloud ? JSON.parse(device.cloud) : undefined,
    chromeDriverPath: device.chromeDriverPath ? JSON.parse(device.chromeDriverPath) : undefined,
    capability: device.capability ? JSON.parse(device.capability) : undefined,
    sessionResponse: device.sessionResponse ? JSON.parse(device.sessionResponse) : undefined,
    tags
  } as IDevice;
}

// Helper function to convert IDevice to Prisma Device create/update input
function iDeviceToPrisma(device: Partial<IDevice>, isCreate = false): Prisma.DeviceCreateInput | Prisma.DeviceUpdateInput {
  const baseData = {
    lastCmdExecutedAt: device.lastCmdExecutedAt ? BigInt(device.lastCmdExecutedAt) : null,
    totalUtilizationTimeMilliSec: device.totalUtilizationTimeMilliSec ? BigInt(device.totalUtilizationTimeMilliSec) : BigInt(0),
    sessionStartTime: device.sessionStartTime ? BigInt(device.sessionStartTime) : BigInt(0),
    cloud: device.cloud ? JSON.stringify(device.cloud) : 'false',
    chromeDriverPath: device.chromeDriverPath ? JSON.stringify(device.chromeDriverPath) : null,
    capability: device.capability ? JSON.stringify(device.capability) : null,
    sessionResponse: device.sessionResponse ? JSON.stringify(device.sessionResponse) : null,
    tags: Array.isArray(device.tags) && device.tags.length > 0
    ? device.tags.join(',')
    : null,
    mjpegServerPort: device.mjpegServerPort ?? null
    };

  if (isCreate) {
    const requiredFields = [
      'systemPort', 'host', 'name', 'udid', 'state', 'sdk', 
      'platform', 'deviceType', 'realDevice', 'adbRemoteHost', 
      'adbPort', 'width', 'height'
    ];
    // For create operations, ensure all required fields are present
    const missingFields = requiredFields.filter(field => device[field as keyof IDevice] === undefined);
    if (missingFields.length > 0) {
      const error = `Missing required fields for device creation: ${missingFields.join(', ')}`;
      debugLog(`Device data: ${JSON.stringify(device, null, 2)}`);
      debugLog(error);
      throw new Error(error);
    }

    return {
      ...baseData,
      systemPort: device.systemPort,
      host: device.host,
      name: device.name,
      udid: device.udid,
      state: device.state,
      sdk: device.sdk,
      platform: device.platform,
      deviceType: device.deviceType,
      realDevice: device.realDevice,
      adbRemoteHost: device.adbRemoteHost,
      adbPort: device.adbPort,
      width: device.width,
      height: device.height,
      busy: device.busy ?? false,
      userBlocked: device.userBlocked ?? false,
      offline: device.offline ?? false,
      wdaLocalPort: device.wdaLocalPort,
      mjpegServerPort: device.mjpegServerPort,
      productModel: device.productModel,
      nodeId: device.nodeId,
    } as Prisma.DeviceCreateInput;
  }

  // For update operations, only include provided fields
  const updateData: Prisma.DeviceUpdateInput = {
    ...baseData,
  };

  // Only include fields that are actually present
  if (device.systemPort !== undefined) updateData.systemPort = device.systemPort;
  if (device.host !== undefined) updateData.host = device.host;
  if (device.name !== undefined) updateData.name = device.name;
  if (device.state !== undefined) updateData.state = device.state;
  if (device.busy !== undefined) updateData.busy = device.busy;
  if (device.userBlocked !== undefined) updateData.userBlocked = device.userBlocked;
  if (device.offline !== undefined) updateData.offline = device.offline;
  if (device.session_id !== undefined) updateData.session_id = device.session_id;

  return updateData;
}

export async function removeDevice(devices: { udid: string; host: string }[]) {
  for await (const device of devices) {
    log.info(`Removing device ${device.udid} from host ${device.host} from device list.`);
    await prisma.device.deleteMany({
      where: {
        AND: [
          { udid: device.udid },
          { host: { contains: device.host } }
        ]
      }
    });
  }
}

export async function addNewDevice(devices: IDevice[], host?: string): Promise<IDevice[]> {
  const addedDevices = await Promise.all(devices.map(async (device) => {
    if (device.host === undefined && host !== undefined) {
      device.host = host;
    }

    const deviceData = {
      ...device,
      userBlocked: false,
      offline: false,
      totalUtilizationTimeMilliSec: device.totalUtilizationTimeMilliSec || 0,
      sessionStartTime: device.sessionStartTime || 0,
      tags: device.tags || [],
      // Add defaults for required fields if they're typically available
      systemPort: device.systemPort || 8200,
      adbRemoteHost: device.adbRemoteHost || 'localhost',
      adbPort: device.adbPort || 5037,
      width: String(device.width || 0),
      height: String(device.height || 0),
      realDevice: device.realDevice ?? true,
    };
    log.info(JSON.stringify(deviceData))

    try {
      const existingDevice = await prisma.device.findFirst({
        where: {
          udid: device.udid,
          host: device.host
        }
      });

      if (!existingDevice) {
        const createdDevice = await prisma.device.create({
          data: iDeviceToPrisma(deviceData, true) as Prisma.DeviceCreateInput
        });
        return prismaToIDevice(createdDevice);
      } else {
        debugLog(`Device "${device.udid}" already exists in database`);
        return null;
      }
    } catch (error) {
      log.warn(`Unable to add device "${device.udid}" to database. Reason: ${error}`);
      return null;
    }
  }));

  const result = addedDevices.filter((device): device is IDevice => Boolean(device));
  log.debug(`Added ${result.length} new devices to local database`);
  debugLog(`Added devices: ${JSON.stringify(result)}`);

  await updateDeviceTags();
  return result;
}

export async function setSimulatorState(devices: Array<IDevice>) {
  for await (const device of devices) {
    if (device.deviceType === 'simulator') {
      const existingDevice = await prisma.device.findFirst({
        where: { udid: device.udid }
      });

      if (existingDevice && existingDevice.state !== device.state) {
        log.info(
          `Updating Simulator status from ${existingDevice.state} to ${device.state} for device ${device.udid}`,
        );
        await prisma.device.updateMany({
          where: { udid: device.udid },
          data: { state: device.state }
        });
      }
    }
  }
}

export async function updateDeviceTags() {
  const deviceTagList = await prisma.deviceTags.findMany();
  
  for (const tagData of deviceTagList) {
    await prisma.device.updateMany({
      where: { 
        udid: tagData.udid,
        host: tagData.host
      },
      data: {
        tags: tagData.tags || ''
      }
    });
  }
}

export async function getAllDevices(): Promise<IDevice[]> {
  const devices = await prisma.device.findMany();
  return devices
    .map(prismaToIDevice)
    .filter((device): device is IDevice => Boolean(device));
}

export async function getDevices(filterOptions: IDeviceFilterOptions): Promise<IDevice[]> {
  type WhereClause = {
    host?: { not?: string } | string;
    userBlocked?: boolean;
    platform?: string;
    name?: { contains: string };
    busy?: boolean;
    offline?: boolean;
    udid?: { in: string[] };
    deviceType?: string;
    session_id?: string;
    tags?: { contains: string };
  };

  const where: WhereClause = {
    host: { not: '' },
  };

  if (filterOptions.platform) where.platform = filterOptions.platform;
  
  if (filterOptions.name?.trim()) {
    where.name = { contains: filterOptions.name.trim() };
  }

  if (filterOptions.busy !== undefined) where.busy = filterOptions.busy;
  if (filterOptions.offline !== undefined) where.offline = filterOptions.offline;
  if (filterOptions.userBlocked !== undefined) where.userBlocked = filterOptions.userBlocked;
  
  if (filterOptions.udid) {
    where.udid = { 
      in: Array.isArray(filterOptions.udid) ? filterOptions.udid : [filterOptions.udid]
    };
  }

  if (filterOptions.deviceType) where.deviceType = filterOptions.deviceType;
  if (filterOptions.session_id) where.session_id = filterOptions.session_id;
  if (filterOptions.filterByHost) where.host = filterOptions.filterByHost;

  if (filterOptions.tags?.length) {
    where.tags = { contains: filterOptions.tags.join(',') };
  }
  log.info(JSON.stringify(where));
  const devices = await prisma.device.findMany({ where });
  // Post-process for semver comparisons
  return devices
    .map(prismaToIDevice)
    .filter((device): device is IDevice => {
      if (!device) return false;
      
      if (filterOptions.platformVersion) {
        const coercedPlatformVersion = semver.coerce(filterOptions.platformVersion);
        const coercedSDK = semver.coerce(device.sdk);
        if (coercedSDK && coercedPlatformVersion) {
          if (!semver.eq(coercedSDK, coercedPlatformVersion)) return false;
        }
      }

      if (filterOptions.minSDK) {
        const coercedMinSDK = semver.coerce(filterOptions.minSDK);
        const coercedSDK = semver.coerce(device.sdk);
        if (coercedSDK && coercedMinSDK) {
          if (!semver.gte(coercedSDK, coercedMinSDK)) return false;
        }
      }

      if (filterOptions.maxSDK) {
        const coercedMaxSDK = semver.coerce(filterOptions.maxSDK);
        const coercedSDK = semver.coerce(device.sdk);
        if (coercedSDK && coercedMaxSDK) {
          if (!semver.lte(coercedSDK, coercedMaxSDK)) return false;
        }
      }

      return true;
    });
}

export async function getDevice(filterOptions: IDeviceFilterOptions): Promise<IDevice | undefined> {
  const devices = await getDevices(filterOptions);
  if (devices.length === 0) {
    return undefined;
  } else {
    return devices[0];
  }
}

export async function updatedAllocatedDevice(device: IDevice, updateData: Partial<IDevice>) {
  log.info(`Updating allocated device: "${JSON.stringify(device)}"`);
  
  const prismaData = iDeviceToPrisma(updateData);
  await prisma.device.updateMany({
    where: { 
      udid: device.udid,
      host: device.host
    },
    data: prismaData
  });

  const updatedDevice = await prisma.device.findFirst({
    where: { 
      udid: device.udid,
      host: device.host
    }
  });
  const loggableUpdatedDevice = convertBigIntToNumber(updatedDevice);
  log.info(`Updated allocated device: "${JSON.stringify(loggableUpdatedDevice)}"`);
}

export async function updateCmdExecutedTime(sessionId: string) {
  await prisma.device.updateMany({
    where: { session_id: sessionId },
    data: { 
      lastCmdExecutedAt: BigInt(new Date().getTime())
    }
  });
}

export async function userBlockDevice(udid: string, host: string) {
  await prisma.device.updateMany({
    where: { udid, host },
    data: { userBlocked: true }
  });
}

export async function userUnblockDevice(udid: string, host: string) {
  await prisma.device.updateMany({
    where: { udid, host },
    data: {
      userBlocked: false,
      busy: false,
      session_id: null,
      sessionResponse: null
    }
  });
}

export async function blockDevice(udid: string, host: string) {
  await prisma.device.updateMany({
    where: { udid, host },
    data: {
      busy: true,
      lastCmdExecutedAt: null
    }
  });
}

export async function unblockDevice(udid: string, host: string) {
  await unblockDeviceMatchingFilter({ udid: [udid], host });
}

export async function unblockDeviceMatchingFilter(filter: IDeviceFilterOptions) {
  // Convert IDeviceFilterOptions to Prisma where clause
  const where: Prisma.DeviceWhereInput = {};
  
  if (filter.udid?.length === 1) {
    where.udid = filter.udid[0];
  } else if (filter.udid?.length) {
    where.udid = { in: Array.isArray(filter.udid) ? filter.udid : [filter.udid] };
  }
  
  if (filter.host) where.host = filter.host;
  if (filter.session_id) where.session_id = filter.session_id;
  if (filter.platform) where.platform = filter.platform;
  if (filter.deviceType) where.deviceType = filter.deviceType;
  if (filter.tags?.length) {
    where.tags = { contains: filter.tags.join(',') };
  }
  
  const devices = await prisma.device.findMany({ where });

  if (devices.length > 0) {
    debugLog(`Found ${devices.length} devices to unblock with filter ${JSON.stringify(filter)}`);

    await Promise.all(
      devices.map(async (device: PrismaDeviceModel) => {
        const sessionStart = Number(device.sessionStartTime);
        const currentTime = new Date().getTime();
        let utilization = currentTime - sessionStart;
        if (sessionStart === 0) {
          utilization = 0;
        }
        const totalUtilization = Number(device.totalUtilizationTimeMilliSec) + utilization;
        await setUtilizationTime(device.udid, totalUtilization);

        await prisma.device.update({
          where: { id: device.id },
          data: {
            session_id: null,
            sessionResponse: null,
            busy: false,
            userBlocked: false,
            lastCmdExecutedAt: null,
            sessionStartTime: BigInt(0),
            totalUtilizationTimeMilliSec: BigInt(totalUtilization),
            newCommandTimeout: null
          }
        });

        debugLog(`Unblocked device ${device.udid} from host ${device.host}`);
      })
    ).catch((error) => {
      log.error(`Unable to unblock device. Reason: ${error}`);
    });
  } else {
    log.warn(`Unable to find device to unblock with filter ${JSON.stringify(filter)}`);
  }
}

export async function updateDeviceName(host: string, udid: string, name: string): Promise<boolean> {
  try {
    const result = await prisma.device.updateMany({
      where: { udid, host },
      data: { name }
    });
    
    if (result.count > 0) {
      log.info(`Updated name for device ${udid} to ${name}`);
      return true;
    }
    
    log.warn(`Device ${udid} not found for name update`);
    return false;
  } catch (error) {
    log.error(`Error updating device name: ${error}`);
    return false;
  }
}
