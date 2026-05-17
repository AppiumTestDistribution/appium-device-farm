import { randomUUID } from 'node:crypto';
import { UseDeviceSession, Platform } from './types';
import log from '../logger';

interface PromoteParams {
  sessionId: string;
  deviceWidth: number;
  deviceHeight: number;
  stop: () => Promise<void>;
}

type EntryKind = 'reservation' | 'session';

interface InternalEntry {
  kind: EntryKind;
  /** For 'reservation', this is the reservation token. For 'session', sessionId. */
  primaryKey: string;
  session: UseDeviceSession;
  stop?: () => Promise<void>;
  stopping?: Promise<void>;
}

export class UseDeviceRegistry {
  /** Keyed by reservation token (kind=reservation) OR sessionId (kind=session). */
  private byKey = new Map<string, InternalEntry>();
  /** Secondary index for UDID-uniqueness. Both reservations and sessions occupy. */
  private byUdid = new Map<string, InternalEntry>();

  /**
   * Atomically reserve a UDID. Returns a token to be passed to promote()
   * or releaseReservation(). Returns null if the UDID is already held
   * by any reservation or live session.
   */
  tryReserveUdid(udid: string, platform: Platform): string | null {
    if (this.byUdid.has(udid)) return null;
    const token = randomUUID();
    const session: UseDeviceSession = {
      sessionId: token, // placeholder — replaced on promote
      udid,
      platform,
      state: 'starting',
      deviceWidth: 0,
      deviceHeight: 0,
      createdAt: Date.now(),
    };
    const entry: InternalEntry = {
      kind: 'reservation',
      primaryKey: token,
      session,
    };
    this.byKey.set(token, entry);
    this.byUdid.set(udid, entry);
    log.info(`[device-stream] reserved udid=${udid} token=${token}`);
    return token;
  }

  /**
   * Promote a reservation into a live session. Throws if the token has
   * already been promoted or never existed.
   */
  promote(reservationToken: string, params: PromoteParams): UseDeviceSession {
    const entry = this.byKey.get(reservationToken);
    if (!entry || entry.kind !== 'reservation') {
      throw new Error(
        `UseDeviceRegistry: no reservation for token ${reservationToken}`,
      );
    }
    // Swap primary key from token to real sessionId.
    this.byKey.delete(reservationToken);
    entry.kind = 'session';
    entry.primaryKey = params.sessionId;
    entry.session.sessionId = params.sessionId;
    entry.session.state = 'running';
    entry.session.deviceWidth = params.deviceWidth;
    entry.session.deviceHeight = params.deviceHeight;
    entry.stop = params.stop;
    this.byKey.set(params.sessionId, entry);
    // byUdid still points at the same entry; no change needed.
    log.info(
      `[device-stream] promoted reservation ${reservationToken} -> session ${params.sessionId} for ${entry.session.udid}`,
    );
    return entry.session;
  }

  /**
   * Drop a reservation. No-op if the token is unknown OR has already been
   * promoted (in which case the session must go through stop() instead).
   */
  releaseReservation(reservationToken: string): void {
    const entry = this.byKey.get(reservationToken);
    if (!entry || entry.kind !== 'reservation') return;
    this.byKey.delete(reservationToken);
    this.byUdid.delete(entry.session.udid);
    log.info(`[device-stream] released reservation ${reservationToken}`);
  }

  get(sessionId: string): UseDeviceSession | undefined {
    const entry = this.byKey.get(sessionId);
    return entry?.session;
  }

  getByUdid(udid: string): UseDeviceSession | undefined {
    return this.byUdid.get(udid)?.session;
  }

  list(): UseDeviceSession[] {
    return Array.from(this.byKey.values()).map((e) => e.session);
  }

  async stop(sessionId: string): Promise<void> {
    const entry = this.byKey.get(sessionId);
    if (!entry || entry.kind !== 'session' || !entry.stop) return;
    if (entry.stopping) return entry.stopping;
    entry.session.state = 'stopping';
    const stopFn = entry.stop;
    entry.stopping = stopFn()
      .catch((err) => {
        log.warn(
          `[device-stream] stop ${sessionId} threw: ${(err as Error)?.message ?? err}`,
        );
      })
      .finally(() => {
        entry.session.state = 'terminated';
        this.byKey.delete(sessionId);
        this.byUdid.delete(entry.session.udid);
        log.info(`[device-stream] session ${sessionId} terminated`);
      });
    return entry.stopping;
  }

}

/** Module-singleton registry instance, mirroring upstream patterns. */
export const useDeviceRegistry = new UseDeviceRegistry();
