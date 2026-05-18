# iOS Input Responsiveness — design

**Status:** spec, awaiting plan.
**Branch (proposed):** `feat/ios-input-responsiveness`.
**Picks up from:** `feat/ios-use-device` (iOS Use Device slice, shipped
2026-05-18). Same physical device: `kry-phone`, iPhone 12 Pro Max,
iOS 26.4.2.
**Seed:** `docs/superpowers/discovery/2026-05-18-ios-quality-followup-seed.md`.

## Goal

Make the iOS Use Device input experience feel "smooth, responsive, almost
real time" — operator target is BrowserStack App Live parity for the
input-to-on-device-reaction loop. The streaming half of the loop is already
"perfect" per operator; this slice is purely about taps and drags.

Concretely:

1. **Taps** — finger-down on the canvas to visible response on the stream
   feels instant; perceptual latency masked by optimistic UI overlays that
   render before any HTTP/MJPEG roundtrip.
2. **Drags / swipes** — the drag track follows the operator's finger on the
   physical iPhone in near-real-time (not "release finger, watch WDA replay").
3. **Subjective gate** — operator (you) test-drives five apps on `kry-phone`
   and reports "BrowserStack-grade Y/N". That's the only acceptance authority
   on the device-side feel.

## Non-goals

- WebRTC streaming. MJPEG already feels right; deferred per Phase-2 hand-off
  notes in `docs/spikes/02-ios-streaming-spike.md`. WebRTC stays in
  `docs/BACKLOG.md` for a future slice if the stream becomes the new
  bottleneck.
- Removing the Appium attach. Already verified: the gesture hot path bypasses
  Appium via `bridgeHandle.wdaClient` after the session-id rebind. Appium
  exists only as a session-lifecycle / UI-state holder. No latency win
  available there.
- Lock-screen probe fix (Issue A in the seed). Its own later slice.
- Multi-touch / pinch / two-finger gestures. Follow-up if demoable.
- New typing UX. `/wda/keys` works; keyboard pop-up handling is its own
  slice.

## Why the current path feels slow

Inferred from `src/device-stream/router.ts` (lines 638–668) and
`falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx` (lines 116–161):

- **Swipe is a one-shot replay.** On `pointerup`, the canvas sends one
  `swipe` WS frame with `durationMs = Math.max(50, dt)` where `dt` is how
  long the operator drew the gesture. The server calls
  `/wda/dragfromtoforduration` with that same duration, so **WDA replays the
  entire swipe on the physical iPhone over `dt` ms**. The visible loop is
  therefore roughly `dt (operator draws) + RTT (~30–80ms) + dt (WDA replays)`
  — close to 2× the operator's drawing time before the gesture finishes. The
  operator explicitly observed this slowness on the iPhone itself, which
  confirms it's WDA replay timing, not stream observation lag.
- **Tap is a single small HTTP POST** to `/wda/tap`. Probable steady-state
  latency floor is HTTP RTT + WDA dispatch — likely 50–150 ms. Without
  optimistic feedback, every tap reads as "click, wait, see it happen".
- **No live drag.** The browser holds the entire drag state and emits
  nothing until `pointerup`, so even with a hypothetical 0-latency dispatch
  the operator never sees a drag track on the iPhone before releasing.

## Approach (chosen)

**Approach 3** — live drag + optimistic canvas overlays + duration-cap
fallback. Considered alternatives and why they lose:

- *Approach 1, surgical only (duration cap + finger ring, ship in a day).*
  Doesn't reach the BrowserStack bar — drag never tracks live.
- *Approach 2, live drag only (no UX tricks).* Cleaner architecture but
  exposes the full HTTP-RTT floor on every tap and on each drag segment.
  Optimistic overlays are cheap and the largest single perceptual win.
- *Approach 3, all of the above.* Combines architectural fix (live drag) with
  perceptual mask (overlays) and a safety net (duration cap if streaming
  pointer turns out flickery). This is the BrowserStack/SauceLabs pattern
  for interactive iOS device control.

## Architecture

### Phase 1 — Spike (2–3 hours, out-of-tree)

Directory: `/tmp/falx-spike-ios-input/`. Findings file:
`docs/spikes/04-ios-input-latency-spike.md` (new), following the convention
established by spikes 02 and 03.

Three experiments against `kry-phone`:

1. **W3C Actions at iOS-points coords.** Confirm
   `POST /session/<sid>/actions` works on iOS 26.4.2 with the bare-minimum
   session from Channel A of spike 03. Likely passes — spike 02's "broken"
   verdict was the same pixel-coords units bug that masked `/wda/tap`. Trial
   a 1-frame `pointerDown` + `pointerUp` at a known SpringBoard icon.
2. **Live-drag pattern comparison.** Run both patterns against the same
   target (e.g. a swipe across SpringBoard pages):
   - **Pattern A:** single long W3C Actions sequence with ~30 `pointerMove`
     steps + pauses, issued as one POST.
   - **Pattern B:** chained short `/wda/dragfromtoforduration` calls, every
     ~80 ms, current-position → next-position, duration ≈ 80 ms each. Each
     segment starts where the last ended (no finger lift in operator intent).
   Eyeball both on `kry-phone`. Score on: (i) finger-lift flicker between
   segments, (ii) on-device smoothness, (iii) responsiveness during the
   sequence (can we adjust mid-flight if the operator changes direction?).
3. **Tap-latency baseline.** Instrument client-side: from `pointerdown` to
   first MJPEG frame whose pixel hash at the tap region changes. Five trials,
   p50 + max. This number sets the bar for "is the optimistic ring buying
   us enough perceptual win, or do we need to also rework the tap dispatch?".

Spike pass criterion: enough evidence to pick Pattern A vs B (or a hybrid)
for Phase 2, plus a tap-latency baseline number to compare against
post-implementation.

Working assumption going in: Pattern B wins (true live drag). Fallback if
flickery: Pattern A + duration cap + optimistic canvas to mask. Phase 2 has
a branch point on this.

### Phase 2 — Implementation

Three independent pieces, each shipped in its own commit, all on the same
branch.

#### (a) Optimistic canvas overlays — `falx-ui` only

Edit `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`:

- On `pointerdown`, draw a transient ring overlay at the canvas pixel
  position of the touch. Animate it out over ~200 ms (fade + slight expand).
- During drag, draw a fading trail along the pointer path (e.g. recent N
  points, each fading with age).
- Overlays are 2D-canvas draws layered over the MJPEG frame on the same
  canvas. No network, no server roundtrip. Cleared on `pointerup` /
  `pointercancel`.
- Overlay rendering must not interfere with MJPEG redraw — sequence is:
  blit current JPEG frame, then draw overlays on top each frame.

This piece is independently valuable and could ship alone, but combined with
(b) it gives the full perceptual win.

#### (b) Live drag dispatch — server + client

**New WS message kinds** (client → server). Define in
`src/device-stream/types.ts` and the matching codec helpers in
`falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`:

- `pointer_start { x, y, t }` — pointerdown.
- `pointer_move { x, y, t }` — each pointermove during a drag. Browser
  throttles emission to requestAnimationFrame cadence (~16 ms).
- `pointer_end { x, y, t, wasTap }` — pointerup. `wasTap = true` if the
  client classified this as a tap (small dt, small distance — same
  thresholds the canvas already uses, keep co-located).

Existing `tap`, `swipe`, `intent` messages stay wired up for backwards
compatibility during the transition. New client code uses only the pointer
messages. After Phase 3 verifies the new path, retire `swipe`; keep `tap`
as an explicit shortcut path that `pointer_end {wasTap}` resolves to
server-side (so the server has one path for tap dispatch, fed by both old
and new code if needed).

**New module: `src/device-stream/ios/pointer-state.ts`** — pure logic, no
I/O, unit-testable. One instance per active WS connection. Owns:

- The "current finger position" on the device (server is the source of
  truth; the browser doesn't track this).
- The decision of when to emit the next drag-segment command (cadence:
  every ~80 ms, configurable via a constant whose default the spike sets).
- Backpressure: if drag-segment dispatches start queueing (>2 in flight),
  collapse pending segments into one targeting the latest known position.
- On `pointer_end`, emit a final segment to the end position (or skip if
  the last segment was very recent and already targeted near it).
- On `pointer_end {wasTap: true}`, emit a tap command instead of any drag
  segments.

The state machine exposes a synchronous API: `feed(message): Command[]`,
where `Command` is a discriminated union of `{ kind: 'tap', x, y }` or
`{ kind: 'drag', x1, y1, x2, y2, durationMs }`. Pure. Testable with
synthetic event streams.

**Router glue** — edit `src/device-stream/router.ts` (the WS message
handler, currently around lines 632–676):

- On WS open, create a `PointerState` instance bound to the WS.
- On each pointer message, call `state.feed(msg)`, dispatch returned
  commands via `handle.wdaClient`. Errors per the §"Error handling" section
  below.
- On WS close, the existing `unsub()` plus a new `state.dispose()` clears
  any pending work. State is GC-eligible after.

If Phase-1 spike picks Pattern A (W3C Actions sequence on pointerup) over
Pattern B (chained short drags), `pointer-state.ts` accumulates moves and
emits a single `{ kind: 'actions', sequence: [...] }` command on
`pointer_end` instead of streaming drag segments. The router gets a new
`wdaClient.actions(...)` method to dispatch it. The branch is internal to
`pointer-state.ts`; rest of the system doesn't care.

#### (c) Tap-path optimization (conditional)

Only if the Phase-1 spike baseline shows `/wda/tap` itself is slow (>100 ms
on the device side). Default: leave `/wda/tap` alone, optimistic ring
handles the perceptual layer. If swapped, the alternative is
`/session/<sid>/actions` with a 1-frame `pointerDown` + immediate
`pointerUp` sequence at the tap coords — same call shape, potentially
faster dispatch path inside WDA.

#### (d) App switcher gesture — unchanged

Existing fire-and-forget `/wda/dragfromtoforduration` for the app switcher
is fine. No live-drag requirement, no operator-finger to track. Stays as
is.

### Phase 3 — Verification (see §Testing)

Order: (i) unit tests on `pointer-state.ts`, (ii) agent runs the Playwright
MCP self-verification pass against the running app + `kry-phone`, (iii)
operator subjective gate on the physical device.

## Component map

```
docs/spikes/04-ios-input-latency-spike.md            (new — Phase 1 plan + findings)
src/device-stream/types.ts                           (modified — pointer_* msg types)
src/device-stream/ios/pointer-state.ts               (new — per-WS state machine, pure)
src/device-stream/ios/wda-client.ts                  (maybe — add actions() if Pattern A wins)
src/device-stream/router.ts                          (modified — wire pointer_* msgs into pointer-state)
falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx      (modified — overlays + new pointer msg emission)
test/unit/ios-pointer-state.spec.ts                  (new — unit tests for pointer-state.ts)
```

No new top-level dependencies. The Playwright verification step uses the
agent's MCP browser tools at runtime; nothing is added to `package.json`.

### Module boundaries

- `IOSStreamCanvas` — canvas drawing (MJPEG + overlays), pointer event
  capture, WS encoding. Knows nothing about WDA, nothing about HTTP.
- `pointer-state.ts` — pure logic. Pointer messages in, drag/tap commands
  out. No I/O, no timers it doesn't own deterministically (state cadence
  can be driven by message timestamps or a single `now()` injection for
  testability). Synchronously testable.
- `router.ts` WS handler — glue. Decode message, look up `bridgeHandle`,
  feed `PointerState`, dispatch returned commands via `wdaClient`. Catches
  WDA / dispatch errors here so they don't tear down the WS.
- `wda-client.ts` — thin REST surface over WDA. No state.

## Data flow

### Tap

1. **Canvas** `pointerdown` → draws optimistic ring overlay (200 ms animate-
   out); records start point/time; sends `pointer_start { x, y, t }`.
2. **Canvas** `pointerup` (small dt, small distance) → classifies as tap;
   sends `pointer_end { x, y, t, wasTap: true }`.
3. **Router** feeds both messages to `PointerState.feed(...)`. Returns
   `[{ kind: 'tap', x, y }]` from the `pointer_end`.
4. **Router** calls `wdaClient.tap(sessionId, x, y)`. (Or `actions()` if
   tap-path optimization applied.)
5. **WDA** dispatches, iOS reacts. MJPEG fan-out picks up the visual change
   1–2 frames later.
6. **Operator perception:** instant ring at finger-down; MJPEG catches up
   60–150 ms later showing the actual UI change. The ring carries the
   "system received your input" signal across the network/MJPEG delay.

### Drag

1. **Canvas** `pointerdown` → ring overlay + `pointer_start { x, y, t }`.
2. **Canvas** `pointermove` (rAF-throttled) → appends to trail overlay
   (instant); sends `pointer_move { x, y, t }`.
3. **Router** feeds moves into `PointerState.feed(...)`. Every ~80 ms
   (cadence configurable), state returns `[{ kind: 'drag', x1, y1, x2, y2,
   durationMs }]` from the *last sent position to the latest known
   position*. Router dispatches via `wdaClient.drag(...)`. Each segment
   continues from where the last ended → continuous on-device drag track,
   no finger-lift between segments (modulo Phase-1 spike findings).
4. **Canvas** `pointerup` → clears trail; sends `pointer_end { x, y, t,
   wasTap: false }`. State emits a final drag segment to the end position
   if not already there.

### Invariants

- Overlays are pointerdown → pointerup-only. Never persist beyond.
- `pointer-state.ts` is the only owner of "current finger position"
  server-side. Browser never sends "from" coords; server tracks them.
- WS message order = source of truth. Out-of-order or dropped intermediates
  degrade smoothness, not correctness; `pointer_start` and `pointer_end`
  always fire on a real gesture and the state machine treats them as
  authoritative anchors.

### Backpressure

- **Client → server:** if WS `bufferedAmount` exceeds 100 KB, the canvas
  drops intermediate `pointer_move`s and emits only the latest before the
  next rAF tick. `pointer_start` and `pointer_end` are never dropped.
- **Server → WDA:** if `wdaClient.drag` dispatches start queueing
  (>2 in-flight), `pointer-state.ts` collapses pending segments into a
  single segment to the latest known position. WDA never sees more than
  ~3 concurrent in-flight gesture HTTP calls.

## Error handling

- **WDA 5xx mid-drag.** Log warn, drop the segment, continue with the next.
  Don't tear down the session — transient WDA errors are normal. If three
  consecutive segments fail, surface a one-time toast "input dispatching
  errors — try again", clear pointer state, leave the session alive.
- **WDA 423 (device locked).** Stop drag immediately, surface the existing
  lock toast, clear pointer state. Same handling as today's lock case for
  taps.
- **WS closes mid-drag.** `pointer-state.dispose()` runs on the existing
  `ws.once('close')` handler — drops pending segments, GCs state. Any
  currently-in-flight `wdaClient.drag` HTTP call completes naturally
  (existing 30 s axios timeout). No leaked state, no leaked timers.
- **Spike Pattern B turns out flickery.** Phase 2 branches: use Pattern A
  (W3C Actions on pointerup) plus duration cap (≤150 ms regardless of dt)
  plus optimistic canvas to mask. Branch is internal to `pointer-state.ts`;
  rest of the system doesn't need to know.
- **`/wda/tap` discovered slow in spike (>100 ms).** Phase 2 swaps to
  `/session/<sid>/actions` with a 1-frame down/up sequence for taps. Same
  external API on `pointer-state.ts`, different downstream call inside the
  router → wdaClient.
- **Backwards compatibility.** Existing `tap` / `swipe` server handlers
  stay live during the transition. Older falx-ui builds (or replay tests)
  keep working. New canvas only emits `pointer_*` messages.

## Testing

### Unit (jest, fast — required)

`test/unit/ios-pointer-state.spec.ts`:

- Tap detection — small dt + small distance → returns one `{ kind: 'tap' }`
  command on `pointer_end`, no drag segments.
- Drag with continuous moves over time → returns N drag segments, each
  starting at the previous segment's end.
- Backpressure collapse — three queued moves between cadence ticks → single
  drag segment to the latest position.
- WS close mid-drag — `dispose()` clears state, subsequent `feed()` calls
  are no-ops.
- Pattern A fallback (if implemented) — moves accumulate; one
  `{ kind: 'actions', sequence: [...] }` command emitted on `pointer_end`.
- Time-source injection — state cadence driven by message timestamps or a
  single `now()` function; no real timers in unit tests.

### Agent-side Playwright MCP self-verification (mandatory before review)

Before handing back to the user for review, the agent uses the
`mcp__playwright__browser_*` tool family to drive the running falx-ui in a
real browser against `kry-phone`. This is **agent-runtime self-verification
only** — no Playwright dep added to `package.json`, no test files checked
in.

Coverage:

- **UI flow** — navigate to falx-ui, click Use Device on kry-phone, wait
  for stream to render.
- **WS protocol** — `browser_network_requests` + `browser_evaluate` hook a
  WebSocket frame inspector to capture sent frames; confirm
  `pointer_start` / `pointer_move` / `pointer_end` fire as designed for a
  scripted tap and a scripted drag.
- **Overlay rendering** — `browser_take_screenshot` immediately after
  `pointerdown` to confirm the ring renders before any WS roundtrip; sample
  the canvas at the touch coordinate via `browser_evaluate` reading pixel
  data.
- **Backpressure behavior** — `browser_evaluate` dispatches a flood of
  synthetic pointermoves; observe WS frame count is throttled per design.
- **Tap latency** — `browser_evaluate` records `pointerdown` time;
  agent samples the canvas via repeated screenshots watching for a visible
  pixel change at the tap region; report p50 and max across N trials.
- **No regressions** — home + app_switcher gestures still emit the
  expected `intent` frame; Stop still tears down cleanly (no UI error,
  no leaked WS).

Agent's review hand-off message includes: which flows were driven, what
was observed, which assertions passed, any anomalies, and the tap-latency
numbers.

### Manual verification on kry-phone (operator subjective gate)

Final gate, only after the agent's Playwright pass is green. Conventions
follow the prior iOS Use Device slice (see the
`### Manual verification — kry-phone` section in
`docs/superpowers/specs/2026-05-18-ios-use-device-design.md`).

Checklist appended to this spec under a new
`### Manual verification — kry-phone (YYYY-MM-DD)` section at run time:

- Five apps × tap + drag fluency on the physical device (Photos, Settings,
  Safari, Maps, one third-party app the operator picks). Operator records
  subjective notes per app.
- 50-cycle leak script (the one from the prior iOS slice) re-run — confirm
  no new processes leaked from drag-state machine, no new state-retention
  on the WS lifecycle.
- Subjective gate: operator marks **"BrowserStack-grade Y/N"**, with a
  one-line note on what shifted the verdict either way.

### Acceptance order

1. Unit tests green.
2. Agent's Playwright MCP pass green; evidence in hand-off.
3. Operator manual gate green; "BrowserStack-grade Y" noted in spec.

Only after all three is the slice "ready for review" in the user's sense.

## Open questions for the plan phase

- **Spike-result branch.** Pattern A vs Pattern B is decided in Phase 1.
  The plan should structure Phase 2 tasks so the Pattern B path is the
  default and the Pattern A path is a small additional task gated on the
  spike finding. Estimate both branches when writing the plan.
- **Cadence constant.** The ~80 ms drag-segment cadence is the working
  guess. Phase 1 spike likely fine-tunes it. Plan should keep this as a
  constant in `pointer-state.ts` so it's easy to tweak post-implementation
  if the operator gate is "mostly there but not quite".
- **Tap-path swap.** Conditional on spike finding — plan a small
  contingency task ("swap `/wda/tap` for `/actions` 1-frame down/up if
  baseline > 100 ms"); don't pre-commit to it.
- **Overlay style.** Ring color, fade curve, trail point density. Cosmetic;
  pick something quiet (white-on-translucent ring, 200 ms ease-out fade,
  ~6-point trail dots) and adjust if the operator dislikes during manual
  verification.
