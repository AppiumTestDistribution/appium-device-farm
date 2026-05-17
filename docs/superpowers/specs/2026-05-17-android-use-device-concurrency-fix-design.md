# Android Use Device — Concurrency Fix Design

**Date:** 2026-05-17
**Status:** Design approved by user; ready for implementation plan.
**Scope:** Fix-up commit on `feat/android-use-device`. **Not** a new slice.
**Parent slice:** [2026-05-16-android-use-device-design.md](2026-05-16-android-use-device-design.md).

---

## 1. Context

Slice 1 manual verification surfaced two concurrency bugs in the
`/use-device/start` path. Sequential lifecycle is solid — the 100-cycle leak
script ran 100/100 clean, no scrcpy leaks on device, tight latency
distribution (start p50 3322 ms, stop p50 357 ms). The bugs are
concurrency-only.

### Bug A — `/start` queues instead of returning 409

When Tab A holds a Use Device session for device X and Tab B clicks
**Use Device** on the same device, Tab B's `/start` handler calls
`createSession` which is queued by the Appium plugin (because the device is
busy). Tab B's axios call sits for up to 90 seconds, the UI shows
"Session starting…" indefinitely. Spec's documented behavior is HTTP 409,
returned immediately.

### Bug B — Refresh-during-pending creates a stuck busy state

Sequence reproduced manually:

1. Tab A opens, session A is live and streaming.
2. Tab B opens for the same device → Tab B's `createSession` queues.
3. User refreshes Tab A → page unmounts → WS closes → registry tears down
   session A → `DELETE /session/A` runs.
4. Tab A page remounts → its `/start` fires a **second** `createSession`
   for the same UDID, which also queues.
5. Now both Tab A and Tab B are sitting in queued `createSession` calls. If
   either `DELETE` falls through with a swallowed error or a timeout, the
   device's busy flag in Falx never clears.
6. Net state: dashboard says "device in use", no Appium session is
   actually active, neither tab can recover. Device is functionally lost
   until the plugin restarts.

### Why fix now

These bugs live in `src/device-stream/router.ts` and
`src/device-stream/registry.ts` — both shared with iOS. iOS slice will
reuse the same `/start` handler shape. Fixing on Android first means iOS
doesn't inherit the bugs and we don't pay to debug them twice.

---

## 2. Goals & Non-Goals

### In scope

1. `/start` returns 409 **immediately** when the requested UDID already has
   a Use Device session in `starting`, `running`, or `stopping` state.
2. Concurrent `/start` calls for the same UDID serialise: the first one
   reserves the UDID atomically before `createSession`, subsequent ones see
   409 immediately.
3. The reservation is released cleanly on success and on every failure
   path (createSession failure, bridge failure, scrcpy push failure, etc.).
4. Manual concurrent-tab test passes: Tab B sees the 409 within ~1 s,
   not after a 90 s hang.
5. Manual refresh-during-pending test passes: refreshing Tab A while Tab B
   is starting produces one working session and one clean 409, no stuck
   busy state.
6. Unit tests for the new registry behaviour.
7. 100-cycle leak script still green (no regression to sequential path).

### Out of scope (deferred)

- **Orphan recovery loop** (was Bug C in earlier discussion). With A and B
  fixed, the manual-test scenario that produced the orphan should no
  longer be reachable. If post-fix testing surfaces a residual orphan
  path, file a follow-up — don't expand this fix.
- **Surfacing busy state for non-Use-Device Appium sessions.** If a
  regular Appium test runner already has the device, `/start` still
  delegates to `createSession` which will queue. That's the existing
  Falx reservation contract and beyond this fix's scope.
- **Mutex behaviour across hub/node hosts.** Single-host only; multi-host
  coordination lives with the hub/node slice.

---

## 3. Design

### 3.1 Registry change

Add an explicit **starting** state to the registry, keyed by UDID, that's
reserved synchronously before `createSession` runs. The UDID is the
mutex key.

`src/device-stream/registry.ts` gains:

```typescript
// New methods on UseDeviceRegistry:
tryReserveUdid(udid: string, platform: Platform): boolean;
// Atomically: if no entry exists for this UDID, insert a reservation
// in state 'starting' with a placeholder sessionId, return true.
// If an entry exists for this UDID in any state, return false.

promote(reservationToken: string, params: {
  sessionId: string;
  deviceWidth: number;
  deviceHeight: number;
  stop: () => Promise<void>;
}): UseDeviceSession;
// Replaces the placeholder with the real session. Called by /start after
// createSession + bridge.start succeed.

releaseReservation(reservationToken: string): void;
// Drops a starting-state reservation without invoking stop. Called from
// /start's error path before any real resources have been allocated.

getByUdid(udid: string): UseDeviceSession | undefined;
// Lookup by UDID (currently only sessionId-keyed).
```

The reservation token is a UUID generated at `tryReserveUdid` time and
becomes the registry's internal key for that entry until `promote` swaps
in the real sessionId. After `promote`, lookups by sessionId work as
before, lookups by UDID continue to work.

State transitions:

```
absent
  └─ tryReserveUdid(udid) ──► starting (reservationToken)
                                ├─ promote(token, sessionId, ...) ──► running (sessionId)
                                │                                       └─ stop() ──► stopping ──► terminated (gone)
                                └─ releaseReservation(token) ──► terminated (gone)
```

`tryReserveUdid` is the atomic operation. It checks for any existing entry
with matching UDID and inserts only if none exists. JavaScript is
single-threaded so a synchronous check-then-insert is atomic by definition;
no `Mutex` library needed.

### 3.2 `/start` handler change

`src/device-stream/router.ts`:

```typescript
router.post('/use-device/start', async (req, res) => {
  const body = req.body as StartUseDeviceRequest;
  if (!body?.udid) {
    return res.status(400).json({ error: 'missing_udid', message: 'udid is required' });
  }

  // NEW: atomic reservation before any I/O.
  const reservationToken = useDeviceRegistry.tryReserveUdid(body.udid, 'android');
  if (!reservationToken) {
    return res.status(409).json({
      error: 'device_busy',
      message: `Device ${body.udid} is already in use`,
    });
  }

  let appiumSessionId: string | undefined;
  let bridgeHandle: SessionHandle | undefined;
  try {
    // ... existing createSession, adb, bridge.start, dimensions wait ...

    // Replace registry.register(...) with registry.promote(...).
    const session = useDeviceRegistry.promote(reservationToken, {
      sessionId: appiumSessionId!,
      deviceWidth: dim.width,
      deviceHeight: dim.height,
      stop: async () => { /* same as before */ },
    });
    bridgeHandles.set(session.sessionId, bridgeHandle!);
    res.json({ /* same response shape */ });
  } catch (err) {
    // NEW: release reservation in every error path.
    useDeviceRegistry.releaseReservation(reservationToken);

    // ... existing best-effort cleanup of bridge + Appium session ...
    res.status(502).json({ error: 'bridge_start_failed', message: ... });
  }
});
```

### 3.3 Why this works

- **Atomic.** `tryReserveUdid` is a synchronous check-then-insert in a
  single-threaded event loop. No race window.
- **Symmetric.** Every success path calls `promote`. Every failure path
  calls `releaseReservation`. Every successful session eventually goes
  through `stop` → `terminated` → entry deleted. Every reservation has
  exactly one terminal transition.
- **Bug A solved.** Tab B's `tryReserveUdid` fails immediately because
  Tab A's entry exists (in `starting`, `running`, or `stopping` state).
  Tab B gets 409 in <100 ms.
- **Bug B solved.** Tab A's refresh tears down its session via
  `registry.stop(sessionId)`. The registry entry transitions
  `running → stopping → terminated` and disappears. Tab A's remount
  calls `/start` again → `tryReserveUdid` succeeds (entry is gone) →
  starts fresh. Meanwhile Tab B (also queued) sees the entry while it
  exists → 409. No double-`createSession`, no stuck busy.

### 3.4 What stays the same

- The WS route, the bridge module, the framing helpers, the EventBus
  subscription, all UI components, the spec's overall acceptance
  criteria. This is a localised registry + router change. ~80 LOC delta
  total (registry + router + tests).

---

## 4. Acceptance Criteria

1. **Unit tests pass** (existing registry tests + new tests covering
   `tryReserveUdid`, `promote`, `releaseReservation`, double-reserve
   rejection, idempotent stop after promote).
2. **100-cycle leak script** still 100/100 clean. No regression.
3. **Manual concurrent claim test:** Tab A holds device X. Tab B clicks
   Use Device on X → Tab B sees a "device busy" error within 1 s, not a
   hang.
4. **Manual refresh-during-pending test:** Tab A is streaming. Tab B
   queued and pending. Refresh Tab A → Tab A reconnects to a fresh
   session (after a brief "device busy" interlude while Tab A's
   teardown completes) OR sees a clean 409 retryable error.
   Tab B either successfully claims the device (if Tab A doesn't
   re-claim first) or shows 409. **Critical**: no stuck busy state, no
   orphan in Falx's dashboard.
5. **Sequential acceptance unchanged.** Existing slice 1 acceptance
   criteria (functional items 1–9 in the parent design) all still pass.

---

## 5. Risks

- **Window between `tryReserveUdid` and `promote` is ~3 s** (Appium
  session creation latency). During that window a UDID is reserved but
  no real session exists. If the plugin crashes during this window, the
  reservation is lost but no scrcpy or Appium session leaks (nothing
  has been allocated yet). Acceptable.
- **Reservation lookups by UDID iterate the registry.** The registry is
  small (≤ device count, currently low). O(N) is fine. If the registry
  grows past tens of entries, add a secondary `Map<udid, token>`. Don't
  prematurely optimise.

---

## 6. Findings (2026-05-17, post-implementation)

Manual verification on Android phone. Both fix commits in place
(`444dd61` registry API, `76f3310` `/start` migration + shim removal).

### Acceptance — all green

- **100-cycle leak script:** 100 cycles in 406.6 s. Start p50 = 3325 ms,
  p95 = 3372 ms, max = 4383 ms. Stop p50 = 353 ms, p95 = 384 ms,
  max = 402 ms. Final scrcpy procs = 0 (baseline 0). Latency distribution
  matches the pre-fix slice-1 manual-verification numbers within noise.
  No regression to the sequential path.
- **Concurrent claim test (Bug A):** Tab A streaming; Tab B clicks
  **Use Device** on the same UDID → Tab B sees 409 immediately
  (no 90 s hang). Tab A keeps streaming. Reproducible on demand.
- **Refresh-during-pending (Bug B):** Tab A streaming, Tab B blocked
  with 409, then refresh Tab A → Tab A's session torn down → Tab A
  re-claims successfully on remount. Tab B can subsequently retry and
  claim once Tab A's stop completes. No stuck "device busy" state.
- **Tab-close releases device:** Closing Tab B without **Stop** frees
  the device; Tab A's dashboard shows it as available after a refresh
  (~5 s teardown window — same as slice 1).
- **Sequential acceptance unchanged:** Click → video, tap accuracy,
  Back / Home / Recents, **Stop** button cleanly returns to `/`. All
  green.

### Follow-up surfaced (out of scope for this fix-up)

- **"Unblock" button on the dashboard desyncs from the Use Device
  registry.** Repro: Tab B holds an active Use Device session for
  device X. Tab A views the dashboard, sees X marked "in use" with an
  **Unblock** button (the upstream
  `appium-device-farm` block/unblock mechanism). Clicking **Unblock**
  makes Tab A's dashboard show X as available — but X still has the
  live Use Device session in Tab B. If Tab A then clicks **Use
  Device** on X, `/start` correctly returns 409 ("Device already in
  use"). After another refresh, the dashboard re-shows X as available
  even though it isn't.
  
  Root cause sketch: the upstream Unblock route operates on the
  upstream `IDevice.busy` flag without consulting `UseDeviceRegistry`.
  Our 409 from `/start` is the authoritative state; the dashboard
  derives availability from the older flag. This pre-existed the
  concurrency fix — it became visible only because `/start` now
  correctly rejects instead of queueing.
  
  Disposition: log to `docs/BACKLOG.md` as a separate small slice
  ("dashboard availability should reflect Use Device registry, not
  just upstream busy flag"). Do not expand this fix-up.
