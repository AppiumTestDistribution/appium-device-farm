import AndroidDeviceManager from '../../src/AndroidDeviceManager';

describe('Android Device Manager', () => {
  it('Android Device List to have added state', async () => {
    const androidDevices = new AndroidDeviceManager();
    jest
      .spyOn(androidDevices, 'getConnectedDevices')
      .mockResolvedValue([{ udid: 'emulator-5554', state: 'device' }]);
    jest.spyOn(androidDevices, 'getDeviceVersion').mockResolvedValue('9');
    jest
      .spyOn(androidDevices, 'getDeviceName')
      .mockResolvedValue('sdk_phone_x86');
    jest.spyOn(androidDevices, 'isRealDevice').mockResolvedValue(false);

    const devices = await androidDevices.getDevices();

    expect(devices).toStrictEqual([
      {
        busy: false,
        name: 'sdk_phone_x86',
        state: 'device',
        sdk: '9',
        realDevice: false,
        udid: 'emulator-5554',
        platform: 'android',
      },
    ]);
  });
});
