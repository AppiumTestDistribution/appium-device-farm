// eslint-disable-next-line @typescript-eslint/no-var-requires
import { pluginE2EHarness } from '@appium/plugin-test-support';
import axios from 'axios';
import { expect } from 'chai';
import path from 'path';
import { ensureAppiumHome, HUB_APPIUM_PORT, PLUGIN_PATH } from './e2ehelper';
import ip from 'ip';
import { IDevice } from '../../src/interfaces/IDevice';

describe('PCloudy Devices', () => {
  // dump hub config into a file
  const hub_config_file = path.join(__dirname, '../../serverConfig/pcloudy-config.json');

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

  it('Should be able to run the android with PCloudy config', async () => {
    let androidDevices = (await axios.get(`${hub_url}/device-farm/api/device/android`)).data;
    androidDevices = androidDevices.filter((device: IDevice) => device.cloud === 'pCloudy');
    delete androidDevices[0].meta;
    delete androidDevices[0]['$loki'];
    expect(androidDevices[0]).to.deep.equal({
      platform: 'android',
      host: 'https://device.pcloudy.com/appiumcloud',
      busy: false,
      deviceType: 'real',
      capability: {
        pCloudy_DeviceManufacturer: 'GOOGLE',
        pCloudy_DeviceVersion: '11.0',
        platform: 'android',
      },
      cloud: 'pCloudy',
      pCloudy_DeviceManufacturer: 'GOOGLE',
      pCloudy_DeviceVersion: '11.0',
      name: 'GOOGLE',
      sdk: '11.0',
      udid: 'GOOGLE',
      userBlocked: false,
      offline: false,
      sessionStartTime: 0,
      totalUtilizationTimeMilliSec: null,
    });
  });

  it('Should be able to run the plugin with PCloudy config', async () => {
    const status = (await axios.get(`${hub_url}/device-farm/api/device`)).status;
    expect(status).to.be.eql(200);
  });

  it('Should be able to get iOS devices from PCloudy config', async () => {
    const iosDevices = (await axios.get(`${hub_url}/device-farm/api/device/ios`)).data;
    //console.log(JSON.stringify(iosDevices));
    const cloudDevices = iosDevices.filter((device: IDevice) => device.cloud === 'pCloudy');
    delete cloudDevices[0].meta;
    delete cloudDevices[0]['$loki'];
    //delete cloudDevices[0].udid;
    //delete cloudDevices[0].name;
    expect(cloudDevices[0]).to.deep.equal({
      platform: 'ios',
      host: 'https://device.pcloudy.com/appiumcloud',
      busy: false,
      userBlocked: false,
      deviceType: 'real',
      capability: {
        pCloudy_DeviceManufacturer: 'APPLE',
        pCloudy_DeviceVersion: '15.1',
        platform: 'ios',
      },
      cloud: 'pCloudy',
      pCloudy_DeviceManufacturer: 'APPLE',
      pCloudy_DeviceVersion: '15.1',
      sdk: '15.1',
      udid: 'APPLE',
      offline: false,
      sessionStartTime: 0,
      totalUtilizationTimeMilliSec: null,
      name: 'APPLE',
    });
  });
});
