import { DeviceModel } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import logger from '../logger';
import { setUtilizationTime } from '../device-utils';

export function saveDevices(devices: Array<IDevice>): any {
  const connectedDeviceIds = new Set(devices.map((device) => device.udid));
  const devicesInDB = DeviceModel.chain().find().data();
  /**
   * Previously connected devices which are not identified remove.
   */
  DeviceModel.chain()
    .find({ udid: { $nin: [...connectedDeviceIds] } }) // $nin => not in condition
    .remove();

  /**
   * Check if the device is disconnected and remove from the DB instance.
   */
  devicesInDB.forEach((device: IDevice) => {
    const isDeviceConneted = devices.find(
      (d: IDevice) => d.udid === device.udid && device.host === d.host
    );
    if (!isDeviceConneted) {
      DeviceModel.chain().find({ udid: device.udid, host: device.host }).remove();
    }
  });

  /**
   * If the newly identified devices are not in the database, then add them to the database
   */
  devices.forEach(function (device) {
    const isDeviceAlreadyPresent = devicesInDB.find(
      (d: IDevice) => d.udid === device.udid && device.host === d.host
    );
    if (!isDeviceAlreadyPresent) {
      DeviceModel.insert({
        ...device,
        offline: false,
      });
    }
  });

  /**
   * Update the Latest Simulator state in DB
   */
  devices.forEach(function (device) {
    const allDevices = DeviceModel.chain().find().data();
    if (allDevices.length != 0 && device.deviceType === 'simulator') {
      const { state } = allDevices.find((d: IDevice) => d.udid === device.udid);
      if (state !== device.state) {
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

  if (filterOptions.minSDK) {
    filter.sdk = { $gte: filterOptions.minSDK };
  }

  if (filterOptions.deviceType === 'simulator') {
    filter.state = 'Booted';
    if (DeviceModel.chain().find(filter).data()[0] != undefined) {
      logger.info('Picking up booted simulator');
      return DeviceModel.chain().find(filter).data()[0];
    } else {
      filter.state = 'Shutdown';
    }
  }
  return DeviceModel.chain().find(filter).data()[0];
}

export function updateDevice(device: IDevice, updateData: Partial<IDevice>) {
  DeviceModel.chain()
    .find({
      udid: device.udid,
    })
    .update(function (device: IDevice) {
      Object.assign(device, {
        ...updateData,
      });
    });
}

export function updateCmdExecutedTime(sessionId: string) {
  DeviceModel.chain()
    .find({ session_id: sessionId })
    .update(function (device: IDevice) {
      device.lastCmdExecutedAt = new Date().getTime();
    });
}

export function unblockDevice(sessionId: string) {
  const device = DeviceModel.chain().find({ session_id: sessionId }).data()[0];
  const sessionStart = device.sessionStartTime;
  const currentTime = new Date().getTime();
  const utilization = currentTime - sessionStart;
  const totalUtilization = device.totalUtilizationTimeMilliSec + utilization;
  setUtilizationTime(device.udid, totalUtilization);
  DeviceModel.chain()
    .find({
      session_id: sessionId,
    })
    .update(function (device: IDevice) {
      device.session_id = undefined;
      device.busy = false;
      device.lastCmdExecutedAt = undefined;
      device.sessionStartTime = 0;
      device.totalUtilizationTimeMilliSec = totalUtilization;
      device.newCommandTimeout = undefined;
    });
}
