# Spike 04 — iOS input latency + live-drag patterns

**Time box:** 2-3 hours (actual: ~2 hours).
**Spike directory:** `/tmp/falx-spike-ios-input/` (NOT in the Falx repo).
**Status:** done.
**Date:** 2026-05-18.
**Device:** kry-phone (iPhone 12 Pro Max, iOS 26.4.2, UDID `00008101-001A408E2EB9001E`).
**WDA build:** 12.2.2 from spike 02's Xcode build (`com.falx.WebDriverAgentRunner.xctrunner`).
**Picks up from:** spike 03 (tap dispatch validation) and the iOS Use Device
slice (`docs/superpowers/specs/2026-05-18-ios-use-device-design.md`).

## Why this spike exists

The iOS Use Device slice shipped working but with poor input responsiveness
(per operator: "swipe, tab vs slow and not nice smooth. Compared to Android,
it is bad"). The input quality follow-up
(`docs/superpowers/discovery/2026-05-18-ios-quality-followup-seed.md`) and
the resulting design
(`docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md`)
assumed two architectural decisions needed validation:

- **Decision 1:** Live-drag dispatch pattern. Pattern A (single W3C Actions
  sequence at pointerup) vs Pattern B (chained short
  `/wda/dragfromtoforduration` segments every ~80 ms).
- **Decision 2:** Keep `/wda/tap` or swap to W3C `/session/<sid>/actions`
  for taps.

The spec's working hypothesis was that WDA RTT on USB-forwarded localhost was
30–80 ms. Reality, validated below, is **600–1800 ms per call** — 20× higher
than assumed. This finding invalidates the original "live drag tracking"
goal and reshapes the slice.

## Findings

### Task 1 — `/actions` endpoint at iOS points (PASS)

`POST /session/<sid>/actions` with iOS-points coords works on iOS 26.4.2 with
the bare-minimum `{"platformName": "iOS"}` WDA session. Confirms spike 02's
"broken" verdict was the pixel-coords units bug (also documented in spike 03).

- POST `/actions` for a 1-frame tap at (263.5, 859.5) returned in **1469 ms**.
- Photos launched on the device (operator-confirmed).
- Verdict: **`/actions` works at iOS points.**

Notes: the 1469 ms is dominated by WDA dispatch + a 50 ms in-sequence pause
+ idle-sync. Tunable improvements quantified in §"Tunables probe" below.

### Task 2 — Pattern A (single long W3C Actions sequence)

30-step pointerMove sequence over a 500 ms target window (forward + reverse
drags across the SpringBoard).

- POST returned in **13.3 s forward, 13.8 s reverse**.
- Operator observation: "screen scrolled to the left, waited for a while,
  then scrolled to the right again" — on-device gesture was quick (~500 ms
  visually), the 13 s wall time is WDA's post-action settling / idle-sync
  before the POST returns.
- Verdict: **Pattern A is dead for live drag.** Even though the on-device
  gesture renders correctly, the 13 s blocking POST means the server cannot
  react to subsequent operator finger movement.

### Task 3 — Pattern B (chained short `/wda/dragfromtoforduration`)

Six 80 ms segments marching (380 → 40, y=463) across the home page.

- Per-segment dt: **~1.5–1.8 s each** (consistent across two runs).
- Total wall time: **~9–10 s** for a 480 ms target.
- Operator observation: "scrolled all the way to the last screen (1st → 6th
  page), would say it was OK, smooth enough. Brief pauses between segments.
  However, the last scroll one screen back (single 300 ms drag) was slow and
  sluggish."

Critical takeaway: **on-device gestures render at the requested duration**
(80 ms drags look snappy; 300 ms drags look sluggish). The 1.5 s per-call is
HTTP/dispatch wall-time, not on-device gesture wall-time.

### Task 3b — Pattern B with HTTP Keep-Alive

To rule out per-connection RSD/TCP setup as the culprit, re-ran Pattern B
using `http.client.HTTPConnection` keep-alive (matches Node.js axios default).

- Per-segment dt unchanged: **~1.5–2.2 s each**.
- Tap (`/wda/tap`) p50: **~1.4 s**.
- Verdict: **Keep-alive does NOT explain the latency.** Per-call overhead is
  intrinsic to WDA on iOS 26, not the transport.

### Task 3c — `/appium/settings` runtime tunables probe

Attempted 8 settings; only 2 were recognized by WDA 12.2.2:
`waitForIdleTimeout: 0` and `animationCoolOffTimeout: 0`. The other 6
(`waitForQuiescence`, `actionAcksTimeout`, `dispatchedEventActionsTimeout`,
`snapshotTimeout`, `useEnhancedCoordinateMapping`,
`shouldUseTestManagerForVisibilityDetection`) returned `null` (not applied).

Effect on `/wda/tap` p50:
- Baseline: **1349 ms**.
- Post-tunables: **822 ms** (~39 % reduction).

Verdict: **tunables help materially but the floor is still ~800 ms** —
nowhere near "feel real-time".

### Task 4 — Channel comparison + tap-latency baseline (with tunables)

Same WDA session, tunables applied, keep-alive connection.

| Channel | Trials (ms) | p50 (ms) | Max (ms) |
|---|---|---|---|
| `/wda/tap` | 802, 807, 829, 818 | **818** | 829 |
| `/actions` 1-frame | 629, 631, 632, 626 | **631** | 632 |
| `/wda/dragfromtoforduration` (100 ms duration) | 2053, 1735, 1760, 1746 | **1760** | 2053 |

Notes:
- `/actions` is **~22 % faster than `/wda/tap`** for tap dispatch, contrary
  to the spec's working assumption that `/wda/tap` was the fast path.
- Drag dispatch wall time is **uncorrelated with requested duration**:
  asking for a 100 ms drag still costs ~1.8 s wall time. The duration
  parameter only affects on-device gesture rendering.

## Decisions

### Decision 1 — Live-drag dispatch pattern: **NEITHER (live drag not viable)**

Pattern A (13 s blocking POST) and Pattern B (1.5–1.8 s per-segment) both
exceed any latency budget for real-time drag tracking. The slice's original
goal — "drag track follows the operator's finger on the physical iPhone in
near-real-time" — is **not achievable with vanilla WDA on iOS 26**.

Instead: ship one drag at pointerup with capped duration, plus optimistic
canvas overlays to mask perceived latency.

### Decision 2 — Tap channel: **swap to `/actions`**

`/actions` p50 is 631 ms vs `/wda/tap` p50 of 818 ms (~22 % faster). Worth
the swap. Use a 1-frame down-up sequence with a short pause.

### Decision 3 (new) — Apply WDA tunables at session start

`waitForIdleTimeout: 0` and `animationCoolOffTimeout: 0` reduce dispatch
wall time by ~40 %. Apply via `POST /session/<sid>/appium/settings` after
session creation in `src/device-stream/ios/bridge.ts`. Other proposed
tunables don't stick on WDA 12.2.2; document them for future revisits.

### Decision 4 (new) — Cap swipe duration

Currently the canvas sends `durationMs = Math.max(50, dt)`. Replace with
`durationMs = Math.min(120, Math.max(50, dt))` (cap at 120 ms regardless of
how long the operator drew the gesture). This eliminates the "WDA replays
the swipe slowly on the iPhone" complaint without sacrificing tap detection
or short-flick semantics. Operator observation directly supports this:
80 ms drag was smooth, 300 ms drag was sluggish.

## Scope change for the implementation slice

The original spec
(`docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md`)
called for:

- Phase 2(b) Live drag dispatch via per-WS pointer state machine →
  **DROPPED.** Live drag not achievable with vanilla WDA.
- New `pointer_start/move/end` WS messages + `PointerState` machine →
  **DROPPED.** Not needed; existing `tap`/`swipe` messages with duration
  cap are sufficient.
- Conditional Tasks 14 (Pattern A fallback) and 15 (tap-via-actions) →
  **15 promoted to required (default tap channel).** 14 obsoleted.

The new slice scope is ~6 tasks:

1. Apply WDA tunables on session start (`bridge.ts`).
2. Add `wdaClient.actions()` and `wdaClient.tapViaActions()` methods.
3. Swap tap dispatch in `router.ts` to use `tapViaActions`.
4. Cap swipe duration in `router.ts` (or in canvas — TBD in revised plan).
5. Optimistic canvas overlays (ring + trail) in `IOSStreamCanvas.tsx`.
6. Verification: unit tests + agent Playwright MCP pass + operator manual gate.

Estimated effort: ~1 day of implementation vs the original 3–5 day plan.

Acceptance bar reframed: from "BrowserStack-grade smooth, real-time live
drag" to **"noticeably more responsive than current; on-device gesture no
longer 'sluggish'; UI feels acknowledging via optimistic overlay even
during the unavoidable ~600 ms WDA tap dispatch."**

## Open questions for future work

- **Custom WDA build (forks).** Spike 03 channels C/D (latest WDA main,
  Sauce/HeadSpin forks) were skipped because basic dispatch worked. Worth
  revisiting if a fork has reduced per-call overhead on iOS 26.
- **Alternative input channels.** go-ios HID injection (channel E from
  spike 03) and tidevice (channel F) bypass WDA entirely. Either could
  potentially deliver sub-100 ms dispatch. Larger investigation; warrants
  its own spike.
- **Other unapplied tunables.** The 6 settings that didn't stick may work on
  newer WDA builds. Re-test if WDA is updated.
- **WebRTC streaming.** Originally deferred because MJPEG "felt perfect."
  Now that the input loop has a known ~600–1800 ms floor, the streaming
  half is no longer the bottleneck; WebRTC stays deferred.
