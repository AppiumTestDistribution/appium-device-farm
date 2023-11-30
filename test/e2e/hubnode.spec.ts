import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import ip from 'ip';

import { pluginE2EHarness } from '@appium/plugin-test-support';
import { remote } from 'webdriverio';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';

const HUB_APPIUM_PORT = 4723;
const NODE_APPIUM_PORT = 4724;
const PLUGIN_PATH = path.resolve(__dirname + '/../..');

const hub_config = DefaultPluginArgs
const node_config = Object.assign(DefaultPluginArgs, {
  hub: `http://${ip.address()}:${HUB_APPIUM_PORT}`,
})

describe('E2E', () => {
  // create temp dir
  const tempDir = path.resolve(__dirname + '/../../appium-e2e-test');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  // dump hub config into a file
  const hub_config_file = tempDir + '/hub-config.json';
  fs.writeFileSync(hub_config_file, JSON.stringify({
    "server": {
      "port": HUB_APPIUM_PORT,
      "plugin": {
        "device-farm": hub_config
      }
    }
  }));

  // dump node config into a file
  const node_config_file = tempDir + '/node-config.json';
  fs.writeFileSync(node_config_file, JSON.stringify({
    "server": {
      "port": NODE_APPIUM_PORT,
      "plugin": {
        "device-farm": node_config
      }
    }
  }));

  // setup appium home
  const APPIUM_HOME = path.resolve(__dirname + '/../../temp-appium')
  if (!fs.existsSync(APPIUM_HOME)) {
    fs.mkdirSync(APPIUM_HOME);
  }

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