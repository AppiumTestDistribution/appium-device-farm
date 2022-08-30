import ip from 'ip';
import Sinon from 'sinon';
import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';
import * as Helper from '../../src/helpers';
import { expect } from 'chai';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
var sandbox = Sinon.createSandbox();
const ipAddress = ip.address();
const cliArgs = {
  'device-farm': {
    platform: 'iOS',
    'include-simulators': true,
    remote: [`http://${ipAddress}:3000`, 'http://127.0.0.1:4723'],
  },
};
describe('Remote IOS', () => {
  afterEach(function () {
    sandbox.restore();
  });
  const app = express();
  const port = 3000;
  it('Fetch remote devices', async () => {
    const stubResponse = [
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
        host: 'http://127.0.0.1:31337',
        offline: false,
        meta: {
          revision: 0,
          created: 1661836020465,
          version: 0,
        },
        $loki: 2,
      },
    ];
    app.get('/device-farm/api/devices/ios', (req, res) => {
      res.send(JSON.stringify(stubResponse));
    });
    app.listen(port, `${ipAddress}`, () => {
      console.log(`Example app listening on port ${port}`);
    });
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
    const devices = await iosDevices.getDevices(true, [], { port: 4723, plugin: cliArgs });
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
        host: `http://${ipAddress}:3000`,
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
        host: `http://${ipAddress}:3000`,
        offline: false,
      },
    ];
    expect(devices).to.deep.equal(expected);
  });
});
