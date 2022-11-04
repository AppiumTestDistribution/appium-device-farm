import sinon from 'sinon';
import * as DeviceUtils from '../../src/device-utils';
import * as DeviceServices from '../../src/data-service/device-service';

var sandbox = sinon.createSandbox();

describe('Android Device Manager', () => {
  const nonLocalDeviceToBeUnblocked = {
    systemPort: 56205,
    sdk: '10',
    realDevice: true,
    name: 'violet',
    busy: true,
    state: 'device',
    udid: '21779d20',
    platform: 'android',
    deviceType: 'real',
    host: 'http://192.168.0.225:4723',
    totalUtilizationTimeMilliSec: 40778,
    sessionStartTime: 1667113345897,
    offline: false,
    meta: {
      revision: 9,
      created: 1667113187556,
      version: 0,
      updated: 1667113356356,
    },
    $loki: 1,
    session_id: 'aaa3e1a5-58dd-5aea-898c-7aaaec3b094b',
    lastCmdExecutedAt: 1667113356356,
  };
  const deviceToBeUnblocked = {
    systemPort: 56205,
    sdk: '10',
    realDevice: true,
    name: 'violet',
    busy: true,
    state: 'device',
    udid: '21779d20',
    platform: 'android',
    deviceType: 'real',
    host: 'http://127.0.0.1:4723',
    totalUtilizationTimeMilliSec: 40778,
    sessionStartTime: 1667113345897,
    offline: false,
    meta: {
      revision: 9,
      created: 1667113187556,
      version: 0,
      updated: 1667113356356,
    },
    $loki: 1,
    session_id: 'ce23e1a5-58dd-5aea-898c-7104ec3b094b',
    lastCmdExecutedAt: 1667113356356,
  };
  const deviceToBeNotUnblocked = {
    systemPort: 56205,
    sdk: '10',
    realDevice: true,
    name: 'violet',
    busy: true,
    state: 'device',
    udid: '21779d20',
    platform: 'android',
    deviceType: 'real',
    host: 'http://127.0.0.1:4723',
    totalUtilizationTimeMilliSec: 40778,
    sessionStartTime: 1667113345897,
    offline: false,
    meta: {
      revision: 9,
      created: 1667113187556,
      version: 0,
      updated: new Date().getTime(),
    },
    $loki: 2,
    session_id: 'ae23e1a5-48dd-4aea-998c-7104ec3b094i',
    lastCmdExecutedAt: new Date().getTime(),
  };
  const freeDevice = {
    name: 'iPhone SE (3rd generation)',
    udid: '14C1078F-74C1-4672-BDB7-B65FC85FBFB4',
    state: 'Shutdown',
    sdk: '16.0',
    platform: 'ios',
    wdaLocalPort: 53712,
    busy: false,
    realDevice: false,
    deviceType: 'simulator',
    host: 'http://192.168.0.225:4723',
    totalUtilizationTimeMilliSec: 0,
    sessionStartTime: 0,
    offline: false,
    meta: {
      revision: 0,
      created: 1667111869805,
      version: 0,
    },
    $loki: 3,
  };
  const devices = [
    nonLocalDeviceToBeUnblocked,
    deviceToBeNotUnblocked,
    deviceToBeUnblocked,
    freeDevice,
  ];

  // afterEach(function () {
  //   sandbox.restore();
  // });

  it.only('should call save once', function () {
    sandbox.stub(DeviceServices, 'getAllDevices').returns(devices);
    const unblockDeviceStub = sandbox.stub(DeviceServices, 'unblockDevice').returns('ABC***');
    // const unblockDeviceSpy = sinon.spy(DeviceServices, 'unblockDevice');

    DeviceUtils.releaseBlockedDevices();
    sinon.assert.calledOnce(unblockDeviceStub);

    // sinon.assert.calledOnce(unblockDeviceStub);
    // const unblockDeviceStub = sandbox.stub(DeviceServices, 'unblockDevice').returns('devices in test');
    // sandbox.stub(DeviceServices, 'unblockDevice').returns(null);
    // unblockDeviceStub.restore();
    // sinon.assert.calledOnce(unblockDeviceStub);
  });

  // it.only(
  //   'Android Device List to have added state',
  //   sinon.test(function (done) {
  //     const unblockDeviceStub = this.spy(DeviceServices, 'unblockDevice');
  //     sandbox.stub(DeviceServices, 'getAllDevices').returns(devices);
  //     DeviceUtils.releaseBlockedDevices();
  //     sinon.assert.calledOnce(unblockDeviceStub);
  //   })
  // );
});

// sinon.assert.calledOnce(DeviceServices.unblockDevice);
// sinon.assert.calledOnce(spy);
// console.log("----> " + JSON.stringify(spy));
// sandbox.assert.calledWith(DeviceServices.unblockDevice);
// const y = DeviceServices.getAllDevices();
// console.log(JSON.stringify(y));
