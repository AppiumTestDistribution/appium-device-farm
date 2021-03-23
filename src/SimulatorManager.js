import Simctl from 'node-simctl';

export default class SimulatorManager {
  constructor() {
    this.simctl = new Simctl();
  }

  async getSimulators() {
    const devices = await this.simctl.getDevices('13.5', 'iOS');
    console.log(devices);
  }
}
