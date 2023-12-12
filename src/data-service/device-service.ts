import { DeviceModel } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import log from '../logger';
import { setUtilizationTime } from '../device-utils';

export function removeDevice(devices: { udid: string; host: string}[]) {
  devices.forEach(function (device) {
    log.info(`Removing device ${device.udid} from host ${device.host} from device list.`);
    DeviceModel.chain()
      .find({ udid: device.udid, host: { $contains: device.host } })
      .remove();
  })
}

export function addNewDevice(devices: IDevice[]) {
  /**
   * If the newly identified devices are not in the database, then add them to the database
   */
  devices.forEach(function (device) {
    const isDeviceAlreadyPresent = DeviceModel.chain()
      .find({ udid: device.udid, host: device.host })
      .data();
    if (isDeviceAlreadyPresent.length === 0) {
      // @ts-ignore
      delete device['$loki'];
      // @ts-ignore
      delete device['meta'];
      try {
        DeviceModel.insert({
          ...device,
          offline: false,
          userBlocked: false,
        });
      } catch (error) {
        log.warn(`Unable to add device "${device.udid}" to database. Reason: ${error}`);
      }
    } else {
      log.debug(`Device "${device.udid}" already exists in database`);
    }
  });
}

export function setSimulatorState(devices: Array<IDevice>) {
  /**
   * Update the Latest Simulator state in DB
   */
  devices.forEach(function (device) {
    const allDevices = DeviceModel.chain().find().data();
    if (allDevices.length != 0 && device.deviceType === 'simulator') {
      const { state } = allDevices.find((d: IDevice) => d.udid === device.udid);
      if (state !== device.state) {
        log.info(
          `Updating Simulator status from ${state} to ${device.state} for device ${device.udid}`,
        );
        DeviceModel.chain()
          .find({ udid: device.udid })
          .update(function (d: IDevice) {
            d.state = device.state;
          });
      }
    }
  });
}

export function getAllDevices(): Array<IDevice> {
  return DeviceModel.chain().find().data();
}

/**
 * Find devices matching filter options
 * @param filterOptions IDeviceFilterOptions
 * @returns IDevice[]
 */
export function getDevices(filterOptions: IDeviceFilterOptions): IDevice[] {
  const semver = require('semver');
  let results = DeviceModel.chain();

  if (semver.coerce(filterOptions.minSDK)) {
    results = results.where(function (obj: IDevice) {
      if (semver.coerce(obj.sdk)) {
        return semver.gte(semver.coerce(obj.sdk), semver.coerce(filterOptions.minSDK));
      }
      return false;
    });
  }

  if (semver.coerce(filterOptions.maxSDK)) {
    results = results.where(function (obj: IDevice) {
      if (semver.coerce(obj.sdk)) {
        return semver.lte(semver.coerce(obj.sdk), semver.coerce(filterOptions.maxSDK));
      }
      return false;
    });
  }

  const filter = {
    platform: filterOptions.platform,
    name: { $contains: filterOptions.name || '' },
    busy: filterOptions.busy,
  } as any;

  if (filterOptions.platformVersion) {
    filter.sdk = filterOptions.platformVersion;
  }

  if (filterOptions.udid) {
    filter.udid = { $in: filterOptions.udid };
  }

  if (filterOptions.deviceType === 'simulator') {
    filter.state = 'Booted';
  }
  return results.find(filter).data();
}

/**
 * Find device matching the filter options
 * @param filterOptions IDeviceFilterOptions
 * @returns IDevice | undefined
 */
export function getDevice(filterOptions: IDeviceFilterOptions): IDevice | undefined {
  const devices = getDevices(filterOptions);
  if (devices.length === 0) {
    return undefined;
  } else {
    return devices[0];
  }
}

export function updatedAllocatedDevice(device: IDevice, updateData: Partial<IDevice>) {
  log.info(`Updating allocated device: "${JSON.stringify(device)}"`);
  DeviceModel.chain()
    .find({ udid: device.udid, host: device.host })
    .update(function (device: IDevice) {
      Object.assign(device, {
        ...updateData,
      });
    });
}
export function updateDevice(device: IDevice, updateData: Partial<IDevice>) {
  const filterDevice = DeviceModel.chain().find({
    udid: device.udid,
  });
  if (filterDevice.data().length > 1) {
    const find = filterDevice.data().find((d) => d.busy === false);
    DeviceModel.chain()
      .find({ udid: find.udid, host: find.host })
      .update(function (device: IDevice) {
        Object.assign(device, {
          ...updateData,
        });
      });
  } else {
    filterDevice.update(function (device: IDevice) {
      Object.assign(device, {
        ...updateData,
      });
    });
  }
}

export function updateCmdExecutedTime(sessionId: string) {
  DeviceModel.chain()
    .find({ session_id: sessionId })
    .update(function (device: IDevice) {
      device.lastCmdExecutedAt = new Date().getTime();
    });
}

export async function unblockDevice(filter: object) {
  const devices = DeviceModel.chain().find(filter).data();
  if (devices !== undefined) {
    console.log(
      `Found ${devices.length} devices to unblock with filter ${JSON.stringify(filter)}`,
    );

    await Promise.all(devices.map(async (device) => {
      const sessionStart = device.sessionStartTime;
      const currentTime = new Date().getTime();
      let utilization = currentTime - sessionStart;
      // no session time recorded means device was never used
      if (sessionStart === 0) {
        utilization = 0;
      }
      const totalUtilization = device.totalUtilizationTimeMilliSec + utilization;
      await setUtilizationTime(device.udid, totalUtilization);
      DeviceModel.chain()
        .find(filter)
        .update(function (device: IDevice) {
          device.session_id = undefined;
          device.busy = false;
          device.lastCmdExecutedAt = undefined;
          device.sessionStartTime = 0;
          device.totalUtilizationTimeMilliSec = totalUtilization;
          device.newCommandTimeout = undefined;
        });
    }));
  } else {
    console.log(`Not able to find device to unblock with filter ${JSON.stringify(filter)}`);
  }
}
