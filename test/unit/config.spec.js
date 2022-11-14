import path from 'path';
import { isDeviceConfigPathAbsolute } from '../../src/device-utils';
import { expect } from 'chai';
describe('Config Test', () => {
  it('Should be able to load data from absolute path from config', async () => {
    const deviceConfigPath = path.resolve(__dirname, './fixtures/device.config.js');
    expect(isDeviceConfigPathAbsolute(deviceConfigPath)).to.be.true;
  });

  it('Should throw error when path is not absolute', async () => {
    const deviceConfigPath = './fixtures/device.config.js';
    expect(() => isDeviceConfigPathAbsolute(deviceConfigPath)).to.throw(
      'Device Config Path ./fixtures/device.config.js should be absolute'
    );
  });
});
