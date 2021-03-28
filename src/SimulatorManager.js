import Simctl from 'node-simctl';
import { flatten } from 'lodash';

let simulators = [];

export default class SimulatorManager {
  constructor() {
    this.simctl = new Simctl();
  }

  async getSimulators() {
    flatten(
      Object.values(await this.simctl.getDevicesByParsing('iOS'))
    ).forEach((device) =>
      simulators.push(Object.assign({}, device, { busy: false }))
    );
    return simulators;
  }
}
