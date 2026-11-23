import { expect } from 'chai';
import { Container } from 'typedi';
import { getDeviceFarmCapabilities } from '../../src/CapabilityManager';
import { ATDRepository } from '../../src/data-service/db';
import { addCLIArgs } from '../../src/data-service/pluginArgs';
import { cleanPendingSessions, getDeviceFiltersFromCapability } from '../../src/device-utils';
import { DeviceFarmManager } from '../../src/device-managers';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';
import { DevicePlugin } from '../../src/plugin';
import { sessionRequestMap } from '../../src/proxy/wd-command-proxy';
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

describe('Session requests waiting for a device', () => {
  it('fail together once their own timeout is over, not one timeout after the other', async function () {
    this.timeout(15000);
    const timeoutMs = 1500;
    Container.set(
      DeviceFarmManager,
      new DeviceFarmManager(
        'android',
        { androidDeviceType: 'both', iosDeviceType: 'both' },
        4723,
        Object.assign({}, pluginArgs),
        'plugin-queue-test-node',
      ),
    );
    const plugin = new DevicePlugin('device-farm', {
      deviceAvailabilityTimeoutMs: timeoutMs,
      deviceAvailabilityQueryIntervalMs: 100,
    });
    const startedAt = Date.now();

    // No device has this platform version, so every request would wait for its whole timeout.
    const requests = [1, 2, 3].map((n) => {
      const requestId = `queue-request-${n}`;
      sessionRequestMap.set(requestId, {} as any);
      const caps = {
        alwaysMatch: {
          platformName: 'android',
          'appium:platformVersion': '99.3',
          'appium:requestId': requestId,
        },
        firstMatch: [{}],
      };
      return plugin
        .createSession(async () => ({}), {}, {}, {}, caps as any)
        .then(
          () => {
            throw new Error(`request ${n} should not get a session`);
          },
          (err: Error) => ({ n, message: err.message, at: Date.now() - startedAt }),
        )
        .finally(() => sessionRequestMap.delete(requestId));
    });
    const results = await Promise.all(requests);

    for (const result of results) {
      expect(result.message, `request ${result.n}`).to.match(
        /No device matching request|Timed out after 1500 ms/,
      );
      expect(result.at, `request ${result.n} failed after ${result.at} ms`).to.be.within(
        timeoutMs - 100,
        timeoutMs + 1000,
      );
    }
    // None of them is left in the pending sessions.
    const pending = (await ATDRepository.PendingSessionsModel)
      .chain()
      .where((p: any) => String(p.capability_id).startsWith('queue-request-'))
      .data();
    expect(pending).to.have.length(0);
  });
});
