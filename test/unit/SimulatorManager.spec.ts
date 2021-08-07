import SimulatorManager from '../../src/SimulatorManager';

describe('Simulator Manager', () => {
  test('Simulator List to have added state', async () => {
    const simulatorManager = new SimulatorManager();
    jest.spyOn(simulatorManager, 'getiOSSimulators').mockResolvedValue([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        busy: false,
        realDevice: false,
        sessionId: '123',
      },
    ]);

    const simulators = await simulatorManager.getSimulators();

    expect(simulators).toStrictEqual([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'ios',
        busy: false,
        realDevice: false,
        sessionId: '123',
      },
    ]);
  });
});
