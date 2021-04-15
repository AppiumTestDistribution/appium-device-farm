import Simctl from 'node-simctl';
import { flatten } from 'lodash';

let simulators = [];

export default class SimulatorManager {
  constructor() {
    this.simctl = new Simctl();
  }

  async getSimulators() {
    flatten(Object.values(await this.getiOSSimulators())).forEach((device) =>
      simulators.push(
        Object.assign({}, device, { busy: false, realDevice: false })
      )
    );
    simulators.sort((a, b) => (a.state > b.state ? 1 : -1));
    return simulators;
  }

  async getiOSSimulators() {
    return await this.simctl.getDevicesByParsing('iOS');
  }
}
