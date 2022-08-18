import { DeviceModel } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';
import logger from '../logger';

export function saveDevices(devices: Array<IDevice>): any {
  const newDeviveUdids = new Set(devices.map((device) => device.udid));
  const allDeviceIds = DeviceModel.chain()
    .find()
    .data()
    .map((device) => device.udid);

  /**
   * Previously connected devices which are not identified are marked offline.
   */
  DeviceModel.chain()
    .find({ udid: { $nin: [...newDeviveUdids] } }) // $nin => not in condition
    .update(function (device) {
      device.offline = true;
    });

  /**
   * If the newly identified devices are already in the database, mark the device as online
   */
  DeviceModel.chain()
    .find({ udid: { $in: [...newDeviveUdids] } })
    .update(function (device) {
      device.offline = false;
    });

  /**
   * If the newly identified devices are not in the database, then add them to the database
   */
  devices.forEach(function (device) {
    if (!allDeviceIds.includes(device.udid)) {
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
      const { state } = allDevices.find((d) => d.udid === device.udid);
      if (state !== device.state) {
        DeviceModel.chain()
          .find({ udid: device.udid })
          .update(function (d) {
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
    offline: filterOptions.offline,
  } as any;

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
    .update(function (device) {
      Object.assign(device, {
        ...updateData,
      });
    });
}

export function updateCmdExecutedTime(sessionId: string) {
  DeviceModel.chain()
    .find({ session_id: sessionId })
    .update(function (device) {
      device.lastCmdExecutedAt = new Date().getTime();
    });
}

export function unblockDevice(sessionId: string) {
  DeviceModel.chain()
    .find({
      session_id: sessionId,
    })
    .update(function (device) {
      device.session_id = undefined;
      device.busy = false;
      device.lastCmdExecutedAt = undefined;
    });
}
