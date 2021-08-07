import IOSDeviceManager from '../../src/IOSDeviceManager';

describe('IOS Device Manager', () => {
  it('IOS Device List to have added state', async () => {
    const iosDevices = new IOSDeviceManager();
    jest
      .spyOn(iosDevices, 'getConnectedDevices')
      .mockResolvedValue(['00001111-00115D822222002E']);
    jest.spyOn(iosDevices, 'getOSVersion').mockResolvedValue('14.1.1');
    jest.spyOn(iosDevices, 'getDeviceName').mockResolvedValue('Sai’s iPhone');

    const devices = await iosDevices.getDevices();

    expect(devices).toStrictEqual([
      {
        udid: '00001111-00115D822222002E',
        sdk: '14.1.1',
        name: 'Sai’s iPhone',
        busy: false,
        realDevice: true,
        platform: 'ios',
      },
    ]);
  });
});
