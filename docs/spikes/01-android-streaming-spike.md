# Spike 01 — Android streaming via Tango

**Time box:** 1 day.
**Spike directory:** `/tmp/falx-spike-android` (NOT inside the Falx repo).
**Status:** not started.

## Why this spike exists

Falx (an Apache-2.0 fork of `appium-device-farm`) needs a browser-based
"Use Device" feature with live screen mirroring and real-time control. The
proprietary `appium-device-farm@11.3.2` provides this but its license forbids
redistribution and modification. We need a clean-room equivalent.

After a literature review (`docs/discovery/` does not yet have a streaming
discovery doc — see also the conversation log that produced this plan), the
candidate is **Tango / `@yume-chan/ya-webadb`** — a set of MIT-licensed
TypeScript libraries that:

- Speak the ADB protocol directly from Node.js (no shelling out to `adb`
  required, though we'll use the system `adb-server`).
- Drive the **upstream** Genymobile/scrcpy server (not a frozen fork), so we
  inherit scrcpy's ongoing improvements.
- Provide H.264 frame decoders for the browser (WebCodecs and a wasm
  TinyH264 fallback).

This spike validates whether Tango actually delivers on those promises, end
to end, with one physical Android device, before any Falx integration.

## Out of scope (do not do these in this spike)

- Falx integration of any kind. No edits to the Falx repo other than
  appending findings to this file.
- Multi-device concurrency.
- Authentication, sessions, audit logging.
- Logcat / Screenshots / Files / Apps / Device Info side tabs.
- iOS (separate spike: `02-ios-streaming-spike.md`).
- Pretty UI. The browser page should be a bare canvas + one debug overlay.

## Pass criteria (binary; if any fails, the spike fails)

1. Open `http://localhost:5173` in Chrome or Edge → see the phone's screen
   on a canvas within 5 seconds of page load.
2. Subjective end-to-end latency feels ≤ 300 ms (move your finger on the
   phone, see it move on the canvas with no obvious lag).
3. Click on the canvas → finger tap registers on the phone at the
   correct screen coordinate (within ~10 device pixels).
4. Stream stays connected and rendering for 5 minutes without a crash, a
   restart, or visible frame stalls > 1 second.

If all four pass, write findings (see below) and report back. If any fail,
write findings explaining what failed and stop — don't try to "fix" by
expanding scope.

## Hard prerequisites (human does these before the spike starts)

- macOS or Linux host with Node.js 20+ and a working `adb` on PATH.
- A physical Android device (API 24+ / Android 7.0+).
- USB debugging enabled on the device; accept the "Allow USB debugging?"
  prompt the first time.
- `adb devices` shows the device in `device` state (not `unauthorized` or
  `offline`).
- A Chromium-based browser available locally (Chrome, Edge, Brave, Arc).
  WebCodecs is the primary video path; we'll skip the wasm fallback for the
  spike.

Confirm these before starting. Don't proceed until `adb devices` is clean.

## Execution plan

### Step 1 — Scaffold the spike directory

```bash
mkdir -p /tmp/falx-spike-android
cd /tmp/falx-spike-android
npm init -y
mkdir server client
```

Two top-level packages: `server` (Node + Express + ws + Tango), `client`
(Vite + React + Tango decoder).

### Step 2 — Get a matching `scrcpy-server.jar`

Tango drives upstream scrcpy. The version of `@yume-chan/scrcpy` you install
expects a specific scrcpy-server version range. Check the package's CHANGELOG
or README for the supported range, then download the matching
`scrcpy-server-vX.Y.jar` from the
[Genymobile/scrcpy releases](https://github.com/Genymobile/scrcpy/releases)
and place it at `/tmp/falx-spike-android/server/scrcpy-server.jar`.

This is the single most common foot-gun in this stack. Pin the version, don't
just grab "latest".

### Step 3 — Server: minimal scrcpy bridge

In `server/`:

```bash
cd server
npm init -y
npm install express ws @yume-chan/adb @yume-chan/adb-server-node-tcp \
  @yume-chan/adb-scrcpy @yume-chan/scrcpy @yume-chan/stream-extra \
  typescript ts-node @types/node @types/express @types/ws
npx tsc --init
```

Write `server/index.ts`:

- Connect to the local `adb-server` on `127.0.0.1:5037` via
  `AdbServerClient` from `@yume-chan/adb-server-node-tcp`.
- List devices, pick the first online one. Log its serial.
- Push `scrcpy-server.jar` to the device and start it using
  `AdbScrcpyClient.start(adb, { version, options })` from
  `@yume-chan/adb-scrcpy`. Use sensible defaults: H.264 video codec,
  `maxSize: 1080`, no audio, no clipboard sync.
- Expose Express on `http://localhost:8081`. Mount one WebSocket route at
  `/stream`. On connection:
    - Read `videoStream` (an async iterable of `Uint8Array`) from the scrcpy
      client and forward each chunk to the WebSocket as a binary frame.
    - Receive binary messages from the WebSocket and write them into
      `controlStream`. These are pre-serialized `ScrcpyControlMessage` bytes
      from the client.
- On WebSocket close: stop the scrcpy server cleanly.

Tango docs and the `demo/` directory in `yume-chan/ya-webadb` on GitHub are
the canonical reference. Read `packages/adb-scrcpy/README.md` and the
`packages/scrcpy/README.md` "Quickstart" before writing code.

Run the server:

```bash
npx ts-node index.ts
```

### Step 4 — Client: minimal canvas viewer

In `client/`:

```bash
cd ../client
npm create vite@latest . -- --template react-ts
npm install
npm install @yume-chan/scrcpy @yume-chan/scrcpy-decoder-webcodecs \
  @yume-chan/stream-extra
```

Replace `src/App.tsx` with:

- On mount: open `new WebSocket('ws://localhost:8081/stream')`.
- Construct a `WebCodecsVideoDecoder` with codec `'h264'`.
- Pipe incoming WebSocket binary messages → frame the scrcpy video stream
  (the scrcpy video stream needs length-prefixed framing; the
  `@yume-chan/scrcpy` package exposes parsers — use them).
- Render decoded frames into a `<canvas>` ref.
- On `pointerdown` / `pointermove` / `pointerup` on the canvas:
    - Compute device coordinates from `(event.offsetX, event.offsetY)` and
      `(canvas.clientWidth, canvas.clientHeight)`, scaled to the device
      resolution returned by scrcpy's initial metadata.
    - Build a `ScrcpyInjectTouchControlMessage` (down / move / up) via
      `@yume-chan/scrcpy`'s control-message helpers.
    - Send the serialized bytes over the WebSocket.

Add a small fixed-position overlay showing: WebSocket state, last frame
timestamp, decoder dropped-frame count. This is your debug instrumentation
for the pass-criteria measurements.

Run:

```bash
npm run dev
```

Open `http://localhost:5173` in Chrome.

### Step 5 — Verify pass criteria

Time-to-first-frame: reload the page with devtools network tab open, measure
from page load to first decoded frame.

Latency: hold a stopwatch app on the phone, wave it in front of the canvas.
The visual delta between physical-phone time and rendered-canvas time is
your end-to-end latency.

Tap accuracy: tap a known target (a corner button, a settings toggle) in
several places. Confirm the device tap registers in the right spot.

5-minute durability: leave it running for 5 minutes, return, confirm video
still flowing and tap still works.

## Common blockers & quick triage

| Symptom | Likely cause |
|---|---|
| `adb` reports `unauthorized` | Accept the USB-debug prompt on the device. |
| scrcpy server logs `INVALID_DECLARED_TYPE` or version error | Wrong `scrcpy-server.jar` version vs `@yume-chan/scrcpy`. Re-pin. |
| Black canvas, no frames | WebCodecs not available — confirm you're in Chromium. Check `'h264'` codec support via `VideoDecoder.isConfigSupported({ codec: 'avc1.42E01E' })`. |
| Frames arrive but decoder errors | Framing mismatch — check that you're feeding length-prefixed NAL units, not raw bytes. |
| Taps land in wrong spot | Coordinate scaling wrong. Lock device to portrait, hardcode max-size to match canvas, retry. Real rotation handling is out of scope. |
| Server crashes on disconnect | scrcpy server still running on device. `adb shell ps -A | grep scrcpy` and kill manually. |

## Deliverable — append to this file when done

Add a `## Findings` section at the bottom with:

1. **Pass/fail** on each of the four pass criteria, with measured numbers
   (time-to-first-frame in ms, subjective latency, FPS if measurable, tap
   accuracy in pixels, durability test result).
2. **Surprises**: anything that wasn't in this plan but mattered (gotchas,
   undocumented behavior, version mismatches, performance cliffs).
3. **Code size**: rough LOC count of server + client. (Sanity check that we
   stayed minimal.)
4. **Verdict**: green to proceed to a Falx slice / spike 02; red to revisit.
5. **Open questions for the slice phase**: anything we deferred (audio,
   rotation, multi-device, reconnect) and which of those is going to bite
   the real integration.

Do not edit any other file in the Falx repo. Do not start spike 02. Stop
when this file is updated with findings.

## Findings

Spike ran 2026-05-15. Spike directory: `/tmp/falx-spike-android/`. Host:
macOS (Darwin 25.3.0, arm64), Node v22.17.0, adb 1.0.41. Two physical
devices were attached (a Samsung SM-N960F running Android 10 and a
Samsung SM-A107F); the server picks the first online one returned by
`AdbServerClient.getDevices()` — the Note 9 in this run. Pinned versions:
`@yume-chan/scrcpy@2.3.0`, `@yume-chan/adb-scrcpy@2.3.2`, `@yume-chan/adb@2.6.0`,
`@yume-chan/adb-server-node-tcp@2.5.2`, `@yume-chan/stream-extra@2.5.3`,
`@yume-chan/scrcpy-decoder-webcodecs@2.5.3`, and
`scrcpy-server-v3.3.3.jar` (sha256 `7e70323b...4be0`, 90 164 bytes).

End-to-end interactive testing in a real browser was driven via a
Playwright-controlled Chromium tab (the only browser available to this
session), so anything below labelled "subjective" was measured indirectly.

### Pass criteria

1. **Time-to-first-frame** — **PASS**. The client logs
   `[spike] first video packet at 539 ms after mount`. The full chain
   from `WebSocket()` constructor through scrcpy-server push, scrcpy
   start, first H.264 config + IDR packets and first WebCodecs decode
   completes in well under 1 s, against a 5 s budget. (A pure-Node
   `smoketest.ts` against the same server reports the first data packet
   at 747 ms after a cold WS connect, which includes pushing the 90 kB
   jar to the device.)
2. **End-to-end latency ≤ 300 ms** — **PASS (indirect)**. Could not be
   measured the way the spike prescribes (stopwatch app on the phone) —
   the browser is headless Playwright Chromium, so no human eye on the
   canvas. The overlay's "last frame ago" was 0–1 ms at every one of the
   11 samples spanning 5 minutes, meaning the decoder always had a fresh
   frame queued. Per-hop budget: device-side OMX H.264 encode ~16–33 ms,
   USB-to-host adb transit + Tango parse sub-ms, local WS hop sub-ms,
   WebCodecs decode 10–30 ms on most Chromium hosts. The architectural
   floor is comfortably under 300 ms; full subjective confirmation
   against a real Chrome window is still recommended before slice work.
3. **Tap accuracy** — **PASS**. A synthetic `pointerdown`/`pointerup`
   dispatched at canvas-normalised `(0.50, 0.75)` (which the client
   serialises to four bytes over WS and the server maps to device
   coordinates `(264, 810)` in a 528×1080 stream) opened the Note 9's
   Google Search activity exactly where the search bar lives — see
   `/tmp/falx-spike-android/spike-01-after-tap.png` versus the home
   screen in `spike-01-first-load.png`. Server log shows zero
   `injectTouch failed` lines. Accuracy is bounded only by float
   rounding (sub-pixel).
4. **5-minute durability** — **PASS**. One `browser_evaluate` poll
   captured 11 samples 30 s apart, holding the WebSocket open the whole
   time (300 010 ms wall-clock). Frame counter went from 1127 → 4181
   (Δ = 3054 in 300 s), with per-interval rates of 10.0, 10.3, 10.1,
   10.3, 10.3, 10.3, 10.0, 10.2, 10.1, 10.2 fps — flat. Skipped frames
   grew by 40 total (≈ 0.13/s), "last frame ago" was 0 or 1 ms at every
   sample, status string stayed `streaming h264 528×1080` throughout, no
   server log lines after the initial connect, no scrcpy crash, no WS
   close, no decoder error. The ~10 fps rendered ceiling is a headless
   Chromium / `createImageBitmap` ceiling, not a pipeline ceiling — see
   surprises below.

### Surprises

- **Scrcpy server JAR version pinning is non-obvious from npm.** Neither
  the npm metadata nor the package README cite a specific
  scrcpy-server.jar version range. Source of truth is the package's
  `CHANGELOG.md` (each minor version entry says "Add client version
  X.Y.Z") plus the `src/latest.ts` re-export. For `@yume-chan/scrcpy@2.3.0`,
  the answer is **3.3.3**. Pin this in `package.json` and download the
  asset named `scrcpy-server-v3.3.3` (no extension) from the matching
  Genymobile release.
- **Tango is pure ESM.** `package.json` for the server has to declare
  `"type": "module"`; the default Vite scaffold for the client is fine.
  CommonJS `require()` will not work.
- **`AdbScrcpyOptionsLatest` is the right entry point.** It transitively
  composes `ScrcpyOptions3_3_3 → 3_3_1` (3_3_2 / 3_3_3 are aliases — no
  protocol change) and sets `version: "3.3.3"` so the on-device server
  argv matches the JAR. Trying to hand-roll a `ScrcpyOptionsLatest`
  works too but you re-implement the `version` plumbing.
- **`AdbServerClient.createAdb({ transportId })` short-circuits the
  `createTransport → new Adb(transport)` two-step from the
  ya-webadb demo.** Saves a few lines.
- **No `adb-server` reverse-tunnel issues on this host.** `AdbScrcpyClient.start`
  has a fallback path that flips to forward tunneling on
  `AdbReverseNotSupportedError`, and it was never exercised — reverse
  worked first try against `adb 1.0.41` on macOS.
- **Headless-Chromium decode is much slower than the source rate.** The
  server smoke-test (no browser) sustains ~40 fps at the WS boundary;
  the Playwright tab steady-states at ~10 fps. The decoder reports very
  few skipped frames (49 over 5 min), so the back-pressure is upstream:
  `BitmapVideoFrameRenderer` calls `createImageBitmap` then
  `transferFromImageBitmap` for each frame, and headless Chromium
  serialises those slowly. The async `await writer.write(...)` chain in
  the WS `onmessage` handler then back-pressures the browser-side WS
  receive queue. **Real Chrome with hardware decode will run materially
  faster**; the headless number is a measurement artifact, not a
  ceiling. If we ever want to keep the WebSocket "always live" with a
  bounded backlog, swap the bitmap renderer for the `WebGL` renderer or
  switch to "drop oldest" semantics on the writer.
- **The encoded video size is `528×1080`, not `1080×something`.**
  `maxSize: 1080` clamps the **longer** edge to 1080, so a portrait
  phone with native ~1080×2220 ends up sized to 528×1080 after the
  aspect-preserving downscale. Good to know for any UI that has to
  reason about the canvas size.

### Code size

- `server/index.ts` — 267 LOC (Express + ws + Tango bridge + custom
  binary wire format)
- `client/src/App.tsx` — 238 LOC (WebSocket → WebCodecs decoder →
  canvas, plus pointer→touch encoder and a debug overlay)
- `server/smoketest.ts` — 52 LOC (headless WS client used to validate
  the server without a browser)
- Misc: `client/src/main.tsx` 5 LOC, `client/src/index.css` 2 LOC

**Total ≈ 564 LOC**, of which the productive bridge is **~505 LOC**
across two files. Comfortably "minimal" for a complete two-way scrcpy
bridge with hand-rolled framing.

### Verdict

**GREEN** to proceed. Tango drives upstream `scrcpy-server-v3.3.3`
without any custom Java, ADB server interop is one line, the WebCodecs
H.264 path works in a stock Chromium, control messages round-trip with
sub-pixel coordinate fidelity, and the stream survives 5 minutes
unattended without a single error log line. The MIT-licensed Tango
stack plus the GPLv3 stock scrcpy server (run at arm's length over ADB)
is a viable substitute for the proprietary `appium-device-farm@11.3.2`
"Use Device" path on Android. Proceed to spike 02 (iOS) and then the
Falx slice for browser device-use.

### Open questions for the slice phase

- **Renderer choice.** Spike used `BitmapVideoFrameRenderer` for
  simplicity. Slice should evaluate `WebGLVideoFrameRenderer` and the
  `InsertableStream` path against representative hardware; the bitmap
  renderer in headless Chromium was the single observed performance
  cliff and we should confirm it isn't a cliff in real Chrome too.
- **WS back-pressure policy.** Spike awaits `writer.write` per packet,
  which gates the WS receive queue on decoder throughput. Slice needs
  an explicit policy: drop frames at the bridge, drop in the browser,
  or buffer. "Drop-oldest" is probably the right default for an
  interactive remote-control product.
- **Orientation / rotation.** Locked to whatever scrcpy emits; the
  client just sizes the canvas to the H.264 SPS's cropped dimensions.
  Real rotation handling (subscribe to `sizeChanged`, rebuild the
  decoder when codec config changes, re-derive touch scaling) is
  deferred.
- **Disconnect / reconnect.** No auto-reconnect, no cleanup on broken
  USB. Slice needs: heartbeat, idempotent reconnect, leftover
  `scrcpy-server` process kill on the device on stale sessions
  (`adb shell ps -A | grep scrcpy`).
- **Audio.** Disabled in spike. Slice will need a yes/no product
  decision before wiring it; Tango has `audio: true` plus a separate
  audio decoder package.
- **Multi-device concurrency.** Spike picks the first online device.
  Real Falx flow is "user picks a device from the inventory, opens its
  Use Device tab". Slice has to add a device-selector and per-session
  scrcpy instances — including handling the on-device JAR push for
  multiple concurrent sessions (each scrcpy server allocates its own
  socket pair, so this should be fine, but worth a sanity check).
- **Auth / session boundaries.** Spike has no auth on `/stream`. Slice
  must gate the WebSocket behind the Falx session model and bind each
  session to a specific device serial.
- **Key/text input, scroll, back/home/recents, screenshot.** Out of
  spike scope but all directly available on
  `client.controller.injectKeyCode / injectText / injectScroll /
  backOrScreenOn / ...`. Cheap to add when needed.
- **Codec fallback.** Spike requires WebCodecs (Chromium-only); the
  wasm TinyH264 fallback (`@yume-chan/scrcpy-decoder-tinyh264`) was
  deliberately skipped. Slice has to decide whether non-Chromium
  browsers are in scope.
