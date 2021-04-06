import { expect } from 'chai';

import Devices, { listAllDevices } from '../src/Devices';
import { deviceMock } from './fixtures/devices';

describe('Devices', () => {
  it('Get Free device for iOS Platform', async () => {
    const devices = new Devices(deviceMock);
    const freeDevice = await devices.getFreeDevice('ios');
    expect(freeDevice).to.deep.equal({
      name: 'iPad Air (3rd generation)',
      udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
      state: 'Shutdown',
      sdk: '13.5',
      platform: 'iOS',
      busy: false,
      realDevice: false,
    });
  });

  it('Get Free device for android Platform', async () => {
    const devices = new Devices(deviceMock);
    const freeDevice = await devices.getFreeDevice('android');
    expect(freeDevice).to.deep.equal({
      busy: false,
      state: 'device',
      udid: 'emulator-5554',
      platform: 'android',
    });
  });

  it('Block device should set busy state to true', async () => {
    const devices = new Devices(deviceMock);
    const freeDevice = await devices.getFreeDevice('android');
    await devices.blockDevice(freeDevice);
    const deviceList = await listAllDevices().find(
      (device) => freeDevice.udid === device.udid
    );
    expect(deviceList).to.deep.equal({
      busy: true,
      state: 'device',
      udid: 'emulator-5554',
      platform: 'android',
    });
  });

  it('UnBlock device should set busy state to false', async () => {
    const devices = new Devices(deviceMock);
    const blockedDevice = deviceMock.find((device) => device.busy === true);
    const unblockedDevice = await devices.unblockDevice(blockedDevice);
    expect(unblockedDevice).to.deep.equal({
      busy: false,
      state: 'device',
      udid: 'emulator-5555',
      platform: 'android',
    });
  });
});
