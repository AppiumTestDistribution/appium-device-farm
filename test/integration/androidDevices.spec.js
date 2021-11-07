import { expect } from 'chai';
import {
  findFreeDevice,
  blockDevice,
  deviceState,
  androidDevices,
  unblockDevice,
  updateDevice,
  sessionId
} from './testHelpers';

describe('Get Devices', () => {
  it('Fetch all connected android devices and block and unblock', async () => {
    const freeDevice = await findFreeDevice(
      {
        platformName: 'android',
        'appium:app': '/default-path/sample.apk',
      },
      { Platform: 'android' }
    );
    const blockedDevice = blockDevice(androidDevices, freeDevice, 'android');
    const deviceStateAfterBlocking = deviceState(freeDevice.udid)(
      blockedDevice
    );
    expect(deviceStateAfterBlocking).to.be.equal(true);
    const unblock = await unblockDevice(androidDevices, freeDevice, 'android');
    const deviceStateAfterUnblocking = deviceState(freeDevice.udid)(unblock);
    expect(deviceStateAfterUnblocking).to.be.equal(false);
  });

  it('Attach a sessionId to blocked device', async () => {
    const freeDevice = await findFreeDevice(
      {
        platformName: 'android',
        'appium:app': '/default-path/sample.apk',
      },
      { Platform: 'android' }
    );
    blockDevice(androidDevices, freeDevice, 'android');
    const deviceAfterUpdate = updateDevice(
      androidDevices,
      freeDevice,
      '11111111111111'
    );
    const session = sessionId(freeDevice.udid)(deviceAfterUpdate);
    expect(session).to.be.equal('11111111111111');
  });
});
