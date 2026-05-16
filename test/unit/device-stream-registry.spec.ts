import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { UseDeviceRegistry } from '../../src/device-stream/registry';

chai.use(sinonChai);
const expect = chai.expect;

describe('UseDeviceRegistry', () => {
  let stopFn: sinon.SinonStub;
  let registry: UseDeviceRegistry;

  beforeEach(() => {
    stopFn = sinon.stub().resolves();
    registry = new UseDeviceRegistry();
  });

  describe('register + get', () => {
    it('registers a session and retrieves it', () => {
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 528,
        deviceHeight: 1080,
        stop: stopFn,
      });
      const got = registry.get('s1');
      expect(got).to.exist;
      expect(got!.sessionId).to.equal('s1');
      expect(got!.state).to.equal('running');
    });

    it('returns undefined for unknown sessionId', () => {
      expect(registry.get('nope')).to.be.undefined;
    });

    it('rejects duplicate sessionId', () => {
      const params = {
        sessionId: 's1',
        udid: 'u1',
        platform: 'android' as const,
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      };
      registry.register(params);
      expect(() => registry.register(params)).to.throw(/already registered/);
    });
  });

  describe('stop', () => {
    it('transitions state through stopping → terminated and invokes stop fn', async () => {
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      await registry.stop('s1');
      expect(stopFn).to.have.been.calledOnce;
      expect(registry.get('s1')).to.be.undefined;
    });

    it('is idempotent — second call resolves without throwing or re-invoking stop', async () => {
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      await registry.stop('s1');
      await registry.stop('s1');
      expect(stopFn).to.have.been.calledOnce;
    });

    it('is a no-op for unknown sessionId', async () => {
      await registry.stop('nope');
      expect(stopFn).to.not.have.been.called;
    });
  });

  describe('stop concurrency', () => {
    it('coalesces concurrent stop calls — only one teardown happens', async () => {
      let resolveStop: () => void = () => {};
      const slowStop = sinon.stub().returns(
        new Promise<void>((r) => {
          resolveStop = r;
        }),
      );
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: slowStop,
      });
      const p1 = registry.stop('s1');
      const p2 = registry.stop('s1');
      resolveStop();
      await Promise.all([p1, p2]);
      expect(slowStop).to.have.been.calledOnce;
    });
  });
});
