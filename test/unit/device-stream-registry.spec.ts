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

    it('rejects duplicate udid', () => {
      const params = {
        sessionId: 's1',
        udid: 'u1',
        platform: 'android' as const,
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      };
      registry.register(params);
      expect(() => registry.register(params)).to.throw(/already in use/);
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

describe('reservation API', () => {
  let stopFn: sinon.SinonStub;
  let registry: UseDeviceRegistry;

  beforeEach(() => {
    stopFn = sinon.stub().resolves();
    registry = new UseDeviceRegistry();
  });

  describe('tryReserveUdid', () => {
    it('returns a token when udid is free', () => {
      const token = registry.tryReserveUdid('udid-1', 'android');
      expect(token).to.be.a('string').and.have.lengthOf.greaterThan(8);
    });

    it('returns null when udid is already reserved', () => {
      registry.tryReserveUdid('udid-1', 'android');
      const second = registry.tryReserveUdid('udid-1', 'android');
      expect(second).to.be.null;
    });

    it('returns null when udid is already running', () => {
      const token = registry.tryReserveUdid('udid-1', 'android')!;
      registry.promote(token, {
        sessionId: 'sess-1',
        deviceWidth: 528,
        deviceHeight: 1080,
        stop: stopFn,
      });
      const second = registry.tryReserveUdid('udid-1', 'android');
      expect(second).to.be.null;
    });

    it('allows re-reserving the same udid after the previous session stops', async () => {
      const token1 = registry.tryReserveUdid('udid-1', 'android')!;
      registry.promote(token1, {
        sessionId: 'sess-1',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      await registry.stop('sess-1');
      const token2 = registry.tryReserveUdid('udid-1', 'android');
      expect(token2).to.be.a('string');
    });
  });

  describe('promote', () => {
    it('replaces the reservation placeholder with the real session', () => {
      const token = registry.tryReserveUdid('udid-1', 'android')!;
      const session = registry.promote(token, {
        sessionId: 'sess-1',
        deviceWidth: 528,
        deviceHeight: 1080,
        stop: stopFn,
      });
      expect(session.state).to.equal('running');
      expect(registry.get('sess-1')).to.exist;
      expect(registry.getByUdid('udid-1')).to.deep.equal(session);
    });

    it('throws if the token does not exist', () => {
      expect(() =>
        registry.promote('bogus-token', {
          sessionId: 'sess-1',
          deviceWidth: 1,
          deviceHeight: 1,
          stop: stopFn,
        }),
      ).to.throw(/no reservation/);
    });

    it('throws if the token has already been promoted', () => {
      const token = registry.tryReserveUdid('udid-1', 'android')!;
      registry.promote(token, {
        sessionId: 'sess-1',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      expect(() =>
        registry.promote(token, {
          sessionId: 'sess-2',
          deviceWidth: 1,
          deviceHeight: 1,
          stop: stopFn,
        }),
      ).to.throw(/no reservation/);
    });
  });

  describe('releaseReservation', () => {
    it('drops a reservation without calling stop', () => {
      const token = registry.tryReserveUdid('udid-1', 'android')!;
      registry.releaseReservation(token);
      expect(stopFn).to.not.have.been.called;
      expect(registry.getByUdid('udid-1')).to.be.undefined;
      const reReserve = registry.tryReserveUdid('udid-1', 'android');
      expect(reReserve).to.be.a('string');
    });

    it('is a no-op on unknown token', () => {
      expect(() => registry.releaseReservation('bogus')).to.not.throw();
    });

    it('is a no-op once promoted (the session must go through stop instead)', () => {
      const token = registry.tryReserveUdid('udid-1', 'android')!;
      registry.promote(token, {
        sessionId: 'sess-1',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      registry.releaseReservation(token); // no-op
      expect(registry.get('sess-1')).to.exist;
    });
  });

  describe('getByUdid', () => {
    it('returns the running session for a udid', () => {
      const token = registry.tryReserveUdid('udid-1', 'android')!;
      registry.promote(token, {
        sessionId: 'sess-1',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      const got = registry.getByUdid('udid-1');
      expect(got?.sessionId).to.equal('sess-1');
    });

    it('returns the starting placeholder for a udid mid-reservation', () => {
      registry.tryReserveUdid('udid-1', 'android');
      const got = registry.getByUdid('udid-1');
      expect(got?.state).to.equal('starting');
      expect(got?.udid).to.equal('udid-1');
    });

    it('returns undefined for unknown udid', () => {
      expect(registry.getByUdid('nope')).to.be.undefined;
    });
  });
});
