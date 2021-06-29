import sinon from 'sinon';
import { expect } from 'chai';

import IOSDeviceManager from '../../src/IOSDeviceManager';

describe('IOS Device Manager', () => {
  it('IOS Device List to have added state', async () => {
    const iosDevices = new IOSDeviceManager();
    const actualDevices = [];
    sinon
      .stub(iosDevices, 'getConnectedDevices')
      .returns(['00001111-00115D822222002E']);
    sinon.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sinon.stub(iosDevices, 'getDeviceName').returns('Sai’s iPhone');
    const devices = await iosDevices.getDevices(actualDevices);
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      },
    ]);
  });

  it('Get device data from device state', async () => {
    const iosDevices = new IOSDeviceManager();
    const actualDevices = [
      {
        udid: '00001111-00115D822222002H',
        sdk: '14.1.2',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      },
      {
        udid: '00001111-00115D822222002F',
        sdk: '14.1.3',
        name: 'Sri’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      },
    ]
    sinon
      .stub(iosDevices, 'getConnectedDevices')
      .returns(['00001111-00115D822222002H', '00001111-00115D822222002F', '00001111-00115D822222002G']);
    sinon.stub(iosDevices, 'getOSVersion').returns('14.1.1');
    sinon.stub(iosDevices, 'getDeviceName').returns('Sim’s iPhone');
    const devices = await iosDevices.getDevices(actualDevices);
    expect(devices).to.deep.equal([
      {
        udid: '00001111-00115D822222002H',
        sdk: '14.1.2',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      },
      {
        udid: '00001111-00115D822222002F',
        sdk: '14.1.3',
        name: 'Sri’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      },
      {
        udid: '00001111-00115D822222002G',
        sdk: '14.1.1',
        name: 'Sim’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      }
    ]);
  });
});
