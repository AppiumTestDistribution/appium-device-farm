import { expect } from 'chai';
import {
  findFreeDevice,
  blockDevice,
  simulators,
  deviceState,
  unblockDevice,
} from './testHelpers';

describe('iOS', () => {
  it('Fetch all connected iOS Simulators devices and block and unblock', async () => {
    const freeDevice = await findFreeDevice(
      {
        platformName: 'ios',
        'appium:app': '/default-path/sample.app',
      },
      { Platform: 'iOS' }
    );
    const blockedDevice = blockDevice(simulators, freeDevice, 'ios');
    const deviceStateAfterBlocking = deviceState(freeDevice.udid)(
      blockedDevice
    );
    expect(deviceStateAfterBlocking).to.be.equal(true);
    const unblock = await unblockDevice(simulators, freeDevice, 'ios');
    const deviceStateAfterUnblocking = deviceState(freeDevice.udid)(unblock);
    expect(deviceStateAfterUnblocking).to.be.equal(false);
  });
});
