import { expect } from 'chai';
import commands from '../../src/commands';
import { DevicePlugin } from '../../src/plugin';

describe.skip('Plugin commands', () => {
  it('Should not be empty', () => {
    expect(Object.keys(commands).length).to.be.greaterThan(0);
  });

  it('Should register commands to plugin', async () => {
    for (var [name, command] of Object.entries(commands)) {
      expect(DevicePlugin.prototype[name]).to.equal(command);
    }
  });
});
