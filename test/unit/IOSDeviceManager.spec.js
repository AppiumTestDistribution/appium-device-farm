import * as IOSUtils from 'appium-ios-device/build/lib/utilities';
import { expect } from 'chai';
import ip from 'ip';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import { deviceMock } from './fixtures/devices';
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
    const iosDevices = new IOSDeviceManager(
      Object.assign({}, pluginArgs, {
        portRange: '8100-8110',
      }),
      4723,
      uuidv4(),
    );
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(Helper, 'isMac').returns(true);
    const getFreePortStub = sandbox.stub(Helper, 'getFreePort').returns(54093);
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
        id: '7d04d589-fd5d-5172-b7ad-5f87f2de36aa',
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
        tags: [],
        wdaLocalPort: 54093,
        webDriverAgentHost: `http://${ip.address()}`,
        webDriverAgentUrl: `http://${ip.address()}:54093`,
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
    expect(getFreePortStub).to.have.been.calledWith('8100-8110');
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
    sandbox.stub(Helper, 'isMac').returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(IOSDeviceManager, 'getProductModel').returns('iPhone12,8');
    sandbox.stub(IOSUtils, 'getDeviceInfo').returns({ ProductType: 'iPhone12,8' });
    const iosDevicesWithRealDeviceFlag = deviceMock
      .filter((device) => device.platform === 'iOS')
      .map((device) => ({ ...device, realDevice: false }));
    sandbox
      .stub(iosDeviceManager, 'getLocalSims')
      .returns(iosDevicesWithRealDeviceFlag);
    sandbox
      .stub(iosDeviceManager, 'fetchLocalSimulators')
      .returns(iosDevicesWithRealDeviceFlag);
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
        id: '7d04d589-fd5d-5172-b7ad-5f87f2de36aa',
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
        webDriverAgentHost: `http://${ip.address()}`,
        webDriverAgentUrl: `http://${ip.address()}:54093`,
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
        id: '7d04d589-fd5d-5172-b7ad-5f87f2de36aa',
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        tags: [],
        deviceType: 'real',
        platform: 'ios',
        wdaLocalPort: 54093,
        webDriverAgentHost: `http://${ip.address()}`,
        webDriverAgentUrl: `http://${ip.address()}:54093`,
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

  describe('getDevicePlatformName', () => {
    let iosDeviceManager;

    beforeEach(() => {
      iosDeviceManager = new IOSDeviceManager(DefaultPluginArgs, 4723, uuidv4());
    });

    describe('ProductType-based detection (most reliable)', () => {
      it('should return tvos for Apple TV ProductType', () => {
        const result = iosDeviceManager.getDevicePlatformName('Home Theater (2)', 'AppleTV5,3');
        expect(result).to.equal('tvos');
      });

      it('should return tvos for Apple TV 4K ProductType', () => {
        const result = iosDeviceManager.getDevicePlatformName('Apple TV 4K', 'AppleTV6,2');
        expect(result).to.equal('tvos');
      });

      it('should return ios for iPhone ProductType', () => {
        const result = iosDeviceManager.getDevicePlatformName('iPhone 15 Pro', 'iPhone16,1');
        expect(result).to.equal('ios');
      });

      it('should return ios for iPad ProductType', () => {
        const result = iosDeviceManager.getDevicePlatformName('iPad Pro', 'iPad14,1');
        expect(result).to.equal('ios');
      });

      it('should return ios for iPod ProductType', () => {
        const result = iosDeviceManager.getDevicePlatformName('iPod Touch', 'iPod9,1');
        expect(result).to.equal('ios');
      });
    });

    describe('Name pattern detection', () => {
      it('should return tvos for Apple TV name patterns', () => {
        const testCases = [
          'Apple TV HD',
          'Apple TV 4K',
          'Apple TV (2nd generation)',
          'TV Simulator',
          'tvOS Device',
        ];

        testCases.forEach((name) => {
          const result = iosDeviceManager.getDevicePlatformName(name);
          expect(result).to.equal('tvos', `Failed for name: ${name}`);
        });
      });

      it('should return ios for iPhone name patterns', () => {
        const testCases = [
          'iPhone 15 Pro',
          'iPhone 14',
          'iPhone SE',
          'iPhone Simulator',
        ];

        testCases.forEach((name) => {
          const result = iosDeviceManager.getDevicePlatformName(name);
          expect(result).to.equal('ios', `Failed for name: ${name}`);
        });
      });

      it('should return ios for iPad name patterns', () => {
        const testCases = ['iPad Pro', 'iPad Air', 'iPad mini', 'iPad Simulator'];

        testCases.forEach((name) => {
          const result = iosDeviceManager.getDevicePlatformName(name);
          expect(result).to.equal('ios', `Failed for name: ${name}`);
        });
      });

      it('should return ios for iPod name patterns', () => {
        const testCases = ['iPod Touch', 'iPod nano', 'iPod Simulator'];

        testCases.forEach((name) => {
          const result = iosDeviceManager.getDevicePlatformName(name);
          expect(result).to.equal('ios', `Failed for name: ${name}`);
        });
      });
    });

    describe('Edge cases - ProductType takes priority over name', () => {
      it('should return ios when ProductType is iPhone even if name contains TV', () => {
        const result = iosDeviceManager.getDevicePlatformName('iPhone TV', 'iPhone16,1');
        expect(result).to.equal('ios');
      });

      it('should return ios when ProductType is iPad even if name contains TV', () => {
        const result = iosDeviceManager.getDevicePlatformName('iPad TV', 'iPad14,1');
        expect(result).to.equal('ios');
      });

      it('should return tvos when ProductType is AppleTV even if name contains iPhone', () => {
        const result = iosDeviceManager.getDevicePlatformName('iPhone Apple TV', 'AppleTV5,3');
        expect(result).to.equal('tvos');
      });
    });

    describe('Edge cases - Name pattern priority', () => {
      it('should return ios when name contains iPhone even if it starts with TV', () => {
        const result = iosDeviceManager.getDevicePlatformName('TV iPhone', null);
        expect(result).to.equal('ios');
      });

      it('should return ios when name contains iPad even if it starts with TV', () => {
        const result = iosDeviceManager.getDevicePlatformName('TV iPad', null);
        expect(result).to.equal('ios');
      });

      it('should return ios when name contains iPod even if it starts with TV', () => {
        const result = iosDeviceManager.getDevicePlatformName('TV iPod', null);
        expect(result).to.equal('ios');
      });
    });

    describe('ideviceinfo-based detection', () => {
      it('should return tvos when ProductName contains Apple TV', () => {
        const deviceInfo = {
          ProductName: 'Apple TV HD',
          DeviceClass: 'Unknown',
          DeviceName: 'Unknown',
        };
        const result = iosDeviceManager.getDevicePlatformName(
          'Appium',
          null,
          null,
          null,
          deviceInfo,
        );
        expect(result).to.equal('tvos');
      });

      it('should return tvos when DeviceClass contains tv', () => {
        const deviceInfo = {
          ProductName: 'Unknown',
          DeviceClass: 'AppleTV',
          DeviceName: 'Unknown',
        };
        const result = iosDeviceManager.getDevicePlatformName(
          'Test Device',
          null,
          null,
          null,
          deviceInfo,
        );
        expect(result).to.equal('tvos');
      });

      it('should return tvos when DeviceName contains Apple TV', () => {
        const deviceInfo = {
          ProductName: 'Unknown',
          DeviceClass: 'Unknown',
          DeviceName: 'Apple TV 4K',
        };
        const result = iosDeviceManager.getDevicePlatformName(
          'Custom Device',
          null,
          null,
          null,
          deviceInfo,
        );
        expect(result).to.equal('tvos');
      });

      it('should return ios when ideviceinfo indicates iOS device', () => {
        const deviceInfo = {
          ProductName: 'iPhone 15 Pro',
          DeviceClass: 'iPhone',
          DeviceName: 'iPhone 15 Pro',
        };
        const result = iosDeviceManager.getDevicePlatformName(
          'Appium',
          null,
          null,
          null,
          deviceInfo,
        );
        expect(result).to.equal('ios');
      });
    });

    describe('Aspect ratio fallback detection', () => {
      it('should return tvos for 16:9 aspect ratio (1920x1080)', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '1920', '1080');
        expect(result).to.equal('tvos');
      });

      it('should return tvos for 16:9 aspect ratio (3840x2160)', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '3840', '2160');
        expect(result).to.equal('tvos');
      });

      it('should return ios for iPhone portrait aspect ratio', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '1179', '2556');
        expect(result).to.equal('ios');
      });

      it('should return ios for iPhone landscape aspect ratio', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '2556', '1179');
        expect(result).to.equal('ios');
      });

      it('should return ios for iPad portrait aspect ratio', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '1024', '1366');
        expect(result).to.equal('ios');
      });

      it('should return ios for iPad landscape aspect ratio', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '1366', '1024');
        expect(result).to.equal('ios');
      });

      it('should return ios for large iPad Pro screen (non-16:9)', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device', null, '2732', '2048');
        expect(result).to.equal('ios');
      });
    });

    describe('Default behavior', () => {
      it('should return ios for unknown devices with no additional info', () => {
        const result = iosDeviceManager.getDevicePlatformName('Unknown Device');
        expect(result).to.equal('ios');
      });

      it('should return ios for empty device name', () => {
        const result = iosDeviceManager.getDevicePlatformName('');
        expect(result).to.equal('ios');
      });

      it('should return ios for null device name', () => {
        const result = iosDeviceManager.getDevicePlatformName(null);
        expect(result).to.equal('ios');
      });
    });

    describe('Real-world scenarios', () => {
      it('should handle the original issue: Home Theater (2) with AppleTV5,3', () => {
        const result = iosDeviceManager.getDevicePlatformName(
          'Home Theater (2)',
          'AppleTV5,3',
          '1920',
          '1080',
        );
        expect(result).to.equal('tvos');
      });

      it('should handle Apple TV 4K (2nd generation)', () => {
        const result = iosDeviceManager.getDevicePlatformName(
          'Apple TV 4K (2nd generation)',
          'AppleTV11,1',
          '3840',
          '2160',
        );
        expect(result).to.equal('tvos');
      });

      it('should handle iPhone 15 Pro Max', () => {
        const result = iosDeviceManager.getDevicePlatformName(
          'iPhone 15 Pro Max',
          'iPhone16,2',
          '1320',
          '2868',
        );
        expect(result).to.equal('ios');
      });

      it('should handle iPad Pro 12.9-inch', () => {
        const result = iosDeviceManager.getDevicePlatformName(
          'iPad Pro 12.9-inch',
          'iPad14,1',
          '2732',
          '2048',
        );
        expect(result).to.equal('ios');
      });

      it('should handle custom device names with ideviceinfo', () => {
        const deviceInfo = {
          ProductName: 'Apple TV HD',
          DeviceClass: 'AppleTV',
          DeviceName: 'Apple TV HD',
        };
        const result = iosDeviceManager.getDevicePlatformName(
          'Appium',
          null,
          '1920',
          '1080',
          deviceInfo,
        );
        expect(result).to.equal('tvos');
      });
    });

    describe('Error handling', () => {
      it('should handle invalid width/height gracefully', () => {
        const result = iosDeviceManager.getDevicePlatformName(
          'Test Device',
          null,
          'invalid',
          'invalid',
        );
        expect(result).to.equal('ios');
      });

      it('should handle zero width/height gracefully', () => {
        const result = iosDeviceManager.getDevicePlatformName('Test Device', null, '0', '0');
        expect(result).to.equal('ios');
      });

      it('should handle negative width/height gracefully', () => {
        const result = iosDeviceManager.getDevicePlatformName('Test Device', null, '-1920', '-1080');
        expect(result).to.equal('ios');
      });
    });
  });
});
