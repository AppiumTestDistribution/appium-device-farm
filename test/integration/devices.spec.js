import * as device from '../../src/Devices';
import { expect } from 'chai';
import { curry, find, pipe, prop, propEq } from 'ramda';

describe('Get Devices', () => {
  it('Fetch all connected android devices and block and unblock', async () => {
    const freeDevice = await findFreeDevice({
      platformName: 'android',
      'appium:app': '/default-path/sample.apk',
    });
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
    const freeDevice = await findFreeDevice({
      platformName: 'android',
      'appium:app': '/default-path/sample.apk',
    });
    blockDevice(androidDevices, freeDevice, 'android');
    const deviceAfterUpdate = updateDevice(
      androidDevices,
      freeDevice,
      '11111111111111'
    );
    const session = sessionId(freeDevice.udid)(deviceAfterUpdate);
    expect(session).to.be.equal('11111111111111');
  });

  it('Fetch all connected iOS Simulators devices and block and unblock', async () => {
    const freeDevice = await findFreeDevice({
      platformName: 'ios',
      'appium:app': '/default-path/sample.app',
    });
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

const deviceState = (device) =>
  pipe(find(propEq('udid', device)), prop('busy'));

const sessionId = (device) =>
  pipe(find(propEq('udid', device)), prop('sessionId'));

async function findFreeDevice(firstMatch) {
  await device.fetchDevices();
  return device.getFreeDevice(firstMatch);
}

const androidDevices = () => device.listAllAndroidDevices();
const simulators = () => device.listiOSSimulators();
const blockDevice = curry((devices, freeDevice, platform) => {
  device.blockDevice(freeDevice, platform);
  return devices();
});

const unblockDevice = curry((devices, freeDevice, platform) => {
  device.unblockDevice(freeDevice, platform);
  return devices();
});

const updateDevice = curry((devices, freeDevice, sessionId) => {
  device.updateDevice(freeDevice, sessionId);
  return devices();
});
