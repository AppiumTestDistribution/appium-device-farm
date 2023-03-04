import { getDeviceFiltersFromCapability } from '../../src/device-utils';
import { expect } from 'chai';
import { addCLIArgs } from '../../src/data-service/pluginArgs';
import { serverCliArgs } from '../integration/cliArgs';
import { CLIArgs } from '../../src/data-service/db';

describe('Device filter tests', () => {
  it('Get Device filters for real device', async () => {
    await addCLIArgs(serverCliArgs);
    CLIArgs.chain()
    .find()
    .update(function (d) {
      d.plugin['device-farm'].iosDeviceType = 'real';
    });
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.ipa',
        'appium:iPhoneOnly': true,
        'appium:platformVersion': '14.0',
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: '14.0',
      name: 'iPhone',
      deviceType: 'real',
      udid: undefined,
      minSDK: undefined,
      busy: false,
      userBlocked: false,
    });
  });

  it('Get Device from filter properties for simulator', () => {
    CLIArgs.chain()
    .find()
    .update(function (d) {
      d.plugin['device-farm'].iosDeviceType = 'simulated';
    });
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'appium:iPhoneOnly': true,
        'appium:platformVersion': '14.0',
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = getDeviceFiltersFromCapability(firstMatch);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: '14.0',
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: undefined,
      busy: false,
      userBlocked: false,
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
      platformVersion: undefined,
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: 10.2,
      busy: false,
      userBlocked: false,
    });
  });
});
