// eslint-disable-next-line @typescript-eslint/no-var-requires
import { pluginE2EHarness } from '@appium/plugin-test-support';
import axios from 'axios';
import { expect } from 'chai';
import {
  ensureHubConfig,
  ensureNodeConfig,
  ensureAppiumHome,
  HUB_APPIUM_PORT,
  PLUGIN_PATH,
} from './e2ehelper';
import ip from 'ip';
import path from 'path';
import { IDevice } from '../../src/interfaces/IDevice';

describe('Browserstack Devices', () => {
  // dump hub config into a file
  const hub_config_file = path.join(__dirname, '../../serverConfig/bs-config.json');

  // setup appium home
  const APPIUM_HOME = ensureAppiumHome();

  // run hub
  pluginE2EHarness({
    before: global.before,
    after: global.after,
    serverArgs: {
      subcommand: 'server',
      configFile: hub_config_file,
    },
    pluginName: 'device-farm',
    port: HUB_APPIUM_PORT,
    driverSource: 'npm',
    driverName: 'uiautomator2',
    driverSpec: 'appium-uiautomator2-driver',
    pluginSource: 'local',
    pluginSpec: PLUGIN_PATH,
    appiumHome: APPIUM_HOME!,
  });

  const hub_url = `http://${ip.address()}:${HUB_APPIUM_PORT}`;

  it('Should be able to run the android with Browerstack config', async () => {
    let androidDevices = (await axios.get(`${hub_url}/device-farm/api/device/android`)).data;
    androidDevices = androidDevices.filter((device: IDevice) => device.cloud === 'browserstack');
    delete androidDevices[0].meta;
    delete androidDevices[0]['$loki'];
    delete androidDevices[0].nodeId;
    expect(androidDevices[0]).to.deep.equal({
      deviceName: 'Google Pixel 3',
      os_version: '9.0',
      platform: 'android',
      host: 'http://hub-cloud.browserstack.com/wd/hub',
      busy: false,
      userBlocked: false,
      deviceType: 'real',
      capability: { deviceName: 'Google Pixel 3', os_version: '9.0', platform: 'android' },
      cloud: 'browserstack',
      name: 'Google Pixel 3',
      sdk: '9.0',
      udid: 'Google Pixel 3',
      offline: false,
    });
  });

  it('Should be able to run the plugin with Browerstack config', async () => {
    const status = (await axios.get(`${hub_url}/device-farm/api/device`)).status;
    expect(status).to.be.eql(200);
  });

  it('Should be able to get iOS devices from Browerstack config', async () => {
    let iosDevices = (await axios.get(`${hub_url}/device-farm/api/device/ios`)).data;
    iosDevices = iosDevices.filter((device: IDevice) => device.cloud === 'browserstack');
    delete iosDevices[0].meta;
    delete iosDevices[0]['$loki'];
    delete iosDevices[0].nodeId;
    expect(iosDevices[0]).to.deep.equal({
      deviceName: 'iPhone XS',
      os_version: '15',
      platform: 'ios',
      host: 'http://hub-cloud.browserstack.com/wd/hub',
      busy: false,
      userBlocked: false,
      deviceType: 'real',
      capability: {
        deviceName: 'iPhone XS',
        os_version: '15',
        platform: 'ios',
      },
      cloud: 'browserstack',
      name: 'iPhone XS',
      sdk: '15',
      udid: 'iPhone XS',
      offline: false,
    });
  });
});
