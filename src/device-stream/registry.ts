import { UseDeviceSession, Platform } from './types';
import log from '../logger';

interface RegisterParams {
  sessionId: string;
  udid: string;
  platform: Platform;
  deviceWidth: number;
  deviceHeight: number;
  /** Idempotent teardown — called at most once per session by the registry. */
  stop: () => Promise<void>;
}

interface InternalEntry {
  session: UseDeviceSession;
  stop: () => Promise<void>;
  /** Promise of in-progress stop, or undefined when not stopping. */
  stopping?: Promise<void>;
}

export class UseDeviceRegistry {
  private entries = new Map<string, InternalEntry>();

  register(params: RegisterParams): UseDeviceSession {
    if (this.entries.has(params.sessionId)) {
      throw new Error(
        `UseDeviceRegistry: sessionId ${params.sessionId} already registered`,
      );
    }
    const session: UseDeviceSession = {
      sessionId: params.sessionId,
      udid: params.udid,
      platform: params.platform,
      state: 'running',
      deviceWidth: params.deviceWidth,
      deviceHeight: params.deviceHeight,
      createdAt: Date.now(),
    };
    this.entries.set(params.sessionId, {
      session,
      stop: params.stop,
    });
    log.info(
      `[device-stream] session ${session.sessionId} registered for ${session.udid} (${session.platform})`,
    );
    return session;
  }

  get(sessionId: string): UseDeviceSession | undefined {
    return this.entries.get(sessionId)?.session;
  }

  list(): UseDeviceSession[] {
    return Array.from(this.entries.values()).map((e) => e.session);
  }

  async stop(sessionId: string): Promise<void> {
    const entry = this.entries.get(sessionId);
    if (!entry) return;
    if (entry.stopping) return entry.stopping;
    entry.session.state = 'stopping';
    entry.stopping = entry
      .stop()
      .catch((err) => {
        log.warn(
          `[device-stream] stop ${sessionId} threw: ${(err as Error)?.message ?? err}`,
        );
      })
      .finally(() => {
        entry.session.state = 'terminated';
        this.entries.delete(sessionId);
        log.info(`[device-stream] session ${sessionId} terminated`);
      });
    return entry.stopping;
  }
}

/** Module-singleton registry instance, mirroring upstream patterns. */
export const useDeviceRegistry = new UseDeviceRegistry();
