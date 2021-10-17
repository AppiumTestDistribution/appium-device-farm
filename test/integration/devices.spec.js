import { fetchDevices, listAllDevices } from '../../src/Devices';
import { expect } from 'chai';

describe('Get Devices', () => {
  it('Fetch all connected devices', async () => {
    await fetchDevices();
    expect(listAllDevices()).to.not.be.empty;
  });
});
