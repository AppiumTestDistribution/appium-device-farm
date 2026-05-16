# Android Use Device — Design

**Date:** 2026-05-16
**Status:** Design approved by user; ready for implementation plan.
**Slice positioning:** First in a planned series replacing the proprietary
`appium-device-farm@11.3.2` "Use Device" feature with a Falx-owned,
permissively-licensed implementation. This slice ships **Android only**.
iOS is a separate follow-up slice (see [docs/spikes/02-ios-streaming-spike.md](../../spikes/02-ios-streaming-spike.md)
and [docs/spikes/03-ios-tap-injection-spike.md](../../spikes/03-ios-tap-injection-spike.md)).

---

## 1. Context & Motivation

Falx (Apache-2.0 fork of `appium-device-farm`) needs a browser-based
"Use Device" feature: a tester clicks a device in the Falx UI and gets a
live screen view plus real-time control of a physical Android phone, all
in the browser.

The proprietary `appium-device-farm@11.3.2` provided this feature, but
its license forbids redistribution, modification, and reverse engineering
(see [PROPRIETARY-LICENSE.txt](https://github.com/AppiumTestDistribution/appium-device-farm/blob/438fe18/PROPRIETARY-LICENSE.txt)
at the commit that introduced it). The current upstream Apache-2.0
source does not contain the streaming/control feature at all — it was
removed in commit `6367a60` (April 2026) without re-publishing the
implementation. So Falx must build it.

### Spike basis

Two streaming spikes ran 2026-05-15, plus one tap-injection spike on
2026-05-16:

- [Spike 01 — Android via Tango](../../spikes/01-android-streaming-spike.md):
  **GREEN.** Tango (`@yume-chan/scrcpy@2.3.0`,
  `@yume-chan/adb-scrcpy@2.3.2`, MIT) drives upstream
  `scrcpy-server-v3.3.3.jar` (Apache-2.0/GPL-v3 binary) from a Node
  bridge. WebCodecs H.264 decoder renders frames; pointer events
  serialize to scrcpy control messages. ~539 ms time-to-first-frame, 5
  minutes durability clean, sub-pixel tap accuracy. 565 LOC bridge
  total.
- [Spike 02 — iOS via WDA + go-ios](../../spikes/02-ios-streaming-spike.md):
  streaming GREEN at 19 FPS sustained. Tap initially appeared broken.
- [Spike 03 — iOS tap injection](../../spikes/03-ios-tap-injection-spike.md):
  tap was a coordinate-units bug, not an iOS regression. Bare-minimum
  WDA session + iOS-points coordinates work first-try.

The Android spike is the direct basis for this slice; the iOS spikes
inform the cross-platform shape of the `/use-device/:udid` route but the
iOS implementation is deferred.

### Why first

- Use Device is the headline feature of an interactive device farm — the
  thing testers spend most of their time in.
- The proprietary `/device-farm/...` page is currently linked from
  Falx-UI as a stopgap. It cannot ship in a customer-deployed Falx (the
  license forbids redistribution). Replacing it is on the critical path.
- Android first because its spike is fully green and self-contained.
  iOS adds WDA build/sign tooling, RSD tunnel daemon, and per-iOS
  variability that justify a separate slice.

---

## 2. Goals & Non-Goals

### In scope (this slice)

1. New backend module `src/device-stream/` (platform-agnostic
   registry/lifecycle) and `src/device-stream/android/` (Tango bridge),
   mounted under the existing dashboard router.
2. Three new HTTP/WS endpoints under
   `/device-farm/api/dashboard/use-device/` (start, stream WS, stop).
3. Pinned `scrcpy-server-v3.3.3.jar` shipped as a binary asset under
   `src/device-stream/android/scrcpy-server.jar`.
4. Bridge subscribes to the upstream EventBus so any session-end path
   tears down scrcpy uniformly.
5. New Falx-UI route `/use-device/:udid` with a platform-switch shell
   (`AndroidStreamCanvas` lands now; `IOSStreamCanvas` placeholder for
   slice 2).
6. DeviceCard gains a **Use Device** button for Android devices only.
   Existing **Block** stays. iOS card button shows up in slice 2.
7. The proprietary `/device-farm/...` page stays linked from the
   Falx-UI topbar as a "Legacy Use Device" entry, so we can A/B compare
   during dev. Removed in a follow-up slice once we're confident.
8. Browser support: Chrome and Edge (Chromium with WebCodecs). Other
   browsers display a clear "Use Device requires Chrome or Edge"
   message; no broken UI.
9. Tests: unit (framing, registry, state machine), integration
   (mocked AdbScrcpyClient driving the lifecycle), plus a manual
   verification checklist for real-device behavior.

### Out of scope (deferred)

- **iOS path.** Separate slice; this slice's route shell is ready for it
  but no iOS rendering or backend code lands.
- **Auth gating** on the stream routes. Any authenticated Falx-UI user
  can use any device (same posture as the rest of dashboard today).
  Per-user device permissions are a follow-up.
- **Inactivity warning timer.** Stop button + WS-close are the only
  session-end paths.
- **Multi-host hub/node routing.** A stream session is bound to the
  local node. The `streamUrl` field in the start response is the
  extension point; slice 1 always returns a same-host URL.
- **Side tabs**: Logcat, Screenshots, Files, Apps, Device Info. Each is
  its own follow-up slice. The page layout reserves space for a future
  right-side panel but renders nothing in it for slice 1.
- **Audio, multi-touch, swipe gestures, text typing, file upload,
  screenshot capture, orientation control.** All deferred.
- **Reconnect-after-WS-drop.** Closing the tab ends the session; there
  is no "resume" path.
- **Codec fallback for non-Chromium browsers** (TinyH264 wasm). Deferred.

---

## 3. Design

### 3.1 Architecture

The bridge runs **in-process inside the Falx Appium plugin**, matching
the upstream pattern (existing `AndroidDeviceManager` and
`IOSDeviceManager` live in-process for the same reason: they need local
adb / USB access on whichever host the device is physically plugged
into). On a future hub/node deployment, each node runs its own copy of
this code locally; the hub returns a node-specific `streamUrl` so the
browser connects to the right node directly.

```
falx-plugin-process (per host)
├── existing: AndroidDeviceManager, IOSDeviceManager, dashboard router
└── new: src/device-stream/
    ├── index.ts          # registry, types, EventBus wiring
    ├── android/
    │   ├── bridge.ts     # Tango: AdbServerClient + AdbScrcpyClient
    │   ├── framing.ts    # WS <-> scrcpy binary framing
    │   └── scrcpy-server.jar
    └── router.ts         # Express + ws routes
```

### 3.2 Backend module shape

```
src/device-stream/
├── index.ts
│     - export class UseDeviceRegistry {
│         start(udid): Promise<UseDeviceSession>
│         stop(sessionId): Promise<void>
│         get(sessionId): UseDeviceSession | undefined
│       }
│     - type UseDeviceSession = {
│         sessionId: string         // Appium session id
│         udid: string
│         platform: 'android' | 'ios'
│         state: 'starting' | 'running' | 'stopping' | 'terminated'
│         deviceWidth: number       // device pixels post-downscale
│         deviceHeight: number
│         createdAt: number
│       }
│     - EventBus subscription: on session-end (any path), invoke stop().
│
├── android/
│   ├── bridge.ts
│   │     - export class AndroidScrcpyBridge {
│   │         start(udid, adbClient): Promise<{ video, control, dimensions }>
│   │         stop(): Promise<void>      // idempotent
│   │       }
│   │     - Pre-flight: kills any leftover com.genymobile.scrcpy.Server
│   │       on the device before pushing the JAR (handles crash recovery).
│   │     - Uses AdbScrcpyOptionsLatest from @yume-chan/adb-scrcpy with
│   │       videoCodec='h264', maxSize=1080, audio=false.
│   │
│   ├── framing.ts
│   │     - WebSocket <-> scrcpy binary protocol:
│   │       Server -> Client: tag(1 byte=video) + len(4 BE) + NAL bytes
│   │       Client -> Server: tag(1 byte=touch/key) + payload
│   │     - Drop-oldest policy: outbound queue holds at most 2 frames.
│   │
│   └── scrcpy-server.jar        # pinned v3.3.3
│
└── router.ts
      - POST /api/dashboard/use-device/start
      - WS   /api/dashboard/use-device/stream/:sessionId
      - POST /api/dashboard/use-device/stop/:sessionId
```

### 3.3 HTTP/WS surface

| Method | Path | Auth | Request | Response |
|---|---|---|---|---|
| `POST` | `/device-farm/api/dashboard/use-device/start` | existing dashboard middleware (none today) | `{ udid: string }` | 200 `{ sessionId, streamUrl, platform: "android", deviceWidth, deviceHeight }` <br/> 409 `{ error: "device_busy", message }` if device already reserved <br/> 404 `{ error: "device_not_found", message }` if udid unknown <br/> 502 `{ error: "bridge_start_failed", message }` if scrcpy push or session create fails |
| `WS` | `/device-farm/api/dashboard/use-device/stream/:sessionId` | sessionId must exist in registry, state must be `running` | binary frames per `framing.ts` | binary frames per `framing.ts`; closes when state transitions to `stopping`/`terminated` |
| `POST` | `/device-farm/api/dashboard/use-device/stop/:sessionId` | sessionId must exist | empty | 204 on success; 404 if unknown session; 409 if already terminated (idempotent though — log and 204) |

Route prefix matches existing dashboard conventions
([`src/dashboard/router.ts`](../../../src/dashboard/router.ts)). Mounted
in the same place.

### 3.4 Falx-UI changes

```
falx-ui/src/
├── pages/UseDevice/
│   ├── UseDevice.tsx           # route component, calls POST /start, mounts platform child
│   ├── AndroidStreamCanvas.tsx # <canvas> + WebCodecsVideoDecoder + pointer/keyboard handlers
│   ├── ControlToolbar.tsx      # Back / Home / Recents / Stop buttons
│   └── BrowserUnsupported.tsx  # shown when WebCodecs is missing
│
├── api-service/use-device.ts
│   - createUseDeviceSession(udid)
│   - endUseDeviceSession(sessionId)
│   - openStreamSocket(streamUrl, sessionId) -> WebSocket
│
├── router/  (existing)
│   - add <Route path="/use-device/:udid" element={<UseDevice />}> within AppLayout
│
└── components/
    ├── devicecard/DeviceCard.tsx       # add "Use Device" button (Android only)
    └── header/Header.tsx               # add "Legacy Use Device" dropdown entry → /device-farm/#/use-device?...
```

The page renders inside the existing `AppLayout` shell from the 2026-05-15
UI slice. The main column hosts the stream pane; topbar and sidebar
remain visible. No new layout primitive.

`AndroidStreamCanvas.tsx` is the load-bearing component: it owns the
WebSocket, the `WebCodecsVideoDecoder`, the canvas ref, and the
pointer→touch encoder. Coordinate mapping uses the `deviceWidth`/
`deviceHeight` returned in the start response (the downscaled scrcpy
stream dimensions), not pixel-space `naturalWidth`/`naturalHeight` —
this avoids the iOS-style units bug that bit spike 02.

### 3.5 Session lifecycle

```
User clicks "Use Device" on DeviceCard
   │
   ▼
falx-ui navigates to /use-device/<udid>
   │
   ▼
UseDevice.tsx mounts → POST /use-device/start { udid }
   │
   ▼
Backend (UseDeviceRegistry):
   1. Reserve device via existing Falx session model (POST /session against
      our own Appium plugin with uiautomator2 + udid capabilities).
      Returns Appium sessionId.
   2. Kill any leftover scrcpy server on device (crash-recovery pre-flight).
   3. AdbScrcpyClient.start() with pinned JAR; obtain video + control streams.
   4. Register session in registry, state=running.
   5. Return { sessionId, streamUrl, deviceWidth, deviceHeight }.
   │
   ▼
Client opens WebSocket to streamUrl.
   │
   ▼  Frames flow server→client; taps/keys flow client→server.
   │
   ▼
Termination path A — user clicks Stop:
   client POST /use-device/stop/<sessionId>
   → backend transitions state to stopping
   → AndroidScrcpyBridge.stop() (idempotent)
   → DELETE Appium session
   → state=terminated, registry entry removed
   → WS close sent to client
   → client navigates to /

Termination path B — user closes browser tab:
   Clean WS close detected immediately on server.
   For dead clients without a clean close (crash, network drop),
   server-side WS heartbeat (ping every 10 s, terminate after one
   missed pong) detects within ~30 s.
   → registry stop() runs (same idempotent path)
   → same teardown as A
   No reconnect window — client must start a new session.

Termination path C — Appium session ends from any external cause
(admin kill, idle session sweep, Appium client disconnect):
   EventBus emits session-end
   → registry handler invokes stop() for matching sessionId
   → same idempotent teardown
```

State machine in the registry: `idle → starting → running → stopping →
terminated`. Every termination path funnels through one `stop(sessionId)`
method that's idempotent and emits no error on repeat calls.

### 3.6 Why this shape

- **Reuses existing reservation.** No new lock or busy-flag mechanism.
  Use Device sessions show up in the existing Sessions UI for free,
  block other Appium clients on the same device naturally, and unblock
  on the same EventBus the rest of the plugin already listens to.
- **One teardown path, many triggers.** Race conditions between Stop
  click, WS close, and EventBus end events are handled by an idempotent
  state machine, not by ad-hoc coordination.
- **Pinned binary, predictable upgrades.** `scrcpy-server.jar` is a
  versioned asset. Upgrade procedure: bump Tango → check Tango
  CHANGELOG for the supported scrcpy server version → swap JAR → re-run
  spike-style smoke test → commit. No runtime downloads.
- **Hub/node-ready without paying the cost today.** The `streamUrl`
  indirection in the start response is the only piece needed for the
  hub to later return a node-specific URL. Slice 1 hard-codes
  same-host, but the contract is in place.
- **Platform-switch in the page from day 1.** `UseDevice.tsx` reads
  platform from the start response and picks the right child. Slice 2
  (iOS) drops in `IOSStreamCanvas.tsx` without refactoring this slice.

---

## 4. Acceptance Criteria

Slice is **done** when all of the following hold.

### Functional

1. Click **Use Device** on an Android DeviceCard → stream page loads,
   first video frame within **5 s** of click (spike measured 539 ms;
   5 s gives real-Chrome headroom).
2. Tap accuracy: targeting the four corners + center of the canvas →
   device taps within **±20 device pixels** of the intended point
   (spike was sub-pixel; the looser bound accommodates the `maxSize:
   1080` aspect-preserving downscale).
3. **Back / Home / Recents** buttons each fire the correct scrcpy
   keycode and the device responds visibly within 1 s.
4. **Stop** button: page redirects to `/`, the Appium session is gone
   from the existing Sessions UI within 2 s, device shows as not-busy.
5. Closing the browser tab (without clicking Stop) triggers the same
   teardown path. Clean close (tab X / window close): device released
   within ~5 s. Dead client (process kill, network drop): released
   within ~30 s via WS heartbeat.
6. **Concurrent claim conflict**: User A holds the session; User B
   clicks Use Device on the same device → User B sees a clear
   "device busy" error (HTTP 409 surfaces as a UI toast/modal), no
   broken state on either side.
7. The active Use Device session appears in the existing **Sessions**
   UI for the duration; disappears after end.
8. **No regression**: existing Appium test clients can still create
   sessions against *other* devices while a Use Device session is
   active. The existing test suite (`npm test`) still passes.
9. After Use Device ends, the device can be re-acquired by either
   another Use Device click or a regular Appium client. No
   "still busy" stuck state.

### Non-functional

- **10-minute interactive session** stays connected with no decoder
  error and no visible stall > 1 s (verified in real Chrome, not
  headless).
- **100 consecutive start→stop cycles** (scripted) leak nothing:
  `adb shell ps -A | grep scrcpy` is empty after each Stop, the
  internal sessions service has no entries, no creeping file
  descriptors.
- Plugin process resident memory is steady-state during the 10-minute
  session (samples at 1 / 5 / 10 min; flat ± noise).
- Falx-UI bundle size delta is **under 200 KB gzipped** (Tango decoder
  packages dominate).

### Testing

- **Unit tests** for `framing.ts`, `UseDeviceRegistry`, and the
  bridge state machine. Target >80% line coverage on the three new
  files.
- **Integration test** with a mocked `AdbScrcpyClient` driving the
  full start → stream → stop lifecycle, including EventBus-triggered
  teardown. No real device required for CI.
- **Manual verification checklist** for real-device behavior, lives
  at the bottom of the implementation plan. The human runs it
  against ≥ 2 Android vendor families (Samsung confirmed in spike;
  one other vendor required before merge) before marking the slice
  done.
- Existing E2E suite untouched.

### Code quality

- TypeScript strict for the new module. No `any` on public interfaces.
- New module follows existing `src/` conventions (`logger`, error
  shapes, Express error handler).
- Falx-UI follows the conventions established in the
  [2026-05-15 UI shell slice](2026-05-15-ui-shell-light-theme-design.md)
  (light theme tokens, `AppLayout` composition, no MUI in new code).

---

## 5. Risks & Open Questions

### Risks for this slice

1. **Chromium-only.** Falx-UI in Safari/Firefox can't decode H.264 via
   `VideoDecoder`. Mitigation: feature-detect at page mount, render
   `BrowserUnsupported.tsx` with a clear message and link. Explicit user
   expectation; not a silent failure.
2. **Leftover scrcpy server on plugin restart.** A plugin crash mid-session
   leaves `com.genymobile.scrcpy.Server` running on the device, blocking
   the next start. Mitigation: bridge startup runs
   `adb shell pkill -f com.genymobile.scrcpy.Server` before pushing the JAR.
3. **WebSocket back-pressure on slow clients.** Spike documented an
   await-per-write pattern that back-pressured the inbound queue.
   Mitigation: server-side outbound queue capped at 2 frames with
   drop-oldest semantics. Documented in `framing.ts`.
4. **Vendor / Android-version variance.** Spike tested on Samsung
   Android 10 + Android 11. Vendor-specific scrcpy quirks are
   possible (Xiaomi, OnePlus, Pixel; or Android 12 / 13 / 14 / 15).
   Mitigation: manual verification checklist gates merge on at least
   two vendor families.
5. **Concurrent teardown race.** Multiple termination triggers may
   fire simultaneously. Mitigation: explicit state machine in the
   registry, all paths funnel through one idempotent `stop()`.

### Anticipated for future slices

- **iOS path (Slice 2 candidate).** The `/use-device/:udid` route
  shell, platform switch in `UseDevice.tsx`, and registry types are
  built to accept an `IOSStreamCanvas.tsx` drop-in plus a parallel
  `src/device-stream/ios/` backend module without refactoring this
  slice. WDA + go-ios + MJPEG path established in
  [spike 02](../../spikes/02-ios-streaming-spike.md) /
  [spike 03](../../spikes/03-ios-tap-injection-spike.md).
- **Hub/node URL routing.** Slice 1 hardcodes same-host `streamUrl`.
  When the hub/node split matures, the hub returns a node-specific
  URL; the client and bridge are unchanged.
- **Auth gating on stream routes.** Currently same posture as the
  rest of dashboard (none). Per-user device permissions and audit
  logging are a separate slice.

### Deferred, not committed

- Logcat / Screenshots / Files / Apps / Device Info side tabs (each
  its own slice).
- Inactivity-warning timeout.
- Audio, multi-touch, swipe gestures, text typing, file upload,
  screenshot capture, orientation control.
- Reconnect-after-WS-drop.
- TinyH264 wasm fallback for non-Chromium browsers.

### One explicit caveat

This slice produces a **demoable** Android Use Device, but a
**minimal** one: click → see → tap → back / home / recents → Stop.
No text input, no screenshot, no app list. If the next demo requires
more, expand scope explicitly (with eyes open about lengthening) or
land a follow-up slice between this one and Slice 2.

---

## 6. Dependencies

### New npm dependencies (server)

| Package | Version | License | Purpose |
|---|---|---|---|
| `@yume-chan/adb` | ^2.6.0 | MIT | ADB protocol client |
| `@yume-chan/adb-server-node-tcp` | ^2.5.2 | MIT | Connect to local `adb-server` |
| `@yume-chan/adb-scrcpy` | ^2.3.2 | MIT | Push and orchestrate the scrcpy server |
| `@yume-chan/scrcpy` | ^2.3.0 | MIT | scrcpy protocol types and control-message helpers |
| `@yume-chan/stream-extra` | ^2.5.3 | MIT | ReadableStream/WritableStream interop |

`express` and `ws` are already in `package.json` and need no version
change.

### New npm dependencies (falx-ui)

| Package | Version | License | Purpose |
|---|---|---|---|
| `@yume-chan/scrcpy` | ^2.3.0 | MIT | Control-message serializers in the browser |
| `@yume-chan/scrcpy-decoder-webcodecs` | ^2.5.3 | MIT | H.264 → canvas via WebCodecs |
| `@yume-chan/stream-extra` | ^2.5.3 | MIT | Same as above |

### New binary asset

- `src/device-stream/android/scrcpy-server.jar` — pinned **v3.3.3**
  (`scrcpy-server-v3.3.3` asset from
  [Genymobile/scrcpy releases](https://github.com/Genymobile/scrcpy/releases/tag/v3.3.3),
  sha256 `7e70323b...4be0`, 90 164 bytes). License: Apache-2.0 (scrcpy
  client side) plus GPL-v3 (the server JAR specifically; we ship it
  unmodified, push it to the device, and execute it via `app_process`
  — no derivative work concerns since we don't link to it). Falx
  redistributes it under GPL-v3 terms, attributed to Genymobile.

### ADR requirement

Per [CLAUDE.md](../../../CLAUDE.md), new top-level dependencies require
an ADR. The five `@yume-chan/*` npm packages plus the bundled GPL-v3
`scrcpy-server.jar` warrant a single ADR covering the streaming
toolchain choice. ADR drafting is part of the implementation plan.
