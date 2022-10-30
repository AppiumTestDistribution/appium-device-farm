import ip from 'ip';
import Sinon from 'sinon';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
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
    remote: [`http://${firstNode}:3000`, `http://${secondNode}:3000`, 'http://127.0.0.1:4723'],
  },
};
describe('Remote IOS', () => {
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: 'http://127.0.0.1:31337',
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: 'http://127.0.0.1:31337',
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
    stub = Sinon.stub(axios, 'get').resolves(stubResponse);
    const iosDevices = new IOSDeviceManager();
    const simulators = [];
    sandbox.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sandbox.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sandbox.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sandbox.stub(Helper, 'getFreePort').returns(54093);
    sandbox
      .stub(iosDevices, 'fetchLocalSimulators')
      .withArgs(simulators, cliArgs)
      .returns([
        {
          name: 'iPad Air (3rd generation)',
          udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
          state: 'Shutdown',
          sdk: '13.5',
          platform: 'ios',
          host: 'http://127.0.0.1:4723',
        },
      ]);
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: 'http://127.0.0.1:4723',
        derivedDataPath: path.join(os.homedir(), 'Library/Developer/Xcode/DerivedData/WebDriverAgent-00001111-00115D822222002E'),
        mjpegServerPort: 54093
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${firstNode}:3000`,
        offline: false,
      },
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${firstNode}:3000`,
        offline: false,
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${secondNode}:3000`,
        offline: false,
      },
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
        sessionStartTime: 0,
        totalUtilizationTimeMilliSec: 0,
        host: `http://${secondNode}:3000`,
        offline: false,
      },
    ];
    expect(devices).to.deep.equal(expected);
  });
});
