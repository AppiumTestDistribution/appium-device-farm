import { DevicePlugin } from '../../src';
import { expect } from 'chai';

describe('Plugin Test', () => {
  it('Get Device from filter properties for real device', () => {
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.ipa',
        'appium:iPhoneOnly': true,
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = DevicePlugin.getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      name: 'iPhone',
      deviceType: 'real',
      udid: undefined,
      busy: false,
      offline: false,
    });
  });

  it('Get Device from filter properties for simulator', () => {
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:iPhoneOnly': true,
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = DevicePlugin.getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      busy: false,
      offline: false,
    });
  });
});
