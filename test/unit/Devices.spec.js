import { expect } from 'chai';
import { findUserSpecifiesDevices } from '../../src/Devices';
import { deviceMock } from './fixtures/devices';

describe('Devices', () => {
  it('Filter only user specified devices', async () => {
    const userSpecifiedUDIDS = ['emulator-5556', '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888'];
    const filteredDevices = findUserSpecifiesDevices(userSpecifiedUDIDS, deviceMock);
    expect(filteredDevices).to.deep.equal([
      {
        busy: false,
        state: 'device',
        udid: 'emulator-5556',
        platform: 'android',
      },
      {
        name: 'iPad Air',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED888',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        busy: true,
        realDevice: false,
      },
    ]);
  });
});
