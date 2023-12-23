import { getDevice } from '../../src/data-service/device-service';
import { ADTDatabase } from '../../src/data-service/db';
import { expect } from 'chai';
import { IDeviceFilterOptions } from '../../src/interfaces/IDeviceFilterOptions';
import semver from 'semver';

describe('Get device', () => {
  before('Set devices in memory', async () => {
    const devices = [
      {
        sdk: '10',
        realDevice: false,
        name: 'sdk_gphone_x86',
        busy: false,
        state: 'device',
        udid: 'emulator-5554',
        platform: 'android',
        deviceType: 'emulator',
        offline: false,
        userBlocked: false,
        host: 'http://localhost:4723',
      },
      {
        sdk: '11',
        realDevice: false,
        name: 'sdk_gphone_x86',
        busy: false,
        state: 'device',
        udid: 'emulator-5556',
        platform: 'android',
        deviceType: 'emulator',
        offline: false,
        userBlocked: false,
        host: 'http://localhost:4723',
      },
      {
        name: 'iPhone SE (2nd generation)',
        udid: 'F6A28560-7D0C-4EE9-8E1D-C1A70A350434',
        state: 'Shutdown',
        sdk: '13.0',
        platform: 'ios',
        busy: false,
        offline: false,
        realDevice: false,
        deviceType: 'simulator',
        host: 'http://localhost:4723',
        userBlocked: false,
      },
      {
        name: 'iPhone 11 Pro Max',
        udid: 'F44B044A-CBC3-4F9A-96B9-448899FEDD46',
        state: 'Shutdown',
        sdk: '14.0',
        platform: 'ios',
        busy: false,
        offline: false,
        realDevice: false,
        deviceType: 'simulator',
        host: 'http://localhost:4723',
        userBlocked: false,
      },
      {
        name: 'iPhone 11 Pro',
        udid: '18E788F1-92BC-4F91-B5F5-3858B2164088',
        state: 'Shutdown',
        sdk: '15.0',
        platform: 'ios',
        busy: false,
        offline: false,
        realDevice: false,
        deviceType: 'simulator',
        host: 'http://localhost:4723',
        userBlocked: false,
      },
      {
        name: 'Apple TV',
        udid: '8617129A-C477-44A4-9B62-319B56987CC5',
        state: 'Shutdown',
        sdk: '15.0',
        platform: 'tvos',
        busy: false,
        offline: false,
        realDevice: false,
        deviceType: 'simulator',
        userBlocked: false,
        host: 'http://localhost:4723',
      },
      {
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
      },
    ];

    (await ADTDatabase.DeviceModel).removeDataOnly();
    for await (const device of devices) {
      (await ADTDatabase.DeviceModel).insert({
        ...device,
      });
    }
  });

  it('Get android device based on filter with minSDK', async () => {
    const filterOptions = {
      platform: 'android',
      name: '',
      busy: false,
      offline: false,
      minSDK: '10.0.1',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);

    const sdk10 = semver.coerce('10');
    const sdk101 = semver.coerce('10.0.1');
    const sdk11 = semver.coerce('11.0.1');

    expect(semver.gte(sdk10!, sdk10!)).to.be.true;
    expect(semver.gte(sdk101!, sdk10!)).to.be.true;
    expect(semver.gte(sdk10!, sdk11!)).to.be.false;
    expect(device?.sdk).to.be.eq('11');
  });

  it('Get iOS device based on filter real device', async () => {
    const filterOptions = {
      platform: 'ios',
      name: '',
      deviceType: 'real',
      busy: false,
      userBlocked: false,
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.deviceType).to.be.eq('real');
  });

  it('Get android device based on filter with minSDK and maxSDK', async () => {
    const filterOptions = {
      platform: 'android',
      name: '',
      busy: false,
      offline: false,
      minSDK: '10',
      maxSDK: '10.0.1',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eq('10');
  });

  it('Get android device based on filter with maxSDK', async () => {
    const filterOptions = {
      platform: 'android',
      name: '',
      busy: false,
      offline: false,
      maxSDK: '10.0.1',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eq('10');
  });

  it('Get ios simulator based on filter with minSDK', async () => {
    const filterOptions = {
      platform: 'ios',
      name: '',
      busy: false,
      offline: false,
      minSDK: '14.1.0',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eq('15');
  });

  it('Get ios simulator based on filter with maxSDK', async () => {
    const filterOptions = {
      platform: 'ios',
      name: '',
      busy: false,
      offline: false,
      maxSDK: '14.1.0',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eq('14.0');
  });

  it('Get ios simulator based on filter with minSDK and maxSDK', async () => {
    const filterOptions = {
      platform: 'ios',
      name: '',
      busy: false,
      offline: false,
      minSDK: '14',
      maxSDK: '14.1.0',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eq('14.0');
  });

  it('Get android device based on filter with platformVersion', async () => {
    const filterOptions = {
      platform: 'android',
      name: '',
      busy: false,
      offline: false,
      platformVersion: '10',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eql('10');
  });

  it('Get ios simulator based on filter with platform', async () => {
    const filterOptions = {
      platform: 'ios',
      name: '',
      busy: false,
      offline: false,
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eql('13.0');
  });

  it('Get ios simulator based on filter with platformVersion', async () => {
    const filterOptions = {
      //platform: 'ios',
      name: '',
      busy: false,
      offline: false,
      platformVersion: '14.0',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.sdk).to.be.eql('14.0');
  });

  it('Get android device returns undefined based on filter with platformVersion', async () => {
    const filterOptions = {
      platform: 'android',
      name: '',
      busy: false,
      offline: false,
      platformVersion: '9',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device).to.be.undefined;
  });

  it('Get ios simulator returns undefined based on filter with platformVersion', async () => {
    const filterOptions = {
      platform: 'ios',
      name: '',
      busy: false,
      offline: false,
      platformVersion: '16.0',
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device).to.be.undefined;
  });

  it('Get apple tv simulator based on filter with platformName', async () => {
    const filterOptions = {
      platform: 'tvos',
      name: '',
      busy: false,
      offline: false,
    } as unknown as IDeviceFilterOptions;
    const device = await getDevice(filterOptions);
    expect(device?.platform).to.be.eql('tvos');
    expect(device?.sdk).to.be.eql('15.0');

    if (device?.sdk) {
      expect(parseFloat(device?.sdk)).to.be.gte(14.1);
    } else {
      expect(device?.sdk).to.be.not.undefined;
    }
  });
});
