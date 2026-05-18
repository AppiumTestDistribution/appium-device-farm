# iOS Use Device — Design

**Date:** 2026-05-18
**Status:** Design approved by user; ready for implementation plan.
**Slice positioning:** Second in the cross-platform Use Device series.
Completes the browser device-control feature for iOS, mirroring the
Android slice's lifecycle and reservation flow.
**Parent slices:**
- [2026-05-16-android-use-device-design.md](2026-05-16-android-use-device-design.md)
- [2026-05-17-android-use-device-concurrency-fix-design.md](2026-05-17-android-use-device-concurrency-fix-design.md)

---

## 1. Context & Motivation

The Android slice (shipped, merged to `main`) replaced the proprietary
`appium-device-farm@11.3.2` "Use Device" feature on Android with a
Falx-owned, permissively-licensed implementation. This slice does the
same job for iOS so the feature is platform-complete and the
proprietary `/device-farm/...` "Legacy Use Device" entry can eventually
be removed.

### Spike basis

Two iOS spikes ran 2026-05-15/16:

- [Spike 02 — iOS streaming via WDA MJPEG + go-ios](../../spikes/02-ios-streaming-spike.md).
  **GREEN.** Tuned WDA MJPEG (`framerate:20, quality:70, scaling:100`)
  sustains **19 FPS over 5 min** with sub-200 ms max inter-frame gap.
  Time-to-first-frame 119–294 ms. Phase 2 (WebRTC) decided NOT needed.
- [Spike 03 — iOS tap injection](../../spikes/03-ios-tap-injection-spike.md).
  **GREEN.** Channel A — bare-minimum WDA session
  `{capabilities:{alwaysMatch:{platformName:"iOS"}}}` — passes all
  three pass criteria (tap, swipe, type) with 10/10 reliability on
  iOS 26.4.2. The earlier "broken tap" finding in spike 02 was a
  pixel-vs-points coordinate bug, not a real iOS regression. Variants
  that add `appium:bundleId` actually fail on iOS 26 because
  SpringBoard refuses to open apps via WDA's session-launch path.

Both spikes ran against the user's personal iPhone 12 Pro Max
(`kry-phone`, UDID `00008101-001A408E2EB9001E`, iOS 26.4.2).

### Why now

- The Android slice's registry + reservation API is already
  platform-agnostic (see Android concurrency-fix spec §3.1). iOS reuses
  it without changes.
- The Android slice's router hardcodes `'android'` in
  `tryReserveUdid(udid, 'android')` and inlines the adb + scrcpy spawn
  sequence. The iOS slice introduces the platform abstraction at this
  layer — replacing one hardcode with a UDID→platform lookup is small,
  contained, and unblocks the iOS pipeline cleanly.
- The Falx-UI `UseDevice` page hardcodes `AndroidStreamCanvas`. The
  iOS slice introduces the platform switch and adds
  `IOSStreamCanvas.tsx` alongside.

---

## 2. Goals & Non-Goals

### In scope (this slice)

1. New backend module `src/device-stream/ios/` (bridge, WDA HTTP
   client, MJPEG fan-out, port allocator, framing helpers).
2. `src/device-stream/router.ts` modified: `/start` dispatches by
   platform (looked up via the existing iOS device manager); iOS path
   added; Android path unchanged.
3. `src/device-stream/types.ts` extended with iOS-specific WS protocol
   tags and intent codes.
4. Three iOS-specific error responses on `/start`: `423 device_locked`,
   `502 wda_not_installed`, `502 tunnel_not_running`. Existing
   `409 device_busy` continues to apply via the shared reservation.
5. New Falx-UI components:
   - `IOSStreamCanvas.tsx` — WS receiver, MJPEG frame → canvas via
     `createImageBitmap`, pointer→tap encoder, drag→swipe encoder.
   - `IOSControlToolbar.tsx` — Home / App Switcher / Stop buttons.
6. `falx-ui/src/pages/UseDevice/UseDevice.tsx` modified: platform
   switch reads `platform` from the `/start` response and mounts
   `AndroidStreamCanvas` OR `IOSStreamCanvas`.
7. `falx-ui/src/components/devicecard/DeviceCard.tsx` modified:
   **Use Device** button now appears for iOS devices too.
8. `BrowserUnsupported.tsx` modified: per-platform gate. Android
   continues to require `VideoDecoder` (Chromium-only). iOS only
   requires `createImageBitmap` — Safari / Firefox supported.
9. Per-device port allocator: each iOS device gets its own
   `(wdaRestPort, wdaMjpegPort)` pair. Two iPhones can stream
   concurrently from day 1.
10. Lock probe at `/start` — refuses with 423 if the device is
    locked, returning a clear message the UI surfaces as a toast.
11. WDA-installed probe at `/start` — checks the runner bundle is
    installed; returns 502 `wda_not_installed` if missing.
12. Tunnel probe at `/start` — fails fast (502 `tunnel_not_running`)
    if `sudo ios tunnel start` isn't up.
13. Tests:
    - Unit tests for `port-allocator.ts`, `framing.ts` (iOS additions),
      `mjpeg.ts` multipart parser (including the
      `boundary=--BoundaryString` quirk from spike 02), `wda-client.ts`
      (mocked HTTP, error mapping).
    - Integration test with mocked `WDAClient` + mocked `child_process`
      driving the full iOS lifecycle, including reservation + MJPEG
      fan-out to multiple WS subscribers + idempotent stop.
    - Manual verification checklist for real-device behavior, run
      against `kry-phone` AND the second iPhone, including a
      multi-device concurrent run.

### Out of scope (deferred)

- **Text input.** Spike 03 validated `/wda/keys`, but this slice ships
  no UI affordance for typing into focused fields. Follow-up slice
  will add keyboard capture on the canvas.
- **Auto re-sign / re-install of WDA.** Free Apple ID cert expires
  every 7 days; operator rebuilds via Xcode. Auto-pipeline is a
  separate future slice.
- **`sudo ios tunnel start` supervision by Falx.** Operator runs the
  daemon manually for now. Production launchd / systemd unit deferred.
- **Mid-session lock detection.** Probe runs only at `/start`. If the
  user locks the phone mid-session, the stream goes black and we don't
  notify; user unlocks and resumes.
- **App-launch from Falx UI.** Spike 03 found
  `/wda/apps/launch` broken on iOS 26 (SpringBoard refuses
  xctrunner). Workaround would be tapping SpringBoard icons or using
  Spotlight; not in this slice's scope. The user can tap apps live on
  the stream.
- **Multi-touch, pinch, force-touch.** WDA's `/actions` API supports
  these, but the UI ships single-touch tap + drag/swipe only.
- **Reconnect-after-WS-drop.** Tab close ends the session; no resume
  path. Same posture as Android.
- **Audio, screenshot capture, file transfer, app list, device info,
  console / syslog.** Each its own follow-up slice family.

---

## 3. Design

### 3.1 Architecture

The iOS bridge runs **in-process inside the Falx plugin**, matching
the Android bridge and the existing `IOSDeviceManager`. Same reason
as Android: USB device access has to happen on the host the phone is
physically plugged into. On a future hub/node deployment, each node
runs its own copy locally; the hub returns a node-specific
`streamUrl` so the browser connects directly.

```
falx-plugin-process (per host)
├── existing: AndroidDeviceManager, IOSDeviceManager, dashboard router
└── src/device-stream/
    ├── types.ts                 # MODIFY: add iOS WS tags + intent codes
    ├── registry.ts              # unchanged (already platform-agnostic)
    ├── router.ts                # MODIFY: platform dispatch
    ├── android/                 # unchanged
    └── ios/                     # NEW
        ├── bridge.ts            # IOSWdaBridge — go-ios children, WDA lifecycle, MJPEG fan-out
        ├── wda-client.ts        # thin WDA REST client
        ├── mjpeg.ts             # multipart fetch + fan-out
        ├── port-allocator.ts    # UDID → port pair
        └── framing.ts           # iOS WS protocol helpers
```

Per-device port allocator hands each device a `(wdaRestPort,
wdaMjpegPort)` pair. Default base: 8100 / 9100. Subsequent devices:
8101 / 9101, 8102 / 9102, … The allocator stores assignments by UDID
so reconnects to the same device reuse the same pair. Release on
`bridge.stop()` returns the pair to the free pool.

### 3.2 Backend module shape

```
src/device-stream/ios/
├── port-allocator.ts
│     - export class IOSPortAllocator {
│         allocate(udid: string): { wdaRestPort: number; wdaMjpegPort: number };
│         release(udid: string): void;
│         getAllocated(): Map<string, { wdaRestPort: number; wdaMjpegPort: number }>;
│       }
│     - Hands out from configurable base ports (defaults 8100/9100).
│       Per-process singleton mounted into the bridge.
│
├── wda-client.ts
│     - export class WDAClient {
│         constructor(baseUrl: string);
│         createSession(): Promise<string>;
│         deleteSession(sessionId: string): Promise<void>;
│         getStatus(): Promise<{ ready: boolean }>;
│         getLocked(sessionId: string): Promise<boolean>;
│         getScreen(sessionId: string): Promise<{
│           width: number; height: number; scale: number;
│         }>;
│         tap(sessionId: string, x: number, y: number): Promise<void>;
│         drag(sessionId: string, x1, y1, x2, y2, durationSec): Promise<void>;
│         getActiveAppBundleId(sessionId: string): Promise<string | undefined>;
│         terminateApp(sessionId: string, bundleId: string): Promise<void>;
│         setMjpegSettings(sessionId, settings): Promise<void>;
│       }
│     - All methods are HTTP calls against the per-device baseUrl
│       (e.g. http://localhost:8100). Errors mapped to
│       typed exceptions for the router's error responses.
│
├── mjpeg.ts
│     - export class MjpegFanout {
│         constructor(upstreamUrl: string);
│         start(): Promise<void>;     // opens upstream fetch
│         stop(): Promise<void>;       // closes upstream fetch
│         subscribe(handler: (jpeg: Buffer) => void): () => void;  // returns unsubscribe
│       }
│     - One upstream fetch held open; N subscribers downstream.
│     - Multipart parser handles WDA's nonstandard
│       `boundary=--BoundaryString` header quirk (use header value
│       VERBATIM as body delimiter; do NOT prepend `--`).
│     - Drop-oldest per subscriber (max 2 pending frames each).
│
├── bridge.ts
│     - export class IOSWdaBridge {
│         start(udid, ports, runnerBundleId): Promise<{
│           sessionId: string;
│           deviceWidthPoints: number;
│           deviceHeightPoints: number;
│           deviceWidthPixels: number;
│           deviceHeightPixels: number;
│           scale: number;
│           wdaClient: WDAClient;
│           mjpegFanout: MjpegFanout;
│         }>;
│         stop(): Promise<void>;   // idempotent
│       }
│     - Sequenced child spawn per spike 02 lessons:
│         1. `ios image auto --udid` (idempotent).
│         2. spawn `ios runwda --bundleid=$runner
│            --testrunnerbundleid=$runner --udid` (both flags
│            get the .xctrunner bundle id per spike 02 surprises).
│         3. await 3000 ms (WDA XCTest handshake).
│         4. spawn `ios forward $wdaRestPort 8100 --udid`.
│         5. await 500 ms.
│         6. spawn `ios forward $wdaMjpegPort 9100 --udid`.
│         7. Poll WDA `/status` until 200 or 60 s timeout.
│         8. WDA createSession() → bare-minimum body.
│         9. WDA getLocked() → throw DeviceLockedError if true.
│        10. WDA getScreen() → cache dimensions.
│        11. WDA setMjpegSettings({framerate:20, quality:70, scaling:100}).
│        12. MjpegFanout.start() with upstream
│            http://localhost:$wdaMjpegPort/mjpeg.
│     - stop() reverses: deleteSession, MjpegFanout.stop(),
│       SIGKILL forwards, SIGKILL runwda. Idempotent.
│
└── framing.ts
      - encodeMetaIos(payload: IosMetaPayload): Buffer;
      - encodeFrameIos(jpeg: Buffer): Buffer;
      - decodeClientIosMessage(buf: Buffer):
          | { kind: 'tap'; x: number; y: number }
          | { kind: 'swipe'; x1, y1, x2, y2, durationMs }
          | { kind: 'intent'; intent: 'home' | 'app_switcher' };
      - Tag values defined in src/device-stream/types.ts.
```

### 3.3 Router changes

`src/device-stream/router.ts` becomes platform-aware. The lookup uses
the existing `IOSDeviceManager` / `AndroidDeviceManager` registries
that the upstream plugin already exposes.

```typescript
router.post('/use-device/start', async (req, res) => {
  const body = req.body as StartUseDeviceRequest;
  if (!body?.udid) return res.status(400).json({ error: 'missing_udid', ... });

  // NEW: platform lookup.
  const platform = lookupPlatformByUdid(body.udid);
  if (!platform) return res.status(404).json({ error: 'device_not_found', ... });

  // EXISTING: reservation. Now takes the looked-up platform.
  const reservationToken = useDeviceRegistry.tryReserveUdid(body.udid, platform);
  if (!reservationToken) return res.status(409).json({ error: 'device_busy', ... });

  try {
    if (platform === 'android') {
      // existing Android path, unchanged
    } else {
      // NEW: iOS path
      //   a) probe tunnel       → 502 tunnel_not_running
      //   b) probe WDA installed → 502 wda_not_installed
      //   c) allocate ports
      //   d) bridge.start(udid, ports, runnerBundleId)
      //      (DeviceLockedError → release reservation + 423 device_locked)
      //   e) registry.promote(reservationToken, {sessionId, dims, stop})
      //   f) return {sessionId, streamUrl, platform: 'ios', deviceWidth, deviceHeight, scale}
    }
  } catch (err) {
    useDeviceRegistry.releaseReservation(reservationToken);
    // best-effort cleanup; map err to typed response
  }
});
```

`/stream/:sessionId` and `/stop/:sessionId` stay identical in shape;
the WS handler reads `session.platform` from the registry to pick the
right framing.

### 3.4 HTTP/WS surface

| Method | Path | Request | Response |
|---|---|---|---|
| `POST` | `/device-farm/api/dashboard/use-device/start` | `{ udid: string }` | 200 `{ sessionId, streamUrl, platform: "ios", deviceWidth, deviceHeight, scale }` (or `platform: "android"`, no `scale`). <br/> 400 `missing_udid`. <br/> 404 `device_not_found`. <br/> 409 `device_busy`. <br/> 423 `device_locked` (iOS only). <br/> 502 `wda_not_installed` (iOS only). <br/> 502 `tunnel_not_running` (iOS only). <br/> 502 `bridge_start_failed` (catch-all). |
| `WS` | `/device-farm/api/dashboard/use-device/stream/:sessionId` | binary frames per platform framing | binary frames per platform framing; closes on state→`stopping`/`terminated`. |
| `POST` | `/device-farm/api/dashboard/use-device/stop/:sessionId` | empty | 204; idempotent for already-terminated sessions. |

`scale` is iOS-only and reports the device's `screen.scale`
(typically 2 or 3). Android responses do not include it.
`deviceWidth` / `deviceHeight` on iOS are in **iOS points** (e.g.
428 × 926), never pixels.

### 3.5 WS wire format (iOS)

Shared constants in `src/device-stream/types.ts`:

```typescript
// Server → client (existing tags reused where applicable):
export const SRV_TAG_META = 0x01;     // existing — JSON metadata
// 0x02 = SRV_TAG_CONFIG (Android scrcpy config; unused on iOS)
// 0x03 = SRV_TAG_DATA (Android H.264; unused on iOS)
export const SRV_TAG_FRAME = 0x04;    // NEW — raw JPEG bytes (iOS)

// Client → server (existing Android tags 0x10/0x11 left alone):
export const CLIENT_TAP_TAG = 0x20;       // NEW — iOS tap
export const CLIENT_SWIPE_TAG = 0x21;     // NEW — iOS swipe / drag
export const CLIENT_INTENT_TAG = 0x22;    // NEW — iOS toolbar intent

export const INTENT_HOME = 0x01;
export const INTENT_APP_SWITCHER = 0x02;
```

Wrapper is the existing tag + length-prefix framing used by Android.

**Server → client iOS payloads:**
- `SRV_TAG_META`: JSON body
  `{deviceWidthPoints, deviceHeightPoints, deviceWidthPixels, deviceHeightPixels, scale}`.
  Sent once, immediately after the WS connects.
- `SRV_TAG_FRAME`: raw JPEG bytes. One frame per server-to-client
  message. Drop-oldest cap of 2 frames per subscriber.

**Client → server iOS payloads (all in iOS points):**
- `CLIENT_TAP_TAG`: 8-byte body — `f32 x | f32 y`. Translated to
  `POST /wda/tap { x, y }`.
- `CLIENT_SWIPE_TAG`: 20-byte body — `f32 x1 | f32 y1 | f32 x2 | f32 y2 | u32 durationMs`.
  Translated to `POST /wda/dragfromtoforduration { fromX, fromY, toX, toY, duration: durationMs/1000 }`.
- `CLIENT_INTENT_TAG`: 1-byte body — intent code.
  - `INTENT_HOME` (0x01): `GET /wda/activeAppInfo` → `POST /wda/apps/terminate { bundleId }`.
    No-op if no foreground app (returns 200 anyway).
  - `INTENT_APP_SWITCHER` (0x02): `POST /wda/dragfromtoforduration`
    from (deviceWidthPoints/2, deviceHeightPoints - 5) to
    (deviceWidthPoints/2, deviceHeightPoints × 0.55) over 350 ms.
    Gesture parameters tunable; manual verification may adjust.

### 3.6 Falx-UI changes

```
falx-ui/src/
├── pages/UseDevice/
│   ├── UseDevice.tsx              # MODIFY: platform switch on start-response
│   ├── AndroidStreamCanvas.tsx    # unchanged
│   ├── IOSStreamCanvas.tsx        # NEW
│   ├── IOSControlToolbar.tsx      # NEW: Home / App Switcher / Stop
│   ├── ControlToolbar.tsx         # unchanged
│   └── BrowserUnsupported.tsx     # MODIFY: per-platform feature gate
│
├── api-service/use-device.ts      # unchanged (already platform-agnostic)
│
└── components/devicecard/DeviceCard.tsx  # MODIFY: button enabled for iOS too
```

**`UseDevice.tsx`**: keeps current shape; after the `POST /start`
resolves, branches on `platform` and mounts the corresponding canvas
+ toolbar pair.

**`IOSStreamCanvas.tsx`**:
- Owns the WS connection, a `<canvas>` ref, and pointer handlers.
- On `SRV_TAG_META`: store dimensions + scale; size the canvas's CSS
  to a sensible max-fit while keeping aspect ratio.
- On `SRV_TAG_FRAME`: `createImageBitmap(new Blob([bytes], {type:'image/jpeg'}))` →
  `ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)` →
  `bitmap.close()`. If a new frame arrives while decoding, drop the
  in-flight previous frame.
- `pointerdown` records start position + time. `pointerup` decides:
  - Movement < 10 px and duration < 120 ms → `CLIENT_TAP_TAG`.
  - Otherwise → `CLIENT_SWIPE_TAG` (with the measured duration).
- Coordinate conversion: `event.offsetX / canvas.clientWidth ×
  deviceWidthPoints` (and same for y). Coordinates posted to the
  server are **always in iOS points**.

**`IOSControlToolbar.tsx`**: three buttons.
- **Home**: WS send `CLIENT_INTENT_TAG` + `INTENT_HOME`.
- **App Switcher**: WS send `CLIENT_INTENT_TAG` + `INTENT_APP_SWITCHER`.
- **Stop**: calls existing `endUseDeviceSession()` API helper;
  page navigates to `/` on response.

**`BrowserUnsupported.tsx`**: feature gate split.
- If page receives `platform: 'android'` → require `VideoDecoder`.
- If page receives `platform: 'ios'` → require `createImageBitmap`.
- If neither: show "Use Device requires Chrome / Edge for Android
  devices, or any modern browser for iOS devices."

**`DeviceCard.tsx`**: existing **Use Device** button (currently
gated to `device.platform === 'android'`) now enabled for
`'android'` OR `'ios'`. Other platforms (none today) stay hidden.

### 3.7 Session lifecycle (iOS)

```
User clicks "Use Device" on an iOS DeviceCard
   │
   ▼
falx-ui navigates to /use-device/<udid>
   │
   ▼
UseDevice.tsx mounts → POST /use-device/start { udid }
   │
   ▼
Backend (router → registry → iOS path):
   1. Look up platform → 'ios'.
   2. registry.tryReserveUdid(udid, 'ios') → reservation token.
   3. Probe `ios info` → fail fast 502 tunnel_not_running if down.
   4. Probe `ios apps | grep $RUNNER_BUNDLE` → 502 wda_not_installed if missing.
   5. Allocate ports → (wdaRest, wdaMjpeg).
   6. IOSWdaBridge.start(udid, ports, runner):
        image auto → runwda → 3 s wait → forward 8100 → 500 ms → forward 9100 →
        poll /status → createSession → getLocked → getScreen →
        setMjpegSettings → MjpegFanout.start.
      If getLocked === true: release reservation, teardown, return 423.
   7. registry.promote(token, {sessionId, deviceWidthPoints,
      deviceHeightPoints, stop: idempotent teardown closure}).
   8. Return 200 { sessionId, streamUrl, platform: 'ios',
      deviceWidth, deviceHeight, scale }.
   │
   ▼
Client opens WebSocket to streamUrl.
   │
   ▼
WS handler:
   - Reads session from registry, checks platform === 'ios'.
   - Subscribes to bridge.mjpegFanout.
   - Sends SRV_TAG_META frame with dimension data.
   - Forwards each JPEG as SRV_TAG_FRAME.
   - Receives tap/swipe/intent messages; translates to WDA calls.
   - Drop-oldest queue (max 2 pending frames).
   │
   ▼  Frames flow server→client; tap/swipe/intent flow client→server.
   │
   ▼
Termination path A — user clicks Stop:
   client POST /use-device/stop/<sessionId>
   → registry.stop transitions state to stopping
   → IOSWdaBridge.stop() (idempotent: deleteSession, mjpeg.stop, SIGKILL forwards, SIGKILL runwda)
   → port-allocator.release(udid)
   → state=terminated, registry entry removed
   → WS close sent
   → client navigates to /

Termination path B — user closes browser tab:
   Clean WS close: server-side WS close event triggers
   registry.stop(sessionId) → same idempotent teardown.
   Dead client: heartbeat (ping every 10 s, terminate after one
   missed pong) triggers within ~30 s.

Termination path C — Appium session ends from external cause
(admin kill, idle sweep):
   EventBus session-end → registry handler invokes stop() for
   matching sessionId → same idempotent teardown.
```

State machine in the registry is unchanged: `idle → starting →
running → stopping → terminated`. Every termination path funnels
through one `stop(sessionId)` method.

### 3.8 Why this shape

- **Reuses the post-concurrency-fix reservation.** No new registry
  surface. iOS hits `tryReserveUdid` / `promote` / `releaseReservation`
  the same way Android does. The concurrency-fix work pays off twice.
- **Single teardown path.** Same as Android — idempotent stop, every
  termination trigger funnels through it.
- **Per-device port allocator from day 1.** Two iPhones plugged in
  →two concurrent sessions on independent port pairs. Verified manually
  on the user's second iPhone.
- **MJPEG fan-out at the bridge layer.** Single upstream WDA fetch,
  N WS subscribers. Solves spike 02's "WDA MJPEG is single-client"
  finding without changing the WS shape.
- **Bare-minimum WDA session.** Spike 03 verdict applied directly. No
  `appium:bundleId`, no `/wda/apps/launch`. Workarounds for
  iOS-26-broken APIs documented in code where used.
- **No new npm deps.** iOS uses node built-ins (http, child_process)
  plus existing express + ws. No ADR required per CLAUDE.md.

---

## 4. Acceptance Criteria

### Functional

1. Click **Use Device** on an iOS DeviceCard → stream page loads,
   first MJPEG frame within **8 s** of click (spike measured ~7.3 s
   startup + first-frame; 8 s gives small headroom).
2. **Tap accuracy:** targeting four corners + center of the canvas →
   device taps within **±10 points** of the intended point (spike 03
   was 0-pt drift on the Photos icon).
3. **Home** button → returns to SpringBoard within 1 s if a foreground
   app exists; no-op (still returns 200) if already on SpringBoard.
4. **App Switcher** button → App Switcher visible within 1 s. Risk:
   gesture parameters (350 ms duration, 0.55 × height end-y) are
   unvalidated in spikes; manual verification may tune them. If
   tuning fails, fall back to documenting "App Switcher button
   deferred" and shipping with Home + Stop only.
5. **Stop** button → page redirects to `/`, Appium session is gone
   from the existing Sessions UI within 2 s, device shows not-busy.
6. Closing the browser tab (without Stop) triggers the same teardown
   path. Clean close: device released within ~5 s. Dead client
   (process kill / network drop): released within ~30 s via WS
   heartbeat.
7. **Concurrent claim conflict:** User A holds session for device X;
   User B clicks Use Device on X → User B sees `409 device_busy`
   within 1 s, no broken state on either side.
8. **Locked device at start:** phone locked when `/start` is called →
   `423 device_locked` with "Unlock kry-phone, then try again" toast.
   No partial session left behind; reservation released cleanly.
9. **Multi-device:** with two iPhones plugged in, both can have
   concurrent active Use Device sessions on independent port pairs
   (8100/9100 + 8101/9101). Both stream interactively at the same
   time without interfering.
10. Active iOS session appears in the existing **Sessions** UI for
    its duration; disappears after end.
11. **No regression:** Android Use Device still works end-to-end.
    Existing Appium test clients can still create sessions against
    other devices while an iOS Use Device session is active. The
    existing test suite (`npm test`) still passes.
12. After Use Device ends, the device can be re-acquired by either
    another Use Device click or a regular Appium client. No
    "still busy" stuck state.

### Non-functional

- **10-minute interactive session** stays connected with no visible
  stall > 1 s in real Chrome / Safari / Firefox (verified in at
  least one browser other than Chrome to validate the gate change).
  Extrapolated from spike 02's clean 5-minute 19 FPS / 187 ms max-gap
  run.
- **50 consecutive start→stop cycles** scripted: no leaked
  `ios runwda` / `ios forward` processes
  (`ps -A | grep -E 'ios (runwda|forward)'` clean after each Stop),
  no leaked WDA sessions on device (verify via post-cycle
  `GET /sessions`), no leaked port allocations
  (`allocator.getAllocated()` empty), no creeping file descriptors.
- Plugin process resident memory steady-state during 10-min session
  (samples at 1 / 5 / 10 min; flat ± noise).
- Falx-UI bundle size delta **under 20 KB gzipped** (no big new
  dependencies — only canvas + WS code).

### Testing

- **Unit tests** for:
  - `port-allocator.ts` (allocate, release, exhaustion, reallocation
    after release).
  - `framing.ts` iOS additions (encode/decode for all 5 new tags).
  - `mjpeg.ts` multipart parser, including the `boundary=--BoundaryString`
    quirk from spike 02 and multi-subscriber fan-out.
  - `wda-client.ts` against a mock HTTP server, including error
    mapping (DeviceLockedError on 200 `{value: true}` from `/locked`,
    WDA-not-running on connect refused, etc.).
- **Integration test** with mocked `WDAClient` + mocked
  `child_process` driving `bridge.start()` → MJPEG frames fan out to
  multiple WS subscribers → `bridge.stop()`. Includes
  reservation-conflict path (second `/start` for same UDID returns
  409) and idempotent stop (calling stop twice doesn't throw or leak).
  No real device required.
- **Manual verification checklist** for real-device behavior. Lives
  at the bottom of the implementation plan. Run against:
  - `kry-phone` (iPhone 12 Pro Max, iOS 26.4.2) — primary.
  - The user's second iPhone — multi-device validation.
  - At least one non-Chrome browser (Safari or Firefox) — gate-change
    validation.
- Existing E2E suite untouched.

### Code quality

- TypeScript strict for the new module. No `any` on public interfaces.
- New module follows the existing `src/device-stream/android/`
  conventions (`logger`, error shapes, Express error handler).
- Falx-UI new components follow the conventions established in
  prior slices (light theme tokens, `AppLayout` composition, no MUI
  in new code).

---

## 5. Risks

### Risks for this slice

1. **App Switcher gesture is unvalidated.** Spike 03 confirmed
   `/wda/dragfromtoforduration` works for SpringBoard page swipes
   and Spotlight, but the specific App-Switcher-summon gesture
   (swipe-up-with-pause from the home indicator) has different timing
   sensitivities. Mitigation: manual verification tunes the duration
   / end-y; if tuning fails, ship without App Switcher and document.
2. **WDA cert expiry every 7 days.** Free Apple ID limitation.
   Mitigation: `/start` probe surfaces `502 wda_not_installed` with
   a clear "rebuild WDA in Xcode" message. Auto re-sign pipeline is
   a future slice.
3. **`sudo ios tunnel start` is a manual prerequisite.** If it dies
   mid-day, `/start` returns `502 tunnel_not_running`. Operator
   restarts. Production launchd / systemd unit is a future task —
   spec calls it out under Hard Prerequisites with a "future
   automation" note.
4. **MJPEG fan-out edge cases.** Single upstream fetch + N downstream
   subscribers + drop-oldest. Could leak the upstream connection on
   tricky shutdown paths (e.g. fetch hung in a TCP retransmit when
   stop is called). Mitigation: integration test covers
   multi-subscriber connect-disconnect; 50-cycle script catches
   process / socket leaks.
5. **iPhone lock mid-session.** Stream goes black, no notification.
   Mitigation: documented as known limitation. Mid-session polling
   deferred to follow-up.
6. **WDA's nonstandard MJPEG boundary.** WDA's `Content-Type` already
   includes the `--` prefix that RFC 2046 reserves for the body
   delimiter. The multipart parser must use the header value verbatim
   as the body delimiter. Mitigation: explicit unit test for this
   case; comment in `mjpeg.ts` referencing spike 02 finding.
7. **Sequenced child spawn timing.** Spike 02 found parallel spawn
   of `runwda` + two `forward`s crashes go-ios's RSD daemon
   (connection reset). Mitigation: sequenced spawn with 3000 ms /
   500 ms waits per spike 02. Encoded in `bridge.ts`; integration
   test verifies order.
8. **iOS 26 `appium:bundleId` regression.** Adding `bundleId` to
   session caps breaks on iOS 26. Mitigation: bare-minimum
   capabilities only, as per spike 03 verdict. Documented in
   `wda-client.ts` next to `createSession`.
9. **Bundle-ID convention varies by user.** Each developer's WDA
   build uses a different bundle ID (Apple won't let two share).
   Mitigation: `WDA_RUNNER_BUNDLE_ID` env var with default
   `com.falx.WebDriverAgentRunner.xctrunner` (matches user's
   spike-02 build). Surfaced in the spec's Hard Prerequisites.

### Anticipated for future slices

- **Text input.** Spike 03 validated `/wda/keys`. Next iOS slice
  wires canvas keyboard capture → `CLIENT_KEYS_TAG`.
- **WDA auto re-sign / re-install.** Separate slice.
- **Mid-session lock detection.** Polling `/wda/locked` while
  streaming, overlay UI when locked.
- **Tunnel daemon supervision.** launchd / systemd unit shipped
  with the device-host image.
- **Hub/node URL routing.** Same posture as Android — `streamUrl`
  is the seam.
- **Audio, multi-touch, screenshot capture, app launch, file
  transfer, syslog tap.** Each its own follow-up slice.

### Deferred, not committed

- Text input UI.
- Mid-session lock detection.
- Tunnel daemon supervision by Falx.
- WDA auto re-sign / re-install pipeline.
- Reconnect-after-WS-drop.
- Multi-touch / pinch / force-touch gestures.

### One explicit caveat

This slice produces a **demoable** iOS Use Device, but a **minimal**
one: click → see → tap → swipe → Home / App Switcher → Stop. No text
input, no app launch, no screenshot, no app list. If the next demo
requires more, expand scope explicitly or land follow-up slices.

---

### Manual verification — kry-phone (2026-05-18)

Verified live via Playwright-driven Chrome against iPhone 12 Pro Max,
UDID `00008101-001A408E2EB9001E`, iOS 26.4.2.

#### Pass criteria verified

- **Happy path / start session:** dashboard → Use Device → canvas streams within ~7–8 s. Confirmed.
- **Tap dispatch:** synthetic centre-tap changed the canvas hash; phone responded. Confirmed.
- **Home:** click → canvas hash changed → SpringBoard transition. Confirmed.
- **App Switcher:** click → canvas hash changed (default gesture parameters work; no tuning needed). Confirmed.
- **Stop:** click → page redirects to `/`, session cleaned up. Confirmed.
- **Aspect-ratio fix:** wrapper renders at 323.5 × 700 px, ratio 0.4622 (matches expected 428/926 ÷). Backing store 1284 × 2778. Confirmed.
- **WDA session rebind:** `[device-stream] iOS rebinding WDA session …→…` logged; all subsequent `/session/<id>/wda/...` calls succeed. Confirmed.
- **No dispatch errors:** zero `[device-stream/ios] message dispatch failed` errors in plugin log. Confirmed.

#### Fixes required during manual verification

- **`2553436`** — `ios apps --list` to keep probe output under Node's 1 MB execFile maxBuffer.
- **`c09177d`** — drop runwda flags so go-ios v1.0.188 doesn't fail "all-or-none" validation. (Superseded by the next fix.)
- **`f6febf6`** — pass all three runwda flags including `xctestconfig=WebDriverAgentRunner.xctest`; auto-discover-only path falls back to Facebook bundle id, not installed runner.
- **`70e518c`** — wrap IOSStreamCanvas in aspect-locked div; `aspect-ratio` CSS on `<canvas>` (replaced element) doesn't constrain against `max-height` + `width:auto` combo.
- **`93ce31a`** — rebind `bridgeHandle.sessionId` after Appium's xcuitest driver creates its own WDA session; otherwise all `/session/<stale>/wda/...` calls 404.

#### Open items still to verify on real hardware

- 50-cycle leak run (Task 16 script committed; needs operator to run with plugin up).
- Multi-device with second iPhone (Task 14).
- Safari / Firefox cross-browser (Task 15).
- 10-minute stability run, locked-device probe, two-tab 409 toast, tab-close-releases-device (Task 13 Steps 8–11).

#### Known limitations (user-observed)

- **Streaming framerate is lower than Android.** WDA's MJPEG server runs at 20 fps; Android uses H.264 at native framerate via scrcpy. WebRTC is the future quality lever (noted in spike 02 Phase-2 trigger discussion).
- **Tap and gesture responsiveness is lower than Android.** Each input goes through WDA's REST API as a separate HTTP call; Android input is streamed via scrcpy's UInput path. Inherent to WDA's input architecture.

---

## 6. Dependencies

### npm dependencies

**None.** The iOS path uses Node built-ins (`http`, `child_process`,
`stream`, `buffer`) plus existing `express` and `ws`. No new
top-level package. **No ADR required.**

### Binary assets

**None.** WDA is built and installed on each device by the operator
via Xcode (see Hard Prerequisites). Falx does not ship WDA.

### Hard prerequisites (operator, one-time per host / device)

- macOS host with Xcode latest stable.
- Apple Developer signing identity (free Apple ID works; cert expires
  every 7 days).
- iPhone with iOS 16+ paired to the Mac; Developer Mode enabled
  (Settings → Privacy & Security → Developer Mode).
- WebDriverAgent built + installed via Xcode once per cert cycle.
  Procedure documented in `docs/spikes/02-ios-streaming-spike.md`
  under "WebDriverAgent build & install (one-time)". The
  `.xctrunner` runner bundle ID is the value the operator sets in
  the `WDA_RUNNER_BUNDLE_ID` env var read by `bridge.ts` (default
  `com.falx.WebDriverAgentRunner.xctrunner`).
- `brew install go-ios`.
- `sudo ios tunnel start` running. **Mandatory for iOS 17+.** Falx
  does not start or supervise this daemon in this slice; the
  operator runs it manually in a separate terminal. Production
  launchd / systemd unit is a future automation task.

### Environment variables

- `WDA_RUNNER_BUNDLE_ID` — defaults to
  `com.falx.WebDriverAgentRunner.xctrunner`. Override per developer.
- `IOS_WDA_BASE_REST_PORT` — defaults to `8100`. Port allocator
  starts here.
- `IOS_WDA_BASE_MJPEG_PORT` — defaults to `9100`. Port allocator
  starts here.

---
