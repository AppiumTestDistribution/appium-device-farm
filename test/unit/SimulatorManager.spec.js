import sinon from 'sinon';
import { expect } from 'chai';
import SimulatorManager from '../../src/SimulatorManager';

describe('Simulator Manager', () => {
  it('Simulator List to have added state', async () => {
    const simulatorManager = new SimulatorManager();
    sinon.stub(simulatorManager, 'getiOSSimulators').returns([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'iOS',
      },
    ]);
    const simulators = await simulatorManager.getSimulators();
    expect(simulators).to.deep.equal([
      {
        name: 'iPad Air (3rd generation)',
        udid: '0FBCBDCC-2FF1-4FCA-B034-60ABC86ED866',
        state: 'Shutdown',
        sdk: '13.5',
        platform: 'iOS',
        busy: false,
        realDevice: false,
      },
    ]);
  });
});
