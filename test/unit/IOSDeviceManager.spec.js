import sinon from 'sinon';
import { expect } from 'chai';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
import * as DeviceUtils from '../../src/device-utils';
import { deviceMock } from './fixtures/devices';
import ip from 'ip';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import { v4 as uuidv4 } from 'uuid';
import * as IOSUtils from 'appium-ios-device/build/lib/utilities';
var sandbox = sinon.createSandbox();

const cliArgs = {
  'device-farm': {
    platform: 'iOS',
    'device-types': 'both',
    remote: ['http://127.0.0.1:4723'],
  },
};

const pluginArgs = Object.assign({}, DefaultPluginArgs, {
  remote: [`http://${ip.address()}:4723`],
  skipChromeDownload: true,
});

describe('IOS Device Manager', () => {
  // const deviceManager = new DeviceFarmManager('ios', {androidDeviceType: 'both', iosDeviceType: 'both'}, 4723, Object.assign(pluginArgs, {}));

  afterEach(function () {
    sandbox.restore();
  });
  it('IOS Device List to have added state', async () => {
    const iosDevices = new IOSDeviceManager(pluginArgs, 4723, uuidv4());
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(Helper, 'isMac').returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
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
    const devices = await iosDevices.getDevices({ iosDeviceType: 'both' }, []);
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
        tags: [],
        wdaLocalPort: 54093,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        width: '375',
        productModel: 'iPhone12,8',
        wdaBundleId: '',
        height: '667',
        host: `http://${ip.address()}:4723`,
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
    ];

    let iosDeviceManager = new IOSDeviceManager(
      Object.assign(
        {
          platform: 'iOS',
          simulators,
        },
        DefaultPluginArgs,
      ),
      4723,
      uuidv4(),
    );
    sandbox.stub(iosDeviceManager, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDeviceManager, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDeviceManager, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    sandbox
      .stub(iosDeviceManager, 'getLocalSims')
      .returns(deviceMock.filter((device) => device.platform === 'iOS'));
    const devices = await iosDeviceManager.getDevices({ iosDeviceType: 'real' }, []);
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
    ];
    let iosDeviceManager = new IOSDeviceManager(
      Object.assign(
        {
          platform: 'iOS',
          iosDeviceType: 'simulated',
          remote: ['http://127.0.0.1:4723'],
          simulators,
        },
        DefaultPluginArgs,
      ),
      4723,
      uuidv4(),
    );
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(IOSDeviceManager, 'getProductModel').returns('iPhone12,8');
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
    sandbox
      .stub(iosDeviceManager, 'getLocalSims')
      .returns(deviceMock.filter((device) => device.platform === 'iOS'));
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await iosDeviceManager.getDevices({ iosDeviceType: 'simulated' }, []);
    // all devices are simulators
    devices.forEach((device) => {
      expect(device.realDevice).to.be.false;
    });
  });

  it('IOS Device List to have added state - Include simulators with real devices', async () => {
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723, uuidv4());
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
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
        width: '375',
        productModel: 'iPhone12,8',
        wdaBundleId: '',
        height: '667',
        tags: [],
        platform: 'ios',
        wdaLocalPort: 54093,
        host: `http://${ip.address()}:4723`,
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
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723, uuidv4());
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
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
    const iosDevices = new IOSDeviceManager(DefaultPluginArgs, 4723, uuidv4());
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
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
        tags: [],
        deviceType: 'real',
        platform: 'ios',
        wdaLocalPort: 54093,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${ip.address()}:4723`,
        width: '375',
        productModel: 'iPhone12,8',
        wdaBundleId: '',
        height: '667',
        mjpegServerPort: 54093,
      },
    ]);
  });
});
