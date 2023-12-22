import { getDeviceFiltersFromCapability } from '../../src/device-utils';
import { expect } from 'chai';
import { addCLIArgs } from '../../src/data-service/pluginArgs';
import { serverCliArgs } from '../integration/cliArgs';
import { CLIArgs } from '../../src/data-service/db';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';

const pluginArgs = DefaultPluginArgs;

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
        'appium:udid': '21112-1111-1111-111',
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = getDeviceFiltersFromCapability(firstMatch, pluginArgs);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: '14.0',
      name: 'iPhone',
      deviceType: 'real',
      udid: '21112-1111-1111-111',
      minSDK: undefined,
      maxSDK: undefined,
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
    const filter = getDeviceFiltersFromCapability(firstMatch, pluginArgs);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: '14.0',
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: undefined,
      maxSDK: undefined,
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
        'appium:minSDK': '10.2.0',
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const filter = getDeviceFiltersFromCapability(firstMatch, pluginArgs);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: undefined,
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: '10.2.0',
      maxSDK: undefined,
      busy: false,
      userBlocked: false,
    });
  });
});
