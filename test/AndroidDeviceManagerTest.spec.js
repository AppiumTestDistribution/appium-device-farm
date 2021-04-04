const assert = require('assert');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

import AndroidDeviceManager from '../src/AndroidDeviceManager';

describe('Android Device Manager', () => {
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    sinon
      .stub(androidDevices, 'getConnectedDevices')
      .returns([{ udid: 'emulator-5554', state: 'device' }]);
    const devices = await androidDevices.getDevices();
    expect(devices).to.deep.equal([
      {
        busy: false,
        state: 'device',
        udid: 'emulator-5554',
        platform: 'android',
      },
    ]);
  });
});
