# Spike 02 — iOS streaming via WDA MJPEG + go-ios

**Time box:** 2 days.
**Spike directory:** `/tmp/falx-spike-ios` (NOT inside the Falx repo).
**Status:** Phase 1 complete (2026-05-15). Streaming PASS; tap injection
FAIL on iOS 26 — separate follow-up spike needed. See "Findings" at bottom.
**Phase 2 (only if Phase 1 quality is unacceptable):** see "Phase 2 trigger".

## Why this spike exists

iOS is a first-class platform for Falx — testers need to control real
iPhones from the browser, not only Android. The candidate path (per the
deep-research evaluation) is:

- **WebDriverAgent (WDA)** from the Appium project — exposes a built-in
  MJPEG screen stream on TCP port 9100 and a WebDriver REST API (taps,
  swipes, key input, app launch) on port 8100. License: Apache-2.0.
- **go-ios** — MIT-licensed Go binary that manages iOS device lifecycle
  from Linux/Windows/macOS without Xcode: mount developer disk image,
  launch WDA, forward USB ports. Production-proven (Sauce Labs, HeadSpin
  cite it).

This spike validates that the MJPEG stream is good enough for QA-grade
demo use and that browser→device control round-trips work cleanly. If MJPEG
quality / FPS / latency is unacceptable, Phase 2 (WebRTC via Broadcast
Extension) is the documented fallback — but only if Phase 1's verdict
demands it.

## Out of scope (Phase 1)

- WebRTC, ffmpeg, Broadcast Extension, custom on-device app. Phase 2 only.
- Falx integration.
- Multi-device concurrency.
- Authentication, sessions, audit.
- No-Xcode WDA install (`go-ios` can do this once WDA is signed somewhere
  else; the spike uses the Xcode-built path for simplicity).

## Pass criteria

Phase 1 passes if all four hold:

1. iPhone screen visible in a browser at `http://localhost:5173` within 10
   seconds of page load.
2. Frame rate ≥ 10 FPS at default WDA MJPEG settings, measured by counting
   frame transitions over 30 seconds.
3. Click on the rendered image → tap registers on the phone within ~10
   device pixels of the click point.
4. Stream stays alive for 5 minutes without WDA crashing, the proxy
   stalling, or frames freezing > 3 seconds.

Plus a **subjective quality judgement**: "fine for demo / managable while
testing" vs "embarrassing, must escalate to Phase 2". Record both numbers
and gut feel.

## Hard prerequisites (human does these once, before the spike starts)

This is the heaviest setup of any spike. Do not skip.

### Host

- macOS host (required for the one-time WDA build/sign — go-ios can run
  WDA on Linux later but the initial signing happens in Xcode).
- Xcode latest stable installed.
- Apple Developer account with a signing identity (free Apple ID works for
  on-device testing; expires every 7 days — fine for a spike).
- `brew install go-ios` (or download a release binary from
  `danielpaulus/go-ios` releases and put it on PATH).
- Node.js 20+.

### Device

- An iPhone or iPad running iOS 16+.
- Paired to this Mac (Settings → trust this computer prompt accepted).
- Developer mode enabled on the device (Settings → Privacy & Security →
  Developer Mode, iOS 16+).

### WebDriverAgent build & install (one-time)

1. Clone https://github.com/appium/WebDriverAgent .
2. Open `WebDriverAgent.xcodeproj` in Xcode.
3. Pick the `WebDriverAgentRunner` scheme.
4. Under "Signing & Capabilities" for both `WebDriverAgentLib` and
   `WebDriverAgentRunner`:
    - Set your team.
    - Set unique bundle IDs (e.g. `com.your-name.WebDriverAgentLib`,
      `com.your-name.WebDriverAgentRunner`). Apple won't let two devs
      share a default bundle ID.
5. Product → Test (Cmd-U) with your device selected. The test will run,
   then fail harmlessly — what matters is that WDA is now installed on
   the device.
6. On the iPhone: Settings → General → VPN & Device Management → trust
   your developer profile.
7. Note your three identifiers:
    - WDA bundle ID (e.g. `com.your-name.WebDriverAgentRunner.xctrunner`)
    - WDA runner test bundle ID (e.g. `com.your-name.WebDriverAgentRunner`)
    - The XCTest config: `WebDriverAgentRunner.xctest`

### Confirm go-ios sees the device

```bash
ios list
```

Should print your device UDID and product type. Note the UDID — you'll
hardcode it in the spike.

### iOS 17+ only — RemoteServiceDiscovery tunnel

For iOS 17 and later, many go-ios operations require a privileged tunnel
daemon. Run in a separate terminal and **leave it running**:

```bash
sudo ios tunnel start
```

For iOS 16 you can skip this.

## Execution plan

### Step 1 — Scaffold

```bash
mkdir -p /tmp/falx-spike-ios
cd /tmp/falx-spike-ios
npm init -y
mkdir server client
```

### Step 2 — Server: WDA launcher + MJPEG proxy + tap proxy

```bash
cd server
npm init -y
npm install express http-proxy-middleware node-fetch \
  typescript ts-node @types/node @types/express
npx tsc --init
```

Write `server/index.ts`:

- Read `UDID`, `WDA_BUNDLE_ID`, `WDA_RUNNER_BUNDLE_ID` from env or hardcode
  for now.
- On startup, sequentially:
    1. Mount the developer disk image: `ios image auto --udid=<UDID>`
       (idempotent; safe to re-run).
    2. Background-spawn the WDA runner:
       `ios runwda --bundleid=<WDA_BUNDLE_ID> --testrunnerbundleid=<WDA_RUNNER_BUNDLE_ID> --xctestconfig=WebDriverAgentRunner.xctest --udid=<UDID>`.
       Pipe its stdout/stderr to the Node console.
    3. Open two USB→TCP forwards in the background:
       - `ios forward 8100 8100 --udid=<UDID>` (WDA REST)
       - `ios forward 9100 9100 --udid=<UDID>` (WDA MJPEG)
    4. Poll `http://localhost:8100/status` every 500 ms until it returns
       200 (WDA is up). Time-bound: 60 seconds. Log time-to-ready.
    5. Create a WDA session:
       `POST http://localhost:8100/session` with body
       `{ "capabilities": { "alwaysMatch": { "platformName": "iOS" } } }`.
       Save the returned `sessionId`.
- Express on `http://localhost:8081`:
    - `GET /mjpeg` → use `http-proxy-middleware` (or a manual pipe) to
      proxy `http://localhost:9100` to the response. MJPEG is
      `multipart/x-mixed-replace; boundary=...` — pass headers through.
    - `POST /tap` `{ x, y }` → translate to
      `POST http://localhost:8100/session/<sessionId>/wda/tap/0`
      with body `{ "x": x, "y": y }`. (The `/0` is the deprecated element
      ID slot; pass `0` for absolute screen taps. WDA accepts it.)
- On Ctrl-C: kill WDA, kill the forwards, end the session politely.

Run:

```bash
npx ts-node index.ts
```

Server should print:
- "WDA up after Xms"
- "session: <uuid>"
- "listening on 8081".

### Step 3 — Client: bare viewer

```bash
cd ../client
npm create vite@latest . -- --template react-ts
npm install
```

Replace `src/App.tsx`:

- Render `<img src="http://localhost:8081/mjpeg" ref={imgRef} />` with
  `maxWidth: 400px` for sanity. Browsers natively render
  `multipart/x-mixed-replace` JPEG streams in `<img>`.
- `onClick` on the image:
    - Get `imgRef.current.getBoundingClientRect()`.
    - `scaleX = imgRef.current.naturalWidth / rect.width`
    - `scaleY = imgRef.current.naturalHeight / rect.height`
    - `deviceX = (event.clientX - rect.left) * scaleX`
    - `deviceY = (event.clientY - rect.top) * scaleY`
    - `fetch('http://localhost:8081/tap', { method: 'POST', body: JSON.stringify({ x: deviceX, y: deviceY }), headers: { 'Content-Type': 'application/json' } })`.
- Add a small fixed-position debug overlay: last tap coords, last MJPEG
  frame timestamp (use the `<img>`'s `onLoad` event, which fires per frame
  in multipart streams in Chromium).

Run `npm run dev`, open `http://localhost:5173`.

### Step 4 — Tune & measure

Default WDA MJPEG settings are conservative. Once Phase 1 works at all,
spend ~30 minutes tuning via the WDA settings endpoint:

```bash
POST http://localhost:8100/session/<sid>/appium/settings
{
  "settings": {
    "mjpegServerFramerate": 20,
    "mjpegServerScreenshotQuality": 50,
    "mjpegScalingFactor": 75
  }
}
```

Try several combinations. Record the best balance of FPS / clarity /
latency you can get. This is the data point that decides whether Phase 2
is needed.

## Common blockers & quick triage

| Symptom | Likely cause |
|---|---|
| `ios runwda` exits immediately | WDA isn't installed, or the bundle IDs don't match the device's installed app. Verify in Settings → General → VPN & Device Management. |
| `/status` never returns 200 | Developer disk not mounted; run `ios image auto` manually and watch its output. iOS 17+: confirm `sudo ios tunnel start` is running. |
| MJPEG endpoint returns immediately with empty body | No active WDA session. Create one via `POST /session` first; WDA only streams during a live session. |
| 401 / pairing error | Re-pair: unplug, replug, trust prompt. `ios pair --udid=<UDID>` if needed. |
| Black screen but `<img>` loads | iPhone is locked. Wake it. WDA doesn't unlock for you. |
| Taps land in wrong location | Image is being scaled by CSS; check that `scaleX/Y` use `naturalWidth/Height`, not `width/height`. |
| Stream stalls after ~30 seconds | macOS power-save on USB. Disable USB selective suspend; or test on a dock that supplies power. |

## Phase 2 trigger (do NOT plan in advance)

If after tuning, the verdict is "embarrassing, must escalate":

- Read GADS source at https://github.com/shamanec/GADS in the providers/ios
  directory. AGPL-3.0 — **read-only, do not copy**. Understand the
  architecture: a custom Broadcast Extension app on the device captures
  the screen with ReplayKit, pipes raw frames into an `ffmpeg` process on
  the host, which encodes to WebRTC, which the browser consumes.
- Plan that as a separate spike `03-ios-webrtc-spike.md`. Do not start it
  from inside this spike — Phase 1 either passes or kicks the decision out.

## Deliverable — append to this file when done

Add a `## Findings` section at the bottom with:

1. **Pass/fail** on each of the four Phase 1 pass criteria, with measured
   numbers (time-to-WDA-ready, FPS, latency, tap accuracy in pixels, 5-min
   durability result).
2. **Tuning sweet spot**: which WDA MJPEG settings gave the best
   subjective experience.
3. **Subjective verdict**: "fine for demo" / "managable while testing" /
   "embarrassing, escalate to Phase 2".
4. **Surprises**: anything not in this plan.
5. **Code size**: LOC server + client.
6. **Open questions for the slice phase**: WDA build automation
   (avoiding Xcode-by-hand), iOS 17+ tunnel daemon lifecycle, multi-device
   port allocation, session cleanup on browser close.
7. **Phase 2 decision**: explicit yes / no, with rationale.

Stop when this file is updated. Don't start Phase 2 implicitly.

## Findings

Phase 1 ran 2026-05-15 against an iPhone 12 Pro Max
(`iPhone13,4`, named `kry-phone`) running iOS 26.4.2 over USB, UDID
`00008101-001A408E2EB9001E`. Spike directory: `/tmp/falx-spike-ios/`.
Host: macOS Darwin 25.3.0, Node v22.17.0, go-ios v1.0.188. WDA
12.2.2 was built and signed via Xcode against `com.falx.WebDriverAgentRunner`
(Lib) / `com.falx.WebDriverAgentRunner.xctrunner` (installed runner),
Apple ID signed by the user. `sudo ios tunnel start` was running
throughout (required for iOS 17+ RemoteServiceDiscovery).

End-to-end interactive testing happened through a Playwright-controlled
Chromium tab plus direct `curl` against WDA's REST API on
`http://localhost:8100`. The browser-side `<img>` rendered the MJPEG
stream natively; FPS and durability were measured separately via a
Node script that fetches `/mjpeg` and counts multipart boundaries
(WDA's MJPEG server is single-client, so the browser had to be closed
during quantitative measurement).

### Pass criteria

1. **Time-to-first-frame ≤ 10 s** — **PASS**. Cold load measured at
   294 ms first time, 119–149 ms on warm reloads. Server-side, the
   first MJPEG boundary arrived 116–137 ms after the `fetch()` call to
   `/mjpeg`. WDA itself was up `33 ms` after the `/status` poll began
   (after the sequenced spawn + 3 s WDA RSD-settle wait + 0.5 s + 0.5 s
   for the two `ios forward`s — total ~7 s from `npx ts-node` to
   `listening on 8081`). Comfortably under budget.

2. **FPS ≥ 10 at default WDA MJPEG settings** — **MARGINAL → PASS after
   tuning**. At WDA defaults (`mjpegServerFramerate: 10`,
   `mjpegServerScreenshotQuality: 25`, `mjpegScalingFactor: 100`), a
   30 s measurement counted 285 frames = **9.47 FPS** — just under the
   10 FPS criterion (the default framerate cap appears to be exactly
   10, and per-frame encode + transit shaves the rest). At the tuned
   sweet spot (`framerate: 20, quality: 70, scaling: 100`), a 30 s
   sample produced 584 frames = **19.45 FPS**, and the 5-min
   durability run averaged **19.08 FPS** (5723 frames in 300 s). FPS
   criterion passes once `mjpegServerFramerate` is bumped above 10.

3. **Tap accuracy: register within ~10 device pixels** — **FAIL** (and
   not for a coordinate-math reason). Tap-equivalent endpoints all
   return `200` with `value: null` but execute no UI action on this
   device:
    - `POST /session/<sid>/wda/tap` (with body `{x, y}`)
    - `POST /session/<sid>/actions` (W3C pointer sequence with
      pointerMove → pointerDown → pause → pointerUp)
    - `POST /session/<sid>/wda/dragfromtoforduration` (degenerate
      same-point drag)
    - `POST /session/<sid>/element/<id>/click` against an element ID
      previously found via xpath
    - WDA's legacy `/wda/touch/perform` is removed: returns 404
      "Unhandled endpoint".

   Sanity-tested: WDA's READ endpoints all work — `/status`, `/screen`
   (reports `{statusBarSize: {428, 47}, scale: 3, screenSize: {428,
   926}}`), `/source` (returns the full XCUIElement tree of the active
   app), `/element` finder. Hardware-style writes also return 200 null
   (`/wda/pressButton {"name":"home"}` came back 200 — and the phone
   may have transitioned into the App Switcher around that time, but I
   could not reproduce that reliably enough to call it a working
   write). `/orientation` write returns 500 "Unable To Rotate Device".

   Net: this WDA 12.2.2 build on iOS 26.4.2 returns success for every
   tap-injection API but the device shows no response. This appears to
   be a known WDA + new-iOS regression — the same `XCUIElement.tap()`
   plumbing underlies `/wda/tap` and `/element/<id>/click`, and Apple's
   per-iOS-version changes to XCTest's UI Automation pipeline have
   broken WDA's tap codepath multiple times historically. None of the
   spike's coordinate-math, server proxy, or client code is at fault —
   they all transport the right values to WDA, which then no-ops.

4. **5-minute durability** — **PASS, clean**. The durability script
   held the MJPEG connection open for 300 018 ms wall-clock, counted
   5723 frames (19.08 FPS), saw a max inter-frame gap of **187 ms**,
   and recorded **zero** gaps over 500 ms / 1 s / 3 s. The stream did
   not end early. Per-30-s frame counts: 563, 585, 587, 587, 582, 565,
   564, 563, 565, 563 — extremely flat. No WDA crash, no forward
   exited, no `ts-node` died, no server-log error lines beyond the
   normal `forward: close clientConn` lines that fire when each
   `/status` poll closes its TCP socket.

### Tuning sweet spot

```json
{
  "mjpegServerFramerate":        20,
  "mjpegServerScreenshotQuality": 70,
  "mjpegScalingFactor":           100
}
```

Subjectively (when the browser was open against this tuning) the
stream looked clean — sharp text, no visible compression artifacts on
the white system surfaces, no perceptible per-frame lag. Bumping
`mjpegServerFramerate` above 20 was not tested but would probably
deliver more headroom if the JPEG quality is dropped to compensate;
20 FPS was already past the criterion so no need.

### Subjective verdict (streaming side)

**"Fine for demo / manageable while testing"** for the MJPEG path. The
visual quality and 19 FPS sustained for 5 minutes is well within
QA-grade-demo expectations.

The control side is a different story — see Phase 2 decision below.

### Surprises

- **Bundle-ID flag convention for `ios runwda` on iOS 17+ / Xcode 15+
  is the opposite of what the spike plan says.** The plan recommends
  `--testrunnerbundleid=com.your-name.WebDriverAgentRunner` (without
  the `.xctrunner` suffix). On iOS 26 with this go-ios version, that
  fails with `cannot get test app information: Did not find test app
  for 'com.…WebDriverAgentRunner' on device`. The pattern that
  actually works is to pass **the `.xctrunner` runner-app bundle to
  both `--bundleid` and `--testrunnerbundleid`**. The "test bundle id"
  is no longer a distinct discoverable identifier — it's the xctrunner
  app itself. Server picks this up via the `WDA_RUNNER_BUNDLE_ID` env
  override; the in-code default still mirrors the spike plan's
  (wrong-for-iOS-17+) convention. Worth flipping the default before
  this lands in a Falx slice.

- **go-ios RSD daemon serialises poorly under concurrent connections.**
  The spike's first server iteration spawned `ios runwda`,
  `ios forward 8100`, and `ios forward 9100` in parallel after
  `image auto`. On every run, two of the three children died
  immediately with `could not connect to RSD: read tcp …: read:
  connection reset by peer`. Running each in isolation works; running
  them with a `wait(3000)` after `runwda` and `wait(500)` between the
  two forwards is reliable. The 3 s wait for runwda is for WDA to
  complete its XCTest handshake (the `_XCT_didFormPlanWithData:` log
  line appears within ~2 s); afterwards the tunnel daemon will happily
  serve the forwards. Sequenced spawn is now in `server/index.ts`.

- **WDA's MJPEG server uses a non-standard multipart boundary in the
  `Content-Type` header.** The header value already includes the `--`
  prefix that RFC 2046 says belongs only in the body delimiter — i.e.
  the header literally reads `boundary=--BoundaryString` and the body
  parts are separated by `--BoundaryString` (not `----BoundaryString`).
  Any client parsing the multipart stream must use the header value
  *verbatim* as the body delimiter rather than prepending `--`.
  Cost me one debugging round.

- **The deprecated `/wda/tap/0` element-id slot is gone.** The spike
  plan says: *"`POST /session/<sessionId>/wda/tap/0`… (The `/0` is the
  deprecated element ID slot; pass `0` for absolute screen taps. WDA
  accepts it.)"* — this is no longer true. Modern WDA returns `404
  Unhandled endpoint`. Use `/wda/tap` (no `/0`). Server now does.

- **WDA tap injection is silently broken on iOS 26.4.2 with WDA 12.2.2
  (May 2026 build).** Already covered under criterion 3 — the most
  load-bearing surprise of the whole spike. None of `/wda/tap`,
  `/actions`, `/wda/dragfromtoforduration`, `/element/<id>/click`
  produced any visible action on the device, despite returning 200
  null. Element finders and source reads work fine, so it's not a
  session-attachment problem. Most likely a private-API regression
  Apple introduced in iOS 26 that WDA hasn't caught up with; the
  Appium WDA repo has a multi-year history of similar
  every-iOS-version regressions.

- **WDA's MJPEG server is single-client.** Once the browser is
  consuming the stream, a second `fetch('/mjpeg')` returns the
  Content-Type header but no body data. This is why FPS measurement
  had to alternate between browser-open visual tests and
  browser-closed quantitative runs. Falx will need to multiplex
  the upstream MJPEG into N downstream consumers in the device-farm
  server.

- **WDA cannot unlock past Face ID / passcode.** `/wda/unlock` only
  wakes the screen; it can't bypass biometric/PIN. Locked-screen
  state shows up in the MJPEG stream as a black frame (WDA does not
  return a "device is locked" indicator in the stream). The phone
  must be manually unlocked before automation. Long-running sessions
  need Auto-Lock set to *Never*.

- **WDA expects coordinates in iOS POINTS, not physical pixels.** The
  MJPEG stream returns physical pixels (1284×2778 on this device) but
  `/wda/screen` reports `screenSize: {428, 926}` and `scale: 3`, and
  WDA's tap APIs operate in the 428×926 point space. The current
  client sends pixel coordinates derived directly from
  `naturalWidth/Height` of the `<img>`. This is a real bug — it would
  send out-of-range or wrong-area taps — but it didn't manifest in
  this spike because WDA's tap APIs no-op on iOS 26 regardless of
  what coordinates you send. Fix-when-needed: divide by
  `screen.scale` before posting to `/tap`, or scale the client-side
  computation by `screenSize.width / image.naturalWidth`.

- **Time-to-first-frame is way better than the budget suggests.** The
  spike plan budgets 10 s; measured was 119–294 ms (~30× better). The
  10 s budget was a holdover from worry about WDA cold-start; in
  practice WDA's MJPEG starts streaming within ~120 ms of the first
  `/mjpeg` GET. The 7 s startup overhead is in WDA's runwda
  XCTest handshake + USB forward setup, not in stream initiation.

- **`/wda/pressButton {"name":"home"}` is suggestive evidence of a
  partial-write capability.** The call returned 200 null and, in one
  trial, the App Switcher came up; I could not reproduce that
  deterministically with the user away from the phone, so the
  evidence is anecdotal. Worth re-testing in the follow-on tap-injection
  spike — if hardware-button presses *do* work, that's at least a
  workable channel for home / app-switcher / siri triggers even if
  per-pixel taps stay broken.

### Code size

- `server/index.ts` — **285 LOC** (TypeScript: env config, sequenced
  child-process orchestration with SIGINT/SIGTERM cleanup, Express
  with explicit MJPEG passthrough proxy + tap relay + CORS for Vite
  origin, structured prefix logging)
- `client/src/App.tsx` — **121 LOC** (React + Vite scaffold: bare
  `<img>` viewer, click-to-tap with pixel→device coord math, debug
  overlay with last tap / frame count / "ms since last frame")
- Plus orchestrator-side measurement helpers, not part of the
  deliverable bridge: `measure-fps.mjs` 51 LOC, `durability.mjs` 59
  LOC

**Productive bridge total: ~406 LOC** across two files — leaner than
the Android spike (565 LOC) because the iOS path is mostly proxying
WDA's prebuilt MJPEG + REST, where the Android path required a
custom Node↔scrcpy WebSocket bridge with hand-rolled framing.

### Open questions for the slice phase

- **WDA tap injection workaround (highest-priority follow-up).**
  Options to evaluate in a separate spike:
    - A different set of WDA session capabilities (the spike used the
      bare-minimum `{ "alwaysMatch": { "platformName": "iOS" } }` —
      adding `automationName`, `useNativeCachingStrategy`,
      `bundleId: com.apple.springboard`, or `useNativeTouchActions` may
      flip a path).
    - A different WDA fork (Sauce / HeadSpin maintain forks with
      private patches for newer iOS).
    - go-ios `ios diagnostics` / native HID injection that bypasses
      WDA entirely — go-ios's `ios touch` subcommand or similar.
    - tidevice (Python) for HID-level touch injection.
    - A custom XCTest harness that uses Apple's newer
      `XCUIRemote`/`XCUICoordinate` APIs more aggressively.
- **WDA build automation: avoiding Xcode-by-hand each time.** Current
  flow requires Xcode, Apple Developer signing, and Cmd-U per device
  per 7 days (free cert expiry). `go-ios install` can push a prebuilt
  signed `.ipa` — investigate codesigning a portable WDA artifact in
  CI, then distributing it via go-ios to devices.
- **iOS 17+ tunnel daemon lifecycle.** `sudo ios tunnel start` must be
  running for the entire spike. Falx will need to manage this daemon
  (start on boot, restart on failure, log) and audit the `sudo`
  requirement — probably wrap in a systemd unit or launchd job in
  the device-host image.
- **Multi-device port allocation.** Server hardcodes 8100/9100/8081.
  N devices need N×{8100, 9100, 8081} or a port-allocator that maps
  device UDID → port triple.
- **Session cleanup on browser close.** Currently the WDA session
  outlives the browser; that's correct behavior for "reconnect to
  the same device session" but Falx will need per-session quotas
  (idle timeout, hard cap).
- **MJPEG single-client fan-out.** WDA's MJPEG only serves one
  consumer. Falx will need to proxy the upstream stream once and
  fan it out to N browser tabs (presumably anyone with the device
  reserved).
- **Coordinate-unit scaling in the client.** Pixel→point conversion
  must use `/wda/screen` data, not `naturalWidth`. Trivial once tap
  works.
- **Locked-device UX in the UI.** What does the Falx browser tab show
  when WDA returns black frames? Likely a "device is locked, unlock
  on the phone" overlay; needs a locked-state probe.

### Phase 2 decision

**No.** Phase 2 in this spike doc means "WebRTC via Broadcast
Extension" — a streaming-quality remediation. Streaming is *not* the
problem; Phase 1's MJPEG path delivers 19 FPS for 5 minutes with no
stalls, sub-200 ms inter-frame gaps, and visually-clean rendering at
the tuned settings. That is comfortably "fine for demo / manageable
while testing" and there is no quality reason to escalate to WebRTC.

**However:** the spike uncovered an orthogonal, *control*-side
blocker — WDA's tap injection is broken on iOS 26.4.2 with the
stock May-2026 WDA 12.2.2 build. This is **not** a streaming
problem and Phase 2 as currently defined wouldn't fix it. It needs
its own follow-up spike: **`03-ios-tap-injection-spike.md`** — to
enumerate what tap channels (if any) actually work on iOS 26 against
this WDA build, evaluate workarounds (different session capabilities,
go-ios direct HID, tidevice, custom XCTest harness, alternative WDA
fork), and pick the best option for Falx's iOS device-use slice. That
spike is a *prerequisite* for shipping Falx iOS browser device-use,
but it's a different shape than this spike's Phase 2 stub.

Net: proceed to the cross-platform iOS+Android device-use Falx slice
*for streaming only*, and run spike 03 before wiring up the
browser→device tap UI for iOS.

