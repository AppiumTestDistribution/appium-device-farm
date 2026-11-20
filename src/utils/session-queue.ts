import AsyncLock from 'async-lock';

export interface SessionQueueOptions<T> {
  /** Id of the new session request, only used in error messages. */
  requestId: string;
  /** Time the request was received. The timeout is counted from here, not from the front of the queue. */
  requestedAt: number;
  /** Total time the request may take, queue time included. */
  timeoutMs: number;
  /** How often a waiting request checks that its client is still connected. */
  checkIntervalMs: number;
  /** Returns false once the client has given up on the request. */
  isClientConnected: () => boolean;
  /** Runs when the request reaches the front. Gets the time left of its timeout. */
  run: (remainingMs: number) => Promise<T>;
}

/**
 * Runs `run` under `lock`, one request at a time per key, the way `lock.acquire` does.
 *
 * While the request waits behind others it also gives up when its timeout has elapsed or
 * its client has disconnected, so that time in the queue counts against the timeout.
 * Once the request reaches the front, `run` owns both checks.
 */
export async function runInSessionQueue<T>(
  lock: AsyncLock,
  key: string,
  options: SessionQueueOptions<T>,
): Promise<T> {
  const { requestId, requestedAt, timeoutMs, checkIntervalMs, isClientConnected, run } = options;
  let started = false;
  let abandoned = false;
  let deadlineTimer: NodeJS.Timeout | undefined;
  let checkTimer: NodeJS.Timeout | undefined;

  const queued = lock.acquire(key, async () => {
    if (abandoned) {
      throw new Error(`Session request ${requestId} left the queue before it reached the front`);
    }
    started = true;
    // Never hand run() a zero or negative timeout, which would skip its one device check.
    return run(Math.max(timeoutMs - (Date.now() - requestedAt), 1));
  });
  // The request may stop waiting before the lock gives it a turn. Its turn then fails fast, and
  // nobody is left to read that rejection.
  queued.catch(() => undefined);

  const leftQueue = new Promise<never>((_resolve, reject) => {
    const giveUp = (reason: string) => {
      if (started || abandoned) {
        return;
      }
      abandoned = true;
      reject(new Error(reason));
    };
    deadlineTimer = setTimeout(
      () =>
        giveUp(
          `Timed out after ${timeoutMs} ms waiting for other session requests ahead of ${requestId}`,
        ),
      Math.max(timeoutMs - (Date.now() - requestedAt), 0),
    );
    checkTimer = setInterval(() => {
      if (!isClientConnected()) {
        giveUp(`Client has closed the connection for the new session request with id ${requestId}`);
      }
    }, checkIntervalMs);
  });

  try {
    return await Promise.race([queued, leftQueue]);
  } finally {
    clearTimeout(deadlineTimer);
    clearInterval(checkTimer);
  }
}
