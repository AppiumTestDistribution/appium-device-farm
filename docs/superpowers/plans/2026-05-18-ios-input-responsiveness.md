# iOS Input Responsiveness Implementation Plan (revised post-spike)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make iOS Use Device input meaningfully more responsive than current within the constraints of vanilla WDA on iOS 26 (which has a ~600–1800 ms per-call dispatch floor). Fix the "swipe replays slowly on the iPhone" complaint, swap tap dispatch to the faster `/actions` channel, apply WDA tunables that shave ~40 % off dispatch, and add optimistic canvas overlays that mask the unavoidable WDA wait perceptually.

**Architecture:** No new wire protocol or state machine. Four targeted edits — one in the iOS bridge (tunables), one in the WDA client (new method), one in the WS router (duration cap + tap channel swap), and one in the canvas (overlays). Existing `tap` / `swipe` WS messages stay; the iOS Use Device live drag goal from the original plan is **dropped** because WDA dispatch can't support it (spike findings in `docs/spikes/04-ios-input-latency-spike.md`).

**Tech Stack:** Node.js + TypeScript server (mocha + chai for tests), React + TypeScript client (`falx-ui/`), WDA REST over USB-forwarded port. Agent-side verification via the Playwright MCP browser tools (`mcp__playwright__*`), no repo dep added.

**Branch:** `feat/ios-tap-perf-issues` (current branch; spec + plan + spike findings already committed).

**Spec:** `docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md` (see §"Revision — 2026-05-18, post-spike scope cut").

**Spike findings:** `docs/spikes/04-ios-input-latency-spike.md` (data justifying every scope decision in this plan).

---

## Phase 1 — Spike (DONE)

Phase 1 tasks from the original plan (Tasks 1–5) executed on 2026-05-18. Spike harness boot, three live-drag pattern trials, tunables probe, channel comparison. Findings committed to `docs/spikes/04-ios-input-latency-spike.md`. No further Phase 1 work.

---

## Phase 2 — Implementation

All Phase 2 tasks run on branch `feat/ios-tap-perf-issues`. The four implementation tasks (1–4) are server-side except #4 which is `falx-ui`. Verification tasks (5–7) run after #1–4 are merged commits.

### Task 1: Apply WDA tunables on session start

**Files:**
- Modify: `src/device-stream/ios/bridge.ts`
- Modify: `src/device-stream/ios/wda-client.ts` (already has `setMjpegSettings`; verify the existing `appium/settings` POST helper covers what we need OR add a small `setDispatchTunables` method).
- Test: existing `test/unit/device-stream-ios-wda-client.spec.ts` (add a test case if a new method is added).

The spike confirmed two settings stick on WDA 12.2.2: `waitForIdleTimeout: 0` and `animationCoolOffTimeout: 0`. Together they reduce per-call dispatch wall-time by ~40 %.

- [ ] **Step 1: Inspect `wda-client.ts` to see whether a generic `setSettings` helper exists or if we need a new method**

Run:
```bash
grep -n "appium/settings" /Users/kry/personal/code/falx/src/device-stream/ios/wda-client.ts
```
Expected: `setMjpegSettings` already exists. We need a sibling that posts dispatch-tunables without conflicting (both end up at the same endpoint; WDA merges settings).

- [ ] **Step 2: If no generic helper exists, write a failing test for `setDispatchTunables`**

Edit `test/unit/device-stream-ios-wda-client.spec.ts`. Find the existing `describe('setMjpegSettings', ...)` and after it, add:
```typescript
describe('setDispatchTunables', () => {
  it('POSTs waitForIdleTimeout:0 and animationCoolOffTimeout:0 to /appium/settings', async () => {
    let captured: { url?: string; body?: unknown } = {};
    const fakePost = async (url: string, body: unknown) => {
      captured = { url, body };
      return { data: { value: {} } };
    };
    const client = new WDAClient('http://localhost:8100');
    // Replace the internal axios instance with a tiny fake.
    (client as unknown as { http: { post: typeof fakePost } }).http = { post: fakePost } as never;
    await client.setDispatchTunables('SID-1');
    expect(captured.url).to.equal('/session/SID-1/appium/settings');
    expect(captured.body).to.deep.equal({
      settings: { waitForIdleTimeout: 0, animationCoolOffTimeout: 0 },
    });
  });
});
```

- [ ] **Step 3: Run the failing test**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-wda-client.spec.ts --exit --timeout=20000
```
Expected: FAIL — `setDispatchTunables is not a function`.

- [ ] **Step 4: Add `setDispatchTunables` to `WDAClient`**

Edit `src/device-stream/ios/wda-client.ts`. Add at the bottom of the `WDAClient` class:
```typescript
  async setDispatchTunables(sessionId: string): Promise<void> {
    // Only two settings stick on WDA 12.2.2 (iOS 26.4.2); the rest are
    // unrecognized. See docs/spikes/04-ios-input-latency-spike.md.
    await this.http.post(`/session/${sessionId}/appium/settings`, {
      settings: {
        waitForIdleTimeout: 0,
        animationCoolOffTimeout: 0,
      },
    });
  }
```

- [ ] **Step 5: Run the test to confirm it passes**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-wda-client.spec.ts --exit --timeout=20000
```
Expected: all tests pass.

- [ ] **Step 6: Wire the tunables into the bridge's start sequence**

Edit `src/device-stream/ios/bridge.ts`. Find the line right after `setMjpegSettings(sessionId, DEFAULT_MJPEG_SETTINGS);` (currently around line 156). Add directly after it:
```typescript
      // Dispatch-speed tunables: ~40% reduction in WDA per-call latency on
      // iOS 26.4.2 (waitForIdleTimeout + animationCoolOffTimeout = 0).
      // See docs/spikes/04-ios-input-latency-spike.md.
      await wdaClient.setDispatchTunables(sessionId).catch((err) =>
        log.warn(
          `[ios-bridge] setDispatchTunables failed (non-fatal): ${(err as Error)?.message}`,
        ),
      );
```

- [ ] **Step 7: Type-check**

Run:
```bash
cd /Users/kry/personal/code/falx && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 8: Run all device-stream unit tests to confirm nothing broke**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-*.spec.ts --exit --timeout=20000
```
Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add src/device-stream/ios/wda-client.ts src/device-stream/ios/bridge.ts test/unit/device-stream-ios-wda-client.spec.ts
git commit -m "feat(device-stream/ios): apply WDA dispatch tunables on session start

Reduces per-call WDA dispatch wall-time by ~40% on iOS 26.4.2 by setting
waitForIdleTimeout=0 and animationCoolOffTimeout=0 immediately after
WDA session creation. Other tunables attempted in the spike were not
recognized by WDA 12.2.2 and are documented for future revisits.

See docs/spikes/04-ios-input-latency-spike.md."
```

---

### Task 2: Add `wdaClient.actions()` and `wdaClient.tapViaActions()`

**Files:**
- Modify: `src/device-stream/ios/wda-client.ts`
- Modify: `test/unit/device-stream-ios-wda-client.spec.ts`

Spike Decision 2: `/actions` is ~22 % faster than `/wda/tap` for tap dispatch (631 ms vs 818 ms p50 with tunables applied). Add the methods, wire in Task 3.

- [ ] **Step 1: Write failing test for `actions()`**

Append to `test/unit/device-stream-ios-wda-client.spec.ts` (inside the top-level describe):
```typescript
describe('actions', () => {
  it('POSTs a single pointer chain to /actions', async () => {
    let captured: { url?: string; body?: unknown } = {};
    const fakePost = async (url: string, body: unknown) => {
      captured = { url, body };
      return { data: { value: null } };
    };
    const client = new WDAClient('http://localhost:8100');
    (client as unknown as { http: { post: typeof fakePost } }).http = { post: fakePost } as never;
    const seq = [
      { type: 'pointerMove', duration: 0, x: 100, y: 200 },
      { type: 'pointerDown', button: 0 },
    ];
    await client.actions('SID-1', seq);
    expect(captured.url).to.equal('/session/SID-1/actions');
    expect(captured.body).to.deep.equal({
      actions: [{
        type: 'pointer', id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: seq,
      }],
    });
  });
});

describe('tapViaActions', () => {
  it('POSTs a 1-frame down/up sequence to /actions at the given coords', async () => {
    let captured: { url?: string; body?: unknown } = {};
    const fakePost = async (url: string, body: unknown) => {
      captured = { url, body };
      return { data: { value: null } };
    };
    const client = new WDAClient('http://localhost:8100');
    (client as unknown as { http: { post: typeof fakePost } }).http = { post: fakePost } as never;
    await client.tapViaActions('SID-1', 263.5, 859.5);
    expect(captured.url).to.equal('/session/SID-1/actions');
    const body = captured.body as { actions: Array<{ actions: unknown[] }> };
    expect(body.actions[0].actions).to.deep.equal([
      { type: 'pointerMove', duration: 0, x: 263.5, y: 859.5 },
      { type: 'pointerDown', button: 0 },
      { type: 'pause', duration: 30 },
      { type: 'pointerUp', button: 0 },
    ]);
  });
});
```

- [ ] **Step 2: Run the failing tests**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-wda-client.spec.ts --exit --timeout=20000
```
Expected: FAIL — `actions`/`tapViaActions` not a function.

- [ ] **Step 3: Implement the methods**

Edit `src/device-stream/ios/wda-client.ts`. Add to the bottom of the `WDAClient` class:
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

  async tapViaActions(sessionId: string, x: number, y: number): Promise<void> {
    await this.actions(sessionId, [
      { type: 'pointerMove', duration: 0, x, y },
      { type: 'pointerDown', button: 0 },
      { type: 'pause', duration: 30 },
      { type: 'pointerUp', button: 0 },
    ]);
  }
```

- [ ] **Step 4: Run tests, confirm pass**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-ios-wda-client.spec.ts --exit --timeout=20000
```
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/ios/wda-client.ts test/unit/device-stream-ios-wda-client.spec.ts
git commit -m "feat(device-stream/ios): add WDAClient.actions() and tapViaActions() helpers

Spike 04 found /actions p50 ~631ms vs /wda/tap ~818ms with tunables
applied. Adds the W3C Actions wrapper and a 1-frame tap helper for
the router to swap to in the next commit.

See docs/spikes/04-ios-input-latency-spike.md."
```

---

### Task 3: Swap tap dispatch to `/actions` + cap swipe duration

**Files:**
- Modify: `src/device-stream/router.ts`

Two changes, one commit. Both directly address spike findings.

- [ ] **Step 1: Open `src/device-stream/router.ts` and locate the iOS WS message handler**

The handler dispatches `tap`, `swipe`, and `intent` messages. Currently around lines 632–676 (line numbers may drift). Look for the chain `if (msg.kind === 'tap') { ... } else if (msg.kind === 'swipe') { ... }`.

- [ ] **Step 2: Swap the `tap` branch to use `tapViaActions`**

Replace:
```typescript
      if (msg.kind === 'tap') {
        await handle.wdaClient.tap(handle.sessionId, msg.x, msg.y);
      }
```
with:
```typescript
      if (msg.kind === 'tap') {
        // /actions is ~22% faster than /wda/tap on WDA 12.2.2 + iOS 26.4.2
        // after tunables; see docs/spikes/04-ios-input-latency-spike.md.
        await handle.wdaClient.tapViaActions(handle.sessionId, msg.x, msg.y);
      }
```

- [ ] **Step 3: Cap swipe duration in the `swipe` branch**

Replace:
```typescript
      } else if (msg.kind === 'swipe') {
        await handle.wdaClient.drag(
          handle.sessionId,
          msg.x1,
          msg.y1,
          msg.x2,
          msg.y2,
          msg.durationMs,
        );
```
with:
```typescript
      } else if (msg.kind === 'swipe') {
        // Cap on-device replay duration: WDA renders drags at the requested
        // duration. Operator-drawn long swipes (e.g. 300ms) feel sluggish
        // on the iPhone; clamping to 120ms gives a snappy on-device gesture
        // regardless of how long the operator drew it. Lower bound preserves
        // distinguishability vs taps. See docs/spikes/04-ios-input-latency-spike.md.
        const cappedDuration = Math.min(120, Math.max(50, msg.durationMs));
        await handle.wdaClient.drag(
          handle.sessionId,
          msg.x1,
          msg.y1,
          msg.x2,
          msg.y2,
          cappedDuration,
        );
```

- [ ] **Step 4: Type-check**

Run:
```bash
cd /Users/kry/personal/code/falx && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Run all device-stream unit tests to confirm no regression**

Run:
```bash
cd /Users/kry/personal/code/falx && npx mocha -r ts-node/register ./test/unit/device-stream-*.spec.ts --exit --timeout=20000
```
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/device-stream/router.ts
git commit -m "feat(device-stream/router): swap tap to /actions + cap swipe duration at 120ms

Two iOS input-responsiveness changes:
- Tap dispatch now uses WDA's W3C /actions endpoint via tapViaActions
  (p50 ~631ms vs /wda/tap ~818ms after tunables, per spike 04).
- Swipe duration is clamped to [50, 120]ms regardless of how long the
  operator drew the gesture. Eliminates the 'WDA replays the swipe
  slowly on the iPhone' complaint without breaking tap/swipe
  distinguishability.

See docs/spikes/04-ios-input-latency-spike.md."
```

---

### Task 4: Optimistic canvas overlays (ring + trail) — `falx-ui`

**Files:**
- Create: `falx-ui/src/pages/UseDevice/overlay-renderer.ts`
- Create: `falx-ui/src/pages/UseDevice/overlay-renderer.spec.ts`
- Modify: `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`

Pure-function overlay renderer with unit tests, then wire it into the canvas. This is the single biggest perceptual win — the canvas reacts instantly even while the underlying WDA dispatch waits 600 ms+.

- [ ] **Step 1: Confirm `falx-ui` has `vitest`**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && cat package.json | grep -E "(vitest|test\")"
```
Expected: a `"test"` script invoking `vitest` AND `vitest` in `devDependencies`. If absent, STOP and ask — this plan assumes `vitest` is set up per the repo's `falx-ui/` convention.

- [ ] **Step 2: Write failing tests for the renderer**

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
    it('draws an arc at the touch point', () => {
      const { ctx, calls } = fakeCtx();
      drawRing(ctx, { x: 100, y: 200, ageMs: 0, lifetimeMs: 200 });
      const arc = calls.find((c) => c.method === 'arc');
      expect(arc).toBeTruthy();
      expect(arc!.args[0]).toBe(100);
      expect(arc!.args[1]).toBe(200);
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

- [ ] **Step 3: Run the test to confirm it fails**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx vitest run src/pages/UseDevice/overlay-renderer.spec.ts
```
Expected: FAIL — module `./overlay-renderer` not found.

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

- [ ] **Step 6: Wire the renderer into `IOSStreamCanvas.tsx`**

Edit `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`. Make six changes in this order:

(a) Add the import + constants at the top with the other imports:
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

(b) Inside the `IOSStreamCanvas(props)` component, immediately after the existing `const pointerStart = useRef<...>(null);` line, add:
```typescript
  const ringRef = useRef<{ x: number; y: number; tStartMs: number } | null>(null);
  const trailRef = useRef<{ x: number; y: number; tMs: number }[]>([]);
  const overlayRafRef = useRef<number | null>(null);
```

(c) Inside the component, before the `useEffect` that connects WS, add:
```typescript
  function renderOverlays() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const now = performance.now();
    const ring = ringRef.current;
    const trail = trailRef.current;
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

(d) Replace the existing `clientToPoints` helper with one that returns both spaces:
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
Then update `onPointerDown` and `onPointerUp` call sites: replace `const p = clientToPoints(e);` and `const end = clientToPoints(e);` with calls to `clientToCanvasAndPoints(e)` and destructure `{ x, y }` (existing point-space usage stays identical; new `px` / `py` feed the overlay refs).

(e) In `onPointerDown`, after `pointerStart.current = { x: p.x, y: p.y, t: performance.now() };` (and before `e.preventDefault();`), add:
```typescript
    ringRef.current = { x: p.px, y: p.py, tStartMs: performance.now() };
    trailRef.current = [{ x: p.px, y: p.py, tMs: performance.now() }];
    startOverlayLoop();
```

(f) Add a new `onPointerMove` handler in the component:
```typescript
  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!pointerStart.current) return;
    const p = clientToCanvasAndPoints(e);
    const now = performance.now();
    trailRef.current.push({ x: p.px, y: p.py, tMs: now });
    if (trailRef.current.length > 64) trailRef.current.shift();
    startOverlayLoop();
    e.preventDefault();
  }
```
This handler ONLY drives the visual trail; no WS messages are sent during the drag (server still gets one `swipe` message at pointerup, per the existing path).

(g) In `onPointerUp` after `pointerStart.current = null;`, add `trailRef.current = [];` (clear the trail; the ring continues to fade naturally via the overlay loop). In `onPointerCancel` after `pointerStart.current = null;`, add `trailRef.current = []; ringRef.current = null;`.

(h) Attach `onPointerMove={onPointerMove}` to the canvas JSX next to the other pointer handlers.

(i) In the WS-connection `useEffect`'s cleanup return, add overlay-rAF cancellation:
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

- [ ] **Step 7: Type-check**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add falx-ui/src/pages/UseDevice/overlay-renderer.ts falx-ui/src/pages/UseDevice/overlay-renderer.spec.ts falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx
git commit -m "feat(falx-ui): optimistic canvas overlays for iOS Use Device (ring + trail)

Draws a transient ring at pointerdown and a fading trail during drag,
layered over the MJPEG frame on the same canvas. Renders instantly,
no network round-trip. Masks the unavoidable ~600ms WDA dispatch wait
on iOS 26.4.2 (see docs/spikes/04-ios-input-latency-spike.md) by
giving the operator immediate visual confirmation that the gesture
was registered.

Pure-function renderer with unit tests for ring drawing, trail
polyline, expiry, and trim semantics."
```

---

## Phase 3 — Verification

### Task 5: Run full unit-test suite

**Files:** none (verification only)

- [ ] **Step 1: Server unit tests**

Run:
```bash
cd /Users/kry/personal/code/falx && npm test 2>&1 | tail -20
```
Expected: all tests pass; no new failures vs `main`.

- [ ] **Step 2: `falx-ui` unit tests**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npx vitest run 2>&1 | tail -20
```
Expected: all tests pass.

- [ ] **Step 3: If any test fails, fix in place and re-run. Do NOT proceed to Task 6 with red tests.**

---

### Task 6: Build + start falx server + agent Playwright MCP self-verification

**Files:** none (operational + ephemeral verification via MCP browser tools)

This task is the agent's responsibility — drive the running falx-ui via `mcp__playwright__browser_*` tools after a clean build. No repo changes.

- [ ] **Step 1: Confirm operator-side prerequisites**

The agent asks the operator (you) to confirm:
- `kry-phone` is connected via USB and unlocked.
- `sudo ios tunnel start` is running.
- The spike-04 harness on port 8081 is stopped (otherwise it conflicts on `ios runwda`).
- The current falx appium server is restarted to pick up the new bridge code.

- [ ] **Step 2: Build the `falx-ui` bundle**

Run:
```bash
cd /Users/kry/personal/code/falx/falx-ui && npm run build
```
Expected: clean build, `dist/` populated.

- [ ] **Step 3: Restart the falx appium server**

Operator stops the running appium (PID was 9907 at spike start; may differ now) and re-runs whatever command they normally use to start the falx appium plugin. Agent waits for confirmation that the dashboard URL is reachable again.

- [ ] **Step 4: Drive the UI flow via Playwright MCP**

Tools used: `mcp__playwright__browser_navigate`, `_click`, `_wait_for`, `_evaluate`, `_take_screenshot`, `_network_requests`, `_console_messages`.

(a) Navigate to the dashboard URL (typically `http://localhost:4723/device-farm/`).
(b) Confirm kry-phone is listed; click Use Device.
(c) Wait for the stream canvas to render (a frame painted).
(d) Hook a WebSocket frame inspector via `browser_evaluate`:
```javascript
() => {
  window.__falxWsFrames = [];
  const originalSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function(data) {
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
      const view = data instanceof Uint8Array ? data : new Uint8Array(data);
      window.__falxWsFrames.push({ tag: view[0], len: view.length, t: performance.now() });
    }
    return originalSend.call(this, data);
  };
  return 'hooked';
}
```

(e) Dispatch a synthetic tap on the canvas via `browser_evaluate`. Confirm one WS frame with `tag === 0x20` (CLIENT_TAP_TAG) was sent. Take a screenshot immediately after pointerdown to confirm the optimistic ring is visible on the canvas before the WDA dispatch returns.

(f) Dispatch a synthetic drag (pointerdown → several pointermoves → pointerup). Confirm one WS frame with `tag === 0x21` (CLIENT_SWIPE_TAG) was sent at pointerup. Confirm the trail overlay was visible during the drag via mid-drag screenshot. Confirm trail is cleared after pointerup via post-up screenshot.

(g) Measure observable response latency: dispatch a tap on a SpringBoard icon (compute canvas pixel coords from icon points), record `t0`, sample the canvas at the icon center via `getImageData` in a tight loop watching for pixel-color change. Report dt across 5 trials.

(h) Verify no regressions: click Home button in the toolbar → assert intent frame (`tag === 0x22`). Click App Switcher → same. Click Stop → WS closes cleanly, no console errors.

- [ ] **Step 5: Agent writes the verification log into the user-facing hand-off message**

Summary template:
- Build status: clean / failed.
- Server status: appium up, kry-phone reachable, stream rendering.
- WS protocol: tap and swipe messages observed with expected tags + lengths.
- Optimistic overlays: ring rendered at pointerdown screenshot, trail rendered during drag, both cleared on pointerup.
- Tap response latency: 5 trials, p50 / max.
- Regressions: home + app_switcher + stop all green; no console errors.
- Anomalies: <list, or "none">.

If any check fails, agent fixes it (within the implementation scope) and re-runs the verification pass. Hand-off message goes to the operator only when the Playwright pass is green-on-arrival.

---

### Task 7: Operator subjective gate on kry-phone

**Files:**
- Modify: `docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md` (append `### Manual verification — kry-phone (YYYY-MM-DD)` section)

Operator-driven; agent provides the checklist and waits for results.

- [ ] **Step 1: Operator drives five apps**

Photos, Settings, Safari, Maps, plus one third-party app of the operator's choice. For each: ten taps + five drags. Operator records per-app subjective notes.

- [ ] **Step 2: Re-run the 50-cycle leak script from the prior iOS Use Device slice**

Path: see the prior slice's manual verification section in
`docs/superpowers/specs/2026-05-18-ios-use-device-design.md` § "Manual verification — kry-phone (2026-05-18)". Confirm zero leaked `ios runwda` / `ios forward` processes.

- [ ] **Step 3: Operator records the subjective verdict**

Append to the spec file:
```markdown
### Manual verification — kry-phone (YYYY-MM-DD)

- Apps tested: Photos, Settings, Safari, Maps, <third-party>.
- Per-app notes: <one line each>.
- 50-cycle leak run: clean / N leaked (process listing).
- Tap response latency (post-implementation, agent Playwright pass): p50=<X>ms, max=<Y>ms.
- Subjective verdict: **noticeably more responsive Y / N**.
- Notes: <what shifted the verdict; specifically: does the optimistic
  ring + trail mask the dispatch wait satisfactorily? does the swipe
  duration cap eliminate the 'WDA replays slowly' complaint?>.
```

- [ ] **Step 4: Commit the verification log**

```bash
git add docs/superpowers/specs/2026-05-18-ios-input-responsiveness-design.md
git commit -m "docs(ios-input): manual verification on kry-phone YYYY-MM-DD"
```

- [ ] **Step 5: Hand off to user for review**

The slice is now "ready for review" — unit tests green, agent Playwright pass green with evidence in conversation log, operator manual gate green with verdict appended to spec. User takes it from here.
