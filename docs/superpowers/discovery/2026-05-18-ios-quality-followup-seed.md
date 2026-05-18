# iOS Use Device — quality follow-up seed

**Status:** brainstorm seed, not a spec yet. Picks up where the iOS Use
Device slice (branch `feat/ios-use-device`, finishing ~2026-05-18) left
off. The slice ships a working, demoable-ish, but-not-Android-grade iOS
device-control experience. Two known gaps want their own slice family.

## Where things ended

The slice is code-complete and verified on `kry-phone` (iPhone 12 Pro
Max, iOS 26.4.2):
- Click Use Device → live MJPEG canvas at correct portrait aspect ratio
  within ~5.3 s p50 / ~5.8 s p95 (50-cycle leak run clean).
- Tap, swipe, Home, App Switcher, Stop all dispatch correctly.
- Zero leaked `ios runwda` / `ios forward` processes after 50 cycles.
- Image quality is **good** — operator-reported "perfect".

**What's not demo-grade** (operator feedback on 2026-05-18):
- Lock-screen probe doesn't behave as spec'd — see Issue A.
- Tap and swipe responsiveness is noticeably worse than Android — see
  Issue B.

Everything else from the original slice spec is in the post-run
`### Manual verification — kry-phone (2026-05-18)` section at
`docs/superpowers/specs/2026-05-18-ios-use-device-design.md`.

## Issue A — Lock-screen probe fails to fire 423

**Symptom:** Operator locks the phone, clicks Use Device. Expected: 423
`device_locked` toast, no partial session. Actual: probe doesn't trip;
something else happens (likely a later step fails, surfacing as 502).

**Code path:**
- `src/device-stream/ios/bridge.ts` Step 9: `await wdaClient.getLocked(sessionId)`.
- `src/device-stream/ios/wda-client.ts`: `GET /session/<sid>/wda/locked` →
  returns `Boolean(r.data?.value)`.
- On `true` → throws `DeviceLockedError` → router maps to 423.

**Hypotheses to verify:**
1. **WDA on iOS 26 reports a different shape.** Spike 03 ran against
   the same OS but didn't actually trigger lock-detection. Curl
   `/session/<sid>/wda/locked` with the phone locked — what comes back?
2. **"Locked" vs "screen off" semantics.** WDA may only consider the
   phone locked when the display is OFF. Face-ID-prompt-but-display-on
   may return false.
3. **Probe runs against the bridge's WDA session, which is then
   replaced by Appium.** Order of operations (bridge.getLocked → bridge
   succeeds → Appium attach → rebind) means the probe used the bridge's
   short-lived session. Fine in theory; but worth confirming the probe
   isn't racing the session-swap.

**Risk if unfixed:** UX regression vs spec promise; operator gets a
generic "bridge start failed" instead of an actionable "unlock your
phone". Small but real.

**Suggested next step:** spike — curl WDA's `/wda/locked` in three
states (display on/unlocked, display on/locked with Face ID prompt,
display off/locked). Compare responses. Adjust the probe accordingly.

## Issue B — Tap/swipe responsiveness is worse than Android

**Symptom:** Operator description: "swipe, tab vs slow and not nice
smooth. Compared to Android, it is bad." Image quality is fine; the
gap is in the input → visible-feedback loop.

**Architectural cause:**
- Android: scrcpy injects events via UInput streamed over the existing
  adb connection. No per-event HTTP. Visual feedback at H.264 native
  framerate.
- iOS: each tap or swipe = browser WS message → server → axios POST to
  WDA's REST API → WDA processes → response. Each call is a separate
  HTTP round trip. Visual feedback via MJPEG at 20 fps (~50 ms/frame
  steady state, but parser + decode adds tens of ms).

Round-trip on a local USB-forwarded WDA REST call is typically 30–80 ms.
Add MJPEG observe lag and the loop is 100–200 ms — perceptible.

**Candidate levers (one slice each, not all at once):**

1. **Optimistic visual feedback.** Draw a transient tap-ring or
   swipe-trail on the canvas at `pointerdown` time, before WDA
   acknowledges. Disconnects *perceived* latency from network latency.
   Cheap, high-impact for "feels responsive". Pure falx-ui change.

2. **WDA W3C Actions endpoint (`POST /wda/actions`).** Pack multiple
   pointer events in one HTTP call (long taps, multi-point swipes, even
   pinch). Cuts HTTP overhead for compound gestures. Bridge / WS
   handler change.

3. **WebRTC streaming.** Cuts the visual-feedback half of the loop from
   ~50 ms MJPEG frame interval to single-digit ms. Already noted as the
   spike-02 Phase-2 trigger; deferred because MJPEG met the bar then.
   Bigger lift: a `pion`/`ws`-based WebRTC negotiation path on the
   plugin and a `RTCPeerConnection` on the canvas.

4. **Drop the Appium attach.** The router currently creates an Appium
   XCUITest session that piggybacks on our pre-started WDA via
   `webDriverAgentUrl` — *only* so the device shows in the upstream
   Sessions UI and the existing EventBus session-end teardown wires up.
   Removing this gets rid of the session rebind dance and removes some
   per-call overhead (Appium proxies some calls through itself). Risk:
   loses the Sessions UI integration. Tradeoff worth a spec.

5. **Long-pressed pointer = lower-latency drag.** The current
   `dragfromtoforduration` model is a fire-and-forget HTTP. A streaming
   pointer API (sequential moves over WS → Server batches and forwards
   as W3C actions) would let the operator see the drag track on-device
   in near-real-time. Combine with #1.

Pick the cheapest big-win first. Likely order: 1 → 2 → 3.

## Brainstorm seed — questions for the next session

- Is the lock-probe fix part of this quality slice or a one-line
  bugfix slipped into the iOS slice's PR?
- Does the demo audience know they're seeing iOS or do they expect
  "same as Android"? Sets the bar.
- Do we have any local network-jitter tolerance budget, or is the
  USB-forwarded path tight enough that all latency is host-side?
- Is removing Appium attach (lever #4) on the table at all, or is
  Sessions-UI integration sacred?

## Kickoff prompt to start the new session

```
We finished the iOS Use Device slice on branch feat/ios-use-device. It
works but two issues are not demo-grade: the lock-screen probe doesn't
fire 423, and tap/swipe responsiveness is well below Android. Read
docs/superpowers/discovery/2026-05-18-ios-quality-followup-seed.md for
the full context, then brainstorm the next slice with me using the
superpowers:brainstorming skill. Start from the candidate levers in
Issue B; we'll decide which to spec first.
```
