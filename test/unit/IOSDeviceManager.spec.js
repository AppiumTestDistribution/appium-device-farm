import sinon from 'sinon';
import { expect } from 'chai';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
import * as DeviceUtils from '../../src/device-utils';
import os from 'os';
import path from 'path';
import { deviceMock } from './fixtures/devices';
import ip from 'ip';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
var sandbox = sinon.createSandbox();

const cliArgs = {
  'device-farm': {
    platform: 'iOS',
    'device-types': 'both',
    remote: ['http://127.0.0.1:4723'],
  },
};
describe('IOS Device Manager', () => {
  afterEach(function () {
    sandbox.restore();
  });
  it('IOS Device List to have added state', async () => {
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723);
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(Helper, 'isMac').returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(iosDevices, 'getSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86E9999',
        state: 'Booted',
        sdk: '14.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
    const devices = await iosDevices.getDevices({iosDeviceType: 'both'}, []);
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
        wdaLocalPort: 54093,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${ip.address()}:4723`,
        derivedDataPath: path.join(
          os.homedir(),
          'Library/Developer/Xcode/DerivedData/WebDriverAgent-00001111-00115D822222002E'
        ),
        mjpegServerPort: 54093,
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86E9999',
        state: 'Booted',
        sdk: '14.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
  });

  it('Should consider only simulators that is given by user and all real devices', async () => {
    const simulators = [
      {
        name: 'iPhone 14',
        sdk: '16.1',
      },
      {
        name: 'iPhone 14 Plus',
        sdk: '16.1',
      },
    ]

    let iosDeviceManager = new IOSDeviceManager(Object.assign({
      platform: 'iOS',
      simulators,
    }, DefaultPluginArgs), 4723);
    sandbox.stub(iosDeviceManager, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDeviceManager, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDeviceManager, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox.stub(iosDeviceManager, 'getLocalSims').returns(deviceMock.filter((device) => device.platform === 'iOS'));
    const devices = await iosDeviceManager.getDevices({iosDeviceType: 'real'}, []);
    // all devices are simulators
    devices.forEach((device) => {
      expect(device.realDevice).to.equal(true);
    });
  });

  it('Should consider only simulators that is given by user and not real devices', async () => {
    const simulators = [
      {
        name: 'iPhone 14',
        sdk: '16.1',
      },
      {
        name: 'iPhone 14 Plus',
        sdk: '16.1',
      },
    ]
    let iosDeviceManager = new IOSDeviceManager(Object.assign({
      platform: 'iOS',
      iosDeviceType: 'simulated',
      remote: ['http://127.0.0.1:4723'],
      simulators,
    }, DefaultPluginArgs), 4723);
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(iosDeviceManager, 'getLocalSims').returns(deviceMock.filter((device) => device.platform === 'iOS'));
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await iosDeviceManager.getDevices({iosDeviceType: 'simulated'}, []);
    // all devices are simulators
    devices.forEach((device) => {
      expect(device.realDevice).to.be.false;
    });
  });

  it('IOS Device List to have added state - Include simulators with real devices', async () => {
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723);
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox.stub(iosDevices, 'getSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
    const devices = await iosDevices.getDevices('both', [], { port: 4723, plugin: cliArgs });
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
        wdaLocalPort: 54093,
        host: `http://${ip.address()}:4723`,
        derivedDataPath: path.join(
          os.homedir(),
          'Library/Developer/Xcode/DerivedData/WebDriverAgent-00001111-00115D822222002E'
        ),
        mjpegServerPort: 54093,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
  });

  it('IOS Device List to have added state - Only simulators', async () => {
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723);
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox.stub(iosDevices, 'getSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
    const devices = await iosDevices.getDevices({ iosDeviceType: 'simulated' }, []);
    expect(devices).to.deep.equal([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
  });

  it('IOS Device List to have added state - Only real devices', async () => {
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723);
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox.stub(iosDevices, 'getSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: `http://${ip.address()}:4723`,
      },
    ]);
    const devices = await iosDevices.getDevices({ iosDeviceType: 'real' }, [], {
      port: 4723,
      plugin: cliArgs,
    });
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
        wdaLocalPort: 54093,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${ip.address()}:4723`,
        derivedDataPath: path.join(
          os.homedir(),
          'Library/Developer/Xcode/DerivedData/WebDriverAgent-00001111-00115D822222002E'
        ),
        mjpegServerPort: 54093,
      },
    ]);
  });
});
