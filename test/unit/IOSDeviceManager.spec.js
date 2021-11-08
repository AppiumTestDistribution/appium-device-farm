import sinon from 'sinon';
import { expect } from 'chai';

import IOSDeviceManager from '../../src/device-managers/IOSDeviceManager';

describe('IOS Device Manager', () => {
  it('IOS Device List to have added state', async () => {
    const iosDevices = new IOSDeviceManager();
    sinon.stub(iosDevices, 'getConnectedDevices').returns(['00001111-00115D822222002E']);
    sinon.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sinon.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    sinon.stub(iosDevices, 'getSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
      },
    ]);
    const devices = await iosDevices.getDevices();
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        deviceType: 'real',
        platform: 'ios',
      },
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
      },
    ]);
  });
});
