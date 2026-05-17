# Android Use Device Concurrency Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two concurrency bugs in `src/device-stream/router.ts` + `registry.ts` surfaced during manual verification of the Android Use Device slice. Sequential behaviour is solid (100/100 cycle test green); only concurrent claims and refresh-during-pending paths are broken.

**Architecture:** Add an atomic UDID-keyed reservation step in the registry that happens **before** `createSession`. JavaScript is single-threaded so a synchronous check-then-insert is the entire mutex. All success paths transition reservation → live session via `promote(token)`; all failure paths drop the reservation via `releaseReservation(token)`.

**Tech Stack:** TypeScript. Same module set as the parent slice (no new dependencies).

---

## Spec reference

This plan implements [docs/superpowers/specs/2026-05-17-android-use-device-concurrency-fix-design.md](../specs/2026-05-17-android-use-device-concurrency-fix-design.md).

Parent slice plan and design (read these first for context):
- [docs/superpowers/specs/2026-05-16-android-use-device-design.md](../specs/2026-05-16-android-use-device-design.md)
- [docs/superpowers/plans/2026-05-16-android-use-device.md](2026-05-16-android-use-device.md)

## Branch

This is a **fix-up commit on `feat/android-use-device`** — not a new branch. Verify before starting:

```bash
git status        # should show clean tree on feat/android-use-device
git log --oneline | head -5   # most recent should be fa2c434 manual verification + final polish
```

If you're not on that branch with a clean tree, stop and check with the human.

## File map

- Modify `src/device-stream/registry.ts` — add reservation API.
- Modify `src/device-stream/router.ts` — use reservation in `/start`.
- Modify `test/unit/device-stream-registry.spec.ts` — add reservation tests.

That's it. No new files. ~80 LOC delta across the two source files.

---

## Task 1: Registry — reservation API (TDD)

**Files:**
- Modify: `src/device-stream/registry.ts`
- Modify: `test/unit/device-stream-registry.spec.ts`

- [x] **Step 1: Read the existing registry to remind yourself of the shape**

```bash
cat src/device-stream/registry.ts
```

- [x] **Step 2: Add the failing tests**

Append to `test/unit/device-stream-registry.spec.ts`:

```typescript
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
```

- [x] **Step 3: Run tests to verify they fail**

```bash
npx mocha -r ts-node/register test/unit/device-stream-registry.spec.ts
```
Expected: new tests fail with method-not-found / undefined errors.

- [x] **Step 4: Implement the reservation API in `registry.ts`**

The full revised `src/device-stream/registry.ts`:

```typescript
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

  /**
   * @deprecated Use tryReserveUdid + promote. Kept as a back-compat shim
   * so Task 1's commit doesn't break the router until Task 2 lands. Remove
   * the shim in Task 2.
   */
  register(params: {
    sessionId: string;
    udid: string;
    platform: Platform;
    deviceWidth: number;
    deviceHeight: number;
    stop: () => Promise<void>;
  }): UseDeviceSession {
    const token = this.tryReserveUdid(params.udid, params.platform);
    if (!token) {
      throw new Error(
        `UseDeviceRegistry: udid ${params.udid} already in use`,
      );
    }
    return this.promote(token, {
      sessionId: params.sessionId,
      deviceWidth: params.deviceWidth,
      deviceHeight: params.deviceHeight,
      stop: params.stop,
    });
  }
}

export const useDeviceRegistry = new UseDeviceRegistry();
```

Note: existing slice 1 tests that exercise `register()` should still pass after Task 1 — the shim preserves behaviour for the single-session-per-udid happy path. Tests asserting "duplicate sessionId throws" need updating: the new contract is "duplicate UDID throws". If any existing test relies on the old error message, adjust the assertion to match the new shim's error.

- [x] **Step 5: Run all registry tests to verify they pass**

```bash
npx mocha -r ts-node/register test/unit/device-stream-registry.spec.ts
```
Expected: all tests pass (the existing register/get/stop/concurrency tests + the new reservation tests).

Note: the old `register()` method is removed. If any other test or production code calls `register()` directly, switch it to `tryReserveUdid` + `promote`.

- [x] **Step 6: Commit**

```bash
git add src/device-stream/registry.ts test/unit/device-stream-registry.spec.ts
git commit -m "feat(device-stream): registry reservation API for atomic UDID claim"
```

→ Committed as `444dd61`. Reservation API + 13 new tests; 20/20 registry tests green.

---

## Task 2: Router — use reservation in `/start`

**Files:**
- Modify: `src/device-stream/router.ts`

- [x] **Step 1: Read the current `/start` handler**

```bash
grep -n "use-device/start\|registry\.register\|UseDeviceRegistry" src/device-stream/router.ts
```

- [x] **Step 2: Modify the `/start` handler**

Find the `router.post('/use-device/start', ...)` block in `src/device-stream/router.ts`. The new structure:

```typescript
router.post('/use-device/start', async (req: Request, res: Response) => {
  const body = req.body as StartUseDeviceRequest;
  if (!body?.udid) {
    return res.status(400).json({
      error: 'missing_udid',
      message: 'udid is required',
    });
  }

  // Atomic UDID reservation BEFORE any I/O. JavaScript is single-threaded,
  // so check-then-insert in the registry is the entire mutex.
  const reservationToken = useDeviceRegistry.tryReserveUdid(body.udid, 'android');
  if (!reservationToken) {
    log.info(`[device-stream] /start 409: udid ${body.udid} already in use`);
    return res.status(409).json({
      error: 'device_busy',
      message: `Device ${body.udid} is already in use by another Use Device session`,
    });
  }

  let appiumSessionId: string | undefined;
  let bridgeHandle: Awaited<ReturnType<AndroidScrcpyBridge['start']>> | undefined;
  try {
    // 1. Create Appium session (existing logic — unchanged).
    const createUrl = `http://localhost:${pluginArgs.callbackPort ?? 4723}/wd/hub/session`;
    const caps = {
      capabilities: {
        firstMatch: [{}],
        alwaysMatch: {
          platformName: 'Android',
          'appium:automationName': 'UiAutomator2',
          'appium:udid': body.udid,
          'appium:newCommandTimeout': 3600,
        },
      },
    };
    const created = await axios.post<{ value: AppiumSessionCreateResult }>(
      createUrl,
      caps,
      { timeout: 90_000 },
    );
    appiumSessionId = created.data.value.sessionId;

    // 2. Build adb (existing logic — unchanged).
    const connector = new AdbServerNodeTcpConnector({ host: '127.0.0.1', port: 5037 });
    const serverClient = new AdbServerClient(connector);
    const devices = await serverClient.getDevices();
    const picked = devices.find((d) => d.serial === body.udid && d.state === 'device');
    if (!picked) throw new Error(`device ${body.udid} not online via adb`);
    const adb = await serverClient.createAdb({ transportId: picked.transportId });

    // 3. Start bridge.
    const bridge = new AndroidScrcpyBridge(adb, { jarPath: JAR_PATH });
    bridgeHandle = await bridge.start();

    // 4. Resolve dimensions (existing — uses bridge's onDimensions if needed,
    //    or default placeholder per Slice 1 final commit).
    const dim = bridgeHandle.getDimensions() ?? { width: 0, height: 0 };

    // 5. PROMOTE the reservation into a live session.
    const session = useDeviceRegistry.promote(reservationToken, {
      sessionId: appiumSessionId,
      deviceWidth: dim.width,
      deviceHeight: dim.height,
      stop: async () => {
        await bridgeHandle!.stop();
        try {
          await axios.delete(
            `http://localhost:${pluginArgs.callbackPort ?? 4723}/wd/hub/session/${appiumSessionId}`,
            { timeout: 30_000 },
          );
        } catch (err) {
          log.warn(
            `[device-stream] DELETE appium session ${appiumSessionId} failed: ${(err as Error)?.message ?? err}`,
          );
        }
      },
    });
    bridgeHandles.set(session.sessionId, bridgeHandle);

    // 6. Respond (existing).
    const host = req.get('host') ?? `localhost:${pluginArgs.port ?? 4723}`;
    const protocol = req.protocol === 'https' ? 'wss' : 'ws';
    const streamUrl = `${protocol}://${host}/device-farm/api/dashboard/use-device/stream/${session.sessionId}`;
    res.json({
      sessionId: session.sessionId,
      streamUrl,
      platform: 'android',
      deviceWidth: dim.width,
      deviceHeight: dim.height,
    });
  } catch (err) {
    log.error(`[device-stream] /start failed: ${(err as Error)?.message ?? err}`);
    // Release the reservation in every error path.
    useDeviceRegistry.releaseReservation(reservationToken);
    // Best-effort cleanup of partially-allocated resources.
    if (bridgeHandle) await bridgeHandle.stop().catch(() => {});
    if (appiumSessionId) {
      try {
        await axios.delete(
          `http://localhost:${pluginArgs.callbackPort ?? 4723}/wd/hub/session/${appiumSessionId}`,
          { timeout: 30_000 },
        );
      } catch (delErr) {
        log.warn(
          `[device-stream] cleanup DELETE appium session ${appiumSessionId} failed: ${(delErr as Error)?.message ?? delErr}`,
        );
      }
    }
    const message = (err as Error)?.message ?? String(err);
    res.status(502).json({ error: 'bridge_start_failed', message });
  }
});
```

Key differences from the original:
- `tryReserveUdid` call at top — 409 early-exit if it returns null.
- `registry.promote(reservationToken, ...)` replaces `registry.register(...)`.
- `useDeviceRegistry.releaseReservation(reservationToken)` at the top of the catch block.
- Cleanup `axios.delete` failure now logs the actual error message instead of swallowing.

Keep all other handler behaviour (adb connection, bridge start, stream URL construction, stop handler, WS heartbeat) identical to the existing implementation.

- [x] **Step 3: Remove the deprecated `register()` shim from `registry.ts`**

Open `src/device-stream/registry.ts` and delete the entire `register(params)` method that Task 1 added as a back-compat shim. No other caller uses it now.

- [x] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -E 'device-stream|error' | head -20
```
Expected: no errors mentioning device-stream.

- [x] **Step 5: Run all unit tests**

```bash
npm test
```
Expected: all tests pass.

- [x] **Step 6: Commit**

```bash
git add src/device-stream/router.ts src/device-stream/registry.ts
git commit -m "fix(device-stream): atomic UDID reservation in /start prevents stuck busy state"
```

→ Committed as `76f3310`. `/start` reserves atomically, promotes on success, releases on every failure path; `register()` shim deleted; legacy registry tests ported via `registerSession` helper. 161 passing / 4 pending / 0 failing. tsc clean.

---

## Task 3: Manual verification

After the two commits, run the verification battery. **The human runs this** with the Android phone attached.

- [x] **Step 1: Rebuild and run Falx**

```bash
npm run build
appium server -ka 800 --use-plugins=device-farm -pa /wd/hub
```

- [x] **Step 2: 100-cycle leak script — regression check**

```bash
export AUTH_TOKEN="Bearer <token from browser>"
export UDID="<udid>"
node /tmp/falx-cycle-test.mjs
```
Expected: 100/100 clean, scrcpy procs = 0 at the end, latency distribution similar to pre-fix (start p50 ~3.3 s, stop p50 ~360 ms ± 10%).

- [x] **Step 3: Concurrent claim test**

1. Open Chrome Tab A → Falx → click **Use Device** on the test device → wait for stream.
2. Open Chrome Tab B → Falx → click **Use Device** on the same device.

Expected: Tab B sees a "device busy" error or modal **within 1 second** (the 409 path). Tab A keeps streaming.

- [x] **Step 4: Refresh-during-pending test**

1. Open Tab A → start a Use Device session, leave it streaming.
2. Open Tab B → click **Use Device** on the same device → should see 409 quickly.
3. Reload Tab A (Cmd-R).

Expected: Tab A's old session is torn down (~5 s for WS-close → registry.stop → `DELETE /session`), then Tab A starts a fresh session and streams again. Tab B remains in its error state (it never queued, it got 409 already).

Tab B can now manually retry by clicking **Use Device** again — if Tab A has the device, 409; if not, Tab B claims it.

**Critical**: at no point should the dashboard show "device in use" with no active session.

- [x] **Step 5: Sanity check — sequential acceptance unchanged**

Run the slice 1 manual checklist:
- [x] Click Use Device → video appears.
- [x] Tap accuracy holds.
- [x] Back / Home / Recents work.
- [x] Stop button cleanly returns to `/`, device frees within 2 s.
- [x] Close tab without Stop → device frees within ~5 s.

- [x] **Step 6: Append findings to the design**

If everything passes, append a `## Findings` section to [docs/superpowers/specs/2026-05-17-android-use-device-concurrency-fix-design.md](../specs/2026-05-17-android-use-device-concurrency-fix-design.md) noting: 100-cycle still green, concurrent claim 409 reproducible, refresh-during-pending no stuck busy state, sequential acceptance unchanged.

If anything fails, append the failure and stop — don't try to patch on top.

- [x] **Step 7: Final commit**

```bash
git add -A
git status   # should only show the design doc with the findings appended, if anything
git commit -m "docs(device-stream): concurrency fix manual verification findings" || echo "nothing to commit"
```

---

## Self-review checklist (before requesting review)

- [ ] All unit tests pass (`npm test`).
- [ ] `npx tsc --noEmit` clean.
- [ ] 100-cycle leak script — green.
- [ ] Manual concurrent claim test — Tab B sees 409 within 1 s.
- [ ] Manual refresh-during-pending — no stuck busy state.
- [ ] All slice 1 sequential acceptance criteria still green.
- [ ] No leftover `register()` call in production code (replaced by `tryReserveUdid` + `promote`).
- [ ] `releaseReservation` is called in every error path inside `/start`'s try/catch.
- [ ] `releaseReservation` is **not** called after `promote` has succeeded (the session goes through `stop()` instead).

## Open seams (deferred to follow-up if surfaced)

- **Orphan recovery loop.** If, post-fix, any path still produces an Appium session with no registry entry or vice versa, file a separate spike. Don't expand this fix.
- **Cross-host coordination.** Hub/node multi-host claims need hub-side coordination; out of scope.
- **Non-Use-Device Appium clients reserving the device first.** Out of scope; existing Falx reservation contract.
