import { DeviceModel } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import logger from '../logger';
import { setUtilizationTime } from '../device-utils';

export function removeDevice(device: any) {
  DeviceModel.chain()
    .find({ udid: device.udid, host: { $contains: device.host } })
    .remove();
}

export function addNewDevice(devices: Array<IDevice>) {
  /**
   * If the newly identified devices are not in the database, then add them to the database
   */
  const devicesInDB = DeviceModel.chain().find().data();
  devices.forEach(function (device) {
    const isDeviceAlreadyPresent = devicesInDB.find(
      (d: IDevice) => d.udid === device.udid && device.host === d.host
    );
    if (!isDeviceAlreadyPresent) {
      DeviceModel.insert({
        ...device,
        offline: false,
        userBlocked: false,
      });
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
        logger.info(
          `Updating Simulator status from ${state} to ${device.state} for device ${device.udid}`
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

export function getDevice(filterOptions: IDeviceFilterOptions): IDevice {
  const semver = require('semver');
  var results = DeviceModel.chain();

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
    const results_copy = results.copy();
    if (results_copy.find(filter).data()[0] != undefined) {
      logger.info('Picking up booted simulator');
      return results.find(filter).data()[0];
    } else {
      filter.state = 'Shutdown';
    }
  }

  return results.find(filter).data()[0];
}

export function updatedAllocatedDevice(device: IDevice, updateData: Partial<IDevice>) {
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
  const device = DeviceModel.chain().find(filter).data()[0];
  if (device !== undefined) {
    console.log(`Found device with udid ${device.udid} to unblock with filter ${JSON.stringify(filter)}`);
    const sessionStart = device.sessionStartTime;
    const currentTime = new Date().getTime();
    const utilization = currentTime - sessionStart;
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
  } else {
    console.log(`Not able to find device to unblock with filter ${JSON.stringify(filter)}`);
  }
}
