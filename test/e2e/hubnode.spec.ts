import { expect } from 'chai';
import ip from 'ip';

import { pluginE2EHarness } from '@appium/plugin-test-support';
import { remote } from 'webdriverio';
import { HUB_APPIUM_PORT, NODE_APPIUM_PORT, PLUGIN_PATH, ensureAppiumHome, ensureHubConfig, ensureNodeConfig } from './e2ehelper';

describe('E2E', () => {
  // dump hub config into a file
  const hub_config_file = ensureHubConfig();

  // dump node config into a file
  const node_config_file = ensureNodeConfig();

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome();

  // run hub
  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: hub_config_file
    },
    pluginName: 'device-farm',
    port: HUB_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!
  })

  // run node
  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: node_config_file
    },
    pluginName: 'device-farm',
    port: NODE_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!
  })


  it('should use my plugin', async function () {
    this.timeout(200000);

    // port/host should match what you provided to `pluginE2EHarness`
    const browser = await remote({
      port: HUB_APPIUM_PORT, 
      hostname: ip.address(),
      capabilities: {
        "appium:automationName": "UiAutomator2",
        "appium:app": "https://prod-mobile-artefacts.lambdatest.com/assets/docs/proverbial_android.apk",
        "platformName": "android",
        "appium:deviceName": "",
      } as unknown as WebdriverIO.Capabilities
    });
    
    const cap = browser.capabilities;
    
    // check that session is created
    expect(cap).to.have.property('app').that.is.a('string').that.satisfies((app: string) => {
      return app.startsWith('http')
    })
  })
});