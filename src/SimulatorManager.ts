import Simctl from 'node-simctl';
import { flatten } from 'lodash';
import { IDevice } from './interfaces/IDevice';

export default class SimulatorManager {
  async getSimulators(): Promise<Array<IDevice>> {
    const simulators: Array<IDevice> = [];
    flatten(Object.values(await this.getiOSSimulators())).forEach((device) =>
      simulators.push(
        Object.assign({}, device, { busy: false, realDevice: false })
      )
    );
    simulators.sort((a, b) => (a.state > b.state ? 1 : -1));
    simulators.forEach((simulator) => (simulator.platform = 'ios'));
    return simulators;
  }

  async getiOSSimulators(): Promise<Array<IDevice>> {
    return await new Simctl().getDevicesByParsing('iOS');
  }
}
