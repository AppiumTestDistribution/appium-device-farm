import Simctl from 'node-simctl';

export default class SimulatorManager {
  constructor() {
    this.simctl = new Simctl();
  }

  async getSimulators() {
    return await this.simctl.getDevicesByParsing('iOS');
  }
}
