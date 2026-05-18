# iOS Input Responsiveness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring iOS Use Device input feel to BrowserStack-grade — live drag tracking on the physical iPhone plus optimistic canvas overlays that mask network/MJPEG latency for taps, without changing the streaming pipeline.

**Architecture:** A per-WS server-side pointer-state machine consumes streamed `pointer_start/move/end` WS messages from the canvas and dispatches chained short `/wda/dragfromtoforduration` segments to WDA (Pattern B; fallback Pattern A via one W3C Actions sequence on pointerup). The canvas additionally renders an instantaneous ring + drag-trail overlay layer on top of the MJPEG frame to decouple perceived latency from network round-trip. The Appium attach path stays untouched — gestures already bypass it.

**Tech Stack:** Node.js + TypeScript server (mocha + chai for tests), React + TypeScript client (`falx-ui/`), WDA REST over USB-forwarded port, MJPEG fan-out via the existing bridge. Spike harness in stdlib Python (matches spike 03 precedent). Agent-side verification via the Playwright MCP browser tools (`mcp__playwright__*`), no repo dep added.

**Branch:** `feat/ios-input-responsiveness`, off `main` (after `feat/ios-use-device` merges).

**Spec:** `docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md`.

---

## Phase 1 — Spike (out of tree)

The spike validates three things and decides two branch points for Phase 2:
- **Decision 1:** Pattern A (one long W3C Actions sequence on pointerup) vs Pattern B (chained short `/wda/dragfromtoforduration` every ~80ms). Default working assumption: Pattern B wins.
- **Decision 2:** Keep `/wda/tap` for taps, or swap to `/session/<sid>/actions` 1-frame down/up. Default: keep `/wda/tap`.

All spike work lives in `/tmp/falx-spike-ios-input/`. Findings file lives in the repo at `docs/spikes/04-ios-input-latency-spike.md`.

**Prerequisites (operator does once before spike):**
- `kry-phone` connected via USB, unlocked, screen on.
- `sudo ios tunnel start` running.
- WDA 12.2.2 installed (the spike-02 build is still valid).
- The existing MJPEG harness in `/tmp/falx-spike-ios/server/` is alive (boots WDA on port 8100, MJPEG on 9100 — see spike 03 §"Spike directory" notes). If not, restart per spike 02 §"How to run the harness".

---

### Task 1: Boot session + validate `/actions` endpoint at iOS points

**Files:**
- Create: `/tmp/falx-spike-ios-input/probe_actions.py`
- Create: `/tmp/falx-spike-ios-input/probe_actions.log` (via redirected output)

- [ ] **Step 1: Create the spike directory**

Run: `mkdir -p /tmp/falx-spike-ios-input/`

- [ ] **Step 2: Confirm WDA is reachable and create a bare session**

Run:
```bash
curl -s http://localhost:8100/status | head -c 200
```
Expected: JSON beginning with `{"value":{"build":...,"ready":true}` or similar. If "Connection refused" or non-ready, fix the harness per spike-02 instructions before proceeding.

- [ ] **Step 3: Write the W3C `/actions` probe script**

Write `/tmp/falx-spike-ios-input/probe_actions.py`:
```python
#!/usr/bin/env python3
"""Spike 04 — W3C /session/<sid>/actions probe at iOS points.

Validates that the W3C Actions endpoint dispatches a tap correctly on
iOS 26.4.2 against the bare-minimum WDA session. Spike 02 listed this
endpoint as broken, but spike 03 traced that to the pixel-coord units
bug. This probe sends the same payload in points.
"""
import json
import time
import urllib.request

BASE = "http://localhost:8100"
PHOTOS_X = 263.5
PHOTOS_Y = 859.5  # SpringBoard Photos icon centre, per spike 03 findings

def post(path: str, body: dict) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def delete(path: str) -> dict:
    req = urllib.request.Request(BASE + path, method="DELETE")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def main() -> int:
    print("=== Task 1: /actions probe ===")
    s = post("/session", {"capabilities": {"alwaysMatch": {"platformName": "iOS"}}})
    sid = s["value"]["sessionId"]
    print(f"sessionId={sid}")
    try:
        # W3C 1-frame tap: pointerDown at (x,y), pause 50ms, pointerUp.
        body = {
            "actions": [
                {
                    "type": "pointer",
                    "id": "finger1",
                    "parameters": {"pointerType": "touch"},
                    "actions": [
                        {"type": "pointerMove", "duration": 0, "x": PHOTOS_X, "y": PHOTOS_Y},
                        {"type": "pointerDown", "button": 0},
                        {"type": "pause", "duration": 50},
                        {"type": "pointerUp", "button": 0},
                    ],
                }
            ]
        }
        t0 = time.time()
        r = post(f"/session/{sid}/actions", body)
        dt_ms = (time.time() - t0) * 1000
        print(f"/actions returned in {dt_ms:.1f} ms: {json.dumps(r)[:200]}")
        # Observation: operator confirms Photos launched (MJPEG stream).
        time.sleep(2.0)
        # Cleanup: terminate Photos and return to SpringBoard.
        try:
            post(f"/session/{sid}/wda/apps/terminate",
                 {"bundleId": "com.apple.mobileslideshow"})
        except Exception as e:
            print(f"terminate failed (non-fatal): {e}")
        return 0
    finally:
        try:
            delete(f"/session/{sid}")
        except Exception:
            pass

if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 4: Run the probe and capture output**

Run:
```bash
cd /tmp/falx-spike-ios-input && python3 probe_actions.py | tee probe_actions.log
```
Expected: `/actions returned in <300 ms: {"value":null,...}` AND operator confirms Photos launches on the device. Record the dt in ms. If `/actions` returns 4xx/5xx, capture the error and stop — fall back to confirmed `/wda/tap` for taps in Phase 2 §Task 15.

- [ ] **Step 5: Commit nothing yet — spike output goes in Task 5's findings file. Move on.**

---

### Task 2: Pattern A trial — single long W3C Actions sequence

**Files:**
- Create: `/tmp/falx-spike-ios-input/pattern_a.py`
- Create: `/tmp/falx-spike-ios-input/pattern_a.log`

- [ ] **Step 1: Write the Pattern A probe**

Write `/tmp/falx-spike-ios-input/pattern_a.py`:
```python
#!/usr/bin/env python3
"""Spike 04 — Pattern A: single W3C Actions sequence with many moves.

Simulates a 500ms drag across the SpringBoard with ~30 intermediate
pointerMove steps in one POST. Measures dispatch time and observes the
on-device smoothness.
"""
import json
import time
import urllib.request

BASE = "http://localhost:8100"

def post(path: str, body: dict) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())

def delete(path: str) -> dict:
    req = urllib.request.Request(BASE + path, method="DELETE")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def main() -> int:
    print("=== Task 2: Pattern A ===")
    s = post("/session", {"capabilities": {"alwaysMatch": {"platformName": "iOS"}}})
    sid = s["value"]["sessionId"]
    print(f"sessionId={sid}")
    try:
        # Right-to-left swipe across home page: (380, 463) -> (40, 463) over ~500ms.
        STEPS = 30
        TOTAL_MS = 500
        STEP_MS = TOTAL_MS // STEPS  # ~16ms per step
        actions = [{"type": "pointerMove", "duration": 0, "x": 380, "y": 463},
                   {"type": "pointerDown", "button": 0}]
        for i in range(1, STEPS + 1):
            x = 380 + (40 - 380) * (i / STEPS)
            actions.append({"type": "pointerMove", "duration": STEP_MS, "x": x, "y": 463})
        actions.append({"type": "pointerUp", "button": 0})
        body = {"actions": [{"type": "pointer", "id": "finger1",
                              "parameters": {"pointerType": "touch"},
                              "actions": actions}]}
        t0 = time.time()
        r = post(f"/session/{sid}/actions", body)
        dt_ms = (time.time() - t0) * 1000
        print(f"Pattern A: {STEPS} moves over {TOTAL_MS}ms wall-target — POST returned in {dt_ms:.1f} ms")
        print(f"response: {json.dumps(r)[:200]}")
        # Reverse to restore page.
        time.sleep(1.0)
        actions_rev = [{"type": "pointerMove", "duration": 0, "x": 40, "y": 463},
                       {"type": "pointerDown", "button": 0}]
        for i in range(1, STEPS + 1):
            x = 40 + (380 - 40) * (i / STEPS)
            actions_rev.append({"type": "pointerMove", "duration": STEP_MS, "x": x, "y": 463})
        actions_rev.append({"type": "pointerUp", "button": 0})
        post(f"/session/{sid}/actions",
             {"actions": [{"type": "pointer", "id": "finger1",
                            "parameters": {"pointerType": "touch"},
                            "actions": actions_rev}]})
        return 0
    finally:
        try: delete(f"/session/{sid}")
        except Exception: pass

if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run and observe**

Run:
```bash
cd /tmp/falx-spike-ios-input && python3 pattern_a.py | tee pattern_a.log
```
Expected: POST returns after roughly `TOTAL_MS` (request blocks until WDA finishes the sequence — that's the central limitation of Pattern A). Operator watches the physical iPhone: did SpringBoard scroll smoothly from page 1 to page 2 over ~500ms? Record:
- (i) POST wall-time in ms.
- (ii) Subjective on-device smoothness: smooth / herky-jerky / didn't move.
- (iii) Any artifacts (mid-flight cancel, finger-lift glitch).

- [ ] **Step 3: Note observations in head; will be recorded in Task 5.**

---

### Task 3: Pattern B trial — chained short `/dragfromtoforduration` segments

**Files:**
- Create: `/tmp/falx-spike-ios-input/pattern_b.py`
- Create: `/tmp/falx-spike-ios-input/pattern_b.log`

- [ ] **Step 1: Write the Pattern B probe**

Write `/tmp/falx-spike-ios-input/pattern_b.py`:
```python
#!/usr/bin/env python3
"""Spike 04 — Pattern B: chained short /wda/dragfromtoforduration calls.

Simulates a streaming-pointer drag where each segment is a 80ms drag
from the previous end to the current target. Six segments of ~57 px
each move across the home page in ~500ms wall time.
"""
import json
import time
import urllib.request

BASE = "http://localhost:8100"

def post(path: str, body: dict) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def delete(path: str) -> dict:
    req = urllib.request.Request(BASE + path, method="DELETE")
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def main() -> int:
    print("=== Task 3: Pattern B ===")
    s = post("/session", {"capabilities": {"alwaysMatch": {"platformName": "iOS"}}})
    sid = s["value"]["sessionId"]
    print(f"sessionId={sid}")
    try:
        # 6 segments of 80ms each, marching (380 -> 40) across y=463.
        SEGMENTS = 6
        SEG_MS = 80
        START_X, END_X, Y = 380.0, 40.0, 463.0
        seg_dx = (END_X - START_X) / SEGMENTS
        prev_x = START_X
        seg_dts = []
        run_t0 = time.time()
        for i in range(1, SEGMENTS + 1):
            next_x = START_X + seg_dx * i
            t0 = time.time()
            post(f"/session/{sid}/wda/dragfromtoforduration",
                 {"fromX": prev_x, "fromY": Y, "toX": next_x, "toY": Y,
                  "duration": SEG_MS / 1000.0})
            seg_dts.append((time.time() - t0) * 1000)
            prev_x = next_x
        total_ms = (time.time() - run_t0) * 1000
        print(f"Pattern B: {SEGMENTS} segments — per-segment dt ms: {[f'{d:.1f}' for d in seg_dts]}")
        print(f"Pattern B: total wall time {total_ms:.1f} ms (target: ~{SEGMENTS * SEG_MS}ms)")
        time.sleep(1.5)  # let operator observe before restore
        # Restore — single drag back.
        post(f"/session/{sid}/wda/dragfromtoforduration",
             {"fromX": END_X, "fromY": Y, "toX": START_X, "toY": Y, "duration": 0.3})
        return 0
    finally:
        try: delete(f"/session/{sid}")
        except Exception: pass

if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Run and observe**

Run:
```bash
cd /tmp/falx-spike-ios-input && python3 pattern_b.py | tee pattern_b.log
```
Expected: per-segment dt close to `SEG_MS` (each call blocks until WDA finishes that segment). Operator watches the physical iPhone: did the drag scroll smoothly across all six segments, or was there visible finger-lift flicker between segments? Record:
- (i) Per-segment dt list.
- (ii) Subjective on-device smoothness vs Pattern A.
- (iii) Specifically: any flicker / discontinuity between segments.

- [ ] **Step 3: Note observations; will be recorded in Task 5.**

---

### Task 4: Tap-latency baseline

**Files:**
- Create: `/tmp/falx-spike-ios-input/tap_baseline.py`
- Create: `/tmp/falx-spike-ios-input/tap_baseline.log`

- [ ] **Step 1: Write the tap-baseline probe**

Write `/tmp/falx-spike-ios-input/tap_baseline.py`:
```python
#!/usr/bin/env python3
"""Spike 04 — Tap latency baseline.

Measures end-to-end tap latency: from POST /wda/tap dispatch to the
first MJPEG frame whose content has changed enough to indicate the
visual response. Five trials. Outputs p50, max.

Compares two channels:
- /wda/tap (current production)
- /session/<sid>/actions (1-frame down/up)
"""
import hashlib
import json
import time
import urllib.request

BASE = "http://localhost:8100"
MJPEG_URL = "http://localhost:9100"  # adjust if harness uses different port
TAP_X, TAP_Y = 263.5, 859.5  # Photos icon

def post(path: str, body: dict) -> dict:
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())

def delete(path: str):
    req = urllib.request.Request(BASE + path, method="DELETE")
    with urllib.request.urlopen(req, timeout=10) as r:
        r.read()

def read_one_frame(stream) -> bytes:
    """Read one JPEG frame from the multipart MJPEG stream."""
    data = b""
    while b"\xff\xd8" not in data:
        data += stream.read(4096)
    start = data.index(b"\xff\xd8")
    data = data[start:]
    while b"\xff\xd9" not in data:
        data += stream.read(4096)
    end = data.index(b"\xff\xd9") + 2
    return data[:end]

def measure_one(channel: str, sid: str) -> float:
    """Returns latency in ms from POST issued to visible-change frame."""
    stream = urllib.request.urlopen(MJPEG_URL, timeout=10)
    baseline = read_one_frame(stream)
    baseline_hash = hashlib.md5(baseline).hexdigest()
    t0 = time.time()
    if channel == "tap":
        post(f"/session/{sid}/wda/tap", {"x": TAP_X, "y": TAP_Y})
    elif channel == "actions":
        post(f"/session/{sid}/actions", {
            "actions": [{
                "type": "pointer", "id": "finger1",
                "parameters": {"pointerType": "touch"},
                "actions": [
                    {"type": "pointerMove", "duration": 0, "x": TAP_X, "y": TAP_Y},
                    {"type": "pointerDown", "button": 0},
                    {"type": "pause", "duration": 30},
                    {"type": "pointerUp", "button": 0},
                ],
            }]
        })
    # Read frames until one differs from baseline (Photos icon highlights / app launches).
    for _ in range(120):  # cap at ~6s
        frame = read_one_frame(stream)
        if hashlib.md5(frame).hexdigest() != baseline_hash:
            return (time.time() - t0) * 1000
    return float("inf")

def main() -> int:
    print("=== Task 4: Tap latency baseline ===")
    s = post("/session", {"capabilities": {"alwaysMatch": {"platformName": "iOS"}}})
    sid = s["value"]["sessionId"]
    print(f"sessionId={sid}")
    try:
        for channel in ("tap", "actions"):
            results = []
            for trial in range(5):
                ms = measure_one(channel, sid)
                results.append(ms)
                # Cleanup: terminate Photos, return to SpringBoard.
                try:
                    post(f"/session/{sid}/wda/apps/terminate",
                         {"bundleId": "com.apple.mobileslideshow"})
                    time.sleep(0.6)  # let SpringBoard settle
                except Exception as e:
                    print(f"cleanup trial {trial} failed: {e}")
                    time.sleep(1.0)
            results_sorted = sorted(results)
            p50 = results_sorted[len(results) // 2]
            mx = max(results)
            print(f"channel={channel}  trials={[f'{r:.0f}' for r in results]}  p50={p50:.0f}ms  max={mx:.0f}ms")
        return 0
    finally:
        try: delete(f"/session/{sid}")
        except Exception: pass

if __name__ == "__main__":
    raise SystemExit(main())
```

- [ ] **Step 2: Confirm MJPEG port**

Run:
```bash
grep -E "(mjpegServerPort|9100|MJPEG)" /tmp/falx-spike-ios/server/*.* 2>/dev/null | head -5
```
Expected: shows the harness's actual MJPEG port. If it's not 9100, edit `MJPEG_URL` in `tap_baseline.py` accordingly.

- [ ] **Step 3: Run the baseline**

Run:
```bash
cd /tmp/falx-spike-ios-input && python3 tap_baseline.py | tee tap_baseline.log
```
Expected: two output lines showing p50 and max for both channels. Sanity: p50 should be in the 80–300 ms range. If "inf" appears, the frame-diff detection is too strict or Photos didn't actually launch — eyeball Photos launching, retry.

- [ ] **Step 4: Note observations; will be recorded in Task 5.**

---

### Task 5: Write spike findings + decide Phase-2 branches

**Files:**
- Create: `docs/spikes/04-ios-input-latency-spike.md`

- [ ] **Step 1: Write the findings file**

Write `docs/spikes/04-ios-input-latency-spike.md` with this structure (fill in the numeric and observational results gathered in Tasks 1–4):

```markdown
# Spike 04 — iOS input latency + live-drag patterns

**Time box:** 2-3 hours.
**Spike directory:** `/tmp/falx-spike-ios-input/` (NOT in the Falx repo).
**Status:** done.
**Date:** YYYY-MM-DD.
**Device:** kry-phone (iPhone 12 Pro Max, iOS 26.4.2, UDID 00008101-001A408E2EB9001E).
**Picks up from:** spike 03 (tap-dispatch validation) and the iOS Use Device slice (`docs/superpowers/specs/2026-05-18-ios-use-device-design.md`).

## Why this spike exists

The iOS Use Device slice shipped working but with two known gaps. The
input gap (Issue B in `docs/superpowers/discovery/2026-05-18-ios-quality-followup-seed.md`)
needs two architectural decisions before implementation can start:

- **Decision 1:** Live-drag dispatch pattern. Pattern A (single W3C
  Actions sequence at pointerup) vs Pattern B (chained short
  `/dragfromtoforduration` segments every ~80 ms).
- **Decision 2:** Whether to keep `/wda/tap` or swap to W3C
  `/session/<sid>/actions` for taps, based on which is faster
  end-to-end.

## Findings

### Task 1 — `/actions` endpoint at iOS points

- POST `/actions` for a 1-frame tap returned in **<FILL IN ms>**.
- Photos launched on the device: **YES / NO**.
- Verdict: `/session/<sid>/actions` is **WORKING / BROKEN** on iOS 26.4.2
  with bare WDA session. (Confirms / refutes the spike-02 "broken"
  finding as a units bug.)

### Task 2 — Pattern A (single long W3C Actions sequence)

- POST returned in **<FILL IN ms>** for a ~500 ms 30-step drag.
- On-device smoothness: **<FILL IN: smooth / herky-jerky / didn't move>**.
- Notable: <FILL IN observations>.

### Task 3 — Pattern B (chained short `/dragfromtoforduration`)

- Per-segment dt: **<FILL IN list>**.
- Total wall time: **<FILL IN ms>** (target ~480 ms).
- On-device smoothness: **<FILL IN>**.
- Finger-lift flicker between segments: **<YES / NO / SUBTLE>**.

### Task 4 — Tap latency baseline

| Channel | Trials (ms) | p50 (ms) | Max (ms) |
|---|---|---|---|
| `/wda/tap` | <FILL IN> | <FILL IN> | <FILL IN> |
| `/actions` 1-frame | <FILL IN> | <FILL IN> | <FILL IN> |

## Decisions

- **Decision 1 (live-drag pattern):** Adopt **Pattern A / Pattern B**.
  Rationale: <one line, e.g. "Pattern B was visually smooth with no
  perceptible flicker between segments and lets the server react to
  mid-drag direction changes; Pattern A blocks the POST for the full
  drag duration which makes live drag impossible.">.

- **Decision 2 (tap channel):** Keep `/wda/tap` / Swap to `/actions`
  1-frame down/up. Rationale: <one line based on p50 comparison —
  default: keep /wda/tap unless /actions p50 is materially lower
  (≥40 ms improvement)>.

## Open questions for the plan phase

- Optimal cadence for Pattern B segments: spike used 80 ms; tune in
  manual verification if drag feels gappy or over-busy.
- Tap latency is currently dominated by <HTTP RTT / WDA dispatch /
  MJPEG observation> — note for post-implementation re-measurement.
```

- [ ] **Step 2: Fill in the bracketed `<FILL IN>` values from Tasks 1–4 logs**

The values come from the `.log` files in `/tmp/falx-spike-ios-input/` and from the operator's observations. Every `<FILL IN>` must become a concrete value before this step is done.

- [ ] **Step 3: Confirm the spec's Phase-2 task structure matches the decisions**

Re-read the spec's §"Approach (chosen)" and §"Component map". If Decision 1 picked Pattern A, Phase-2 Task 14 (Pattern A branch) becomes required and Task 10's drag-segment logic becomes a thin "accumulate moves" helper. If Decision 2 picked /actions for taps, Phase-2 Task 15 is required. Note the active-vs-conditional status at the top of `docs/spikes/04-ios-input-latency-spike.md` for the executor.

- [ ] **Step 4: Commit**

```bash
git add docs/spikes/04-ios-input-latency-spike.md
git commit -m "spike(ios-input): validate W3C actions, live-drag patterns, tap latency baseline"
```

---

## Phase 2 — Implementation

All Phase 2 tasks run on branch `feat/ios-input-responsiveness`. Default ordering assumes Pattern B (default). Pattern A and /actions tap-channel branches are flagged conditional and gated on Task 5's decisions.

### Task 6: Optimistic overlay renderer (TDD, pure functions)

**Files:**
- Create: `falx-ui/src/pages/UseDevice/overlay-renderer.ts`
- Create: `falx-ui/src/pages/UseDevice/overlay-renderer.spec.ts`

This module owns ring and trail drawing. Pure functions taking a `CanvasRenderingContext2D` + state, no React, no DOM lookups. Testable with a fake context that records calls.

- [ ] **Step 1: Write the failing tests**

Write `falx-ui/src/pages/UseDevice/overlay-renderer.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { drawRing, drawTrail, ringIsExpired, trimTrail } from './overlay-renderer';

interface CallRecord { method: string; args: unknown[]; }

function fakeCtx(): { ctx: CanvasRenderingContext2D; calls: CallRecord[] } {
  const calls: CallRecord[] = [];
  const proxy = new Proxy({} as Record<string, unknown>, {
    get(target, prop) {
      if (prop in target) return target[prop as string];
      const value = (...args: unknown[]) => {
        calls.push({ method: String(prop), args });
        return undefined;
      };
      target[prop as string] = value;
      return value;
    },
    set(target, prop, value) {
      target[prop as string] = value;
      calls.push({ method: `set:${String(prop)}`, args: [value] });
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx: proxy, calls };
}

describe('overlay-renderer', () => {
  describe('drawRing', () => {
    it('draws an arc at the touch point with age-based alpha', () => {
      const { ctx, calls } = fakeCtx();
      drawRing(ctx, { x: 100, y: 200, ageMs: 0, lifetimeMs: 200 });
      const arc = calls.find((c) => c.method === 'arc');
      expect(arc).toBeTruthy();
      expect(arc!.args[0]).toBe(100);
      expect(arc!.args[1]).toBe(200);
      // alpha must be set somewhere; at age 0 it should be high
      const alphaSet = calls.find((c) => c.method === 'set:globalAlpha');
      expect(alphaSet).toBeTruthy();
      expect(Number(alphaSet!.args[0])).toBeGreaterThan(0.5);
    });

    it('fades to lower alpha as age approaches lifetime', () => {
      const { ctx, calls } = fakeCtx();
      drawRing(ctx, { x: 100, y: 200, ageMs: 180, lifetimeMs: 200 });
      const alphaSet = calls.find((c) => c.method === 'set:globalAlpha');
      expect(Number(alphaSet!.args[0])).toBeLessThan(0.3);
    });
  });

  describe('ringIsExpired', () => {
    it('returns true when ageMs >= lifetimeMs', () => {
      expect(ringIsExpired(200, 200)).toBe(true);
      expect(ringIsExpired(250, 200)).toBe(true);
    });
    it('returns false when ageMs < lifetimeMs', () => {
      expect(ringIsExpired(199, 200)).toBe(false);
      expect(ringIsExpired(0, 200)).toBe(false);
    });
  });

  describe('drawTrail', () => {
    it('draws a polyline through provided points', () => {
      const { ctx, calls } = fakeCtx();
      drawTrail(ctx, [
        { x: 10, y: 10, ageMs: 0 },
        { x: 20, y: 30, ageMs: 16 },
        { x: 40, y: 60, ageMs: 32 },
      ], 200);
      expect(calls.find((c) => c.method === 'beginPath')).toBeTruthy();
      const moveTo = calls.find((c) => c.method === 'moveTo');
      expect(moveTo!.args).toEqual([10, 10]);
      const lineTos = calls.filter((c) => c.method === 'lineTo');
      expect(lineTos.length).toBe(2);
      expect(lineTos[0].args).toEqual([20, 30]);
      expect(lineTos[1].args).toEqual([40, 60]);
      expect(calls.find((c) => c.method === 'stroke')).toBeTruthy();
    });

    it('renders nothing for fewer than 2 points', () => {
      const { ctx, calls } = fakeCtx();
      drawTrail(ctx, [{ x: 10, y: 10, ageMs: 0 }], 200);
      expect(calls.find((c) => c.method === 'stroke')).toBeUndefined();
    });
  });

  describe('trimTrail', () => {
    it('removes points older than maxAgeMs', () => {
      const points = [
        { x: 1, y: 1, ageMs: 250 },
        { x: 2, y: 2, ageMs: 100 },
        { x: 3, y: 3, ageMs: 0 },
      ];
      expect(trimTrail(points, 200)).toEqual([
        { x: 2, y: 2, ageMs: 100 },
        { x: 3, y: 3, ageMs: 0 },
      ]);
    });
  });
});
```

- [ ] **Step 2: Confirm the test runner**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && cat package.json | grep -E "(vitest|test\")" | head
```
Expected: a `"test"` script that invokes `vitest`. If `vitest` isn't installed in `falx-ui/`, this plan deviates — STOP and ask the user. (`falx-ui/` is independent of the server's mocha setup.)

- [ ] **Step 3: Run the test, confirm it fails with "Cannot find module"**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx vitest run src/pages/UseDevice/overlay-renderer.spec.ts
```
Expected: FAIL — module './overlay-renderer' not found.

- [ ] **Step 4: Implement the renderer**

Write `falx-ui/src/pages/UseDevice/overlay-renderer.ts`:
```typescript
export interface RingState {
  x: number;          // canvas pixel coords
  y: number;
  ageMs: number;      // ms since pointerdown
  lifetimeMs: number; // total fade duration
}

export interface TrailPoint {
  x: number;          // canvas pixel coords
  y: number;
  ageMs: number;      // ms since the move event
}

const RING_RADIUS_PX = 36;
const RING_LINE_WIDTH = 3;
const RING_COLOR = '#ffffff';
const TRAIL_LINE_WIDTH = 4;
const TRAIL_COLOR = '#ffffff';

export function drawRing(ctx: CanvasRenderingContext2D, state: RingState): void {
  const t = Math.min(1, state.ageMs / state.lifetimeMs);
  // Ease-out alpha from 0.85 -> 0.0.
  const alpha = 0.85 * (1 - t * t);
  const radius = RING_RADIUS_PX * (1 + t * 0.4);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = RING_COLOR;
  ctx.lineWidth = RING_LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(state.x, state.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function ringIsExpired(ageMs: number, lifetimeMs: number): boolean {
  return ageMs >= lifetimeMs;
}

export function drawTrail(
  ctx: CanvasRenderingContext2D,
  points: TrailPoint[],
  maxAgeMs: number,
): void {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = TRAIL_COLOR;
  ctx.lineWidth = TRAIL_LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  // Use the most recent point's age for the polyline alpha (cheap; per-segment
  // alpha would add complexity for marginal visual gain).
  const newest = Math.min(...points.map((p) => p.ageMs));
  const t = Math.min(1, newest / maxAgeMs);
  ctx.globalAlpha = 0.7 * (1 - t);
  ctx.stroke();
  ctx.restore();
}

export function trimTrail(points: TrailPoint[], maxAgeMs: number): TrailPoint[] {
  return points.filter((p) => p.ageMs <= maxAgeMs);
}
```

- [ ] **Step 5: Run the tests, confirm they pass**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx vitest run src/pages/UseDevice/overlay-renderer.spec.ts
```
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add falx-ui/src/pages/UseDevice/overlay-renderer.ts falx-ui/src/pages/UseDevice/overlay-renderer.spec.ts
git commit -m "feat(falx-ui): add iOS canvas overlay renderer (ring + trail)"
```

---

### Task 7: Wire overlay renderer into IOSStreamCanvas

**Files:**
- Modify: `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`

- [ ] **Step 1: Import the renderer and add overlay state**

Edit `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`. At the top after the existing imports, add:
```typescript
import {
  drawRing,
  drawTrail,
  ringIsExpired,
  trimTrail,
  type RingState,
  type TrailPoint,
} from './overlay-renderer';

const RING_LIFETIME_MS = 220;
const TRAIL_MAX_AGE_MS = 280;
```

- [ ] **Step 2: Add overlay-state refs inside the component**

Inside `IOSStreamCanvas(props)` (immediately after `const pointerStart = useRef<...>(null);`), add:
```typescript
const ringRef = useRef<{ x: number; y: number; tStartMs: number } | null>(null);
const trailRef = useRef<{ x: number; y: number; tMs: number }[]>([]);
const overlayRafRef = useRef<number | null>(null);
```

- [ ] **Step 3: Add an overlay render-loop helper**

Inside the component, before `useEffect` that connects WS, add:
```typescript
function renderOverlays() {
  const c = canvasRef.current;
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  const now = performance.now();
  const ring = ringRef.current;
  const trail = trailRef.current;
  // Re-draw the most recent MJPEG frame so overlays don't accumulate.
  // (The MJPEG handler already draws each frame as it arrives; overlays
  // are layered on top in the same frame loop.)
  if (ring) {
    const ageMs = now - ring.tStartMs;
    if (ringIsExpired(ageMs, RING_LIFETIME_MS)) {
      ringRef.current = null;
    } else {
      const state: RingState = { x: ring.x, y: ring.y, ageMs, lifetimeMs: RING_LIFETIME_MS };
      drawRing(ctx, state);
    }
  }
  if (trail.length > 0) {
    const aged: TrailPoint[] = trail.map((p) => ({ x: p.x, y: p.y, ageMs: now - p.tMs }));
    const kept = trimTrail(aged, TRAIL_MAX_AGE_MS);
    trailRef.current = trail.filter((_, i) => aged[i].ageMs <= TRAIL_MAX_AGE_MS);
    drawTrail(ctx, kept, TRAIL_MAX_AGE_MS);
  }
  // Continue the loop while there's anything to draw.
  if (ringRef.current || trailRef.current.length > 0) {
    overlayRafRef.current = requestAnimationFrame(renderOverlays);
  } else {
    overlayRafRef.current = null;
  }
}

function startOverlayLoop() {
  if (overlayRafRef.current == null) {
    overlayRafRef.current = requestAnimationFrame(renderOverlays);
  }
}
```

- [ ] **Step 4: Update `clientToPoints` to also expose canvas pixel coords**

Replace `clientToPoints` with a helper that returns both spaces:
```typescript
function clientToCanvasAndPoints(e: React.PointerEvent<HTMLCanvasElement>): {
  px: number; py: number; x: number; y: number;
} {
  const c = canvasRef.current;
  if (!c) return { px: 0, py: 0, x: 0, y: 0 };
  const rect = c.getBoundingClientRect();
  const relX = (e.clientX - rect.left) / rect.width;
  const relY = (e.clientY - rect.top) / rect.height;
  const rawX = relX * dims.widthPoints;
  const rawY = relY * dims.heightPoints;
  return {
    px: Math.max(0, Math.min(c.width, relX * c.width)),
    py: Math.max(0, Math.min(c.height, relY * c.height)),
    x: Math.max(0, Math.min(dims.widthPoints, rawX)),
    y: Math.max(0, Math.min(dims.heightPoints, rawY)),
  };
}
```

Search for the old `clientToPoints(e)` call sites in `onPointerDown` / `onPointerUp` and replace with `clientToCanvasAndPoints(e)`, destructuring `{ x, y }` (the points-space coords stay used the same way; the pixel coords feed the overlay refs).

- [ ] **Step 5: Update `onPointerDown` to seed the ring + start the overlay loop**

Replace `onPointerDown`:
```typescript
function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
  (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  const p = clientToCanvasAndPoints(e);
  pointerStart.current = { x: p.x, y: p.y, t: performance.now() };
  ringRef.current = { x: p.px, y: p.py, tStartMs: performance.now() };
  trailRef.current = [{ x: p.px, y: p.py, tMs: performance.now() }];
  startOverlayLoop();
  e.preventDefault();
}
```

- [ ] **Step 6: Add an `onPointerMove` handler that appends trail points**

Inside the component, add a `pointerMoveRaf` ref and the handler:
```typescript
const lastMoveEmitRef = useRef<number>(0);
function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
  if (!pointerStart.current) return;
  const p = clientToCanvasAndPoints(e);
  const now = performance.now();
  trailRef.current.push({ x: p.px, y: p.py, tMs: now });
  if (trailRef.current.length > 64) trailRef.current.shift();
  startOverlayLoop();
  // Wire-protocol emission added in Task 13.
  lastMoveEmitRef.current = now;
  e.preventDefault();
}
```

- [ ] **Step 7: Clear ring + trail in `onPointerUp` and `onPointerCancel`**

In `onPointerUp`, immediately after the existing `pointerStart.current = null;` line, add:
```typescript
trailRef.current = [];
// ring continues to fade naturally; overlay loop expires it
```

In `onPointerCancel`, after `pointerStart.current = null;`, add:
```typescript
trailRef.current = [];
ringRef.current = null;
```

- [ ] **Step 8: Attach `onPointerMove` to the canvas**

In the JSX, on the `<canvas>` element, add `onPointerMove={onPointerMove}` next to the existing `onPointerDown` / `onPointerUp` / `onPointerCancel`.

- [ ] **Step 9: Cancel the overlay rAF on unmount**

In the existing `useEffect` that returns a cleanup (WS-connection effect), modify the cleanup to also cancel any in-flight overlay rAF:
```typescript
return () => {
  ws.close();
  wsRef.current = null;
  if (overlayRafRef.current != null) {
    cancelAnimationFrame(overlayRafRef.current);
    overlayRafRef.current = null;
  }
};
```

- [ ] **Step 10: Type-check the change**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx tsc --noEmit
```
Expected: no errors. If errors, fix the types they call out.

- [ ] **Step 11: Commit**

```bash
git add falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx
git commit -m "feat(falx-ui): render optimistic ring + drag trail overlays on iOS canvas"
```

---

### Task 8: Add `pointer_*` WS message types + framing codecs

**Files:**
- Modify: `src/device-stream/types.ts`
- Modify: `src/device-stream/ios/framing.ts`
- Modify: `test/unit/device-stream-ios-framing.spec.ts`

- [ ] **Step 1: Write failing tests for the new decoders**

Edit `test/unit/device-stream-ios-framing.spec.ts`. Add to the top-level import:
```typescript
import {
  CLIENT_POINTER_START_TAG,
  CLIENT_POINTER_MOVE_TAG,
  CLIENT_POINTER_END_TAG,
} from '../../src/device-stream/types';
```

Inside the existing `describe('decodeIosClientMessage', () => {` block, before the closing `});`, add:
```typescript
it('decodes a pointer_start message', () => {
  const buf = Buffer.alloc(1 + 16);
  buf[0] = CLIENT_POINTER_START_TAG;
  buf.writeFloatBE(123.5, 1);
  buf.writeFloatBE(456.25, 5);
  buf.writeDoubleBE(1737000000000.5, 9);
  expect(decodeIosClientMessage(buf)).to.deep.equal({
    kind: 'pointer_start',
    x: 123.5,
    y: 456.25,
    t: 1737000000000.5,
  });
});

it('decodes a pointer_move message', () => {
  const buf = Buffer.alloc(1 + 16);
  buf[0] = CLIENT_POINTER_MOVE_TAG;
  buf.writeFloatBE(200, 1);
  buf.writeFloatBE(300, 5);
  buf.writeDoubleBE(1737000000050.0, 9);
  expect(decodeIosClientMessage(buf)).to.deep.equal({
    kind: 'pointer_move',
    x: 200,
    y: 300,
    t: 1737000000050,
  });
});

it('decodes a pointer_end (drag) message', () => {
  const buf = Buffer.alloc(1 + 17);
  buf[0] = CLIENT_POINTER_END_TAG;
  buf.writeFloatBE(40, 1);
  buf.writeFloatBE(500, 5);
  buf.writeDoubleBE(1737000000300.0, 9);
  buf.writeUInt8(0, 17); // wasTap = false
  expect(decodeIosClientMessage(buf)).to.deep.equal({
    kind: 'pointer_end',
    x: 40,
    y: 500,
    t: 1737000000300,
    wasTap: false,
  });
});

it('decodes a pointer_end (tap) message', () => {
  const buf = Buffer.alloc(1 + 17);
  buf[0] = CLIENT_POINTER_END_TAG;
  buf.writeFloatBE(100, 1);
  buf.writeFloatBE(100, 5);
  buf.writeDoubleBE(1737000000010.0, 9);
  buf.writeUInt8(1, 17); // wasTap = true
  expect(decodeIosClientMessage(buf)).to.deep.equal({
    kind: 'pointer_end',
    x: 100,
    y: 100,
    t: 1737000000010,
    wasTap: true,
  });
});
```

- [ ] **Step 2: Run the tests, confirm they fail**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-framing.spec.ts --exit --timeout=20000
```
Expected: FAIL — undefined imports `CLIENT_POINTER_START_TAG` etc.

- [ ] **Step 3: Add the tags + message types**

Edit `src/device-stream/types.ts`. Add after the existing `CLIENT_INTENT_TAG = 0x22;` line:
```typescript
/** Client → server WS message tags (iOS) — streaming pointer (Spike 04, slice 2026-05). */
export const CLIENT_POINTER_START_TAG = 0x23;
export const CLIENT_POINTER_MOVE_TAG = 0x24;
export const CLIENT_POINTER_END_TAG = 0x25;
```

Add new message-type interfaces after the existing `IosIntentMessage` interface:
```typescript
export interface IosPointerStartMessage {
  kind: 'pointer_start';
  x: number;
  y: number;
  t: number; // client performance.now() at pointerdown
}

export interface IosPointerMoveMessage {
  kind: 'pointer_move';
  x: number;
  y: number;
  t: number;
}

export interface IosPointerEndMessage {
  kind: 'pointer_end';
  x: number;
  y: number;
  t: number;
  wasTap: boolean;
}
```

Update the `IosClientMessage` union:
```typescript
export type IosClientMessage =
  | IosTapMessage
  | IosSwipeMessage
  | IosIntentMessage
  | IosPointerStartMessage
  | IosPointerMoveMessage
  | IosPointerEndMessage;
```

- [ ] **Step 4: Extend the decoder**

Edit `src/device-stream/ios/framing.ts`. Update the imports at the top:
```typescript
import {
  SRV_TAG_META,
  SRV_TAG_FRAME,
  CLIENT_TAP_TAG,
  CLIENT_SWIPE_TAG,
  CLIENT_INTENT_TAG,
  INTENT_HOME,
  INTENT_APP_SWITCHER,
  CLIENT_POINTER_START_TAG,
  CLIENT_POINTER_MOVE_TAG,
  CLIENT_POINTER_END_TAG,
} from '../types';
```

Inside `decodeIosClientMessage`, before the final `return null;`, add:
```typescript
  if (tag === CLIENT_POINTER_START_TAG) {
    if (buf.length < 1 + 16) return null;
    return {
      kind: 'pointer_start',
      x: buf.readFloatBE(1),
      y: buf.readFloatBE(5),
      t: buf.readDoubleBE(9),
    };
  }

  if (tag === CLIENT_POINTER_MOVE_TAG) {
    if (buf.length < 1 + 16) return null;
    return {
      kind: 'pointer_move',
      x: buf.readFloatBE(1),
      y: buf.readFloatBE(5),
      t: buf.readDoubleBE(9),
    };
  }

  if (tag === CLIENT_POINTER_END_TAG) {
    if (buf.length < 1 + 17) return null;
    return {
      kind: 'pointer_end',
      x: buf.readFloatBE(1),
      y: buf.readFloatBE(5),
      t: buf.readDoubleBE(9),
      wasTap: buf.readUInt8(17) === 1,
    };
  }
```

- [ ] **Step 5: Run the tests, confirm they pass**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-framing.spec.ts --exit --timeout=20000
```
Expected: all tests pass (existing + new).

- [ ] **Step 6: Commit**

```bash
git add src/device-stream/types.ts src/device-stream/ios/framing.ts test/unit/device-stream-ios-framing.spec.ts
git commit -m "feat(device-stream/ios): add pointer_start/move/end WS message types + decoders"
```

---

### Task 9: TDD `pointer-state.ts` — tap detection

**Files:**
- Create: `src/device-stream/ios/pointer-state.ts`
- Create: `test/unit/device-stream-ios-pointer-state.spec.ts`

This is the pure-logic state machine. The plan splits it across three TDD tasks (9, 10, 11) for clarity; each adds one capability.

- [ ] **Step 1: Write failing tests for tap detection**

Write `test/unit/device-stream-ios-pointer-state.spec.ts`:
```typescript
import { expect } from 'chai';
import { PointerState } from '../../src/device-stream/ios/pointer-state';

describe('PointerState', () => {
  describe('tap detection', () => {
    it('emits one tap command on pointer_end{wasTap:true}', () => {
      const ps = new PointerState();
      const cmds1 = ps.feed({ kind: 'pointer_start', x: 100, y: 200, t: 0 });
      expect(cmds1).to.deep.equal([]);
      const cmds2 = ps.feed({
        kind: 'pointer_end', x: 100, y: 200, t: 50, wasTap: true,
      });
      expect(cmds2).to.deep.equal([{ kind: 'tap', x: 100, y: 200 }]);
    });

    it('emits no drag segments for a tap (no pointer_move messages)', () => {
      const ps = new PointerState();
      ps.feed({ kind: 'pointer_start', x: 50, y: 50, t: 0 });
      const cmds = ps.feed({
        kind: 'pointer_end', x: 50, y: 50, t: 80, wasTap: true,
      });
      const drags = cmds.filter((c) => c.kind === 'drag');
      expect(drags).to.deep.equal([]);
    });

    it('ignores pointer_move before pointer_start', () => {
      const ps = new PointerState();
      const cmds = ps.feed({ kind: 'pointer_move', x: 100, y: 100, t: 0 });
      expect(cmds).to.deep.equal([]);
    });

    it('ignores pointer_end before pointer_start', () => {
      const ps = new PointerState();
      const cmds = ps.feed({
        kind: 'pointer_end', x: 100, y: 100, t: 0, wasTap: true,
      });
      expect(cmds).to.deep.equal([]);
    });
  });
});
```

- [ ] **Step 2: Run the tests, confirm they fail**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-pointer-state.spec.ts --exit --timeout=20000
```
Expected: FAIL — cannot find module './src/device-stream/ios/pointer-state'.

- [ ] **Step 3: Implement the minimal state machine**

Write `src/device-stream/ios/pointer-state.ts`:
```typescript
import type {
  IosClientMessage,
  IosPointerStartMessage,
  IosPointerMoveMessage,
  IosPointerEndMessage,
} from '../types';

export type PointerCommand =
  | { kind: 'tap'; x: number; y: number }
  | { kind: 'drag'; x1: number; y1: number; x2: number; y2: number; durationMs: number };

type PointerMsg =
  | IosPointerStartMessage
  | IosPointerMoveMessage
  | IosPointerEndMessage;

export class PointerState {
  private active = false;
  private lastSentPos: { x: number; y: number } | null = null;
  private lastSentTime: number | null = null;

  feed(msg: IosClientMessage): PointerCommand[] {
    if (!isPointerMsg(msg)) return [];

    if (msg.kind === 'pointer_start') {
      this.active = true;
      this.lastSentPos = { x: msg.x, y: msg.y };
      this.lastSentTime = msg.t;
      return [];
    }

    if (!this.active) return [];

    if (msg.kind === 'pointer_move') {
      // Drag-segment emission added in Task 10; tap-only at this step.
      return [];
    }

    // pointer_end
    const cmds: PointerCommand[] = [];
    if (msg.wasTap) {
      cmds.push({ kind: 'tap', x: msg.x, y: msg.y });
    }
    this.active = false;
    this.lastSentPos = null;
    this.lastSentTime = null;
    return cmds;
  }

  dispose(): void {
    this.active = false;
    this.lastSentPos = null;
    this.lastSentTime = null;
  }
}

function isPointerMsg(msg: IosClientMessage): msg is PointerMsg {
  return (
    msg.kind === 'pointer_start' ||
    msg.kind === 'pointer_move' ||
    msg.kind === 'pointer_end'
  );
}
```

- [ ] **Step 4: Run the tests, confirm they pass**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-pointer-state.spec.ts --exit --timeout=20000
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/ios/pointer-state.ts test/unit/device-stream-ios-pointer-state.spec.ts
git commit -m "feat(device-stream/ios): add PointerState with tap-detection logic"
```

---

### Task 10: TDD `pointer-state.ts` — drag segment cadence

**Files:**
- Modify: `src/device-stream/ios/pointer-state.ts`
- Modify: `test/unit/device-stream-ios-pointer-state.spec.ts`

- [ ] **Step 1: Write failing tests for drag-segment emission**

Append to `test/unit/device-stream-ios-pointer-state.spec.ts`, before the final `});`:
```typescript
  describe('drag segments', () => {
    it('emits no segment if elapsed since last sent < cadence', () => {
      const ps = new PointerState({ segmentCadenceMs: 80 });
      ps.feed({ kind: 'pointer_start', x: 100, y: 100, t: 0 });
      const cmds = ps.feed({ kind: 'pointer_move', x: 120, y: 100, t: 30 });
      expect(cmds).to.deep.equal([]);
    });

    it('emits a segment when elapsed >= cadence', () => {
      const ps = new PointerState({ segmentCadenceMs: 80 });
      ps.feed({ kind: 'pointer_start', x: 100, y: 100, t: 0 });
      const cmds = ps.feed({ kind: 'pointer_move', x: 200, y: 150, t: 80 });
      expect(cmds).to.deep.equal([
        { kind: 'drag', x1: 100, y1: 100, x2: 200, y2: 150, durationMs: 80 },
      ]);
    });

    it('chains segments — each starts where the previous ended', () => {
      const ps = new PointerState({ segmentCadenceMs: 80 });
      ps.feed({ kind: 'pointer_start', x: 0, y: 0, t: 0 });
      const c1 = ps.feed({ kind: 'pointer_move', x: 50, y: 50, t: 80 });
      const c2 = ps.feed({ kind: 'pointer_move', x: 100, y: 80, t: 160 });
      expect(c1).to.deep.equal([
        { kind: 'drag', x1: 0, y1: 0, x2: 50, y2: 50, durationMs: 80 },
      ]);
      expect(c2).to.deep.equal([
        { kind: 'drag', x1: 50, y1: 50, x2: 100, y2: 80, durationMs: 80 },
      ]);
    });

    it('emits a final segment on pointer_end if the end position differs from last-sent', () => {
      const ps = new PointerState({ segmentCadenceMs: 80 });
      ps.feed({ kind: 'pointer_start', x: 0, y: 0, t: 0 });
      ps.feed({ kind: 'pointer_move', x: 50, y: 50, t: 80 });
      const cmds = ps.feed({
        kind: 'pointer_end', x: 75, y: 60, t: 120, wasTap: false,
      });
      // Last-sent was (50,50) at t=80. pointer_end at t=120, pos (75,60).
      // dt=40, dx=25, dy=10. Should emit a drag (50,50)->(75,60).
      expect(cmds).to.deep.equal([
        { kind: 'drag', x1: 50, y1: 50, x2: 75, y2: 60, durationMs: 40 },
      ]);
    });

    it('emits nothing on pointer_end if final position already matches last-sent', () => {
      const ps = new PointerState({ segmentCadenceMs: 80 });
      ps.feed({ kind: 'pointer_start', x: 0, y: 0, t: 0 });
      ps.feed({ kind: 'pointer_move', x: 100, y: 100, t: 80 });
      const cmds = ps.feed({
        kind: 'pointer_end', x: 100, y: 100, t: 100, wasTap: false,
      });
      expect(cmds).to.deep.equal([]);
    });
  });
```

- [ ] **Step 2: Run the new tests, confirm they fail**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-pointer-state.spec.ts --exit --timeout=20000
```
Expected: new tests FAIL (`PointerState` constructor doesn't take options; pointer_move returns `[]`; etc.).

- [ ] **Step 3: Implement the drag-segment logic**

Replace `src/device-stream/ios/pointer-state.ts` with:
```typescript
import type {
  IosClientMessage,
  IosPointerStartMessage,
  IosPointerMoveMessage,
  IosPointerEndMessage,
} from '../types';

export type PointerCommand =
  | { kind: 'tap'; x: number; y: number }
  | { kind: 'drag'; x1: number; y1: number; x2: number; y2: number; durationMs: number };

export interface PointerStateOptions {
  /** Minimum elapsed time between successive drag segments, in ms. */
  segmentCadenceMs?: number;
}

const DEFAULT_SEGMENT_CADENCE_MS = 80;

type PointerMsg =
  | IosPointerStartMessage
  | IosPointerMoveMessage
  | IosPointerEndMessage;

export class PointerState {
  private active = false;
  private lastSentPos: { x: number; y: number } | null = null;
  private lastSentTime: number | null = null;
  private readonly cadenceMs: number;

  constructor(opts: PointerStateOptions = {}) {
    this.cadenceMs = opts.segmentCadenceMs ?? DEFAULT_SEGMENT_CADENCE_MS;
  }

  feed(msg: IosClientMessage): PointerCommand[] {
    if (!isPointerMsg(msg)) return [];

    if (msg.kind === 'pointer_start') {
      this.active = true;
      this.lastSentPos = { x: msg.x, y: msg.y };
      this.lastSentTime = msg.t;
      return [];
    }

    if (!this.active || this.lastSentPos == null || this.lastSentTime == null) {
      return [];
    }

    if (msg.kind === 'pointer_move') {
      const dt = msg.t - this.lastSentTime;
      if (dt < this.cadenceMs) return [];
      const cmd: PointerCommand = {
        kind: 'drag',
        x1: this.lastSentPos.x,
        y1: this.lastSentPos.y,
        x2: msg.x,
        y2: msg.y,
        durationMs: dt,
      };
      this.lastSentPos = { x: msg.x, y: msg.y };
      this.lastSentTime = msg.t;
      return [cmd];
    }

    // pointer_end
    const cmds: PointerCommand[] = [];
    if (msg.wasTap) {
      cmds.push({ kind: 'tap', x: msg.x, y: msg.y });
    } else {
      const dx = msg.x - this.lastSentPos.x;
      const dy = msg.y - this.lastSentPos.y;
      if (dx !== 0 || dy !== 0) {
        const dt = Math.max(1, msg.t - this.lastSentTime);
        cmds.push({
          kind: 'drag',
          x1: this.lastSentPos.x,
          y1: this.lastSentPos.y,
          x2: msg.x,
          y2: msg.y,
          durationMs: dt,
        });
      }
    }
    this.active = false;
    this.lastSentPos = null;
    this.lastSentTime = null;
    return cmds;
  }

  dispose(): void {
    this.active = false;
    this.lastSentPos = null;
    this.lastSentTime = null;
  }
}

function isPointerMsg(msg: IosClientMessage): msg is PointerMsg {
  return (
    msg.kind === 'pointer_start' ||
    msg.kind === 'pointer_move' ||
    msg.kind === 'pointer_end'
  );
}
```

- [ ] **Step 4: Run tests, confirm all pass**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-pointer-state.spec.ts --exit --timeout=20000
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/ios/pointer-state.ts test/unit/device-stream-ios-pointer-state.spec.ts
git commit -m "feat(device-stream/ios): add drag-segment cadence to PointerState"
```

---

### Task 11: TDD `pointer-state.ts` — backpressure + dispose

**Files:**
- Modify: `src/device-stream/ios/pointer-state.ts`
- Modify: `test/unit/device-stream-ios-pointer-state.spec.ts`

- [ ] **Step 1: Write failing tests**

Append before the final `});` in the spec file:
```typescript
  describe('dispose', () => {
    it('clears active state — subsequent feeds return []', () => {
      const ps = new PointerState();
      ps.feed({ kind: 'pointer_start', x: 0, y: 0, t: 0 });
      ps.dispose();
      const cmds = ps.feed({ kind: 'pointer_move', x: 100, y: 100, t: 1000 });
      expect(cmds).to.deep.equal([]);
    });

    it('is idempotent', () => {
      const ps = new PointerState();
      ps.dispose();
      expect(() => ps.dispose()).not.to.throw();
    });
  });

  describe('backpressure', () => {
    it('inFlight tracking allows the caller to collapse pending segments', () => {
      // Pattern: caller increments before dispatch, decrements after dispatch
      // completes; PointerState exposes `recordDispatchStart()` /
      // `recordDispatchComplete()`. When inFlight > maxInFlight, further
      // pointer_move emissions collapse: the state machine emits only the
      // latest segment regardless of cadence.
      const ps = new PointerState({ segmentCadenceMs: 80, maxInFlight: 2 });
      ps.feed({ kind: 'pointer_start', x: 0, y: 0, t: 0 });
      const c1 = ps.feed({ kind: 'pointer_move', x: 50, y: 0, t: 80 });
      expect(c1).to.have.lengthOf(1);
      ps.recordDispatchStart();
      const c2 = ps.feed({ kind: 'pointer_move', x: 100, y: 0, t: 160 });
      expect(c2).to.have.lengthOf(1);
      ps.recordDispatchStart();
      // inFlight=2 == maxInFlight; next move at t=240 emits but ALSO records
      // the start internally so caller doesn't double-count? No — keep it
      // explicit: when inFlight >= maxInFlight, emit nothing (the caller will
      // get to the latest position once an in-flight completes).
      const c3 = ps.feed({ kind: 'pointer_move', x: 150, y: 0, t: 240 });
      expect(c3).to.deep.equal([]);
      // Once a dispatch completes, the next move catches up to latest position.
      ps.recordDispatchComplete();
      const c4 = ps.feed({ kind: 'pointer_move', x: 200, y: 0, t: 320 });
      // Segment goes from last-sent (100,0) at t=160 to current (200,0) at t=320,
      // durationMs = 160.
      expect(c4).to.deep.equal([
        { kind: 'drag', x1: 100, y1: 0, x2: 200, y2: 0, durationMs: 160 },
      ]);
    });
  });
```

- [ ] **Step 2: Run tests, confirm new ones fail**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-pointer-state.spec.ts --exit --timeout=20000
```
Expected: new tests fail — no `recordDispatchStart`/`Complete` method, no `maxInFlight` option.

- [ ] **Step 3: Add backpressure handling**

Edit `src/device-stream/ios/pointer-state.ts`. Update `PointerStateOptions`:
```typescript
export interface PointerStateOptions {
  /** Minimum elapsed time between successive drag segments, in ms. */
  segmentCadenceMs?: number;
  /** Max concurrent in-flight drag dispatches before collapsing. */
  maxInFlight?: number;
}

const DEFAULT_SEGMENT_CADENCE_MS = 80;
const DEFAULT_MAX_IN_FLIGHT = 2;
```

Inside the class, add a private counter and methods, and modify `feed` to short-circuit when saturated:
```typescript
export class PointerState {
  private active = false;
  private lastSentPos: { x: number; y: number } | null = null;
  private lastSentTime: number | null = null;
  private inFlight = 0;
  private readonly cadenceMs: number;
  private readonly maxInFlight: number;

  constructor(opts: PointerStateOptions = {}) {
    this.cadenceMs = opts.segmentCadenceMs ?? DEFAULT_SEGMENT_CADENCE_MS;
    this.maxInFlight = opts.maxInFlight ?? DEFAULT_MAX_IN_FLIGHT;
  }

  recordDispatchStart(): void {
    this.inFlight += 1;
  }

  recordDispatchComplete(): void {
    this.inFlight = Math.max(0, this.inFlight - 1);
  }

  feed(msg: IosClientMessage): PointerCommand[] {
    if (!isPointerMsg(msg)) return [];

    if (msg.kind === 'pointer_start') {
      this.active = true;
      this.lastSentPos = { x: msg.x, y: msg.y };
      this.lastSentTime = msg.t;
      return [];
    }

    if (!this.active || this.lastSentPos == null || this.lastSentTime == null) {
      return [];
    }

    if (msg.kind === 'pointer_move') {
      const dt = msg.t - this.lastSentTime;
      if (dt < this.cadenceMs) return [];
      if (this.inFlight >= this.maxInFlight) return [];
      const cmd: PointerCommand = {
        kind: 'drag',
        x1: this.lastSentPos.x,
        y1: this.lastSentPos.y,
        x2: msg.x,
        y2: msg.y,
        durationMs: dt,
      };
      this.lastSentPos = { x: msg.x, y: msg.y };
      this.lastSentTime = msg.t;
      return [cmd];
    }

    // pointer_end — unchanged from Task 10; the final-segment logic
    // always emits (backpressure does not apply to end-of-gesture).
    const cmds: PointerCommand[] = [];
    if (msg.wasTap) {
      cmds.push({ kind: 'tap', x: msg.x, y: msg.y });
    } else {
      const dx = msg.x - this.lastSentPos.x;
      const dy = msg.y - this.lastSentPos.y;
      if (dx !== 0 || dy !== 0) {
        const dt = Math.max(1, msg.t - this.lastSentTime);
        cmds.push({
          kind: 'drag',
          x1: this.lastSentPos.x,
          y1: this.lastSentPos.y,
          x2: msg.x,
          y2: msg.y,
          durationMs: dt,
        });
      }
    }
    this.active = false;
    this.lastSentPos = null;
    this.lastSentTime = null;
    return cmds;
  }

  dispose(): void {
    this.active = false;
    this.lastSentPos = null;
    this.lastSentTime = null;
    this.inFlight = 0;
  }
}
```

- [ ] **Step 4: Run tests, confirm all pass**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-pointer-state.spec.ts --exit --timeout=20000
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/ios/pointer-state.ts test/unit/device-stream-ios-pointer-state.spec.ts
git commit -m "feat(device-stream/ios): add backpressure + dispose to PointerState"
```

---

### Task 12: Wire `PointerState` into router.ts WS handler

**Files:**
- Modify: `src/device-stream/router.ts`

- [ ] **Step 1: Import PointerState at the top of router.ts**

Edit `src/device-stream/router.ts`. Search for the existing import of `decodeIosClientMessage` near the top of the file; on the next line, add:
```typescript
import { PointerState } from './ios/pointer-state';
```

- [ ] **Step 2: Create a PointerState instance per WS connection**

In the iOS WS handler (search for the function that contains the `ws.on('message', async (raw, isBinary) => {` block that decodes iOS client messages — currently around line 632 in the file), at the top of that function, immediately after `const handle = ...;` line and before `ws.on('message', ...)`, add:
```typescript
const pointerState = new PointerState();
ws.once('close', () => pointerState.dispose());
```

- [ ] **Step 3: Dispatch pointer messages via PointerState**

Inside the `ws.on('message', ...)` handler, after the existing `if (msg.kind === 'tap') { ... } else if (msg.kind === 'swipe') { ... } else if (msg.kind === 'intent') { ... }` chain, add:
```typescript
      } else if (
        msg.kind === 'pointer_start' ||
        msg.kind === 'pointer_move' ||
        msg.kind === 'pointer_end'
      ) {
        const cmds = pointerState.feed(msg);
        for (const cmd of cmds) {
          if (cmd.kind === 'tap') {
            // Fire-and-forget; errors are logged below.
            handle.wdaClient.tap(handle.sessionId, cmd.x, cmd.y).catch((err) =>
              log.warn(
                `[device-stream/ios] pointer-tap dispatch failed: ${(err as Error)?.message}`,
              ),
            );
          } else if (cmd.kind === 'drag') {
            pointerState.recordDispatchStart();
            handle.wdaClient
              .drag(handle.sessionId, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.durationMs)
              .catch((err) =>
                log.warn(
                  `[device-stream/ios] pointer-drag dispatch failed: ${(err as Error)?.message}`,
                ),
              )
              .finally(() => pointerState.recordDispatchComplete());
          }
        }
      }
```

The placement is inside the existing `try { ... } catch (err) { ... }` block; the new `else if` branch goes after the existing `intent` branch and before the closing brace of the try block.

- [ ] **Step 4: Type-check**

Run:
```bash
cd /Users/kry/personal/code/falx && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Smoke-run the existing unit tests to confirm nothing broke**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-*.spec.ts --exit --timeout=20000
```
Expected: all device-stream unit tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/device-stream/router.ts
git commit -m "feat(device-stream/router): wire PointerState into iOS WS handler"
```

---

### Task 13: Update `IOSStreamCanvas` to emit `pointer_*` messages

**Files:**
- Modify: `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`

- [ ] **Step 1: Add the new client-side tag constants**

Edit `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`. After the existing `const CLIENT_INTENT_TAG = 0x22;` line, add:
```typescript
const CLIENT_POINTER_START_TAG = 0x23;
const CLIENT_POINTER_MOVE_TAG = 0x24;
const CLIENT_POINTER_END_TAG = 0x25;
```

- [ ] **Step 2: Add encoder helpers as module-level functions (outside the component)**

Above the `IOSStreamCanvas` function declaration, add:
```typescript
function encodePointerStart(x: number, y: number, t: number): ArrayBuffer {
  const buf = new ArrayBuffer(1 + 16);
  const v = new DataView(buf);
  v.setUint8(0, CLIENT_POINTER_START_TAG);
  v.setFloat32(1, x, false);
  v.setFloat32(5, y, false);
  v.setFloat64(9, t, false);
  return buf;
}

function encodePointerMove(x: number, y: number, t: number): ArrayBuffer {
  const buf = new ArrayBuffer(1 + 16);
  const v = new DataView(buf);
  v.setUint8(0, CLIENT_POINTER_MOVE_TAG);
  v.setFloat32(1, x, false);
  v.setFloat32(5, y, false);
  v.setFloat64(9, t, false);
  return buf;
}

function encodePointerEnd(x: number, y: number, t: number, wasTap: boolean): ArrayBuffer {
  const buf = new ArrayBuffer(1 + 17);
  const v = new DataView(buf);
  v.setUint8(0, CLIENT_POINTER_END_TAG);
  v.setFloat32(1, x, false);
  v.setFloat32(5, y, false);
  v.setFloat64(9, t, false);
  v.setUint8(17, wasTap ? 1 : 0);
  return buf;
}
```

- [ ] **Step 3: Emit pointer_start in `onPointerDown`**

In `onPointerDown` (modified in Task 7), add right before `e.preventDefault();`:
```typescript
  const ws = wsRef.current;
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(encodePointerStart(p.x, p.y, performance.now()));
  }
```

- [ ] **Step 4: Emit pointer_move in `onPointerMove` (throttled by canvas rAF, plus WS-buffer guard)**

Replace the body of `onPointerMove` from Task 7's Step 6 with:
```typescript
function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
  if (!pointerStart.current) return;
  const p = clientToCanvasAndPoints(e);
  const now = performance.now();
  trailRef.current.push({ x: p.px, y: p.py, tMs: now });
  if (trailRef.current.length > 64) trailRef.current.shift();
  startOverlayLoop();
  // Emit pointer_move. rAF cadence comes from the browser's native
  // pointer-event coalescing; throttling further is unnecessary.
  // Backpressure: if WS buffer is high, drop intermediate moves.
  const ws = wsRef.current;
  if (ws && ws.readyState === ws.OPEN && ws.bufferedAmount < 100_000) {
    ws.send(encodePointerMove(p.x, p.y, now));
  }
  lastMoveEmitRef.current = now;
  e.preventDefault();
}
```

- [ ] **Step 5: Replace `onPointerUp` to send `pointer_end` instead of `tap`/`swipe`**

Replace the body of `onPointerUp` with:
```typescript
function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
  const start = pointerStart.current;
  pointerStart.current = null;
  trailRef.current = [];
  if (!start) return;
  const end = clientToCanvasAndPoints(e);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dt = performance.now() - start.t;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const wasTap = dist < SWIPE_PX_THRESHOLD && dt < SWIPE_MS_THRESHOLD;

  const ws = wsRef.current;
  if (!ws || ws.readyState !== ws.OPEN) return;
  ws.send(encodePointerEnd(end.x, end.y, performance.now(), wasTap));

  e.preventDefault();
}
```

(Note: this removes the old code paths that emitted `CLIENT_TAP_TAG` and `CLIENT_SWIPE_TAG`. The server-side handlers for those tags remain functional — they're just no longer reached from this client. Retire them in a separate cleanup commit later if desired.)

- [ ] **Step 6: Type-check**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx tsc --noEmit
```
Expected: no errors. If unused-variable warnings appear for `CLIENT_TAP_TAG` / `CLIENT_SWIPE_TAG` (now unused), keep them — they're documentation for the wire-protocol; mark them with `void CLIENT_TAP_TAG; void CLIENT_SWIPE_TAG;` at module top if the linter is strict, or remove if the codebase tolerates unused consts.

- [ ] **Step 7: Commit**

```bash
git add falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx
git commit -m "feat(falx-ui): emit pointer_start/move/end WS messages from iOS canvas"
```

---

### Task 14 (CONDITIONAL — only if spike Task 5 picked Pattern A)

Skip this task if Phase-1 spike Task 5 confirmed Pattern B (chained short drags) as the live-drag pattern. Execute only if Pattern B was rejected (visible finger-lift flicker, etc.) and Pattern A is the fallback.

**Files:**
- Modify: `src/device-stream/ios/wda-client.ts`
- Modify: `src/device-stream/ios/pointer-state.ts`
- Modify: `test/unit/device-stream-ios-pointer-state.spec.ts`

- [ ] **Step 1: Add `actions()` method to WDAClient**

In `src/device-stream/ios/wda-client.ts`, add at the bottom of the `WDAClient` class:
```typescript
  async actions(sessionId: string, sequence: unknown[]): Promise<void> {
    await this.http.post(`/session/${sessionId}/actions`, {
      actions: [{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: sequence,
      }],
    });
  }
```

- [ ] **Step 2: Add `PointerCommand` variant for actions sequence**

In `src/device-stream/ios/pointer-state.ts`, extend `PointerCommand`:
```typescript
export type PointerCommand =
  | { kind: 'tap'; x: number; y: number }
  | { kind: 'drag'; x1: number; y1: number; x2: number; y2: number; durationMs: number }
  | { kind: 'actions'; sequence: unknown[] };
```

Add a `mode` option to `PointerStateOptions`:
```typescript
export interface PointerStateOptions {
  segmentCadenceMs?: number;
  maxInFlight?: number;
  /** 'segments' = Pattern B (default). 'actions' = Pattern A. */
  mode?: 'segments' | 'actions';
}
```

In the constructor, store `mode`. In `feed`:
- If `mode === 'actions'`, on `pointer_move` accumulate `{x, y, t}` into a private buffer (no command emission). On `pointer_end`, build the W3C `actions` sequence (`pointerMove → pointerDown → pointerMove*N → pointerUp`) and emit one `{kind: 'actions', sequence}`.

- [ ] **Step 3: Add tests for Pattern A mode**

Append to `test/unit/device-stream-ios-pointer-state.spec.ts`:
```typescript
  describe('actions mode (Pattern A fallback)', () => {
    it('accumulates moves and emits one actions sequence on pointer_end', () => {
      const ps = new PointerState({ mode: 'actions' });
      ps.feed({ kind: 'pointer_start', x: 0, y: 0, t: 0 });
      const c1 = ps.feed({ kind: 'pointer_move', x: 50, y: 50, t: 80 });
      expect(c1).to.deep.equal([]); // accumulated, not emitted
      const c2 = ps.feed({ kind: 'pointer_move', x: 100, y: 100, t: 160 });
      expect(c2).to.deep.equal([]);
      const c3 = ps.feed({
        kind: 'pointer_end', x: 150, y: 150, t: 240, wasTap: false,
      });
      expect(c3).to.have.lengthOf(1);
      expect(c3[0].kind).to.equal('actions');
    });
  });
```

- [ ] **Step 4: Wire the router to dispatch `actions` commands**

In `src/device-stream/router.ts`, inside the pointer-message dispatch block (added Task 12 Step 3), add a third branch:
```typescript
          } else if (cmd.kind === 'actions') {
            pointerState.recordDispatchStart();
            handle.wdaClient
              .actions(handle.sessionId, cmd.sequence)
              .catch((err) =>
                log.warn(
                  `[device-stream/ios] pointer-actions dispatch failed: ${(err as Error)?.message}`,
                ),
              )
              .finally(() => pointerState.recordDispatchComplete());
          }
```

Also, in Task 12 Step 2, change the `PointerState` construction to pass `mode: 'actions'`:
```typescript
const pointerState = new PointerState({ mode: 'actions' });
```

- [ ] **Step 5: Run tests, confirm all pass**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-*.spec.ts --exit --timeout=20000
```
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/device-stream/ios/wda-client.ts src/device-stream/ios/pointer-state.ts src/device-stream/router.ts test/unit/device-stream-ios-pointer-state.spec.ts
git commit -m "feat(device-stream/ios): add Pattern A actions-sequence fallback for PointerState"
```

---

### Task 15 (CONDITIONAL — only if spike Task 5 picked /actions for taps)

Skip if Phase-1 spike Task 5 confirmed `/wda/tap` as the tap channel. Execute only if `/actions` p50 was materially lower (≥40 ms improvement per the spike decision rule).

**Files:**
- Modify: `src/device-stream/ios/wda-client.ts` (if Task 14 wasn't executed, add the `actions()` method per Task 14 Step 1 first)
- Modify: `src/device-stream/router.ts`

- [ ] **Step 1: Ensure `wdaClient.actions()` exists**

In `src/device-stream/ios/wda-client.ts`, check whether the `actions()` method already exists (added by Task 14). If absent, add it at the bottom of the `WDAClient` class:
```typescript
  async actions(sessionId: string, sequence: unknown[]): Promise<void> {
    await this.http.post(`/session/${sessionId}/actions`, {
      actions: [{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: sequence,
      }],
    });
  }
```
If `actions()` already exists from Task 14, leave it alone.

- [ ] **Step 2: Add a `tapViaActions` helper on WDAClient**

In `src/device-stream/ios/wda-client.ts`, add at the bottom of the `WDAClient` class:
```typescript
  async tapViaActions(sessionId: string, x: number, y: number): Promise<void> {
    await this.actions(sessionId, [
      { type: 'pointerMove', duration: 0, x, y },
      { type: 'pointerDown', button: 0 },
      { type: 'pause', duration: 30 },
      { type: 'pointerUp', button: 0 },
    ]);
  }
```

- [ ] **Step 3: Swap the tap dispatch in router.ts (both call sites)**

In `src/device-stream/router.ts`:

(a) Inside the pointer-message dispatch block (added Task 12 Step 3), replace:
```typescript
            handle.wdaClient.tap(handle.sessionId, cmd.x, cmd.y).catch((err) =>
```
with:
```typescript
            handle.wdaClient.tapViaActions(handle.sessionId, cmd.x, cmd.y).catch((err) =>
```

(b) Inside the legacy `tap` message handler block (search for `if (msg.kind === 'tap') {`), replace:
```typescript
        await handle.wdaClient.tap(handle.sessionId, msg.x, msg.y);
```
with:
```typescript
        await handle.wdaClient.tapViaActions(handle.sessionId, msg.x, msg.y);
```

- [ ] **Step 4: Smoke-run unit tests**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-*.spec.ts --exit --timeout=20000
```
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/ios/wda-client.ts src/device-stream/router.ts
git commit -m "feat(device-stream/ios): swap tap dispatch to W3C /actions per spike findings"
```

---

## Phase 3 — Verification

### Task 16: Run full unit-test suite

**Files:** none (verification only)

- [ ] **Step 1: Run server unit tests**

Run:
```bash
cd /Users/kry/personal/code/falx && npm test 2>&1 | tail -20
```
Expected: all tests pass; no new failures vs `main`.

- [ ] **Step 2: Run falx-ui unit tests**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx vitest run 2>&1 | tail -20
```
Expected: all tests pass.

- [ ] **Step 3: If any test fails, fix in place and re-run before moving on. Do NOT proceed to Task 17 with red tests.**

---

### Task 17: Build + start falx server with iOS bridge against kry-phone

**Files:** none (operational)

- [ ] **Step 1: Confirm prerequisites for the device-attached run**

Operator-side checks (the agent prompts the operator to confirm):
- `kry-phone` is connected via USB and unlocked.
- `sudo ios tunnel start` is running.
- No other Appium/WDA process is bound to ports the bridge uses.

- [ ] **Step 2: Build the falx-ui bundle**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npm run build
```
Expected: clean build, `dist/` populated. The plugin serves these built assets.

- [ ] **Step 3: Start the appium plugin with device-farm enabled**

Run (matching the iOS Use Device slice's run command — adjust path if the project Makefile / npm script changes the command):
```bash
cd /Users/kry/personal/code/falx && npx appium --use-plugins=device-farm --plugin-device-farm-platform=ios --port=4723
```
Expected: log shows "[device-stream/ios] ..." lines as the bridge initialises. Note the dashboard URL (typically `http://localhost:4723/device-farm/`).

- [ ] **Step 4: Confirm the dashboard loads**

Open the dashboard URL in a browser. Expected: kry-phone appears in the device list with iOS metadata.

- [ ] **Step 5: Click Use Device on kry-phone manually once**

Confirm: stream appears, a manual tap on a SpringBoard icon launches the app, a manual drag shows live-drag tracking. If anything fails at this step, debug before proceeding to Task 18 — Playwright will only confirm what already works manually.

---

### Task 18: Agent Playwright MCP self-verification

**Files:** none (ephemeral verification via MCP tools)

This task is the agent's responsibility — it drives the running falx-ui via the `mcp__playwright__browser_*` tool family. No repo changes, no checked-in spec files.

- [ ] **Step 1: Navigate to the dashboard**

Tool: `mcp__playwright__browser_navigate` with URL `http://localhost:4723/device-farm/`.
Expected: `browser_snapshot` shows the dashboard with kry-phone listed.

- [ ] **Step 2: Click Use Device on kry-phone**

Tool: `mcp__playwright__browser_click` on the Use Device button. Wait for the stream UI to render via `mcp__playwright__browser_wait_for` keyed on a stream-canvas selector.

- [ ] **Step 3: Hook a WebSocket frame inspector**

Tool: `mcp__playwright__browser_evaluate` to install a JS snippet that records all binary frames sent over the WS connection used by the canvas:
```javascript
() => {
  window.__falxWsFrames = [];
  const originalSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function(data) {
    if (data instanceof ArrayBuffer) {
      const view = new Uint8Array(data);
      window.__falxWsFrames.push({ tag: view[0], len: view.length, t: performance.now() });
    }
    return originalSend.call(this, data);
  };
  return 'hooked';
}
```
Expected: returns `'hooked'`.

- [ ] **Step 4: Verify tap emits pointer_start + pointer_end{wasTap:true}**

Use `mcp__playwright__browser_evaluate` to dispatch a synthetic pointer tap on the canvas, then read `window.__falxWsFrames`:
```javascript
() => {
  window.__falxWsFrames = [];
  const c = document.querySelector('canvas');
  const rect = c.getBoundingClientRect();
  const x = rect.left + rect.width * 0.3;
  const y = rect.top + rect.height * 0.7;
  function pe(type) {
    return new PointerEvent(type, {
      bubbles: true, cancelable: true,
      pointerId: 1, pointerType: 'mouse',
      clientX: x, clientY: y, button: 0,
    });
  }
  c.dispatchEvent(pe('pointerdown'));
  c.dispatchEvent(pe('pointerup'));
  // give the WS a moment
  return new Promise((r) => setTimeout(() => r(window.__falxWsFrames), 200));
}
```
Expected: returns at least two frames — first with `tag === 0x23` (CLIENT_POINTER_START_TAG), then one with `tag === 0x25` (CLIENT_POINTER_END_TAG).

- [ ] **Step 5: Verify drag emits start + N moves + end{wasTap:false}**

Similar `browser_evaluate` snippet that dispatches pointerdown, multiple pointermove events at staggered offsets, then pointerup. Confirm frame sequence: `0x23, 0x24*N (N ≥ 3), 0x25`.

- [ ] **Step 6: Verify optimistic ring renders before WS roundtrip**

Use `mcp__playwright__browser_take_screenshot` (with `clip` near the touch point) immediately after dispatching pointerdown (before any animation frame elapses meaningfully). Then take a second screenshot 250 ms later. Expected: the first screenshot shows the ring overlay; the second has the ring faded out.

- [ ] **Step 7: Measure tap latency**

Use `browser_evaluate` to dispatch a tap at a SpringBoard icon position (compute from canvas size: scale Photos icon points 263.5/859.5 → canvas pixels via current canvas.width/height ratio), record `t0 = performance.now()`. Sample the canvas pixel at the icon center via `getImageData` in a tight loop, watch for pixel-color change indicating Photos launched. Report dt. Repeat 5 times.

Cleanup between trials: dispatch synthetic intent home (or call the Home button via the dashboard UI). Expected: 5 latency numbers in the same ballpark as Phase-1 Task 4 baseline.

- [ ] **Step 8: Verify no regression — home + app_switcher still emit intent frames**

Click the Home button in the dashboard toolbar (or dispatch the equivalent imperative call via the IOSStreamHandle if exposed for testing). Confirm a frame with `tag === 0x22` appears in `__falxWsFrames`. Repeat for App Switcher.

- [ ] **Step 9: Stop the session cleanly**

Click Stop in the dashboard. Confirm WS closes (the inspector hook captures any final frames), no errors in `browser_console_messages`.

- [ ] **Step 10: Capture all observations into the hand-off summary**

Agent writes (in the conversation, not a file): which steps ran, what was observed, the 5 tap-latency numbers, any anomalies. This summary goes into the user-facing review-ready message.

---

### Task 19: Operator subjective gate on kry-phone

**Files:**
- Modify: `docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md` (append `### Manual verification — kry-phone (YYYY-MM-DD)` section)

This task is run by the operator (user), not the agent. The agent provides the checklist and waits for the operator to complete it.

- [ ] **Step 1: Operator drives five apps**

Photos, Settings, Safari, Maps, plus one third-party app of the operator's choice. For each: ten taps + five drags. Operator records per-app subjective notes (smooth / acceptable / poor).

- [ ] **Step 2: Re-run the 50-cycle leak script**

Run the leak script from the prior iOS Use Device slice (path: see `docs/superpowers/specs/2026-05-18-ios-use-device-design.md` § "Manual verification — kry-phone (2026-05-18)"). Confirm zero leaked `ios runwda` / `ios forward` processes.

- [ ] **Step 3: Operator records the subjective verdict**

Operator appends to the spec file a new section like:
```markdown
### Manual verification — kry-phone (YYYY-MM-DD)

- Apps tested: Photos, Settings, Safari, Maps, <third-party>.
- Per-app notes: <one line each>.
- 50-cycle leak run: clean / N leaked (process listing).
- Tap latency (post-implementation, agent Playwright pass): p50=<X>ms, max=<Y>ms.
- Subjective verdict: **BrowserStack-grade Y / N**.
- Notes: <what shifted the verdict>.
```

- [ ] **Step 4: Commit the verification log**

```bash
git add docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md
git commit -m "docs(ios-input): manual verification on kry-phone YYYY-MM-DD"
```

- [ ] **Step 5: Hand off to user for review**

The slice is now "ready for review" in the user's sense — unit tests green, agent Playwright pass green with evidence in conversation log, operator manual gate green with verdict appended to spec. The user takes it from here (PR creation, integration choice).
