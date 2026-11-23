import AsyncLock from 'async-lock';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { runInSessionQueue, SessionQueueOptions } from '../../src/utils/session-queue';

chai.use(chaiAsPromised);
const expect = chai.expect;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function deferred() {
  let release!: () => void;
  const promise = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { promise, release };
}

describe('runInSessionQueue', () => {
  let lock: AsyncLock;

  function options<T>(
    overrides: Partial<SessionQueueOptions<T>> & Pick<SessionQueueOptions<T>, 'run'>,
  ): SessionQueueOptions<T> {
    return {
      requestId: 'request',
      requestedAt: Date.now(),
      timeoutMs: 5000,
      checkIntervalMs: 20,
      isClientConnected: () => true,
      ...overrides,
    };
  }

  beforeEach(() => {
    lock = new AsyncLock();
  });

  it('returns what run returns when the lock is free', async () => {
    const result = await runInSessionQueue(lock, 'key', options({ run: async () => 'device-1' }));
    expect(result).to.equal('device-1');
  });

  it('passes on an error thrown by run', async () => {
    await expect(
      runInSessionQueue(
        lock,
        'key',
        options({
          run: async () => {
            throw new Error('No device matching request.');
          },
        }),
      ),
    ).to.be.rejectedWith('No device matching request.');
  });

  it('runs requests with the same key one after the other, in order', async () => {
    const order: string[] = [];
    const first = deferred();
    const requests = [
      runInSessionQueue(
        lock,
        'key',
        options({
          run: async () => {
            order.push('first start');
            await first.promise;
            order.push('first end');
          },
        }),
      ),
      runInSessionQueue(
        lock,
        'key',
        options({
          run: async () => {
            order.push('second');
          },
        }),
      ),
    ];
    await sleep(50);
    expect(order).to.deep.equal(['first start']);
    first.release();
    await Promise.all(requests);
    expect(order).to.deep.equal(['first start', 'first end', 'second']);
  });

  it('does not make requests with different keys wait for each other', async () => {
    const blocker = deferred();
    const blocked = runInSessionQueue(
      lock,
      'ios 17',
      options({ run: () => blocker.promise.then(() => 'late') }),
    );
    const other = await runInSessionQueue(
      lock,
      'android 14',
      options({ run: async () => 'early' }),
    );
    expect(other).to.equal('early');
    blocker.release();
    expect(await blocked).to.equal('late');
  });

  it('counts the time spent in the queue against the timeout', async () => {
    const blocker = deferred();
    const holder = runInSessionQueue(lock, 'key', options({ run: () => blocker.promise }));

    let secondRan = false;
    const startedAt = Date.now();
    const second = runInSessionQueue(
      lock,
      'key',
      options({
        requestId: 'second',
        timeoutMs: 150,
        run: async () => {
          secondRan = true;
        },
      }),
    );
    await expect(second).to.be.rejectedWith(
      'Timed out after 150 ms waiting for other session requests ahead of second',
    );
    expect(Date.now() - startedAt).to.be.within(100, 400);

    // The request that gave up must not take its turn once the request ahead of it is done.
    blocker.release();
    await holder;
    await sleep(30);
    expect(secondRan).to.be.false;
  });

  it('fails every waiting request at its own deadline, not one timeout after the other', async () => {
    const blocker = deferred();
    const holder = runInSessionQueue(
      lock,
      'key',
      options({ timeoutMs: 10000, run: () => blocker.promise }),
    );
    const startedAt = Date.now();
    const waiting = [1, 2, 3].map((n) =>
      runInSessionQueue(
        lock,
        'key',
        options({ requestId: `waiting-${n}`, timeoutMs: 150, run: async () => n }),
      ).catch((err: Error) => ({ error: err.message, at: Date.now() - startedAt })),
    );
    const results = (await Promise.all(waiting)) as { error: string; at: number }[];
    for (const result of results) {
      expect(result.error).to.match(/^Timed out after 150 ms/);
      expect(result.at).to.be.within(100, 400);
    }
    blocker.release();
    await holder;
  });

  it('starts the timeout of run from the time the request was received', async () => {
    const blocker = deferred();
    const holder = runInSessionQueue(lock, 'key', options({ run: () => blocker.promise }));
    let remaining = -1;
    const second = runInSessionQueue(
      lock,
      'key',
      options({
        timeoutMs: 1000,
        run: async (remainingMs) => {
          remaining = remainingMs;
        },
      }),
    );
    await sleep(200);
    blocker.release();
    await holder;
    await second;
    expect(remaining).to.be.within(1, 900);
  });

  it('never hands run a timeout of zero or less', async () => {
    let remaining = -1;
    await runInSessionQueue(
      lock,
      'key',
      options({
        requestedAt: Date.now() - 10000,
        timeoutMs: 1000,
        run: async (remainingMs) => {
          remaining = remainingMs;
        },
      }),
    );
    expect(remaining).to.equal(1);
  });

  it('leaves the queue when the client disconnects while waiting', async () => {
    const blocker = deferred();
    const holder = runInSessionQueue(lock, 'key', options({ run: () => blocker.promise }));
    let connected = true;
    let secondRan = false;
    const startedAt = Date.now();
    const second = runInSessionQueue(
      lock,
      'key',
      options({
        requestId: 'second',
        isClientConnected: () => connected,
        run: async () => {
          secondRan = true;
        },
      }),
    );
    setTimeout(() => {
      connected = false;
    }, 60);
    await expect(second).to.be.rejectedWith(
      'Client has closed the connection for the new session request with id second',
    );
    // Well before the 5 s timeout, while the request ahead of it still holds the lock.
    expect(Date.now() - startedAt).to.be.below(500);

    blocker.release();
    await holder;
    await sleep(30);
    expect(secondRan).to.be.false;
  });

  it('lets the next request run when one in front of it left the queue', async () => {
    const blocker = deferred();
    const holder = runInSessionQueue(lock, 'key', options({ run: () => blocker.promise }));
    const leaving = runInSessionQueue(
      lock,
      'key',
      options({ isClientConnected: () => false, run: async () => 'never' }),
    ).catch(() => 'left');
    const staying = runInSessionQueue(lock, 'key', options({ run: async () => 'served' }));
    expect(await leaving).to.equal('left');
    blocker.release();
    await holder;
    expect(await staying).to.equal('served');
  });

  it('does not interrupt a request that has reached the front', async () => {
    const result = await runInSessionQueue(
      lock,
      'key',
      options({
        timeoutMs: 50,
        isClientConnected: () => false,
        run: async () => {
          await sleep(150);
          return 'finished';
        },
      }),
    );
    expect(result).to.equal('finished');
  });
});
