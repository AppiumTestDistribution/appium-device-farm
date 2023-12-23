import ip from 'ip';
import Sinon from 'sinon';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
import * as DeviceUtils from '../../src/device-utils';
import { expect } from 'chai';
import axios from 'axios';
import os from 'os';
import path from 'path';
let sandbox = Sinon.createSandbox();
const firstNode = ip.address();
const secondNode = ip.address();
const cliArgs = {
  'device-farm': {
    platform: 'iOS',
    'device-types': 'both',
    hub: `http://${firstNode}:3000`,
  },
};
describe.skip('Remote IOS', () => {
  const stubResponse = {
    data: [
      {
        name: 'iPad Air (4th generation)',
        udid: 'F9C2FD71-A5A3-4E0A-A8CD-BE96BF907ABF',
        state: 'Shutdown',
        sdk: '14.2',
        platform: 'ios',
        wdaLocalPort: 62879,
        busy: false,
        realDevice: false,
        deviceType: 'simulator',
        host: `http://${firstNode}:31337`,
        offline: false,
        meta: {
          revision: 0,
          created: 1661836020465,
          version: 0,
        },
        $loki: 1,
      },
      {
        name: 'iPad (8th generation)',
        udid: '3F74FBC0-D50E-4317-8C33-428C1CE55C27',
        state: 'Shutdown',
        sdk: '14.2',
        platform: 'ios',
        wdaLocalPort: 62878,
        busy: false,
        realDevice: false,
        deviceType: 'simulator',
        host: `http://${firstNode}:31337`,
        offline: false,
        meta: {
          revision: 0,
          created: 1661836020465,
          version: 0,
        },
        $loki: 2,
      },
    ],
  };
  let stub;
  afterEach(() => {
    stub.restore();
  });
  it('Fetch remote devices', async function () {
    stub = Sinon.stub(axios, 'post').resolves(stubResponse);
    const iosDevices = new IOSDeviceManager();
    const simulators = [];
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox.stub(DeviceUtils, 'getUtilizationTime').returns(0);
    const devices = await iosDevices.getDevices('both', [], { port: 4723, plugin: cliArgs });
    const expected = [
      {
        wdaLocalPort: 54093,
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
        host: 'http://127.0.0.1:4723',
        derivedDataPath: path.join(
          os.homedir(),
          'Library/Developer/Xcode/DerivedData/WebDriverAgent-00001111-00115D822222002E',
        ),
        mjpegServerPort: 54093,
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
      },
      {
        name: 'iPad (8th generation)',
        udid: '3F74FBC0-D50E-4317-8C33-428C1CE55C27',
        state: 'Shutdown',
        sdk: '14.2',
        platform: 'ios',
        wdaLocalPort: 62878,
        busy: false,
        realDevice: false,
        deviceType: 'simulator',
        host: `http://${firstNode}:3000`,
        offline: false,
      },
    ];
    expect(devices).to.deep.equal(expected);
  });
});
