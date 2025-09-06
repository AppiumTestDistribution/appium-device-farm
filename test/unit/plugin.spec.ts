import { expect } from 'chai';
import { getDeviceFarmCapabilities } from '../../src/CapabilityManager';
import { ATDRepository } from '../../src/data-service/db';
import { addCLIArgs } from '../../src/data-service/pluginArgs';
import { cleanPendingSessions, getDeviceFiltersFromCapability } from '../../src/device-utils';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import { serverCliArgs } from '../integration/cliArgs';

const pluginArgs = DefaultPluginArgs;

describe('Device filter tests', () => {
  it('Get Device filters for real device', async () => {
    await addCLIArgs(serverCliArgs);
    (await ATDRepository.CLIArgs)
      .chain()
      .find()
      .update(function (d) {
        d.plugin['device-farm'].iosDeviceType = 'real';
      });
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.ipa',
        'df:iPhoneOnly': true,
        'appium:platformVersion': '14.0',
        'appium:udid': '21112-1111-1111-111',
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const deviceFarmCapabilities = getDeviceFarmCapabilities(capabilities);
    const filter = getDeviceFiltersFromCapability(firstMatch, deviceFarmCapabilities, pluginArgs);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: '14.0',
      name: 'iPhone',
      deviceType: 'real',
      udid: ['21112-1111-1111-111'],
      minSDK: undefined,
      maxSDK: undefined,
      filterByHost: undefined,
      tags: undefined,
      busy: false,
      userBlocked: false,
    });
  });

  it('Get Device from filter properties for simulator', async () => {
    (await ATDRepository.CLIArgs)
      .chain()
      .find()
      .update(function (d) {
        d.plugin['device-farm'].iosDeviceType = 'simulated';
      });
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'df:iPhoneOnly': true,
        'appium:platformVersion': '14.0',
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const deviceFarmCapabilities = getDeviceFarmCapabilities(capabilities);
    const filter = getDeviceFiltersFromCapability(firstMatch, deviceFarmCapabilities, pluginArgs);
    expect(filter).to.deep.equal({
      platform: 'ios',
      platformVersion: '14.0',
      name: 'iPhone',
      filterByHost: undefined,
      deviceType: 'simulator',
      udid: undefined,
      minSDK: undefined,
      maxSDK: undefined,
      tags: undefined,
      busy: false,
      userBlocked: false,
    });
  });

  it('Get Device filter properties with minSDK', () => {
    const capabilities = {
      alwaysMatch: {
        platformName: 'iOS',
        'appium:app': '/Downloads/VodQA.app',
        'df:minSDK': '10.2.0',
        'df:options': {
          iPhoneOnly: true,
        },
      },
      firstMatch: [{}],
    };
    const firstMatch = Object.assign({}, capabilities.firstMatch[0], capabilities.alwaysMatch);
    const deviceFarmCapabilities = getDeviceFarmCapabilities(capabilities);
    const filter = getDeviceFiltersFromCapability(firstMatch, deviceFarmCapabilities, pluginArgs);
    expect(filter).to.deep.equal({
      platform: 'ios',
      filterByHost: undefined,
      platformVersion: undefined,
      name: 'iPhone',
      deviceType: 'simulator',
      udid: undefined,
      minSDK: '10.2.0',
      maxSDK: undefined,
      tags: undefined,
      busy: false,
      userBlocked: false,
    });
  });
});

describe('Pending sessions', async () => {
  it('clean pending sessions', async () => {
    // insert pending sessions
    (await ATDRepository.PendingSessionsModel).insert({
      capability_id: '1',
      createdAt: new Date().getTime(),
    });
    (await ATDRepository.PendingSessionsModel).insert({
      capability_id: '2',
      createdAt: new Date().getTime() - 10000,
    });

    // clean pending sessions
    await cleanPendingSessions(5000);

    // check pending sessions
    const pendingSessions = (await ATDRepository.PendingSessionsModel).chain().data();
    expect(pendingSessions.length).to.equal(1);
  });
});
