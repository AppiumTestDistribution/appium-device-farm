# iOS Use Device Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the iOS path of the Falx browser "Use Device" feature — click a USB-attached iPhone in the Falx UI, see a live MJPEG screen view, tap and swipe, fire Home / App Switcher, stop cleanly. Mirrors the Android slice (2026-05-16) and reuses its registry + reservation API (2026-05-17 fix-up).

**Architecture:** go-ios runs WebDriverAgent on the device, USB-forwarded to a per-device port pair on the host. A new `src/device-stream/ios/` module orchestrates the child processes, attaches an Appium XCUITest session to that WDA (so the device shows in the existing Sessions UI), proxies WDA's MJPEG to N WebSocket subscribers (single-upstream / multi-downstream fan-out), and translates `CLIENT_TAP`/`SWIPE`/`INTENT` WS messages into WDA REST calls. The Falx-UI mounts a new `IOSStreamCanvas` that decodes MJPEG frames via `createImageBitmap` into a `<canvas>`.

**Tech Stack:** TypeScript, Node built-ins (http, child_process, stream), Express, ws, axios (already in tree). No new top-level npm dependencies. React 18 + Vite (existing falx-ui). go-ios + WebDriverAgent installed on the host/device by the operator.

---

## Spec reference

This plan implements [docs/superpowers/specs/2026-05-18-ios-use-device-design.md](../specs/2026-05-18-ios-use-device-design.md). Read it before starting. Decisions locked in the spec are not re-litigated here.

Related specs (read for shape and reuse):
- [docs/superpowers/specs/2026-05-16-android-use-device-design.md](../specs/2026-05-16-android-use-device-design.md) — sibling slice, established the registry / router / UI shape.
- [docs/superpowers/specs/2026-05-17-android-use-device-concurrency-fix-design.md](../specs/2026-05-17-android-use-device-concurrency-fix-design.md) — established `tryReserveUdid` / `promote` / `releaseReservation` API which iOS reuses unchanged.

## Spike reference (read-only — do NOT modify)

The spikes are validated reference implementations. The plan refactors their logic into Falx code; it does **not** invent new approaches.

- [docs/spikes/02-ios-streaming-spike.md](../../spikes/02-ios-streaming-spike.md) — source of truth for the sequenced go-ios spawn (image auto → runwda → 3 s wait → forward 8100 → 500 ms → forward 9100), the MJPEG `boundary=--BoundaryString` quirk, the MJPEG tuning settings (framerate:20, quality:70, scaling:100), and the `.xctrunner` bundle ID convention.
- [docs/spikes/03-ios-tap-injection-spike.md](../../spikes/03-ios-tap-injection-spike.md) — source of truth for bare-minimum WDA session caps `{"capabilities":{"alwaysMatch":{"platformName":"iOS"}}}`, the points-vs-pixels coordinate convention, the SpringBoard launch regression on iOS 26 (don't use `appium:bundleId` or `/wda/apps/launch`), the working endpoints (`/wda/tap`, `/wda/dragfromtoforduration`, `/wda/keys`, `/wda/apps/terminate`, `/wda/activeAppInfo`).

The spike directories may have been cleaned up; the findings in those two docs are the authoritative reference.

## Hard prerequisites (operator-managed, not in this plan's code)

Document in the plan's manual-verification task but do not automate:
- macOS host with Xcode + Apple Developer signing identity (free Apple ID OK).
- iPhone iOS 16+ paired, Developer Mode enabled.
- WDA built + installed via Xcode at least once. Default runner bundle ID in this plan: `com.falx.WebDriverAgentRunner.xctrunner` (override via `WDA_RUNNER_BUNDLE_ID` env var).
- `brew install go-ios` (`ios` command on PATH).
- `sudo ios tunnel start` running in a separate terminal.

## File map

**Backend (in-process Falx plugin):**
- Modify `src/device-stream/types.ts` — add iOS WS tag constants + intent codes.
- Create `src/device-stream/ios/port-allocator.ts` — UDID → port pair allocator.
- Create `src/device-stream/ios/framing.ts` — iOS WS encode/decode helpers.
- Create `src/device-stream/ios/wda-client.ts` — thin WDA REST client.
- Create `src/device-stream/ios/mjpeg.ts` — multipart fetch + fan-out.
- Create `src/device-stream/ios/bridge.ts` — `IOSWdaBridge` class.
- Modify `src/device-stream/router.ts` — platform dispatch.

**Backend tests:**
- Create `test/unit/device-stream-ios-port-allocator.spec.ts`
- Create `test/unit/device-stream-ios-framing.spec.ts`
- Create `test/unit/device-stream-ios-wda-client.spec.ts`
- Create `test/unit/device-stream-ios-mjpeg.spec.ts`
- Create `test/integration/device-stream-ios-lifecycle.spec.ts`

**Falx-UI:**
- Create `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`
- Create `falx-ui/src/pages/UseDevice/IOSControlToolbar.tsx`
- Modify `falx-ui/src/pages/UseDevice/UseDevice.tsx` — platform switch.
- Modify `falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx` — per-platform feature gate.
- Modify `falx-ui/src/components/devicecard/DeviceCard.tsx` — enable Use Device button for iOS.

**Repo:**
- No ADR (no new top-level npm deps).

---

## Task 1: Extend the shared types module with iOS WS tags

Pure constants. No logic.

**Files:**
- Modify: `src/device-stream/types.ts`

- [x] **Step 1: Add iOS tags to `types.ts`**

Edit `src/device-stream/types.ts`. After the existing `CLIENT_KEYCODE_TAG = 0x11` line, add:

```typescript
/** Server → client WS message tag (iOS): raw JPEG frame payload. */
export const SRV_TAG_FRAME = 0x04;

/** Client → server WS message tags (iOS). */
export const CLIENT_TAP_TAG = 0x20;
export const CLIENT_SWIPE_TAG = 0x21;
export const CLIENT_INTENT_TAG = 0x22;

/** Intent codes carried by CLIENT_INTENT_TAG (one-byte body). */
export const INTENT_HOME = 0x01;
export const INTENT_APP_SWITCHER = 0x02;

/** Payload types shared across iOS framing + bridge + router. */
export interface IosMetaPayload {
  deviceWidthPoints: number;
  deviceHeightPoints: number;
  deviceWidthPixels: number;
  deviceHeightPixels: number;
  scale: number;
}

export interface IosTapMessage {
  kind: 'tap';
  x: number;
  y: number;
}

export interface IosSwipeMessage {
  kind: 'swipe';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  durationMs: number;
}

export interface IosIntentMessage {
  kind: 'intent';
  intent: 'home' | 'app_switcher';
}

export type IosClientMessage = IosTapMessage | IosSwipeMessage | IosIntentMessage;
```

Also extend `StartUseDeviceResponse` (currently in this file) with an optional `scale?: number` for iOS:

```typescript
export interface StartUseDeviceResponse {
  sessionId: string;
  streamUrl: string;
  platform: Platform;
  deviceWidth: number;
  deviceHeight: number;
  /** iOS only: screen scale factor (typically 2 or 3). Omitted for Android. */
  scale?: number;
}
```

- [x] **Step 2: Verify TS compiles**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i 'device-stream/types' || echo "OK"
```
Expected: `OK`.

- [x] **Step 3: Commit**

```bash
git add src/device-stream/types.ts
git commit -m "feat(device-stream): add iOS WS tags + payload types"
```

---

## Task 2: Port allocator (TDD)

UDID → `(wdaRestPort, wdaMjpegPort)` allocator. Pure logic, fully testable.

**Files:**
- Create: `src/device-stream/ios/port-allocator.ts`
- Test: `test/unit/device-stream-ios-port-allocator.spec.ts`

- [x] **Step 1: Write the failing tests**

`test/unit/device-stream-ios-port-allocator.spec.ts`:

```typescript
import { expect } from 'chai';
import { IOSPortAllocator } from '../../src/device-stream/ios/port-allocator';

describe('IOSPortAllocator', () => {
  it('allocates the base ports for the first device', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    expect(a.allocate('udid-A')).to.deep.equal({ wdaRestPort: 8100, wdaMjpegPort: 9100 });
  });

  it('allocates incrementing ports for additional devices', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    expect(a.allocate('udid-B')).to.deep.equal({ wdaRestPort: 8101, wdaMjpegPort: 9101 });
    expect(a.allocate('udid-C')).to.deep.equal({ wdaRestPort: 8102, wdaMjpegPort: 9102 });
  });

  it('returns the same ports if the same UDID is allocated twice', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    const first = a.allocate('udid-A');
    const second = a.allocate('udid-A');
    expect(second).to.deep.equal(first);
  });

  it('reuses released slots before incrementing', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    a.allocate('udid-B');
    a.release('udid-A');
    expect(a.allocate('udid-C')).to.deep.equal({ wdaRestPort: 8100, wdaMjpegPort: 9100 });
  });

  it('release is idempotent', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    a.release('udid-A');
    a.release('udid-A'); // no throw
    expect(a.getAllocated().size).to.equal(0);
  });

  it('getAllocated() returns the current udid→ports map', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    a.allocate('udid-B');
    const all = a.getAllocated();
    expect(all.size).to.equal(2);
    expect(all.get('udid-A')).to.deep.equal({ wdaRestPort: 8100, wdaMjpegPort: 9100 });
    expect(all.get('udid-B')).to.deep.equal({ wdaRestPort: 8101, wdaMjpegPort: 9101 });
  });
});
```

- [x] **Step 2: Run tests; verify they fail with module-not-found**

```bash
npm test -- --grep IOSPortAllocator
```
Expected: errors importing `port-allocator` (file does not exist).

- [x] **Step 3: Write the allocator**

`src/device-stream/ios/port-allocator.ts`:

```typescript
export interface PortPair {
  wdaRestPort: number;
  wdaMjpegPort: number;
}

export interface IOSPortAllocatorOptions {
  baseRestPort: number;
  baseMjpegPort: number;
}

export class IOSPortAllocator {
  private byUdid = new Map<string, PortPair>();
  private usedSlots = new Set<number>(); // slot index = port - basePort

  constructor(private readonly options: IOSPortAllocatorOptions) {}

  allocate(udid: string): PortPair {
    const existing = this.byUdid.get(udid);
    if (existing) return existing;

    // Find lowest free slot.
    let slot = 0;
    while (this.usedSlots.has(slot)) slot++;
    this.usedSlots.add(slot);

    const pair: PortPair = {
      wdaRestPort: this.options.baseRestPort + slot,
      wdaMjpegPort: this.options.baseMjpegPort + slot,
    };
    this.byUdid.set(udid, pair);
    return pair;
  }

  release(udid: string): void {
    const pair = this.byUdid.get(udid);
    if (!pair) return;
    const slot = pair.wdaRestPort - this.options.baseRestPort;
    this.usedSlots.delete(slot);
    this.byUdid.delete(udid);
  }

  getAllocated(): Map<string, PortPair> {
    return new Map(this.byUdid);
  }
}
```

- [x] **Step 4: Run tests; verify all pass**

```bash
npm test -- --grep IOSPortAllocator
```
Expected: 6 passing.

- [x] **Step 5: Commit**

```bash
git add src/device-stream/ios/port-allocator.ts test/unit/device-stream-ios-port-allocator.spec.ts
git commit -m "feat(device-stream/ios): per-device WDA port allocator (TDD)"
```

---

## Task 3: iOS WS framing helpers (TDD)

Pure binary protocol encode/decode for the iOS-specific WS tags added in Task 1. Mirrors `src/device-stream/android/framing.ts` shape.

**Files:**
- Create: `src/device-stream/ios/framing.ts`
- Test: `test/unit/device-stream-ios-framing.spec.ts`

- [x] **Step 1: Write the failing tests**

`test/unit/device-stream-ios-framing.spec.ts`:

```typescript
import { expect } from 'chai';
import {
  encodeIosMeta,
  encodeIosFrame,
  decodeIosClientMessage,
} from '../../src/device-stream/ios/framing';
import {
  SRV_TAG_META,
  SRV_TAG_FRAME,
  CLIENT_TAP_TAG,
  CLIENT_SWIPE_TAG,
  CLIENT_INTENT_TAG,
  INTENT_HOME,
  INTENT_APP_SWITCHER,
} from '../../src/device-stream/types';

describe('iOS framing', () => {
  describe('encodeIosMeta', () => {
    it('prefixes JSON payload with SRV_TAG_META', () => {
      const buf = encodeIosMeta({
        deviceWidthPoints: 428,
        deviceHeightPoints: 926,
        deviceWidthPixels: 1284,
        deviceHeightPixels: 2778,
        scale: 3,
      });
      expect(buf[0]).to.equal(SRV_TAG_META);
      const json = JSON.parse(buf.slice(1).toString('utf-8'));
      expect(json).to.deep.equal({
        deviceWidthPoints: 428,
        deviceHeightPoints: 926,
        deviceWidthPixels: 1284,
        deviceHeightPixels: 2778,
        scale: 3,
      });
    });
  });

  describe('encodeIosFrame', () => {
    it('prefixes JPEG bytes with SRV_TAG_FRAME and 4-byte BE length', () => {
      const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const buf = encodeIosFrame(jpeg);
      expect(buf[0]).to.equal(SRV_TAG_FRAME);
      expect(buf.readUInt32BE(1)).to.equal(jpeg.length);
      expect(buf.slice(5)).to.deep.equal(jpeg);
    });
  });

  describe('decodeIosClientMessage', () => {
    it('decodes a tap message', () => {
      const buf = Buffer.alloc(1 + 8);
      buf[0] = CLIENT_TAP_TAG;
      buf.writeFloatBE(263.5, 1);
      buf.writeFloatBE(859.5, 5);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'tap',
        x: 263.5,
        y: 859.5,
      });
    });

    it('decodes a swipe message', () => {
      const buf = Buffer.alloc(1 + 20);
      buf[0] = CLIENT_SWIPE_TAG;
      buf.writeFloatBE(380, 1);
      buf.writeFloatBE(463, 5);
      buf.writeFloatBE(40, 9);
      buf.writeFloatBE(463, 13);
      buf.writeUInt32BE(250, 17);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'swipe',
        x1: 380,
        y1: 463,
        x2: 40,
        y2: 463,
        durationMs: 250,
      });
    });

    it('decodes HOME intent', () => {
      const buf = Buffer.from([CLIENT_INTENT_TAG, INTENT_HOME]);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'intent',
        intent: 'home',
      });
    });

    it('decodes APP_SWITCHER intent', () => {
      const buf = Buffer.from([CLIENT_INTENT_TAG, INTENT_APP_SWITCHER]);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'intent',
        intent: 'app_switcher',
      });
    });

    it('returns null for unknown tag', () => {
      const buf = Buffer.from([0xff, 0x00]);
      expect(decodeIosClientMessage(buf)).to.equal(null);
    });

    it('returns null for truncated tap payload', () => {
      const buf = Buffer.from([CLIENT_TAP_TAG, 0x00, 0x00]);
      expect(decodeIosClientMessage(buf)).to.equal(null);
    });
  });
});
```

- [x] **Step 2: Run tests; verify they fail (module not found)**

```bash
npm test -- --grep 'iOS framing'
```

- [x] **Step 3: Implement the framing module**

`src/device-stream/ios/framing.ts`:

```typescript
import {
  SRV_TAG_META,
  SRV_TAG_FRAME,
  CLIENT_TAP_TAG,
  CLIENT_SWIPE_TAG,
  CLIENT_INTENT_TAG,
  INTENT_HOME,
  INTENT_APP_SWITCHER,
  IosMetaPayload,
  IosClientMessage,
} from '../types';

export function encodeIosMeta(payload: IosMetaPayload): Buffer {
  const json = Buffer.from(JSON.stringify(payload), 'utf-8');
  const out = Buffer.alloc(1 + json.length);
  out[0] = SRV_TAG_META;
  json.copy(out, 1);
  return out;
}

export function encodeIosFrame(jpeg: Buffer): Buffer {
  const out = Buffer.alloc(1 + 4 + jpeg.length);
  out[0] = SRV_TAG_FRAME;
  out.writeUInt32BE(jpeg.length, 1);
  jpeg.copy(out, 5);
  return out;
}

export function decodeIosClientMessage(buf: Buffer): IosClientMessage | null {
  if (buf.length < 1) return null;
  const tag = buf[0];

  if (tag === CLIENT_TAP_TAG) {
    if (buf.length < 1 + 8) return null;
    return {
      kind: 'tap',
      x: buf.readFloatBE(1),
      y: buf.readFloatBE(5),
    };
  }

  if (tag === CLIENT_SWIPE_TAG) {
    if (buf.length < 1 + 20) return null;
    return {
      kind: 'swipe',
      x1: buf.readFloatBE(1),
      y1: buf.readFloatBE(5),
      x2: buf.readFloatBE(9),
      y2: buf.readFloatBE(13),
      durationMs: buf.readUInt32BE(17),
    };
  }

  if (tag === CLIENT_INTENT_TAG) {
    if (buf.length < 2) return null;
    const code = buf[1];
    if (code === INTENT_HOME) return { kind: 'intent', intent: 'home' };
    if (code === INTENT_APP_SWITCHER) return { kind: 'intent', intent: 'app_switcher' };
    return null;
  }

  return null;
}
```

- [x] **Step 4: Run tests; verify all pass**

```bash
npm test -- --grep 'iOS framing'
```
Expected: 7 passing.

- [x] **Step 5: Commit**

```bash
git add src/device-stream/ios/framing.ts test/unit/device-stream-ios-framing.spec.ts
git commit -m "feat(device-stream/ios): WS framing encode/decode (TDD)"
```

---

## Task 4: WDA HTTP client (TDD)

Thin axios-based wrapper over WDA's REST API. Tested against a real `http.Server` listening on a random port (no nock dependency).

**Files:**
- Create: `src/device-stream/ios/wda-client.ts`
- Test: `test/unit/device-stream-ios-wda-client.spec.ts`

- [x] **Step 1: Write the failing tests**

`test/unit/device-stream-ios-wda-client.spec.ts`:

```typescript
import { expect } from 'chai';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { WDAClient, DeviceLockedError } from '../../src/device-stream/ios/wda-client';

async function withServer(
  handler: (req: http.IncomingMessage, res: http.ServerResponse) => void,
  block: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const server = http.createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as AddressInfo).port;
  try {
    await block(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

describe('WDAClient', () => {
  it('getStatus returns ready=true when WDA returns 200', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/status') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ value: { ready: true } }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        const r = await c.getStatus();
        expect(r.ready).to.equal(true);
      },
    );
  });

  it('createSession POSTs bare-minimum caps and returns sessionId', async () => {
    let postedBody: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session' && req.method === 'POST') {
            postedBody = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ value: { sessionId: 'WDA-SESSION-ABC' } }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        const sid = await c.createSession();
        expect(sid).to.equal('WDA-SESSION-ABC');
        expect(postedBody).to.deep.equal({
          capabilities: { alwaysMatch: { platformName: 'iOS' } },
        });
      },
    );
  });

  it('getLocked returns boolean from value field', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID/wda/locked') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ value: true }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        expect(await c.getLocked('SID')).to.equal(true);
      },
    );
  });

  it('getScreen returns width/height/scale from value field', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID/wda/screen') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              value: {
                statusBarSize: { width: 428, height: 47 },
                scale: 3,
                screenSize: { width: 428, height: 926 },
              },
            }),
          );
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        const s = await c.getScreen('SID');
        expect(s).to.deep.equal({ width: 428, height: 926, scale: 3 });
      },
    );
  });

  it('tap posts x/y to /wda/tap', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/wda/tap' && req.method === 'POST') {
            posted = JSON.parse(body);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ value: null }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.tap('SID', 263.5, 859.5);
        expect(posted).to.deep.equal({ x: 263.5, y: 859.5 });
      },
    );
  });

  it('drag posts fromX/fromY/toX/toY/duration (in seconds) to /wda/dragfromtoforduration', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/wda/dragfromtoforduration' && req.method === 'POST') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: null }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.drag('SID', 380, 463, 40, 463, 250);
        expect(posted).to.deep.equal({
          fromX: 380, fromY: 463, toX: 40, toY: 463, duration: 0.25,
        });
      },
    );
  });

  it('getActiveAppBundleId reads value.bundleId from /wda/activeAppInfo', async () => {
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID/wda/activeAppInfo') {
          res.writeHead(200, {});
          res.end(JSON.stringify({ value: { bundleId: 'com.apple.Preferences' } }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        expect(await c.getActiveAppBundleId('SID')).to.equal('com.apple.Preferences');
      },
    );
  });

  it('terminateApp posts bundleId to /wda/apps/terminate', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/wda/apps/terminate') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: true }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.terminateApp('SID', 'com.apple.Preferences');
        expect(posted).to.deep.equal({ bundleId: 'com.apple.Preferences' });
      },
    );
  });

  it('setMjpegSettings POSTs to /appium/settings', async () => {
    let posted: any = null;
    await withServer(
      (req, res) => {
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          if (req.url === '/session/SID/appium/settings') {
            posted = JSON.parse(body);
            res.writeHead(200, {}); res.end(JSON.stringify({ value: {} }));
          }
        });
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.setMjpegSettings('SID', {
          mjpegServerFramerate: 20,
          mjpegServerScreenshotQuality: 70,
          mjpegScalingFactor: 100,
        });
        expect(posted).to.deep.equal({
          settings: {
            mjpegServerFramerate: 20,
            mjpegServerScreenshotQuality: 70,
            mjpegScalingFactor: 100,
          },
        });
      },
    );
  });

  it('deleteSession DELETEs /session/<sid>', async () => {
    let methodSeen = '';
    await withServer(
      (req, res) => {
        if (req.url === '/session/SID') {
          methodSeen = req.method ?? '';
          res.writeHead(200, {}); res.end(JSON.stringify({ value: null }));
        }
      },
      async (baseUrl) => {
        const c = new WDAClient(baseUrl);
        await c.deleteSession('SID');
        expect(methodSeen).to.equal('DELETE');
      },
    );
  });
});
```

- [x] **Step 2: Run tests; verify they fail (module not found)**

```bash
npm test -- --grep 'WDAClient'
```

- [x] **Step 3: Implement the WDA client**

`src/device-stream/ios/wda-client.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

export class DeviceLockedError extends Error {
  constructor() {
    super('device is locked');
    this.name = 'DeviceLockedError';
  }
}

export class WDANotRunningError extends Error {
  constructor(public readonly baseUrl: string, cause?: unknown) {
    super(`WDA not reachable at ${baseUrl}`);
    this.name = 'WDANotRunningError';
    (this as any).cause = cause;
  }
}

export interface ScreenInfo {
  width: number;
  height: number;
  scale: number;
}

export interface MjpegSettings {
  mjpegServerFramerate: number;
  mjpegServerScreenshotQuality: number;
  mjpegScalingFactor: number;
}

export class WDAClient {
  private http: AxiosInstance;
  constructor(public readonly baseUrl: string) {
    this.http = axios.create({ baseURL: baseUrl, timeout: 30_000 });
  }

  async getStatus(): Promise<{ ready: boolean }> {
    try {
      const r = await this.http.get('/status');
      return { ready: Boolean(r.data?.value?.ready ?? true) };
    } catch (err) {
      throw new WDANotRunningError(this.baseUrl, err);
    }
  }

  async createSession(): Promise<string> {
    // Bare-minimum body per spike 03 — no appium:bundleId on iOS 26.
    const body = { capabilities: { alwaysMatch: { platformName: 'iOS' } } };
    const r = await this.http.post('/session', body);
    const sid = r.data?.value?.sessionId;
    if (typeof sid !== 'string') throw new Error('WDA createSession returned no sessionId');
    return sid;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.http.delete(`/session/${sessionId}`);
  }

  async getLocked(sessionId: string): Promise<boolean> {
    const r = await this.http.get(`/session/${sessionId}/wda/locked`);
    return Boolean(r.data?.value);
  }

  async getScreen(sessionId: string): Promise<ScreenInfo> {
    const r = await this.http.get(`/session/${sessionId}/wda/screen`);
    const v = r.data?.value;
    return {
      width: v.screenSize.width,
      height: v.screenSize.height,
      scale: v.scale,
    };
  }

  async tap(sessionId: string, x: number, y: number): Promise<void> {
    await this.http.post(`/session/${sessionId}/wda/tap`, { x, y });
  }

  async drag(
    sessionId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    durationMs: number,
  ): Promise<void> {
    await this.http.post(`/session/${sessionId}/wda/dragfromtoforduration`, {
      fromX: x1,
      fromY: y1,
      toX: x2,
      toY: y2,
      duration: durationMs / 1000,
    });
  }

  async getActiveAppBundleId(sessionId: string): Promise<string | undefined> {
    const r = await this.http.get(`/session/${sessionId}/wda/activeAppInfo`);
    const id = r.data?.value?.bundleId;
    return typeof id === 'string' ? id : undefined;
  }

  async terminateApp(sessionId: string, bundleId: string): Promise<void> {
    await this.http.post(`/session/${sessionId}/wda/apps/terminate`, { bundleId });
  }

  async setMjpegSettings(sessionId: string, settings: MjpegSettings): Promise<void> {
    await this.http.post(`/session/${sessionId}/appium/settings`, { settings });
  }
}
```

- [x] **Step 4: Run tests; verify all pass**

```bash
npm test -- --grep 'WDAClient'
```
Expected: 10 passing.

- [x] **Step 5: Commit**

```bash
git add src/device-stream/ios/wda-client.ts test/unit/device-stream-ios-wda-client.spec.ts
git commit -m "feat(device-stream/ios): WDA HTTP client (TDD)"
```

---

## Task 5: MJPEG fan-out (TDD)

Single upstream multipart fetch → N downstream subscribers. Handles spike 02's `boundary=--BoundaryString` header quirk.

**Files:**
- Create: `src/device-stream/ios/mjpeg.ts`
- Test: `test/unit/device-stream-ios-mjpeg.spec.ts`

- [x] **Step 1: Write the failing tests**

`test/unit/device-stream-ios-mjpeg.spec.ts`:

```typescript
import { expect } from 'chai';
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { MjpegFanout } from '../../src/device-stream/ios/mjpeg';

const BOUNDARY = '--BoundaryStringTest';

function jpegPart(jpeg: Buffer): Buffer {
  // WDA-style frame: boundary line, Content-Type/Length headers, blank line, JPEG, blank line.
  return Buffer.concat([
    Buffer.from(`${BOUNDARY}\r\n`),
    Buffer.from(`Content-Type: image/jpeg\r\n`),
    Buffer.from(`Content-Length: ${jpeg.length}\r\n\r\n`),
    jpeg,
    Buffer.from(`\r\n`),
  ]);
}

describe('MjpegFanout', () => {
  it('extracts JPEG frames from a WDA-style multipart stream using the boundary verbatim', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      res.write(jpegPart(Buffer.from([0xff, 0xd8, 0x01, 0x02])));
      res.write(jpegPart(Buffer.from([0xff, 0xd8, 0x03, 0x04])));
      res.end(jpegPart(Buffer.from([0xff, 0xd8, 0x05, 0x06])));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    const received: Buffer[] = [];
    fan.subscribe((j) => received.push(j));
    await fan.start();
    // wait a short tick for stream draining
    await new Promise((r) => setTimeout(r, 200));
    await fan.stop();
    server.close();

    expect(received).to.have.length(3);
    expect(received[0]).to.deep.equal(Buffer.from([0xff, 0xd8, 0x01, 0x02]));
    expect(received[1]).to.deep.equal(Buffer.from([0xff, 0xd8, 0x03, 0x04]));
    expect(received[2]).to.deep.equal(Buffer.from([0xff, 0xd8, 0x05, 0x06]));
  });

  it('fans out one upstream stream to multiple subscribers', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      res.write(jpegPart(Buffer.from([0xaa])));
      res.write(jpegPart(Buffer.from([0xbb])));
      res.end(jpegPart(Buffer.from([0xcc])));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    const a: Buffer[] = [];
    const b: Buffer[] = [];
    fan.subscribe((j) => a.push(j));
    fan.subscribe((j) => b.push(j));
    await fan.start();
    await new Promise((r) => setTimeout(r, 200));
    await fan.stop();
    server.close();

    expect(a).to.have.length(3);
    expect(b).to.have.length(3);
  });

  it('unsubscribe stops further frames to that subscriber', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      const interval = setInterval(() => {
        res.write(jpegPart(Buffer.from([0x01])));
      }, 20);
      req.on('close', () => clearInterval(interval));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    const received: Buffer[] = [];
    const unsub = fan.subscribe((j) => received.push(j));
    await fan.start();
    await new Promise((r) => setTimeout(r, 100));
    const countAfterFirst = received.length;
    unsub();
    await new Promise((r) => setTimeout(r, 100));
    expect(received.length).to.equal(countAfterFirst);

    await fan.stop();
    server.close();
  });

  it('stop() closes the upstream fetch and is idempotent', async () => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {
        'Content-Type': `multipart/x-mixed-replace; boundary=${BOUNDARY}`,
      });
      const interval = setInterval(() => res.write(jpegPart(Buffer.from([0xff]))), 30);
      req.on('close', () => clearInterval(interval));
    });
    await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
    const port = (server.address() as AddressInfo).port;

    const fan = new MjpegFanout(`http://127.0.0.1:${port}/mjpeg`);
    await fan.start();
    await new Promise((r) => setTimeout(r, 60));
    await fan.stop();
    await fan.stop(); // no throw

    server.close();
  });
});
```

- [x] **Step 2: Run tests; verify they fail (module not found)**

```bash
npm test -- --grep MjpegFanout
```

- [x] **Step 3: Implement the MJPEG fan-out**

`src/device-stream/ios/mjpeg.ts`:

```typescript
import http from 'node:http';
import { URL } from 'node:url';

export type JpegHandler = (jpeg: Buffer) => void;

export class MjpegFanout {
  private subscribers = new Set<JpegHandler>();
  private req: http.ClientRequest | null = null;
  private res: http.IncomingMessage | null = null;
  private stopped = false;

  constructor(private readonly upstreamUrl: string) {}

  start(): Promise<void> {
    if (this.stopped) throw new Error('MjpegFanout: cannot start after stop');
    return new Promise<void>((resolve, reject) => {
      const url = new URL(this.upstreamUrl);
      this.req = http.get(
        {
          host: url.hostname,
          port: url.port ? Number(url.port) : 80,
          path: url.pathname + url.search,
          // No keep-alive; this is a long-lived stream.
        },
        (res) => {
          this.res = res;
          if (res.statusCode !== 200) {
            reject(new Error(`MJPEG upstream status ${res.statusCode}`));
            return;
          }
          // WDA uses the header value verbatim as the body delimiter — do NOT prepend `--`.
          const ct = res.headers['content-type'] ?? '';
          const m = /boundary=(.+)$/i.exec(ct);
          if (!m) {
            reject(new Error('MJPEG response missing boundary'));
            return;
          }
          const boundary = Buffer.from(m[1]!.trim());
          this.parseStream(res, boundary);
          resolve();
        },
      );
      this.req.on('error', (err) => {
        if (!this.stopped) reject(err);
      });
    });
  }

  async stop(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    this.subscribers.clear();
    if (this.res) this.res.destroy();
    if (this.req) this.req.destroy();
  }

  subscribe(handler: JpegHandler): () => void {
    this.subscribers.add(handler);
    return () => this.subscribers.delete(handler);
  }

  private parseStream(res: http.IncomingMessage, boundary: Buffer): void {
    let buf = Buffer.alloc(0);
    res.on('data', (chunk: Buffer) => {
      buf = Buffer.concat([buf, chunk]);

      // Loop: find boundary, find headers/body separator (\r\n\r\n), read Content-Length
      // bytes of JPEG, emit, advance past JPEG + trailing \r\n.
      while (true) {
        const bIdx = buf.indexOf(boundary);
        if (bIdx < 0) break;
        const headerStart = bIdx + boundary.length;
        const headerEnd = buf.indexOf('\r\n\r\n', headerStart);
        if (headerEnd < 0) break;
        const headerText = buf.slice(headerStart, headerEnd).toString('utf-8');
        const lenMatch = /Content-Length:\s*(\d+)/i.exec(headerText);
        if (!lenMatch) {
          // Skip past this malformed part.
          buf = buf.slice(headerEnd + 4);
          continue;
        }
        const len = Number(lenMatch[1]);
        const bodyStart = headerEnd + 4;
        const bodyEnd = bodyStart + len;
        if (buf.length < bodyEnd) break;
        const jpeg = buf.slice(bodyStart, bodyEnd);
        this.dispatch(jpeg);
        buf = buf.slice(bodyEnd);
      }
    });
    res.on('error', () => { /* dispatcher closes; subscribers see no more frames */ });
    res.on('end', () => { /* upstream closed; no more frames */ });
  }

  private dispatch(jpeg: Buffer): void {
    for (const h of this.subscribers) {
      try { h(jpeg); } catch { /* subscriber bug — don't take down dispatch */ }
    }
  }
}
```

- [x] **Step 4: Run tests; verify all pass**

```bash
npm test -- --grep MjpegFanout
```
Expected: 4 passing.

- [x] **Step 5: Commit**

```bash
git add src/device-stream/ios/mjpeg.ts test/unit/device-stream-ios-mjpeg.spec.ts
git commit -m "feat(device-stream/ios): MJPEG single-upstream → N-downstream fan-out (TDD)"
```

---

## Task 6: iOS bridge

Orchestrates the sequenced go-ios spawn, WDA session creation, and MJPEG fan-out start. Exposes a clean `start(udid, ports, runnerBundleId)` / `stop()` interface that the router consumes.

This task has a smaller test surface than the previous ones — most of the value is in the real-device manual verification. We unit-test the sequencing and idempotent stop with a mocked child_process; full lifecycle goes in the integration test in Task 8.

**Files:**
- Create: `src/device-stream/ios/bridge.ts`

- [x] **Step 1: Write the bridge module**

`src/device-stream/ios/bridge.ts`:

```typescript
import { spawn, ChildProcess, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as wait } from 'node:timers/promises';
import { WDAClient, MjpegSettings, ScreenInfo, DeviceLockedError, WDANotRunningError } from './wda-client';
import { MjpegFanout } from './mjpeg';
import { PortPair } from './port-allocator';
import log from '../../logger';

const execFileAsync = promisify(execFile);

const DEFAULT_MJPEG_SETTINGS: MjpegSettings = {
  mjpegServerFramerate: 20,
  mjpegServerScreenshotQuality: 70,
  mjpegScalingFactor: 100,
};

export class TunnelNotRunningError extends Error {
  constructor() {
    super('go-ios tunnel daemon is not running (sudo ios tunnel start)');
    this.name = 'TunnelNotRunningError';
  }
}

export class WDANotInstalledError extends Error {
  constructor(public readonly runnerBundleId: string) {
    super(`WebDriverAgent runner ${runnerBundleId} is not installed on device`);
    this.name = 'WDANotInstalledError';
  }
}

export interface IOSBridgeHandle {
  sessionId: string;            // WDA session id (used for all WDA REST calls)
  deviceWidthPoints: number;
  deviceHeightPoints: number;
  deviceWidthPixels: number;
  deviceHeightPixels: number;
  scale: number;
  wdaClient: WDAClient;
  mjpegFanout: MjpegFanout;
  stop: () => Promise<void>;    // idempotent
}

export interface IOSBridgeOptions {
  /** Test seam: defaults to real spawn. */
  spawnFn?: typeof spawn;
  /** Test seam: defaults to real execFile. */
  execFileFn?: typeof execFile;
}

export class IOSWdaBridge {
  constructor(private readonly options: IOSBridgeOptions = {}) {}

  async start(
    udid: string,
    ports: PortPair,
    runnerBundleId: string,
  ): Promise<IOSBridgeHandle> {
    const spawnFn = this.options.spawnFn ?? spawn;

    log.info(`[ios-bridge] start udid=${udid} ports=${ports.wdaRestPort}/${ports.wdaMjpegPort} runner=${runnerBundleId}`);

    // Step 1 — mount developer disk image (idempotent).
    await this.runIos(['image', 'auto', '--udid', udid], 30_000);

    // Step 2 — spawn `ios runwda` in the background.
    const runwda = spawnFn(
      'ios',
      [
        'runwda',
        `--bundleid=${runnerBundleId}`,
        `--testrunnerbundleid=${runnerBundleId}`,
        `--udid=${udid}`,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.pipeLogs('runwda', runwda);

    // Step 3 — wait 3 s for WDA XCTest handshake (per spike 02).
    await wait(3000);

    // Step 4 — `ios forward $wdaRestPort 8100` (background).
    const forwardRest = spawnFn(
      'ios',
      ['forward', String(ports.wdaRestPort), '8100', `--udid=${udid}`],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.pipeLogs('forward-rest', forwardRest);

    // Step 5 — wait 500 ms.
    await wait(500);

    // Step 6 — `ios forward $wdaMjpegPort 9100` (background).
    const forwardMjpeg = spawnFn(
      'ios',
      ['forward', String(ports.wdaMjpegPort), '9100', `--udid=${udid}`],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.pipeLogs('forward-mjpeg', forwardMjpeg);

    const baseUrl = `http://localhost:${ports.wdaRestPort}`;
    const wdaClient = new WDAClient(baseUrl);

    // Step 7 — poll /status until ready or 60 s timeout.
    const readyDeadline = Date.now() + 60_000;
    while (Date.now() < readyDeadline) {
      try {
        const s = await wdaClient.getStatus();
        if (s.ready) break;
      } catch { /* WDA not up yet */ }
      await wait(250);
    }
    if (Date.now() >= readyDeadline) {
      const err = new WDANotRunningError(baseUrl);
      await this.killAll(runwda, forwardRest, forwardMjpeg);
      throw err;
    }

    // Step 8 — create WDA session (bare-minimum caps per spike 03).
    const sessionId = await wdaClient.createSession();

    // Step 9 — lock probe.
    if (await wdaClient.getLocked(sessionId)) {
      await wdaClient.deleteSession(sessionId).catch(() => {});
      await this.killAll(runwda, forwardRest, forwardMjpeg);
      throw new DeviceLockedError();
    }

    // Step 10 — read screen dimensions.
    const screen: ScreenInfo = await wdaClient.getScreen(sessionId);
    const deviceWidthPoints = screen.width;
    const deviceHeightPoints = screen.height;
    const deviceWidthPixels = Math.round(screen.width * screen.scale);
    const deviceHeightPixels = Math.round(screen.height * screen.scale);

    // Step 11 — push tuned MJPEG settings.
    await wdaClient.setMjpegSettings(sessionId, DEFAULT_MJPEG_SETTINGS);

    // Step 12 — start MJPEG fan-out.
    const mjpegFanout = new MjpegFanout(`http://localhost:${ports.wdaMjpegPort}/mjpeg`);
    await mjpegFanout.start();

    let stopped = false;
    const stop = async (): Promise<void> => {
      if (stopped) return;
      stopped = true;
      try { await mjpegFanout.stop(); } catch (e) { log.warn(`[ios-bridge] mjpeg.stop: ${e}`); }
      try { await wdaClient.deleteSession(sessionId); } catch (e) { log.warn(`[ios-bridge] deleteSession: ${e}`); }
      await this.killAll(runwda, forwardRest, forwardMjpeg);
      log.info(`[ios-bridge] stopped udid=${udid}`);
    };

    log.info(`[ios-bridge] ready udid=${udid} sessionId=${sessionId} ${deviceWidthPoints}x${deviceHeightPoints} @${screen.scale}x`);
    return {
      sessionId,
      deviceWidthPoints,
      deviceHeightPoints,
      deviceWidthPixels,
      deviceHeightPixels,
      scale: screen.scale,
      wdaClient,
      mjpegFanout,
      stop,
    };
  }

  /** Probe `ios info --udid` to confirm tunnel daemon + device pairing. */
  static async probeTunnel(udid: string, execFileFn = execFile): Promise<void> {
    try {
      await promisify(execFileFn)('ios', ['info', '--udid', udid], { timeout: 5_000 });
    } catch (err) {
      throw new TunnelNotRunningError();
    }
  }

  /** Probe `ios apps --udid` for the runner bundle id. */
  static async probeWdaInstalled(
    udid: string,
    runnerBundleId: string,
    execFileFn = execFile,
  ): Promise<void> {
    let stdout = '';
    try {
      const r = await promisify(execFileFn)('ios', ['apps', '--udid', udid], { timeout: 10_000 });
      stdout = String(r.stdout ?? '');
    } catch (err) {
      throw new WDANotInstalledError(runnerBundleId);
    }
    if (!stdout.includes(runnerBundleId)) {
      throw new WDANotInstalledError(runnerBundleId);
    }
  }

  private async runIos(args: string[], timeoutMs: number): Promise<void> {
    const execFileFn = this.options.execFileFn ?? execFile;
    await promisify(execFileFn)('ios', args, { timeout: timeoutMs });
  }

  private pipeLogs(prefix: string, child: ChildProcess): void {
    child.stdout?.on('data', (b) => log.info(`[ios-${prefix}] ${String(b).trim()}`));
    child.stderr?.on('data', (b) => log.warn(`[ios-${prefix}] ${String(b).trim()}`));
    child.on('exit', (code, sig) => log.info(`[ios-${prefix}] exited code=${code} sig=${sig}`));
  }

  private async killAll(...children: ChildProcess[]): Promise<void> {
    for (const c of children) {
      try { c.kill('SIGKILL'); } catch { /* already exited */ }
    }
  }
}
```

- [x] **Step 2: Verify TS compiles**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i 'device-stream/ios' || echo "OK"
```
Expected: `OK`.

- [x] **Step 3: Commit**

```bash
git add src/device-stream/ios/bridge.ts
git commit -m "feat(device-stream/ios): bridge orchestrating go-ios + WDA + MJPEG fan-out"
```

---

## Task 7: Router platform dispatch

Modify `src/device-stream/router.ts` to:
1. Look up the device's platform by UDID.
2. Dispatch to either the existing Android path or the new iOS path.
3. Pass the looked-up platform into `tryReserveUdid` instead of hardcoded `'android'`.
4. Map iOS-specific errors to the right HTTP statuses (423, 502 wda_not_installed / tunnel_not_running).

**Files:**
- Modify: `src/device-stream/router.ts`

- [x] **Step 1: Add platform lookup helper at top of file**

In `src/device-stream/router.ts`, near the existing helpers (`pluginPort`, `pluginCallbackPort`), add:

```typescript
import { getDevice } from '../data-service/device-service';
import { Platform } from './types';
import { IOSPortAllocator } from './ios/port-allocator';
import { IOSWdaBridge, TunnelNotRunningError, WDANotInstalledError } from './ios/bridge';
import { DeviceLockedError } from './ios/wda-client';
import {
  encodeIosMeta,
  encodeIosFrame,
  decodeIosClientMessage,
} from './ios/framing';

const iosPortAllocator = new IOSPortAllocator({
  baseRestPort: Number(process.env.IOS_WDA_BASE_REST_PORT ?? 8100),
  baseMjpegPort: Number(process.env.IOS_WDA_BASE_MJPEG_PORT ?? 9100),
});

const IOS_RUNNER_BUNDLE_ID =
  process.env.WDA_RUNNER_BUNDLE_ID ?? 'com.falx.WebDriverAgentRunner.xctrunner';

/** Bridge handles for active sessions, keyed by sessionId. iOS uses a different
 *  type than Android, so this Map is intentionally loosely typed; the WS handler
 *  branches on platform when consuming. */
const iosBridgeHandles = new Map<
  string,
  Awaited<ReturnType<IOSWdaBridge['start']>>
>();

async function lookupPlatformByUdid(udid: string): Promise<Platform | undefined> {
  const device = await getDevice({ udid } as any);
  if (!device) return undefined;
  const p = String((device as any).platform ?? '').toLowerCase();
  if (p === 'android') return 'android';
  if (p === 'ios') return 'ios';
  return undefined;
}
```

- [x] **Step 2: Restructure the `/start` handler to branch on platform**

Replace the existing `/start` handler body with this dispatching version. Keep the existing Android logic verbatim inside the `if (platform === 'android')` branch. For iOS, the new path:

```typescript
router.post('/use-device/start', async (req: Request, res: Response) => {
  const body = req.body as StartUseDeviceRequest;
  if (!body?.udid) {
    return res.status(400).json({ error: 'missing_udid', message: 'udid is required' });
  }

  const platform = await lookupPlatformByUdid(body.udid);
  if (!platform) {
    return res.status(404).json({
      error: 'device_not_found',
      message: `No device with udid ${body.udid}`,
    });
  }

  const reservationToken = useDeviceRegistry.tryReserveUdid(body.udid, platform);
  if (!reservationToken) {
    log.info(`[device-stream] /start 409: udid ${body.udid} already in use`);
    return res.status(409).json({
      error: 'device_busy',
      message: `Device ${body.udid} is already in use by another Use Device session`,
    });
  }

  if (platform === 'android') {
    // ===== existing Android path unchanged =====
    // (Keep the previous try/catch body verbatim.)
    return handleAndroidStart(req, res, body, reservationToken, pluginArgs);
  }

  // ===== NEW iOS path =====
  return handleIosStart(req, res, body, reservationToken, pluginArgs);
});
```

Extract the existing Android `/start` body into a function `handleAndroidStart(req, res, body, reservationToken, pluginArgs)` (no logic changes — pure refactor for clarity). The function moves the existing try/catch block; in the catch path `useDeviceRegistry.releaseReservation(reservationToken)` is already correct.

- [x] **Step 3: Implement `handleIosStart`**

Add this new function in the same file:

```typescript
async function handleIosStart(
  req: Request,
  res: Response,
  body: StartUseDeviceRequest,
  reservationToken: string,
  pluginArgs: IPluginArgs,
): Promise<Response> {
  let appiumSessionId: string | undefined;
  let bridgeHandle: Awaited<ReturnType<IOSWdaBridge['start']>> | undefined;
  let portsAllocated = false;

  log.info(`[device-stream] /start (iOS) invoked for udid=${body.udid}`);

  try {
    // a) Probe tunnel.
    await IOSWdaBridge.probeTunnel(body.udid);

    // b) Probe WDA runner installed.
    await IOSWdaBridge.probeWdaInstalled(body.udid, IOS_RUNNER_BUNDLE_ID);

    // c) Allocate ports.
    const ports = iosPortAllocator.allocate(body.udid);
    portsAllocated = true;

    // d) Bring up WDA + MJPEG fan-out.
    const bridge = new IOSWdaBridge();
    bridgeHandle = await bridge.start(body.udid, ports, IOS_RUNNER_BUNDLE_ID);

    // e) Create an Appium XCUITest session that attaches to OUR WDA, so the
    //    device appears in the upstream Sessions UI and the existing EventBus
    //    session-end hook tears us down for free.
    //
    //    appium:webDriverAgentUrl  — tells XCUITest "don't xcodebuild; attach here".
    //    appium:usePrebuiltWDA     — belt-and-braces; some driver versions key off it.
    //    NO appium:bundleId        — that path 500s on iOS 26 (spike 03).
    const createUrl = `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session`;
    const caps = {
      capabilities: {
        alwaysMatch: {
          platformName: 'iOS',
          'appium:automationName': 'XCUITest',
          'appium:udid': body.udid,
          'appium:newCommandTimeout': 3600,
          'appium:webDriverAgentUrl': `http://localhost:${ports.wdaRestPort}`,
          'appium:usePrebuiltWDA': true,
        },
        firstMatch: [{}],
      },
    };
    const created = await axios.post<{ value: { sessionId: string } }>(
      createUrl,
      caps,
      { timeout: 90_000 },
    );
    appiumSessionId = created.data.value.sessionId;
    log.info(`[device-stream] iOS appiumSessionId=${appiumSessionId}`);

    // f) Promote.
    const session = useDeviceRegistry.promote(reservationToken, {
      sessionId: appiumSessionId!,
      deviceWidth: bridgeHandle.deviceWidthPoints,
      deviceHeight: bridgeHandle.deviceHeightPoints,
      stop: async () => {
        try {
          await axios.delete(
            `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
            { timeout: 30_000 },
          );
        } catch (err) {
          log.warn(`[device-stream] DELETE appium session failed: ${(err as Error)?.message}`);
        }
        await bridgeHandle!.stop();
        iosPortAllocator.release(body.udid);
        iosBridgeHandles.delete(appiumSessionId!);
      },
    });

    iosBridgeHandles.set(session.sessionId, bridgeHandle);

    const host = req.get('host') ?? `localhost:${pluginPort(pluginArgs)}`;
    const protocol = req.protocol === 'https' ? 'wss' : 'ws';
    const streamPath = `/device-farm/api/dashboard/use-device/stream/${session.sessionId}`;
    const streamUrl = `${protocol}://${host}${streamPath}`;

    return res.json({
      sessionId: session.sessionId,
      streamUrl,
      platform: 'ios',
      deviceWidth: bridgeHandle.deviceWidthPoints,
      deviceHeight: bridgeHandle.deviceHeightPoints,
      scale: bridgeHandle.scale,
    });
  } catch (err) {
    log.error(`[device-stream] iOS /start failed: ${(err as Error)?.message ?? err}`);
    useDeviceRegistry.releaseReservation(reservationToken);

    if (bridgeHandle) await bridgeHandle.stop().catch(() => {});
    if (portsAllocated) iosPortAllocator.release(body.udid);
    if (appiumSessionId) {
      try {
        await axios.delete(
          `http://localhost:${pluginCallbackPort(pluginArgs)}/wd/hub/session/${appiumSessionId}`,
          { timeout: 30_000 },
        );
      } catch { /* best-effort */ }
    }

    if (err instanceof DeviceLockedError) {
      return res.status(423).json({
        error: 'device_locked',
        message: `iPhone ${body.udid} is locked. Unlock it, then try again.`,
      });
    }
    if (err instanceof TunnelNotRunningError) {
      return res.status(502).json({
        error: 'tunnel_not_running',
        message: 'go-ios tunnel daemon is not running. Start it with: sudo ios tunnel start',
      });
    }
    if (err instanceof WDANotInstalledError) {
      return res.status(502).json({
        error: 'wda_not_installed',
        message: `WebDriverAgent runner not installed on device. Rebuild via Xcode (runner bundle id: ${IOS_RUNNER_BUNDLE_ID}).`,
      });
    }
    return res.status(502).json({
      error: 'bridge_start_failed',
      message: (err as Error)?.message ?? String(err),
    });
  }
}
```

- [x] **Step 4: Update the WS handler to branch on platform**

In `handleWsConnection`, after `const session = useDeviceRegistry.get(sessionId)`, branch:

```typescript
if (session.platform === 'ios') {
  return handleIosWs(ws, session.sessionId);
}
// existing Android WS handler unchanged
```

Add `handleIosWs`:

```typescript
async function handleIosWs(ws: WebSocket, sessionId: string): Promise<void> {
  const handle = iosBridgeHandles.get(sessionId);
  const session = useDeviceRegistry.get(sessionId);
  if (!handle || !session) {
    ws.close(1008, 'unknown session');
    return;
  }

  ws.on('close', () => {
    log.info(`[device-stream] ws closed for ${sessionId}`);
    void useDeviceRegistry.stop(sessionId);
  });

  // WS heartbeat — ping every 10 s; terminate after one missed pong.
  let alive = true;
  ws.on('pong', () => { alive = true; });
  const interval = setInterval(() => {
    if (!alive) { ws.terminate(); clearInterval(interval); return; }
    alive = false;
    try { ws.ping(); } catch {}
  }, 10_000);
  ws.once('close', () => clearInterval(interval));

  // Send initial META.
  ws.send(
    encodeIosMeta({
      deviceWidthPoints: handle.deviceWidthPoints,
      deviceHeightPoints: handle.deviceHeightPoints,
      deviceWidthPixels: handle.deviceWidthPixels,
      deviceHeightPixels: handle.deviceHeightPixels,
      scale: handle.scale,
    }),
    { binary: true },
  );

  // Subscribe to MJPEG fan-out.
  const MAX_BUFFERED = 1_000_000;
  const unsub = handle.mjpegFanout.subscribe((jpeg) => {
    if (ws.readyState !== ws.OPEN) return;
    if (ws.bufferedAmount > MAX_BUFFERED) return; // drop-oldest semantics
    ws.send(encodeIosFrame(jpeg), { binary: true });
  });
  ws.once('close', () => unsub());

  // Client → server.
  ws.on('message', async (raw, isBinary) => {
    if (!isBinary || !(raw instanceof Buffer)) return;
    const msg = decodeIosClientMessage(raw);
    if (!msg) return;

    try {
      if (msg.kind === 'tap') {
        await handle.wdaClient.tap(handle.sessionId, msg.x, msg.y);
      } else if (msg.kind === 'swipe') {
        await handle.wdaClient.drag(
          handle.sessionId,
          msg.x1, msg.y1, msg.x2, msg.y2,
          msg.durationMs,
        );
      } else if (msg.kind === 'intent') {
        if (msg.intent === 'home') {
          const bid = await handle.wdaClient.getActiveAppBundleId(handle.sessionId);
          if (bid && bid !== 'com.apple.springboard') {
            await handle.wdaClient.terminateApp(handle.sessionId, bid);
          }
        } else if (msg.intent === 'app_switcher') {
          const w = handle.deviceWidthPoints;
          const h = handle.deviceHeightPoints;
          // Unvalidated gesture per spike 03; tune in manual verification.
          await handle.wdaClient.drag(handle.sessionId, w / 2, h - 5, w / 2, h * 0.55, 350);
        }
      }
    } catch (err) {
      log.warn(`[device-stream/ios] message dispatch failed: ${(err as Error)?.message}`);
    }
  });
}
```

- [x] **Step 5: Verify TS compiles**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i 'device-stream' || echo "OK"
```
Expected: `OK`.

- [x] **Step 6: Verify existing Android tests still pass**

```bash
npm test
```
Expected: existing unit/integration suite still passes (Android path was a pure refactor — extraction into `handleAndroidStart`).

- [x] **Step 7: Commit**

```bash
git add src/device-stream/router.ts
git commit -m "feat(device-stream): platform dispatch in /start + iOS WS handler

- /start now looks up the device's platform by UDID and dispatches.
- iOS path: probe tunnel + WDA installed → allocate ports → bridge.start
  → attach Appium XCUITest session via webDriverAgentUrl → promote.
- New error responses: 423 device_locked, 502 wda_not_installed,
  502 tunnel_not_running.
- Android path extracted into handleAndroidStart, no behavioral change."
```

---

## Task 8: Integration test — iOS lifecycle

End-to-end test with the real router + WS server + registry, but mocked `WDAClient` + mocked `child_process` so no device is needed. Covers: reservation, lock-probe rejection, MJPEG fan-out to multiple subscribers, tap/swipe/intent dispatch, idempotent stop.

**Files:**
- Create: `test/integration/device-stream-ios-lifecycle.spec.ts`

This test is intentionally non-TDD: the moving parts are exercised by the unit tests; the integration test is a smoke test that the wiring matches.

- [x] **Step 1: Write the integration test**

`test/integration/device-stream-ios-lifecycle.spec.ts` — outline (full body to be filled in by the implementing subagent, following the same shape as `test/integration/device-stream-lifecycle.spec.ts`):

```typescript
import { expect } from 'chai';
import http from 'node:http';
import express from 'express';
import { WebSocket } from 'ws';
import sinon from 'sinon';
// import the router register + ws attach + registry + types ...
// stub IOSWdaBridge.prototype.start to return a fake handle with a fake
// MjpegFanout (in-memory subscribers) and a fake WDAClient (sinon stubs
// for tap/drag/getActiveAppBundleId/terminateApp/deleteSession).
// stub IOSWdaBridge.probeTunnel + probeWdaInstalled to resolve.
// Run end-to-end: POST /start → WS connect → wait for META frame →
// emit a fake MJPEG frame via fanout → assert client receives SRV_TAG_FRAME →
// send a CLIENT_TAP_TAG buffer → assert wdaClient.tap was called with the
// right (x,y) → POST /stop → assert teardown ran.
```

Acceptance for this task:
- Test asserts `/start` returns 200 with `platform: 'ios'`, real `deviceWidth`, `scale`.
- Test asserts WS first message is META, second+ are FRAME.
- Test asserts CLIENT_TAP_TAG → `wdaClient.tap(sessionId, x, y)` was called.
- Test asserts CLIENT_INTENT_TAG / HOME → `getActiveAppBundleId` then `terminateApp`.
- Test asserts `/stop` calls `bridgeHandle.stop` once, idempotent on a second call.
- Test asserts second `/start` for the same UDID before stop returns 409.

- [x] **Step 2: Run the test**

```bash
npm test -- test/integration/device-stream-ios-lifecycle.spec.ts
```
Expected: all assertions pass.

- [x] **Step 3: Commit**

```bash
git add test/integration/device-stream-ios-lifecycle.spec.ts
git commit -m "test(device-stream/ios): end-to-end lifecycle integration test"
```

---

## Task 9: Falx-UI — BrowserUnsupported per-platform gate

`BrowserUnsupported.tsx` currently shows one message for all browsers. Now it must know which platform the device is on, because iOS requires only `createImageBitmap` (everywhere modern) while Android requires `VideoDecoder` (Chromium only).

**Files:**
- Modify: `falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx`

- [x] **Step 1: Add a platform prop and per-platform gate**

The component now takes `platform?: 'android' | 'ios'`. If undefined, defaults to Android's strict gate (current behavior).

```tsx
type Props = {
  platform?: 'android' | 'ios';
};

export function BrowserUnsupported({ platform }: Props) {
  const needsWebCodecs = platform !== 'ios'; // Android (or unknown) needs VideoDecoder.

  const message =
    needsWebCodecs
      ? 'This Android device requires Chrome or Edge (WebCodecs / VideoDecoder).'
      : 'This browser does not support iOS streaming (missing createImageBitmap).';

  return (
    <div /* same layout as before */>
      <h2>Browser not supported</h2>
      <p>{message}</p>
    </div>
  );
}

export function isBrowserSupportedForPlatform(platform: 'android' | 'ios'): boolean {
  if (platform === 'ios') {
    return typeof (globalThis as any).createImageBitmap === 'function';
  }
  return typeof (globalThis as any).VideoDecoder !== 'undefined';
}
```

`UseDevice.tsx` (Task 12) will call `isBrowserSupportedForPlatform(platform)` after the `/start` response arrives and render `BrowserUnsupported` if false.

- [x] **Step 2: Verify it builds**

```bash
cd falx-ui && npm run build && cd ..
```
Expected: build succeeds.

- [x] **Step 3: Commit**

```bash
git add falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx
git commit -m "feat(falx-ui): per-platform browser-support gate"
```

---

## Task 10: Falx-UI — `IOSStreamCanvas`

The load-bearing iOS component. Owns the WS, the `<canvas>`, the JPEG decoder, and the pointer/drag handlers.

**Files:**
- Create: `falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`

- [x] **Step 1: Write the component**

`falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';

// Match constants from src/device-stream/types.ts.
const SRV_TAG_META = 0x01;
const SRV_TAG_FRAME = 0x04;
const CLIENT_TAP_TAG = 0x20;
const CLIENT_SWIPE_TAG = 0x21;
const CLIENT_INTENT_TAG = 0x22;
const INTENT_HOME = 0x01;
const INTENT_APP_SWITCHER = 0x02;

const SWIPE_PX_THRESHOLD = 10;
const SWIPE_MS_THRESHOLD = 120;

export interface IOSStreamCanvasProps {
  streamUrl: string;
  sessionId: string;
  /** Initial dimensions from /start response (in iOS points). META frame overwrites. */
  initialDeviceWidth: number;
  initialDeviceHeight: number;
}

export interface IOSStreamHandle {
  sendIntent: (intent: 'home' | 'app_switcher') => void;
}

export function IOSStreamCanvas(
  props: IOSStreamCanvasProps & { handleRef?: (h: IOSStreamHandle | null) => void },
) {
  const { streamUrl, initialDeviceWidth, initialDeviceHeight, handleRef } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [dims, setDims] = useState({
    widthPoints: initialDeviceWidth,
    heightPoints: initialDeviceHeight,
  });
  const decodeInFlight = useRef<Promise<unknown> | null>(null);
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null);

  // Connect WS.
  useEffect(() => {
    const ws = new WebSocket(streamUrl);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.addEventListener('message', (ev) => {
      const buf = new Uint8Array(ev.data as ArrayBuffer);
      if (buf.length < 1) return;
      const tag = buf[0];

      if (tag === SRV_TAG_META) {
        try {
          const meta = JSON.parse(new TextDecoder().decode(buf.slice(1)));
          setDims({
            widthPoints: meta.deviceWidthPoints,
            heightPoints: meta.deviceHeightPoints,
          });
          const c = canvasRef.current;
          if (c) {
            c.width = meta.deviceWidthPixels;
            c.height = meta.deviceHeightPixels;
          }
        } catch (e) {
          console.warn('[IOSStreamCanvas] bad META', e);
        }
      } else if (tag === SRV_TAG_FRAME) {
        const len = new DataView(buf.buffer, buf.byteOffset + 1, 4).getUint32(0, false);
        const jpeg = buf.slice(5, 5 + len);
        if (decodeInFlight.current) return; // drop-oldest — skip while previous frame decodes.
        const blob = new Blob([jpeg], { type: 'image/jpeg' });
        decodeInFlight.current = createImageBitmap(blob).then((bitmap) => {
          const c = canvasRef.current;
          if (c) {
            const ctx = c.getContext('2d');
            if (ctx) ctx.drawImage(bitmap, 0, 0, c.width, c.height);
          }
          bitmap.close();
        }).catch((e) => console.warn('[IOSStreamCanvas] decode failed', e))
          .finally(() => { decodeInFlight.current = null; });
      }
    });

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [streamUrl]);

  // Expose imperative handle for the toolbar.
  useEffect(() => {
    if (!handleRef) return;
    handleRef({
      sendIntent: (intent: 'home' | 'app_switcher') => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== ws.OPEN) return;
        const buf = new Uint8Array(2);
        buf[0] = CLIENT_INTENT_TAG;
        buf[1] = intent === 'home' ? INTENT_HOME : INTENT_APP_SWITCHER;
        ws.send(buf);
      },
    });
    return () => handleRef(null);
  }, [handleRef]);

  function clientToPoints(e: React.PointerEvent<HTMLCanvasElement>): { x: number; y: number } {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * dims.widthPoints;
    const y = ((e.clientY - rect.top) / rect.height) * dims.heightPoints;
    return { x, y };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const p = clientToPoints(e);
    pointerStart.current = { x: p.x, y: p.y, t: performance.now() };
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const end = clientToPoints(e);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dt = performance.now() - start.t;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const ws = wsRef.current;
    if (!ws || ws.readyState !== ws.OPEN) return;

    if (dist < SWIPE_PX_THRESHOLD && dt < SWIPE_MS_THRESHOLD) {
      // tap
      const buf = new ArrayBuffer(1 + 8);
      const v = new DataView(buf);
      v.setUint8(0, CLIENT_TAP_TAG);
      v.setFloat32(1, end.x, false);
      v.setFloat32(5, end.y, false);
      ws.send(buf);
    } else {
      // swipe
      const buf = new ArrayBuffer(1 + 20);
      const v = new DataView(buf);
      v.setUint8(0, CLIENT_SWIPE_TAG);
      v.setFloat32(1, start.x, false);
      v.setFloat32(5, start.y, false);
      v.setFloat32(9, end.x, false);
      v.setFloat32(13, end.y, false);
      v.setUint32(17, Math.max(50, Math.round(dt)), false);
      ws.send(buf);
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      style={{
        maxWidth: '100%',
        maxHeight: 'calc(100vh - 200px)',
        width: 'auto',
        height: 'auto',
        aspectRatio: `${dims.widthPoints} / ${dims.heightPoints}`,
        backgroundColor: 'black',
      }}
    />
  );
}
```

- [x] **Step 2: Verify it builds**

```bash
cd falx-ui && npm run build && cd ..
```

- [x] **Step 3: Commit**

```bash
git add falx-ui/src/pages/UseDevice/IOSStreamCanvas.tsx
git commit -m "feat(falx-ui): IOSStreamCanvas — WS MJPEG → canvas, tap/swipe encoder"
```

---

## Task 11: Falx-UI — `IOSControlToolbar`

Three buttons: Home, App Switcher, Stop. Same visual treatment as the Android `ControlToolbar.tsx`.

**Files:**
- Create: `falx-ui/src/pages/UseDevice/IOSControlToolbar.tsx`

- [x] **Step 1: Write the toolbar**

`falx-ui/src/pages/UseDevice/IOSControlToolbar.tsx`:

```tsx
import { IOSStreamHandle } from './IOSStreamCanvas';

export interface IOSControlToolbarProps {
  /** Imperative handle exposed by IOSStreamCanvas via handleRef. */
  streamHandle: IOSStreamHandle | null;
  onStop: () => void;
}

export function IOSControlToolbar({ streamHandle, onStop }: IOSControlToolbarProps) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: 8 }}>
      <button onClick={() => streamHandle?.sendIntent('home')} aria-label="Home">
        Home
      </button>
      <button
        onClick={() => streamHandle?.sendIntent('app_switcher')}
        aria-label="App Switcher"
      >
        App Switcher
      </button>
      <button onClick={onStop} aria-label="Stop">
        Stop
      </button>
    </div>
  );
}
```

The styling here is deliberately minimal; the implementing subagent should match the existing Android `ControlToolbar.tsx` look (same button shapes, spacing, semantic color tokens) — keep parity within the AppLayout shell.

- [x] **Step 2: Verify it builds**

```bash
cd falx-ui && npm run build && cd ..
```

- [x] **Step 3: Commit**

```bash
git add falx-ui/src/pages/UseDevice/IOSControlToolbar.tsx
git commit -m "feat(falx-ui): IOSControlToolbar — Home / App Switcher / Stop"
```

---

## Task 12: Falx-UI — `UseDevice` platform switch + DeviceCard gate

Wire `IOSStreamCanvas` + `IOSControlToolbar` into the existing `UseDevice.tsx` route, branching on the `/start` response's `platform`. Enable the Use Device button for iOS DeviceCards.

**Files:**
- Modify: `falx-ui/src/pages/UseDevice/UseDevice.tsx`
- Modify: `falx-ui/src/components/devicecard/DeviceCard.tsx`

- [x] **Step 1: Modify `UseDevice.tsx`**

The existing component already calls `createUseDeviceSession(udid)` and renders `AndroidStreamCanvas` on success. Now:

1. After the `/start` response, check `isBrowserSupportedForPlatform(response.platform)` — if false, render `<BrowserUnsupported platform={response.platform} />` and stop.
2. Handle iOS-specific error responses from `/start`:
   - 423 → show a toast/modal "Unlock the iPhone, then try again", navigate back to `/`.
   - 502 with `error: 'wda_not_installed'` → show "WebDriverAgent is not installed on this iPhone. Rebuild via Xcode."
   - 502 with `error: 'tunnel_not_running'` → show "go-ios tunnel daemon is not running. Run `sudo ios tunnel start` on the host."
3. Branch the render:

```tsx
const [streamHandle, setStreamHandle] = useState<IOSStreamHandle | null>(null);

// ... after `/start` succeeds, response in `session` ...

if (session.platform === 'ios') {
  return (
    <div /* layout container */>
      <IOSStreamCanvas
        streamUrl={session.streamUrl}
        sessionId={session.sessionId}
        initialDeviceWidth={session.deviceWidth}
        initialDeviceHeight={session.deviceHeight}
        handleRef={setStreamHandle}
      />
      <IOSControlToolbar
        streamHandle={streamHandle}
        onStop={async () => {
          await endUseDeviceSession(session.sessionId);
          navigate('/');
        }}
      />
    </div>
  );
}

// existing Android branch unchanged
```

- [x] **Step 2: Modify `DeviceCard.tsx`**

Find the existing condition that gates the Use Device button on `device.platform === 'android'` (or similar). Change to:

```tsx
const isUseDeviceSupported =
  device.platform?.toLowerCase() === 'android' ||
  device.platform?.toLowerCase() === 'ios';
```

Keep the button styling unchanged.

- [x] **Step 3: Verify falx-ui builds and renders the iOS card button**

```bash
cd falx-ui && npm run dev
```
Open `http://localhost:5173/`. Visually confirm the iOS DeviceCard now shows the **Use Device** button.

- [x] **Step 4: Commit**

```bash
git add falx-ui/src/pages/UseDevice/UseDevice.tsx falx-ui/src/components/devicecard/DeviceCard.tsx
git commit -m "feat(falx-ui): UseDevice platform switch + DeviceCard button for iOS"
```

---

## Task 13: Manual verification on `kry-phone` (primary device)

Real-device functional verification. **This is a checkpoint task — do not skip.**

**Prerequisites** (operator confirms once at the top):
- iPhone `kry-phone` (UDID `00008101-001A408E2EB9001E`) plugged in via USB.
- Developer Mode enabled on the phone.
- WebDriverAgent built + installed (runner bundle `com.falx.WebDriverAgentRunner.xctrunner`).
- `sudo ios tunnel start` running in a separate terminal.
- Plugin started via the usual Falx dev command, listening on the dashboard port.
- Falx UI open in Chrome at the dashboard URL.

- [x] **Step 1: Sanity — DeviceCard shows the button**

Visit the dashboard. The iOS DeviceCard for `kry-phone` displays a **Use Device** button next to **Block**.

- [x] **Step 2: Start session — happy path**

Click **Use Device** on the iOS card.

Expected:
- Browser navigates to `/use-device/00008101-001A408E2EB9001E`.
- Within ~8 s, the live iPhone screen appears in a canvas.
- The toolbar shows **Home**, **App Switcher**, **Stop**.
- The Sessions UI shows one new active session for this UDID.

- [x] **Step 3: Tap accuracy (10/10 trials)**

Tap each: top-left corner, top-right, bottom-left, bottom-right, and center of the canvas. Each tap should land within ±10 points of the click target on the device (visually obvious — taps in corners hit corner UI elements, center taps hit center elements).

Repeat ten times. Record 0 misses out of 10.

- [x] **Step 4: Swipe (drag) test**

Click-drag from one side of the canvas to the other over ~500 ms. SpringBoard should flip between home pages, or scrolling should work in the open app. Confirm direction matches.

- [x] **Step 5: Home button**

Open any app on the phone (tap an icon). Click **Home** in the toolbar.

Expected: phone returns to SpringBoard within 1 s. Server log shows `getActiveAppBundleId` → `terminateApp` flow.

- [x] **Step 6: App Switcher button**

Click **App Switcher**.

Expected: App Switcher view appears on the phone within 1 s.

**If it doesn't work:** the gesture is the only spike-unvalidated bit of the slice. Try tuning the parameters in `handleIosWs`:
- Increase duration from 350 ms to 500 ms.
- Move endpoint from `h * 0.55` to `h * 0.45` (drag higher = more likely to summon Switcher vs. just dismiss to Home).

If after 3 tunings the gesture still won't reliably summon the App Switcher, **disable the button** (set `disabled` on the JSX in `IOSControlToolbar.tsx`) and add a `docs/discovery/` note about the limitation. Ship the slice with Home + Stop only. The spec already flags this as a risk.

- [x] **Step 7: Stop button**

Click **Stop**.

Expected:
- Browser navigates back to `/`.
- Sessions UI no longer shows this session.
- DeviceCard shows the device as available again.
- `ps -A | grep -E 'ios (runwda|forward)' | grep -v grep` returns no results.

- [ ] **Step 8: Locked-device probe** <!-- pending operator validation -->

Lock the phone (press the side button). On the dashboard, click **Use Device** again.

Expected: a toast appears within 1 s: *"Unlock kry-phone, then try again"* (or similar). Browser stays on `/`. No partial session created. `useDeviceRegistry` does not retain a reservation.

- [ ] **Step 9: Concurrent claim (single browser, two tabs)** <!-- pending operator validation -->

Unlock the phone. Open Tab A, click **Use Device** → session starts. Open Tab B at the dashboard URL, click **Use Device** on the same device.

Expected: Tab B shows a "device busy" toast within 1 s. Tab A keeps streaming uninterrupted.

- [ ] **Step 10: Tab close releases device** <!-- pending operator validation -->

In Tab A (still streaming), close the tab without clicking Stop.

Expected: within ~5 s, the dashboard reflects the device as available; `ps -A | grep ios` is clean.

- [ ] **Step 11: 10-minute stability run** <!-- pending operator validation -->

Start a fresh session. Leave it open for 10 minutes, interacting with the phone occasionally (tap, swipe). Observe: no decoder errors in the browser console, no stalls > 1 s, frame rate stays visually smooth.

At t=1 min, t=5 min, t=10 min: record the plugin process's RSS:

```bash
ps -o pid,rss,command -p <plugin-pid>
```

RSS should be flat ± a few MB.

- [ ] **Step 12: Document findings** <!-- pending operator validation -->

Append a `### Manual verification — kry-phone (2026-MM-DD)` section to the slice's spec, recording results of steps 1–11. Pass/fail per step plus any tuning notes (especially for step 6, App Switcher).

- [ ] **Step 13: Commit findings** <!-- pending operator validation -->

```bash
git add docs/superpowers/specs/2026-05-18-ios-use-device-design.md
git commit -m "docs(ios-use-device): manual verification findings on kry-phone"
```

---

## Task 14: Manual verification — two iPhones (multi-device)

Validates the port allocator works in the field.

> Pending — requires a second iPhone.

**Prerequisites:**
- Both iPhones plugged in (or via a powered USB hub).
- Both visible in `ios list`.
- WDA installed on both, with the same runner bundle id.

- [ ] **Step 1: Start a session on iPhone A**

From the dashboard, click **Use Device** on iPhone A. Verify it streams normally on port pair 8100/9100.

- [ ] **Step 2: Start a session on iPhone B simultaneously**

Open a second browser tab. From the dashboard, click **Use Device** on iPhone B.

Expected:
- iPhone B starts streaming on port pair 8101/9101 (verify via plugin logs).
- Both tabs render their respective phones independently.
- Tapping on either canvas affects only that phone.

- [ ] **Step 3: Confirm port assignment in plugin logs**

Plugin logs should show:
- `[ios-bridge] start udid=<UDID-A> ports=8100/9100`
- `[ios-bridge] start udid=<UDID-B> ports=8101/9101`

- [ ] **Step 4: Stop both sessions**

Click **Stop** on both tabs. Verify both `ios runwda` instances exit; allocator releases both pairs.

- [ ] **Step 5: Reallocate after release**

Click **Use Device** on iPhone A again. Verify it gets ports 8100/9100 (lowest free slot).

- [ ] **Step 6: Document findings, commit**

Add a `### Manual verification — two iPhones` section to the spec.

```bash
git add docs/superpowers/specs/2026-05-18-ios-use-device-design.md
git commit -m "docs(ios-use-device): multi-device verification findings"
```

---

## Task 15: Cross-browser verification

Validates the browser-support gate change in Task 9.

> Pending — requires Safari and Firefox manual runs.

- [ ] **Step 1: Test in Safari**

Open the Falx dashboard in Safari. Click **Use Device** on `kry-phone`. Expected: stream works (Safari has `createImageBitmap`). Toolbar buttons function.

- [ ] **Step 2: Test in Firefox**

Same as above in Firefox. Expected: stream works.

- [ ] **Step 3: Verify Android still gates correctly**

Open the Falx dashboard in Safari. Click **Use Device** on an Android device. Expected: `BrowserUnsupported` view appears with the message "This Android device requires Chrome or Edge".

- [ ] **Step 4: Document findings, commit**

```bash
git add docs/superpowers/specs/2026-05-18-ios-use-device-design.md
git commit -m "docs(ios-use-device): cross-browser verification findings"
```

---

## Task 16: 50-cycle leak script

Sequential start→stop cycles to confirm no resource leaks.

**Files:**
- Create: `scripts/ios-leak-cycle.mjs` (throwaway script, not part of the production bundle).

- [x] **Step 1: Write the script**

`scripts/ios-leak-cycle.mjs`:

```javascript
// Sequential /start → /stop cycles against a live Falx plugin.
// Records timing and lets you visually confirm no `ios runwda` leaks.
import { setTimeout as wait } from 'node:timers/promises';

const BASE = process.env.FALX_URL ?? 'http://localhost:4723';
const UDID = process.env.IOS_UDID ?? '00008101-001A408E2EB9001E';
const N = Number(process.env.CYCLES ?? 50);

const startTimes = [];
const stopTimes = [];

for (let i = 1; i <= N; i++) {
  const t0 = Date.now();
  const startRes = await fetch(`${BASE}/device-farm/api/dashboard/use-device/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ udid: UDID }),
  });
  if (!startRes.ok) {
    console.error(`cycle ${i}: /start failed ${startRes.status}`, await startRes.text());
    process.exit(1);
  }
  const { sessionId } = await startRes.json();
  const t1 = Date.now();
  startTimes.push(t1 - t0);

  await wait(500); // brief idle while "session is live"

  const t2 = Date.now();
  const stopRes = await fetch(`${BASE}/device-farm/api/dashboard/use-device/stop/${sessionId}`, {
    method: 'POST',
  });
  if (!stopRes.ok) {
    console.error(`cycle ${i}: /stop failed ${stopRes.status}`);
    process.exit(1);
  }
  const t3 = Date.now();
  stopTimes.push(t3 - t2);

  console.log(`cycle ${i}/${N}: start ${t1 - t0}ms  stop ${t3 - t2}ms`);
  await wait(500); // settle before next cycle
}

const sorted = (arr) => [...arr].sort((a, b) => a - b);
const p = (arr, q) => sorted(arr)[Math.floor(arr.length * q)];

console.log('\n=== summary ===');
console.log(`start: p50=${p(startTimes, 0.5)}ms p95=${p(startTimes, 0.95)}ms max=${Math.max(...startTimes)}ms`);
console.log(`stop:  p50=${p(stopTimes, 0.5)}ms p95=${p(stopTimes, 0.95)}ms max=${Math.max(...stopTimes)}ms`);
```

- [ ] **Step 2: Run the script with the plugin running**

```bash
node scripts/ios-leak-cycle.mjs
```

After all 50 cycles complete:

```bash
ps -A | grep -E 'ios (runwda|forward)' | grep -v grep
```
Expected: no output.

- [ ] **Step 3: Document findings**

Append the start/stop p50/p95/max latencies and the "0 leaked processes" result to the spec under a `### 50-cycle leak verification` heading.

- [ ] **Step 4: Commit findings**

```bash
git add docs/superpowers/specs/2026-05-18-ios-use-device-design.md scripts/ios-leak-cycle.mjs
git commit -m "test(ios-use-device): 50-cycle leak script + findings"
```

---

## Done criteria

- All checkboxes above ticked.
- `npm test` passes locally (unit + integration).
- All three manual-verification tasks (13, 14, 15) recorded their findings in the spec.
- 50-cycle leak script ran clean.
- Branch ready for PR to `main`.
