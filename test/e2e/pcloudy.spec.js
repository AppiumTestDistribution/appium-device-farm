// eslint-disable-next-line @typescript-eslint/no-var-requires
import axios from 'axios';
import { expect } from 'chai';

describe('Browserstack Devices', () => {
  it('Should be able to run the android with Browerstack config', async () => {
    let androidDevices = (await axios.get('http://localhost:31337/device-farm/api/devices/android'))
      .data;
    delete androidDevices[0].meta;
    delete androidDevices[0]['$loki'];
    expect(androidDevices[0]).to.deep.equal({
      platform: 'android',
      host: 'https://device.pcloudy.com/appiumcloud/wd/hub',
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
    expect(iosDevics[0]).to.deep.equal({
      platform: 'ios',
      host: 'https://device.pcloudy.com/appiumcloud/wd/hub',
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
      name: 'APPLE',
      sdk: '15.1',
      udid: 'APPLE',
      offline: false,
    });
  });
});
