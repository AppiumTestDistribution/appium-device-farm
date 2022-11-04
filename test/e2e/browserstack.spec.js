// eslint-disable-next-line @typescript-eslint/no-var-requires
import axios from 'axios';
import { expect } from 'chai';

describe('Browserstack Devices', () => {
  it('Should be able to run the android with Browerstack config', async () => {
    let androidDevices = (await axios.get('http://localhost:31337/device-farm/api/devices/android'))
      .data;
    delete androidDevices[0].meta;
    delete androidDevices[0]['$loki'];
    expect(androidDevices[0]).to.include({
      device: 'Google Pixel 3',
      os_version: '9.0',
      platform: 'android',
      host: 'http://hub-cloud.browserstack.com',
      busy: false,
      deviceType: 'real',
      name: 'Google Pixel 3',
      sdk: '9.0',
      udid: 'Google Pixel 3',
      cloud: 'browserstack',
      offline: false,
    });
  });

  it('Should be able to run the plugin with Browerstack config', async () => {
    const status = (await axios.get('http://localhost:31337/device-farm/api/devices')).status;
    expect(status).to.be.eql(200);
  });

  it('Should be able to get iOS devices from Browerstack config', async () => {
    let iosDevics = (await axios.get('http://localhost:31337/device-farm/api/devices/ios')).data;
    delete iosDevics[0].meta;
    delete iosDevics[0]['$loki'];
    expect(iosDevics[0]).to.include({
      device: 'iPhone 11 Pro',
      os_version: '15',
      platform: 'ios',
      host: 'http://hub-cloud.browserstack.com',
      busy: false,
      deviceType: 'real',
      name: 'iPhone 11 Pro',
      sdk: '15',
      udid: 'iPhone 11 Pro',
      cloud: 'browserstack',
      offline: false,
    });
  });
});
