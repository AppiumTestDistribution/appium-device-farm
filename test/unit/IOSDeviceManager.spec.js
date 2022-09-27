import sinon from 'sinon';
import { expect } from 'chai';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
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
    const iosDevices = new IOSDeviceManager();
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(Helper, 'isMac').returns(true);
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(iosDevices, 'getSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: 'http://127.0.0.1:4723',
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86E9999',
        state: 'Booted',
        sdk: '14.5',
        platform: 'ios',
        host: 'http://127.0.0.1:4723',
      },
    ]);
    const devices = await iosDevices.getDevices(true, [], { port: 4723, plugin: cliArgs });
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
        host: 'http://127.0.0.1:4723',
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: 'http://127.0.0.1:4723',
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86E9999',
        state: 'Booted',
        sdk: '14.5',
        platform: 'ios',
        host: 'http://127.0.0.1:4723',
      },
    ]);
  });

  it('IOS Device List to have added state - Include simulators with real devices', async () => {
    const iosDevices = new IOSDeviceManager();
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
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
        host: 'http://127.0.0.1:4723',
      },
    ]);
    const devices = await iosDevices.getDevices(true, [], { port: 4723, plugin: cliArgs });
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
        host: 'http://127.0.0.1:4723',
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        host: 'http://127.0.0.1:4723',
      },
    ]);
  });

  it('IOS Device List to have added state - Only real devices', async () => {
    const iosDevices = new IOSDeviceManager();
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
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
        host: 'http://127.0.0.1:4723',
      },
    ]);
    const devices = await iosDevices.getDevices(false, [], { port: 4723, plugin: cliArgs });
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
        host: 'http://127.0.0.1:4723',
      },
    ]);
  });
});
