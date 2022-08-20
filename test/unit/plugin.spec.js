import { getDeviceFiltersFromCapability } from '../../src/device-utils';
import { expect } from 'chai';

describe('Device filter tests', () => {
  it('Get Device filters for real device', () => {
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.ipa',
        'appium:iPhoneOnly': true,
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      name: 'iPhone',
      deviceType: 'real',
      udid: undefined,
      minSDK: undefined,
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
    const filter = getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: undefined,
      busy: false,
      offline: false,
    });
  });

  it('Get Device filter properties with minSDK', () => {
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:iPhoneOnly': true,
        'appium:minSDK': 10.2,
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: 10.2,
      busy: false,
      offline: false,
    });
  });
});
