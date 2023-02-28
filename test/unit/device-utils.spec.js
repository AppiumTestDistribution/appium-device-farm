import sinon from 'sinon';
import * as DeviceUtils from '../../src/device-utils';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { DeviceModel, db } from '../../src/data-service/db';
import ip from 'ip';
import { addNewDevice } from '../../src/data-service/device-service';
import { DeviceFarmManager } from '../../src/device-managers';
import { Container } from 'typedi';
import { allocateDeviceForSession } from '../../src/device-utils';
chai.should();
chai.use(sinonChai);
var expect = chai.expect;
var sandbox = sinon.createSandbox();

describe('Android Device Manager', () => {
  const hub1Device = {
    systemPort: 56205,
    sdk: '10',
    realDevice: true,
    name: 'emulator-5555',
    busy: false,
    state: 'device',
    udid: 'emulator-5555',
    platform: 'android',
    deviceType: 'real',
    host: 'http://192.168.0.225:4723',
    totalUtilizationTimeMilliSec: 40778,
    sessionStartTime: 1667113345897,
    offline: false,
    lastCmdExecutedAt: 1667113356356,
  };
  const hub2Device = {
    systemPort: 56205,
    sdk: '10',
    realDevice: true,
    name: 'emulator-5555',
    busy: false,
    state: 'device',
    udid: 'emulator-5555',
    platform: 'android',
    deviceType: 'real',
    host: 'http://192.168.0.226:4723',
    totalUtilizationTimeMilliSec: 40778,
    sessionStartTime: 1667113345897,
    offline: false,
    lastCmdExecutedAt: 1667113356356,
  };
  const localDeviceAndroid = {
    systemPort: 56205,
    sdk: '10',
    realDevice: true,
    name: 'emulator-5555',
    busy: false,
    state: 'device',
    udid: 'emulator-5555',
    platform: 'android',
    deviceType: 'real',
    host: `http://${ip.address()}:4723`,
    totalUtilizationTimeMilliSec: 40778,
    sessionStartTime: 1667113345897,
    offline: false,
    lastCmdExecutedAt: 1667113356356,
  };
  const localDeviceiOS = {
    name: 'iPhone SE (3rd generation)',
    udid: '14C1078F-74C1-4672-BDB7-B65FC85FBFB4',
    state: 'Shutdown',
    sdk: '16.0',
    platform: 'ios',
    wdaLocalPort: 53712,
    busy: false,
    realDevice: false,
    deviceType: 'simulator',
    host: `http://${ip.address()}:4723`,
    totalUtilizationTimeMilliSec: 0,
    sessionStartTime: 0,
    offline: false,
  };
  const devices = [hub1Device, hub2Device, localDeviceiOS];

  afterEach(function () {
    sandbox.restore();
  });

  it('Set busy status to device with same udid from remote machine', async function () {
    db.removeCollection('devices');
    const cliArgs = {
      platform: 'android',
      androidDeviceType: 'both',
      cliArgs: {
        plugin: { 'device-farm': { maxSessions: 3 } },
      },
    };
    const deviceManager = new DeviceFarmManager(cliArgs);
    Container.set(DeviceFarmManager, deviceManager);
    addNewDevice(devices);
    const capabilities = {
      alwaysMatch: {
        platformName: 'android',
        'appium:app': '/Downloads/VodQA.apk',
        'appium:deviceAvailabilityTimeout': 1800,
        'appium:deviceRetryInterval': 100,
      },
      firstMatch: [{}],
    };
    let allocatedDeviceForFirstSession = await DeviceUtils.allocateDeviceForSession(capabilities);

    function getData() {
      return DeviceModel.chain().find().data();
    }

    let foundDevice = getData().find(
      (device) =>
        device.udid === allocatedDeviceForFirstSession.udid &&
        device.host === allocatedDeviceForFirstSession.host
    );

    function getFilterDeviceWithSameUDID() {
      const devicesInDB = getData();
      return devicesInDB.filter((device) => device.udid === 'emulator-5555');
    }

    const filterDeviceWithSameUDID = getFilterDeviceWithSameUDID();
    expect(filterDeviceWithSameUDID[0].busy).to.be.true;
    expect(filterDeviceWithSameUDID[1].busy).to.be.false;
    expect(foundDevice.busy).to.be.true;

    let allocatedDeviceForSecondSession = await DeviceUtils.allocateDeviceForSession(capabilities);
    let foundSecondDevice = getData().find(
      (device) =>
        device.udid === allocatedDeviceForSecondSession.udid &&
        device.host === allocatedDeviceForSecondSession.host
    );
    expect(getFilterDeviceWithSameUDID()[0].busy).to.be.true;
    expect(getFilterDeviceWithSameUDID()[1].busy).to.be.true;
    expect(foundSecondDevice.busy).to.be.true;

    await allocateDeviceForSession(capabilities).catch((error) =>
      expect(error)
        .to.be.an('error')
        .with.property(
          'message',
          'No device found for filters: {"platform":"android","name":"","busy":false,"userBlocked":false}'
        )
    );
  });
});
