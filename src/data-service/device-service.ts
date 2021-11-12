import { DeviceModel } from './db';
import { IDevice } from '../interfaces/IDevice';
import { IDeviceFilterOptions } from '../interfaces/IDeviceFilterOptions';

export function saveDevices(devices: Array<IDevice>): any {
  const newDeviveUdids = new Set(devices.map((device) => device.udid));
  const allDeviceIds = DeviceModel.chain()
    .find()
    .data()
    .map((device) => device.udid);

  /**
   * Update all devices that are previously identified as offline devices
   */
  DeviceModel.chain()
    .find({ udid: { $nin: [...newDeviveUdids] } }) // $nin => not in condition
    .update(function (device) {
      device.offline = true;
    });

  /**
   * If the newly identified devices are already in the database, then just update the offile state as true
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

  const device = DeviceModel.chain().find(filter).data()[0];

  return device;
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

export function unblockDevice(sessionId: string) {
  DeviceModel.chain()
    .find({
      session_id: sessionId,
    })
    .update(function (device) {
      device.session_id = undefined;
      device.busy = false;
    });
}
