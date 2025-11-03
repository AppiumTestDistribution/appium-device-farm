import chai from 'chai';
import sinon from 'sinon';
import * as Helpers from '../../src/helpers';
import getPort from 'get-port';

const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('Helpers', () => {
  afterEach(() => {
    sandbox.restore();
  });

  it('should call getPort with a port range when a valid range is provided', async () => {
    const getPortStub = sandbox.stub(getPort, 'makeRange').returns([8200, 8210]);
    await Helpers.getFreePort('8200-8210');
    expect(getPortStub.calledOnceWith(8200, 8210)).to.be.true;
  });

  it('should call getPort without a port range when no range is provided', async () => {
    const getPortStub = sandbox.stub(getPort, 'makeRange');
    await Helpers.getFreePort();
    expect(getPortStub.notCalled).to.be.true;
  });

  it('should fall back to any free port when an invalid range is provided', async () => {
    const getPortStub = sandbox.stub(getPort, 'makeRange');
    await Helpers.getFreePort('invalid-range');
    expect(getPortStub.notCalled).to.be.true;
  });
});
