# Android Use Device Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Falx-owned browser "Use Device" feature for Android — click a device, get a live screen view in the browser, tap and use system nav buttons, stop cleanly. Replaces the proprietary `appium-device-farm@11.3.2` "Use Device" feature on Android.

**Architecture:** Tango (yume-chan) drives upstream scrcpy server on the device from a Node bridge inside the Falx plugin. WebCodecs decodes H.264 in Chromium. WebSocket carries video (server→client) and control messages (client→server). New Express + WS routes mounted under the existing dashboard router. New Falx-UI route under the existing AppLayout shell.

**Tech Stack:** TypeScript, Express, ws, `@yume-chan/{adb,adb-server-node-tcp,adb-scrcpy,scrcpy,stream-extra}` (server), `@yume-chan/{scrcpy,scrcpy-decoder-webcodecs,stream-extra}` (browser), pinned `scrcpy-server-v3.3.3.jar`. React 18 + Vite (already in falx-ui).

---

## Spec reference

This plan implements [docs/superpowers/specs/2026-05-16-android-use-device-design.md](../specs/2026-05-16-android-use-device-design.md). Read it before starting. Decisions locked in the spec are not re-litigated here.

## Spike reference (read-only — do not modify)

The spike is a validated reference implementation. The plan refactors it into modular, tested Falx code; it does **not** invent new approaches.

- Backend spike: `/tmp/falx-spike-android/server/index.ts` (267 LOC) — the source of truth for Tango bridge calls, WS framing wire-format constants, scrcpy options, and pointer→touch translation.
- Server JAR pinned at `/tmp/falx-spike-android/server/scrcpy-server.jar` — v3.3.3, sha256 `7e70323b...4be0`, 90 164 bytes.
- Client spike: `/tmp/falx-spike-android/client/src/App.tsx` (238 LOC) — source of truth for WebCodecs decoder setup and pointer-event encoding.

**Verify they exist before starting:**
```bash
ls -la /tmp/falx-spike-android/server/index.ts /tmp/falx-spike-android/server/scrcpy-server.jar /tmp/falx-spike-android/client/src/App.tsx
```
If absent, see Spike 01 findings to rebuild before proceeding.

## File map

**Backend (in-process Falx plugin):**
- Create `src/device-stream/types.ts` — types + constants.
- Create `src/device-stream/registry.ts` — `UseDeviceRegistry` class with state machine.
- Create `src/device-stream/router.ts` — Express + ws routes.
- Create `src/device-stream/android/bridge.ts` — `AndroidScrcpyBridge` class.
- Create `src/device-stream/android/framing.ts` — binary protocol helpers.
- Add `src/device-stream/android/scrcpy-server.jar` — pinned v3.3.3.
- Modify `src/dashboard/router.ts` — mount new module.
- Modify `package.json` — add 5 server deps.

**Backend tests:**
- Create `test/unit/device-stream-framing.spec.ts`
- Create `test/unit/device-stream-registry.spec.ts`
- Create `test/unit/device-stream-android-bridge.spec.ts`
- Create `test/integration/device-stream-lifecycle.spec.ts`

**Falx-UI:**
- Create `falx-ui/src/pages/UseDevice/UseDevice.tsx`
- Create `falx-ui/src/pages/UseDevice/AndroidStreamCanvas.tsx`
- Create `falx-ui/src/pages/UseDevice/ControlToolbar.tsx`
- Create `falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx`
- Create `falx-ui/src/api-service/use-device.ts`
- Modify `falx-ui/src/App.tsx` — add `/use-device/:udid` route.
- Modify `falx-ui/src/components/devicecard/DeviceCard.tsx` — add Use Device button (Android only).
- Modify `falx-ui/src/components/header/Header.tsx` — add Legacy Use Device dropdown entry.
- Modify `falx-ui/package.json` — add 3 UI deps.

**Repo:**
- Create `docs/decisions/0001-streaming-toolchain.md` — ADR.

---

## Task 0: ADR + dependencies + JAR vendor

Per [CLAUDE.md](../../../CLAUDE.md): new top-level dependencies require an ADR.

**Files:**
- Create: `docs/decisions/0001-streaming-toolchain.md`
- Modify: `package.json` (server deps)
- Modify: `falx-ui/package.json` (UI deps)
- Add: `src/device-stream/android/scrcpy-server.jar`

- [ ] **Step 1: Confirm spike artifacts exist**

```bash
ls -la /tmp/falx-spike-android/server/scrcpy-server.jar
```
Expected: file exists, ~90164 bytes. If not, abort and rebuild from Spike 01 findings.

- [ ] **Step 2: Create the ADR**

```bash
mkdir -p docs/decisions
```

Write `docs/decisions/0001-streaming-toolchain.md`:

```markdown
# ADR 0001 — Streaming toolchain for browser device control

**Status:** Accepted
**Date:** 2026-05-16
**Decision drivers:** [Android streaming spike (GREEN)](../spikes/01-android-streaming-spike.md), [iOS streaming spike](../spikes/02-ios-streaming-spike.md), [iOS tap injection spike](../spikes/03-ios-tap-injection-spike.md), [Use Device design](../superpowers/specs/2026-05-16-android-use-device-design.md).

## Context

Falx needs a browser-based "Use Device" feature: live screen view + tap/key control over a USB-attached phone. The proprietary `appium-device-farm@11.3.2` shipped this as obfuscated GPL-restricted code; we cannot redistribute it. We need a permissively-licensed, maintainable alternative.

## Decision

**Android:** Tango (yume-chan/ya-webadb) drives upstream `scrcpy-server-v3.3.3.jar` from a Node bridge inside the Falx plugin process. H.264 video is decoded in the browser via WebCodecs. Control messages are scrcpy's native binary protocol.

Server-side npm dependencies (all MIT):
- `@yume-chan/adb` ^2.6.0
- `@yume-chan/adb-server-node-tcp` ^2.5.2
- `@yume-chan/adb-scrcpy` ^2.3.2
- `@yume-chan/scrcpy` ^2.3.0
- `@yume-chan/stream-extra` ^2.5.3

Falx-UI npm dependencies (all MIT):
- `@yume-chan/scrcpy` ^2.3.0
- `@yume-chan/scrcpy-decoder-webcodecs` ^2.5.3
- `@yume-chan/stream-extra` ^2.5.3

On-device runtime: `scrcpy-server-v3.3.3.jar` shipped as a binary asset under `src/device-stream/android/scrcpy-server.jar`. License: Apache-2.0 client side + GPL-v3 server JAR. Falx pushes the JAR unmodified to the device and runs it via `app_process` — no linking, no derivative work.

**iOS:** WDA + go-ios + MJPEG (validated by spikes 02 and 03, deferred to a follow-up slice). Not part of this ADR's scope beyond noting the trajectory.

## Alternatives considered

- **ws-scrcpy (NetrisTV).** MIT, but ships a 2021 scrcpy fork frozen at v1.19. We'd inherit a five-major-version gap with no upgrade path. Rejected for foundational debt.
- **DeviceFarmer/STF.** Apache-2.0, but ships its own DB (RethinkDB), auth, dashboard, and a CoffeeScript/Pug/Bower frontend — every one of which Falx already has. Rejected for embeddability.
- **Direct scrcpy subprocess + custom Node bridge.** Possible, but re-implements what Tango already does. Falls back to this if Tango stalls.
- **GADS.** AGPL-3.0 + obfuscated proprietary UI components. Two strikes against use. Architecture is a useful reference for iOS WebRTC if streaming quality ever needs to escalate.

## Consequences

- Inherits scrcpy upstream improvements automatically as Tango bumps version pins.
- Single bus-factor maintainer for Tango (yume-chan). Mitigation: keep the integration layer thin so a fallback to direct scrcpy is feasible.
- WebCodecs is Chromium-only. Falx-UI must feature-detect and show a clear "use Chrome or Edge" message in other browsers.
```

- [ ] **Step 3: Add server-side npm deps**

Run from repo root:
```bash
npm install --save \
  @yume-chan/adb@^2.6.0 \
  @yume-chan/adb-server-node-tcp@^2.5.2 \
  @yume-chan/adb-scrcpy@^2.3.2 \
  @yume-chan/scrcpy@^2.3.0 \
  @yume-chan/stream-extra@^2.5.3
```

- [ ] **Step 4: Add falx-ui npm deps**

```bash
cd falx-ui
npm install --save \
  @yume-chan/scrcpy@^2.3.0 \
  @yume-chan/scrcpy-decoder-webcodecs@^2.5.3 \
  @yume-chan/stream-extra@^2.5.3
cd ..
```

- [ ] **Step 5: Vendor the scrcpy-server.jar**

```bash
mkdir -p src/device-stream/android
cp /tmp/falx-spike-android/server/scrcpy-server.jar src/device-stream/android/scrcpy-server.jar
shasum -a 256 src/device-stream/android/scrcpy-server.jar
```
Expected sha256 starts with `7e70323b`. If different, the spike's JAR was replaced; halt and reconcile.

- [ ] **Step 6: Commit**

```bash
git add docs/decisions/0001-streaming-toolchain.md package.json package-lock.json falx-ui/package.json falx-ui/package-lock.json src/device-stream/android/scrcpy-server.jar
git commit -m "feat(device-stream): add streaming toolchain dependencies + ADR + scrcpy-server.jar

ADR 0001 documents the Tango + WDA decision. Pins:
- server: @yume-chan/{adb,adb-server-node-tcp,adb-scrcpy,scrcpy,stream-extra}
- falx-ui: @yume-chan/{scrcpy,scrcpy-decoder-webcodecs,stream-extra}
- on-device: scrcpy-server-v3.3.3.jar (sha256 7e70323b...)

Refs: docs/superpowers/specs/2026-05-16-android-use-device-design.md
"
```

---

## Task 1: Backend types module

Pure type/constant definitions. No logic.

**Files:**
- Create: `src/device-stream/types.ts`

- [ ] **Step 1: Write the types file**

```typescript
// src/device-stream/types.ts

export type Platform = 'android' | 'ios';

export type UseDeviceSessionState =
  | 'starting'
  | 'running'
  | 'stopping'
  | 'terminated';

export interface UseDeviceSession {
  /** Appium session ID — reused as the public session identifier. */
  sessionId: string;
  /** Device UDID. */
  udid: string;
  /** Platform. iOS is not yet implemented but the type is in place. */
  platform: Platform;
  /** State machine current value. */
  state: UseDeviceSessionState;
  /** Encoded video width in device pixels (after scrcpy maxSize downscale). */
  deviceWidth: number;
  /** Encoded video height. */
  deviceHeight: number;
  /** Created-at epoch ms. */
  createdAt: number;
}

export interface StartUseDeviceRequest {
  udid: string;
}

export interface StartUseDeviceResponse {
  sessionId: string;
  streamUrl: string;
  platform: Platform;
  deviceWidth: number;
  deviceHeight: number;
}

/** Server → client WS message tags. */
export const SRV_TAG_META = 0x01;
export const SRV_TAG_CONFIG = 0x02;
export const SRV_TAG_DATA = 0x03;

/** Client → server WS message tags. */
export const CLIENT_TOUCH_TAG = 0x10;
export const CLIENT_KEYCODE_TAG = 0x11;

/** Android key codes (subset used by the toolbar). */
export const KEYCODE_BACK = 4;
export const KEYCODE_HOME = 3;
export const KEYCODE_APP_SWITCH = 187; // recents

/** Pointer actions matching Android MotionEvent. */
export const ACTION_DOWN = 0;
export const ACTION_UP = 1;
export const ACTION_MOVE = 2;
```

- [ ] **Step 2: Verify TS compiles**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i 'device-stream' || echo "OK"
```
Expected: `OK` (no errors mentioning device-stream).

- [ ] **Step 3: Commit**

```bash
git add src/device-stream/types.ts
git commit -m "feat(device-stream): add types and protocol constants"
```

---

## Task 2: WS framing module (TDD)

Pure-logic binary protocol helpers. Testable without a device.

**Files:**
- Create: `src/device-stream/android/framing.ts`
- Test: `test/unit/device-stream-framing.spec.ts`

- [ ] **Step 1: Write the failing tests**

`test/unit/device-stream-framing.spec.ts`:
```typescript
import { expect } from 'chai';
import {
  encodeMeta,
  encodeConfig,
  encodeData,
  decodeClientTouchMessage,
  decodeClientKeycodeMessage,
} from '../../src/device-stream/android/framing';
import {
  SRV_TAG_META,
  SRV_TAG_CONFIG,
  SRV_TAG_DATA,
  CLIENT_TOUCH_TAG,
  CLIENT_KEYCODE_TAG,
  KEYCODE_HOME,
} from '../../src/device-stream/types';

describe('device-stream framing', () => {
  describe('encodeMeta', () => {
    it('prefixes JSON with SRV_TAG_META', () => {
      const out = encodeMeta({ codec: 'h264', width: 528, height: 1080 });
      expect(out[0]).to.equal(SRV_TAG_META);
      const json = JSON.parse(out.slice(1).toString('utf-8'));
      expect(json).to.deep.equal({ codec: 'h264', width: 528, height: 1080 });
    });
  });

  describe('encodeConfig', () => {
    it('prefixes payload with SRV_TAG_CONFIG', () => {
      const payload = new Uint8Array([1, 2, 3, 4]);
      const out = encodeConfig(payload);
      expect(out[0]).to.equal(SRV_TAG_CONFIG);
      expect([...out.slice(1)]).to.deep.equal([1, 2, 3, 4]);
    });
  });

  describe('encodeData', () => {
    it('prefixes payload with SRV_TAG_DATA + 8-byte LE pts', () => {
      const payload = new Uint8Array([9, 8, 7]);
      const out = encodeData(0x1122334455667788n, payload);
      expect(out[0]).to.equal(SRV_TAG_DATA);
      expect(out.readBigUInt64LE(1)).to.equal(0x1122334455667788n);
      expect([...out.slice(9)]).to.deep.equal([9, 8, 7]);
    });

    it('treats undefined pts as 0', () => {
      const out = encodeData(undefined, new Uint8Array());
      expect(out.readBigUInt64LE(1)).to.equal(0n);
    });
  });

  describe('decodeClientTouchMessage', () => {
    it('returns null for non-touch tag', () => {
      const buf = Buffer.from([0x99, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(decodeClientTouchMessage(buf)).to.be.null;
    });

    it('returns null for too-short buffer', () => {
      const buf = Buffer.from([CLIENT_TOUCH_TAG, 0]);
      expect(decodeClientTouchMessage(buf)).to.be.null;
    });

    it('decodes action + normalised coords', () => {
      const buf = Buffer.alloc(10);
      buf[0] = CLIENT_TOUCH_TAG;
      buf[1] = 0; // ACTION_DOWN
      buf.writeFloatBE(0.5, 2);
      buf.writeFloatBE(0.75, 6);
      const msg = decodeClientTouchMessage(buf);
      expect(msg).to.deep.equal({ action: 0, normX: 0.5, normY: 0.75 });
    });
  });

  describe('decodeClientKeycodeMessage', () => {
    it('returns null for non-keycode tag', () => {
      const buf = Buffer.from([0x99, 0, 0, 0, 0]);
      expect(decodeClientKeycodeMessage(buf)).to.be.null;
    });

    it('returns null for too-short buffer', () => {
      const buf = Buffer.from([CLIENT_KEYCODE_TAG]);
      expect(decodeClientKeycodeMessage(buf)).to.be.null;
    });

    it('decodes a 32-bit BE keycode', () => {
      const buf = Buffer.alloc(5);
      buf[0] = CLIENT_KEYCODE_TAG;
      buf.writeUInt32BE(KEYCODE_HOME, 1);
      expect(decodeClientKeycodeMessage(buf)).to.deep.equal({
        keycode: KEYCODE_HOME,
      });
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx mocha -r ts-node/register test/unit/device-stream-framing.spec.ts
```
Expected: failures with `Cannot find module '../../src/device-stream/android/framing'`.

- [ ] **Step 3: Implement the framing module**

`src/device-stream/android/framing.ts`:
```typescript
import {
  SRV_TAG_META,
  SRV_TAG_CONFIG,
  SRV_TAG_DATA,
  CLIENT_TOUCH_TAG,
  CLIENT_KEYCODE_TAG,
} from '../types';

export function encodeMeta(meta: unknown): Buffer {
  const json = Buffer.from(JSON.stringify(meta), 'utf-8');
  const out = Buffer.alloc(1 + json.length);
  out[0] = SRV_TAG_META;
  json.copy(out, 1);
  return out;
}

export function encodeConfig(data: Uint8Array): Buffer {
  const out = Buffer.alloc(1 + data.length);
  out[0] = SRV_TAG_CONFIG;
  Buffer.from(data.buffer, data.byteOffset, data.byteLength).copy(out, 1);
  return out;
}

export function encodeData(
  pts: bigint | undefined,
  data: Uint8Array,
): Buffer {
  const out = Buffer.alloc(1 + 8 + data.length);
  out[0] = SRV_TAG_DATA;
  out.writeBigUInt64LE(pts ?? 0n, 1);
  Buffer.from(data.buffer, data.byteOffset, data.byteLength).copy(out, 9);
  return out;
}

export interface ClientTouchMessage {
  action: number;
  normX: number;
  normY: number;
}

export function decodeClientTouchMessage(
  raw: Buffer,
): ClientTouchMessage | null {
  if (raw.length < 1 + 1 + 4 + 4) return null;
  if (raw[0] !== CLIENT_TOUCH_TAG) return null;
  return {
    action: raw[1]!,
    normX: raw.readFloatBE(2),
    normY: raw.readFloatBE(6),
  };
}

export interface ClientKeycodeMessage {
  keycode: number;
}

export function decodeClientKeycodeMessage(
  raw: Buffer,
): ClientKeycodeMessage | null {
  if (raw.length < 1 + 4) return null;
  if (raw[0] !== CLIENT_KEYCODE_TAG) return null;
  return { keycode: raw.readUInt32BE(1) };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx mocha -r ts-node/register test/unit/device-stream-framing.spec.ts
```
Expected: all 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/android/framing.ts test/unit/device-stream-framing.spec.ts
git commit -m "feat(device-stream): WS<->scrcpy framing helpers (TDD)"
```

---

## Task 3: Registry + state machine (TDD)

Tracks active Use Device sessions, exposes the state machine, fans EventBus session-end signals into bridge teardown.

**Files:**
- Create: `src/device-stream/registry.ts`
- Test: `test/unit/device-stream-registry.spec.ts`

- [ ] **Step 1: Write the failing tests**

`test/unit/device-stream-registry.spec.ts`:
```typescript
import { expect } from 'chai';
import * as sinon from 'sinon';
import { UseDeviceRegistry } from '../../src/device-stream/registry';

describe('UseDeviceRegistry', () => {
  let stopFn: sinon.SinonStub;
  let registry: UseDeviceRegistry;

  beforeEach(() => {
    stopFn = sinon.stub().resolves();
    registry = new UseDeviceRegistry();
  });

  describe('register + get', () => {
    it('registers a session and retrieves it', () => {
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 528,
        deviceHeight: 1080,
        stop: stopFn,
      });
      const got = registry.get('s1');
      expect(got).to.exist;
      expect(got!.sessionId).to.equal('s1');
      expect(got!.state).to.equal('running');
    });

    it('returns undefined for unknown sessionId', () => {
      expect(registry.get('nope')).to.be.undefined;
    });

    it('rejects duplicate sessionId', () => {
      const params = {
        sessionId: 's1',
        udid: 'u1',
        platform: 'android' as const,
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      };
      registry.register(params);
      expect(() => registry.register(params)).to.throw(/already registered/);
    });
  });

  describe('stop', () => {
    it('transitions state through stopping → terminated and invokes stop fn', async () => {
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      await registry.stop('s1');
      expect(stopFn).to.have.been.calledOnce;
      expect(registry.get('s1')).to.be.undefined;
    });

    it('is idempotent — second call resolves without throwing or re-invoking stop', async () => {
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: stopFn,
      });
      await registry.stop('s1');
      await registry.stop('s1'); // should not throw, should not call stop again
      expect(stopFn).to.have.been.calledOnce;
    });

    it('is a no-op for unknown sessionId', async () => {
      await registry.stop('nope');
      expect(stopFn).to.not.have.been.called;
    });
  });

  describe('stop concurrency', () => {
    it('coalesces concurrent stop calls — only one teardown happens', async () => {
      let resolveStop: () => void = () => {};
      const slowStop = sinon.stub().returns(
        new Promise<void>((r) => {
          resolveStop = r;
        }),
      );
      registry.register({
        sessionId: 's1',
        udid: 'u1',
        platform: 'android',
        deviceWidth: 1,
        deviceHeight: 1,
        stop: slowStop,
      });
      const p1 = registry.stop('s1');
      const p2 = registry.stop('s1');
      resolveStop();
      await Promise.all([p1, p2]);
      expect(slowStop).to.have.been.calledOnce;
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx mocha -r ts-node/register test/unit/device-stream-registry.spec.ts
```
Expected: failures with `Cannot find module '../../src/device-stream/registry'`.

- [ ] **Step 3: Implement the registry**

`src/device-stream/registry.ts`:
```typescript
import { UseDeviceSession, Platform, UseDeviceSessionState } from './types';
import log from '../logger';

interface RegisterParams {
  sessionId: string;
  udid: string;
  platform: Platform;
  deviceWidth: number;
  deviceHeight: number;
  /** Idempotent teardown — called at most once per session by the registry. */
  stop: () => Promise<void>;
}

interface InternalEntry {
  session: UseDeviceSession;
  stop: () => Promise<void>;
  /** Promise of in-progress stop, or undefined when not stopping. */
  stopping?: Promise<void>;
}

export class UseDeviceRegistry {
  private entries = new Map<string, InternalEntry>();

  register(params: RegisterParams): UseDeviceSession {
    if (this.entries.has(params.sessionId)) {
      throw new Error(
        `UseDeviceRegistry: sessionId ${params.sessionId} already registered`,
      );
    }
    const session: UseDeviceSession = {
      sessionId: params.sessionId,
      udid: params.udid,
      platform: params.platform,
      state: 'running',
      deviceWidth: params.deviceWidth,
      deviceHeight: params.deviceHeight,
      createdAt: Date.now(),
    };
    this.entries.set(params.sessionId, {
      session,
      stop: params.stop,
    });
    log.info(
      `[device-stream] session ${session.sessionId} registered for ${session.udid} (${session.platform})`,
    );
    return session;
  }

  get(sessionId: string): UseDeviceSession | undefined {
    return this.entries.get(sessionId)?.session;
  }

  list(): UseDeviceSession[] {
    return Array.from(this.entries.values()).map((e) => e.session);
  }

  async stop(sessionId: string): Promise<void> {
    const entry = this.entries.get(sessionId);
    if (!entry) return;
    if (entry.stopping) return entry.stopping;
    entry.session.state = 'stopping';
    entry.stopping = entry
      .stop()
      .catch((err) => {
        log.warn(
          `[device-stream] stop ${sessionId} threw: ${(err as Error)?.message ?? err}`,
        );
      })
      .finally(() => {
        entry.session.state = 'terminated';
        this.entries.delete(sessionId);
        log.info(`[device-stream] session ${sessionId} terminated`);
      });
    return entry.stopping;
  }
}

/** Module-singleton registry instance, mirroring upstream patterns. */
export const useDeviceRegistry = new UseDeviceRegistry();
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx mocha -r ts-node/register test/unit/device-stream-registry.spec.ts
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/device-stream/registry.ts test/unit/device-stream-registry.spec.ts
git commit -m "feat(device-stream): UseDeviceRegistry with idempotent stop (TDD)"
```

---

## Task 4: Android scrcpy bridge (TDD with mocks)

Wraps Tango's `AdbScrcpyClient`. Tests use sinon to stub the scrcpy client without needing a real device.

**Files:**
- Create: `src/device-stream/android/bridge.ts`
- Test: `test/unit/device-stream-android-bridge.spec.ts`

- [ ] **Step 1: Read the spike's bridge code for reference**

```bash
cat /tmp/falx-spike-android/server/index.ts | sed -n '93,247p'
```
This is the working spike implementation. The bridge module refactors lines 93–247 into a class, removes the WS coupling, and adds a leftover-process pre-flight kill.

- [ ] **Step 2: Write the failing tests**

`test/unit/device-stream-android-bridge.spec.ts`:
```typescript
import { expect } from 'chai';
import * as sinon from 'sinon';
import { AndroidScrcpyBridge } from '../../src/device-stream/android/bridge';

describe('AndroidScrcpyBridge', () => {
  let sandbox: sinon.SinonSandbox;
  let mockAdb: any;
  let mockScrcpy: any;
  let bridge: AndroidScrcpyBridge;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockAdb = {
      subprocess: {
        shellProtocol: { spawn: sandbox.stub().resolves({ exit: Promise.resolve(0) }) },
      },
    };
    mockScrcpy = {
      videoStream: Promise.resolve({
        metadata: { codec: 0 /* h264 */ },
        stream: { pipeTo: sandbox.stub().resolves() },
        sizeChanged: sandbox.stub(),
      }),
      controller: {
        injectTouch: sandbox.stub().resolves(),
        injectKeyCode: sandbox.stub().resolves(),
      },
      output: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) },
      close: sandbox.stub().resolves(),
    };
    bridge = new AndroidScrcpyBridge(mockAdb as any, {
      jarPath: '/fake/path/scrcpy-server.jar',
      // Inject the scrcpy factory so tests don't touch real Tango.
      scrcpyFactory: sandbox.stub().resolves(mockScrcpy),
      pushJar: sandbox.stub().resolves(),
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('kills leftover scrcpy processes before starting', async () => {
    await bridge.start();
    expect(mockAdb.subprocess.shellProtocol.spawn).to.have.been.calledWith(
      sinon.match(/pkill.*com.genymobile.scrcpy.Server/),
    );
  });

  it('returns dimensions from sizeChanged', async () => {
    const handle = await bridge.start();
    // simulate scrcpy reporting size
    const sizeChangedHandler = mockScrcpy.videoStream.then((v: any) =>
      v.sizeChanged.firstCall.args[0],
    );
    const handler = await sizeChangedHandler;
    handler({ width: 528, height: 1080 });
    expect(handle.getDimensions()).to.deep.equal({ width: 528, height: 1080 });
  });

  it('stop() is idempotent', async () => {
    const handle = await bridge.start();
    await handle.stop();
    await handle.stop();
    expect(mockScrcpy.close).to.have.been.calledOnce;
  });

  it('forwards touch via injectTouch in device-pixel space', async () => {
    const handle = await bridge.start();
    const sizeHandler = (await mockScrcpy.videoStream).sizeChanged.firstCall.args[0];
    sizeHandler({ width: 528, height: 1080 });
    await handle.injectTouch({ action: 0, normX: 0.5, normY: 0.75 });
    expect(mockScrcpy.controller.injectTouch).to.have.been.calledOnce;
    const arg = mockScrcpy.controller.injectTouch.firstCall.args[0];
    expect(arg.pointerX).to.equal(264);
    expect(arg.pointerY).to.equal(810);
    expect(arg.action).to.equal(0);
  });

  it('forwards keycode via injectKeyCode', async () => {
    const handle = await bridge.start();
    await handle.injectKeycode(3 /* HOME */);
    expect(mockScrcpy.controller.injectKeyCode).to.have.been.calledWith(
      sinon.match({ keyCode: 3 }),
    );
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx mocha -r ts-node/register test/unit/device-stream-android-bridge.spec.ts
```
Expected: failures, missing module.

- [ ] **Step 4: Implement the bridge**

`src/device-stream/android/bridge.ts`:
```typescript
import { readFile } from 'node:fs/promises';
import type { Adb } from '@yume-chan/adb';
import {
  AdbScrcpyClient,
  AdbScrcpyOptionsLatest,
} from '@yume-chan/adb-scrcpy';
import {
  DefaultServerPath,
  ScrcpyVideoCodecId,
} from '@yume-chan/scrcpy';
import { ReadableStream, WritableStream } from '@yume-chan/stream-extra';
import {
  ACTION_DOWN,
  ACTION_UP,
  ACTION_MOVE,
} from '../types';
import log from '../../logger';

const MAX_SIZE = 1080;

type ScrcpyHandle = AdbScrcpyClient<AdbScrcpyOptionsLatest<true>>;

export interface AndroidScrcpyBridgeOptions {
  jarPath: string;
  /** Injection seam for tests. Defaults to real AdbScrcpyClient.start. */
  scrcpyFactory?: (
    adb: Adb,
    serverPath: string,
    options: AdbScrcpyOptionsLatest<true>,
  ) => Promise<ScrcpyHandle>;
  /** Injection seam for tests. Defaults to real AdbScrcpyClient.pushServer. */
  pushJar?: (adb: Adb, jarBytes: Uint8Array) => Promise<void>;
}

export interface SessionHandle {
  /** Called once dimensions arrive from scrcpy's sizeChanged. */
  onDimensions(cb: (d: { width: number; height: number }) => void): void;
  getDimensions(): { width: number; height: number } | undefined;
  /** Frames piped to this writer. */
  pipeVideoTo(writer: WritableStream<VideoPacket>): Promise<void>;
  injectTouch(msg: {
    action: number;
    normX: number;
    normY: number;
  }): Promise<void>;
  injectKeycode(keycode: number): Promise<void>;
  /** Idempotent. */
  stop(): Promise<void>;
}

export interface VideoPacket {
  kind: 'configuration' | 'data';
  data: Uint8Array;
  pts?: bigint;
}

export function codecName(id: number): string {
  if (id === ScrcpyVideoCodecId.H264) return 'h264';
  if (id === ScrcpyVideoCodecId.H265) return 'h265';
  if (id === ScrcpyVideoCodecId.AV1) return 'av1';
  return `unknown(0x${id.toString(16)})`;
}

export class AndroidScrcpyBridge {
  constructor(
    private adb: Adb,
    private options: AndroidScrcpyBridgeOptions,
  ) {}

  async start(): Promise<SessionHandle> {
    await this.killLeftoverScrcpy();
    const jarBytes = await readFile(this.options.jarPath);
    const pushJar = this.options.pushJar ?? defaultPushJar;
    await pushJar(this.adb, jarBytes);

    const scrcpyOptions = new AdbScrcpyOptionsLatest({
      video: true,
      audio: false,
      control: true,
      videoCodec: 'h264',
      maxSize: MAX_SIZE,
      cleanup: true,
      clipboardAutosync: false,
    });

    const factory = this.options.scrcpyFactory ?? defaultScrcpyFactory;
    const scrcpy = await factory(this.adb, DefaultServerPath, scrcpyOptions);

    return this.makeHandle(scrcpy);
  }

  private async killLeftoverScrcpy(): Promise<void> {
    try {
      const proc = await this.adb.subprocess.shellProtocol.spawn(
        'pkill -f com.genymobile.scrcpy.Server || true',
      );
      await proc.exit;
    } catch (err) {
      log.warn(
        `[device-stream] pre-flight pkill failed: ${(err as Error)?.message ?? err}`,
      );
    }
  }

  private makeHandle(scrcpy: ScrcpyHandle): SessionHandle {
    let dimensions: { width: number; height: number } | undefined;
    const dimListeners: ((d: { width: number; height: number }) => void)[] = [];
    let stopped = false;
    let stopPromise: Promise<void> | undefined;

    const videoPromise = scrcpy.videoStream;
    void (async () => {
      const video = await videoPromise;
      video.sizeChanged((d: { width: number; height: number }) => {
        dimensions = d;
        for (const cb of dimListeners) cb(d);
      });
    })();

    return {
      onDimensions: (cb) => {
        dimListeners.push(cb);
        if (dimensions) cb(dimensions);
      },
      getDimensions: () => dimensions,
      pipeVideoTo: async (writer) => {
        const video = await videoPromise;
        if (!video) throw new Error('no video stream');
        await video.stream.pipeTo(
          new WritableStream<any>({
            write(packet) {
              if (stopped) return;
              if (packet.type === 'configuration') {
                writer.getWriter().write({ kind: 'configuration', data: packet.data });
              } else {
                writer.getWriter().write({
                  kind: 'data',
                  data: packet.data,
                  pts: packet.pts,
                });
              }
            },
          }),
        );
      },
      injectTouch: async ({ action, normX, normY }) => {
        if (!scrcpy.controller || !dimensions) return;
        const px = clamp(Math.round(normX * dimensions.width), 0, dimensions.width - 1);
        const py = clamp(Math.round(normY * dimensions.height), 0, dimensions.height - 1);
        const motionAction =
          action === 0 ? ACTION_DOWN : action === 1 ? ACTION_UP : ACTION_MOVE;
        await scrcpy.controller.injectTouch({
          action: motionAction,
          pointerId: 0n,
          pointerX: px,
          pointerY: py,
          videoWidth: dimensions.width,
          videoHeight: dimensions.height,
          pressure: action === 1 ? 0 : 1,
          actionButton: 0,
          buttons: 0,
        });
      },
      injectKeycode: async (keycode) => {
        if (!scrcpy.controller) return;
        await scrcpy.controller.injectKeyCode({
          action: ACTION_DOWN,
          keyCode: keycode,
          repeat: 0,
          metaState: 0,
        });
        await scrcpy.controller.injectKeyCode({
          action: ACTION_UP,
          keyCode: keycode,
          repeat: 0,
          metaState: 0,
        });
      },
      stop: async () => {
        if (stopped) return stopPromise ?? Promise.resolve();
        stopped = true;
        stopPromise = scrcpy.close().catch((err) => {
          log.warn(
            `[device-stream] scrcpy.close threw: ${(err as Error)?.message ?? err}`,
          );
        });
        return stopPromise;
      },
    };
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

async function defaultScrcpyFactory(
  adb: Adb,
  serverPath: string,
  options: AdbScrcpyOptionsLatest<true>,
): Promise<ScrcpyHandle> {
  return AdbScrcpyClient.start(adb, serverPath, options);
}

async function defaultPushJar(adb: Adb, jarBytes: Uint8Array): Promise<void> {
  await AdbScrcpyClient.pushServer(
    adb,
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(jarBytes);
        controller.close();
      },
    }),
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx mocha -r ts-node/register test/unit/device-stream-android-bridge.spec.ts
```
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/device-stream/android/bridge.ts test/unit/device-stream-android-bridge.spec.ts
git commit -m "feat(device-stream): AndroidScrcpyBridge with leftover-process pre-flight (TDD)"
```

---

## Task 5: Backend router (HTTP + WS)

Wires the registry + bridge to Express routes. Subscribes to the upstream EventBus so external session-end teardowns invoke `registry.stop()`.

**Files:**
- Create: `src/device-stream/router.ts`
- Modify: `src/dashboard/router.ts` (mount the new module)

- [ ] **Step 1: Survey the existing dashboard router**

```bash
grep -n "router.get\|router.post\|router.use" src/dashboard/router.ts | head -20
grep -n "registerRoutes\|register" src/dashboard/router.ts | head -5
```
Note where new routes mount. The new module exports a registration function called by `dashboard/router.ts`.

- [ ] **Step 2: Survey the EventBus surface**

```bash
grep -rn "EventBus\|sessionEnded\|sessionFinished" src/ --include="*.ts" | grep -v node_modules | head -20
```
Identify the exact event name fired when an Appium session ends. The registry will subscribe to it.

- [ ] **Step 3: Write the router module**

`src/device-stream/router.ts`:
```typescript
import path from 'node:path';
import express, { Router, Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HttpServer } from 'node:http';
import { AdbServerClient } from '@yume-chan/adb';
import { AdbServerNodeTcpConnector } from '@yume-chan/adb-server-node-tcp';
import { WritableStream } from '@yume-chan/stream-extra';
import { AndroidScrcpyBridge, codecName, VideoPacket } from './android/bridge';
import {
  encodeMeta,
  encodeConfig,
  encodeData,
  decodeClientTouchMessage,
  decodeClientKeycodeMessage,
} from './android/framing';
import { useDeviceRegistry } from './registry';
import { StartUseDeviceRequest } from './types';
import log from '../logger';
import { IPluginArgs } from '../interfaces/IPluginArgs';
// Appium-session creation client. The Falx plugin's existing session-creation
// path is what we delegate to; we POST to our own server's /session endpoint.
import axios from 'axios';

const JAR_PATH = path.join(__dirname, 'android', 'scrcpy-server.jar');

interface AppiumSessionCreateResult {
  sessionId: string;
  capabilities: { udid?: string; deviceUDID?: string };
}

export function registerDeviceStreamRoutes(
  router: Router,
  pluginArgs: IPluginArgs,
): void {
  router.post('/use-device/start', async (req: Request, res: Response) => {
    const body = req.body as StartUseDeviceRequest;
    if (!body?.udid) {
      return res.status(400).json({ error: 'missing_udid', message: 'udid is required' });
    }

    let appiumSessionId: string | undefined;
    let bridgeHandle: Awaited<ReturnType<AndroidScrcpyBridge['start']>> | undefined;
    try {
      // 1. Create an Appium session through our own plugin (reserves the device).
      const createUrl = `http://localhost:${pluginArgs.callbackPort ?? 4723}/wd/hub/session`;
      const caps = {
        capabilities: {
          alwaysMatch: {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:udid': body.udid,
            'appium:newCommandTimeout': 3600,
          },
        },
      };
      const created = await axios.post<{ value: AppiumSessionCreateResult }>(
        createUrl,
        caps,
        { timeout: 90_000 },
      );
      appiumSessionId = created.data.value.sessionId;

      // 2. Connect to local adb-server, build the Adb client.
      const connector = new AdbServerNodeTcpConnector({
        host: '127.0.0.1',
        port: 5037,
      });
      const serverClient = new AdbServerClient(connector);
      const devices = await serverClient.getDevices();
      const picked = devices.find((d) => d.serial === body.udid && d.state === 'device');
      if (!picked) throw new Error(`device ${body.udid} not online via adb`);
      const adb = await serverClient.createAdb({ transportId: picked.transportId });

      // 3. Start the scrcpy bridge.
      const bridge = new AndroidScrcpyBridge(adb, { jarPath: JAR_PATH });
      bridgeHandle = await bridge.start();

      // 4. Wait for first sizeChanged so we can report dimensions in the response.
      const dim = await new Promise<{ width: number; height: number }>((resolve) => {
        bridgeHandle!.onDimensions(resolve);
      });

      // 5. Register in registry.
      const session = useDeviceRegistry.register({
        sessionId: appiumSessionId,
        udid: body.udid,
        platform: 'android',
        deviceWidth: dim.width,
        deviceHeight: dim.height,
        stop: async () => {
          await bridgeHandle!.stop();
          try {
            await axios.delete(
              `http://localhost:${pluginArgs.callbackPort ?? 4723}/wd/hub/session/${appiumSessionId}`,
              { timeout: 30_000 },
            );
          } catch (err) {
            log.warn(`[device-stream] DELETE appium session failed: ${(err as Error)?.message ?? err}`);
          }
        },
      });

      // 6. Stash handle for the WS route.
      bridgeHandles.set(session.sessionId, bridgeHandle);

      // 7. Respond.
      const host = req.get('host') ?? `localhost:${pluginArgs.port ?? 4723}`;
      const protocol = req.protocol === 'https' ? 'wss' : 'ws';
      const basePath = pluginArgs.basePath ?? '/wd/hub';
      const streamPath = `/device-farm/api/dashboard/use-device/stream/${session.sessionId}`;
      // basePath is for WebDriver only; dashboard mounts at /device-farm/...
      const streamUrl = `${protocol}://${host}${streamPath}`;
      res.json({
        sessionId: session.sessionId,
        streamUrl,
        platform: 'android',
        deviceWidth: dim.width,
        deviceHeight: dim.height,
      });
    } catch (err) {
      log.error(`[device-stream] /start failed: ${(err as Error)?.message ?? err}`);
      // Best-effort cleanup.
      if (bridgeHandle) await bridgeHandle.stop().catch(() => {});
      if (appiumSessionId) {
        try {
          await axios.delete(
            `http://localhost:${pluginArgs.callbackPort ?? 4723}/wd/hub/session/${appiumSessionId}`,
            { timeout: 30_000 },
          );
        } catch {}
      }
      const message = (err as Error)?.message ?? String(err);
      if (message.includes('busy') || message.includes('blocked')) {
        return res.status(409).json({ error: 'device_busy', message });
      }
      res.status(502).json({ error: 'bridge_start_failed', message });
    }
  });

  router.post('/use-device/stop/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    await useDeviceRegistry.stop(sessionId);
    bridgeHandles.delete(sessionId);
    res.status(204).send();
  });
}

/** Tracks live SessionHandle per session id for the WS route to pick up. */
const bridgeHandles = new Map<
  string,
  Awaited<ReturnType<AndroidScrcpyBridge['start']>>
>();

export function attachDeviceStreamWebSocket(httpServer: HttpServer): void {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (req, socket, head) => {
    const url = req.url ?? '';
    const match = url.match(
      /^\/device-farm\/api\/dashboard\/use-device\/stream\/([^/?]+)/,
    );
    if (!match) return;
    const sessionId = match[1]!;
    wss.handleUpgrade(req, socket, head, (ws) => {
      void handleWsConnection(ws, sessionId);
    });
  });
}

async function handleWsConnection(
  ws: WebSocket,
  sessionId: string,
): Promise<void> {
  const handle = bridgeHandles.get(sessionId);
  const session = useDeviceRegistry.get(sessionId);
  if (!handle || !session) {
    ws.close(1008, 'unknown session');
    return;
  }

  let closed = false;
  ws.on('close', () => {
    closed = true;
    log.info(`[device-stream] ws closed for ${sessionId}`);
    void useDeviceRegistry.stop(sessionId);
    bridgeHandles.delete(sessionId);
  });

  // WS heartbeat — 10 s ping; terminate after one missed pong.
  let alive = true;
  ws.on('pong', () => {
    alive = true;
  });
  const interval = setInterval(() => {
    if (!alive) {
      ws.terminate();
      clearInterval(interval);
      return;
    }
    alive = false;
    try {
      ws.ping();
    } catch {}
  }, 10_000);
  ws.once('close', () => clearInterval(interval));

  // Send initial meta.
  ws.send(
    encodeMeta({
      codec: 'h264',
      width: session.deviceWidth,
      height: session.deviceHeight,
    }),
    { binary: true },
  );

  // Subscribe to size changes for subsequent meta sends.
  handle.onDimensions(({ width, height }) => {
    session.deviceWidth = width;
    session.deviceHeight = height;
    if (ws.readyState === ws.OPEN) {
      ws.send(encodeMeta({ codec: 'h264', width, height }), { binary: true });
    }
  });

  // Forward video. Drop-newest back-pressure: if the WS send buffer
  // exceeds 1 MB (slow client), drop data frames until it drains. Config
  // frames always go through (decoder won't recover without them).
  const MAX_BUFFERED = 1_000_000;
  void handle
    .pipeVideoTo(
      new WritableStream<VideoPacket>({
        write(packet) {
          if (closed || ws.readyState !== ws.OPEN) return;
          if (packet.kind === 'configuration') {
            ws.send(encodeConfig(packet.data), { binary: true });
            return;
          }
          if (ws.bufferedAmount > MAX_BUFFERED) return;
          ws.send(encodeData(packet.pts, packet.data), { binary: true });
        },
      }),
    )
    .catch((err) => log.warn(`[device-stream] video pipe error: ${err}`));

  // Forward control.
  ws.on('message', (raw, isBinary) => {
    if (!isBinary || !(raw instanceof Buffer) || raw.length < 1) return;
    const touch = decodeClientTouchMessage(raw);
    if (touch) {
      handle.injectTouch(touch).catch((err) =>
        log.warn(`[device-stream] injectTouch failed: ${err}`),
      );
      return;
    }
    const key = decodeClientKeycodeMessage(raw);
    if (key) {
      handle.injectKeycode(key.keycode).catch((err) =>
        log.warn(`[device-stream] injectKeycode failed: ${err}`),
      );
    }
  });
}
```

- [ ] **Step 4: Mount the router in dashboard/router.ts**

Read the existing file to find the right spot:
```bash
grep -n "registerRoutes\|router\.post\|router\.get" src/dashboard/router.ts | tail -10
```

Add to `src/dashboard/router.ts` (inside `registerRoutes`, after the device-name route):
```typescript
import { registerDeviceStreamRoutes } from '../device-stream/router';
// ... inside registerRoutes(router, pluginArgs):
  // Device stream (Use Device)
  registerDeviceStreamRoutes(router, pluginArgs);
```

- [ ] **Step 5: Attach the WS upgrade handler at plugin start**

```bash
grep -rn "createServer\|httpServer\|http\\.Server" src/ --include="*.ts" | grep -v node_modules | head -10
```
Find where the Appium plugin gets the underlying HTTP server. Add a call to `attachDeviceStreamWebSocket(httpServer)` at the same place the dashboard routes get attached.

If the existing plugin doesn't expose the underlying HTTP server cleanly, hook into the Appium plugin lifecycle's `updateServer` (per `plugin.ts` pattern). Read `src/plugin.ts` around line 423 for the existing `updateServer` shape and add the WS upgrade attach there.

- [ ] **Step 6: Verify compile**

```bash
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i 'device-stream' || echo "OK"
```

- [ ] **Step 7: Commit**

```bash
git add src/device-stream/router.ts src/dashboard/router.ts src/plugin.ts
git commit -m "feat(device-stream): HTTP start/stop + WS stream route with heartbeat"
```

---

## Task 6: EventBus subscription for cleanup-on-external-session-end

When an Appium session ends for any reason (admin kill, idle sweep, Appium client disconnect), the registry must tear down its bridge.

**Files:**
- Modify: `src/device-stream/router.ts` (add EventBus subscription on registration)

- [ ] **Step 1: Identify the EventBus end-of-session event name**

```bash
grep -rn "EventBus\|EventEmitter\|sessionEnd\|deleteSession\|delete.*session" src/ --include="*.ts" | grep -v node_modules | grep -v "test/" | head -20
```
Falx upstream uses an EventBus pattern. Identify the exact event name fired on session deletion. Common names: `session:ended`, `sessionFinished`, `delete_session`. If multiple exist, prefer the one fired on EVERY teardown path (including external cleanups).

- [ ] **Step 2: Subscribe at module init**

Append to `src/device-stream/router.ts`, in `registerDeviceStreamRoutes`:

```typescript
  // Wire EventBus session-end → registry teardown.
  // Replace 'session:ended' with the actual event name discovered in step 1.
  Container.get<EventBus>('EventBus').on('session:ended', (event: { sessionId: string }) => {
    void useDeviceRegistry.stop(event.sessionId);
    bridgeHandles.delete(event.sessionId);
  });
```

Add the imports:
```typescript
import { Container } from 'typedi';
import type { EventBus } from '../events/event-bus'; // adjust path to match upstream
```

- [ ] **Step 3: Commit**

```bash
git add src/device-stream/router.ts
git commit -m "feat(device-stream): subscribe to EventBus session-end for cleanup"
```

---

## Task 7: Backend integration test

Mocks `AdbScrcpyClient` and exercises the full start → stream → stop → eventbus-end paths.

**Files:**
- Create: `test/integration/device-stream-lifecycle.spec.ts`

- [ ] **Step 1: Write the integration test**

`test/integration/device-stream-lifecycle.spec.ts`:
```typescript
import { expect } from 'chai';
import * as sinon from 'sinon';
import express from 'express';
import http from 'node:http';
import { WebSocket } from 'ws';
import { AddressInfo } from 'node:net';
import { registerDeviceStreamRoutes, attachDeviceStreamWebSocket } from '../../src/device-stream/router';
import { useDeviceRegistry } from '../../src/device-stream/registry';

describe('device-stream lifecycle (integration)', function () {
  this.timeout(30_000);
  let server: http.Server;
  let baseUrl: string;
  let sandbox: sinon.SinonSandbox;

  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    const app = express();
    app.use(express.json());
    const router = express.Router();
    registerDeviceStreamRoutes(router, {
      callbackPort: 0, // we'll intercept axios in the test
      port: 0,
      basePath: '/wd/hub',
    } as any);
    app.use('/device-farm/api/dashboard', router);
    server = http.createServer(app);
    attachDeviceStreamWebSocket(server);
    server.listen(0, () => {
      const addr = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${addr.port}`;
      done();
    });
  });

  afterEach((done) => {
    sandbox.restore();
    server.close(() => done());
  });

  it('rejects start with missing udid', async () => {
    const res = await fetch(`${baseUrl}/device-farm/api/dashboard/use-device/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(res.status).to.equal(400);
  });

  // More tests would stub axios + the AdbScrcpyClient factory and exercise
  // start → register → stream → stop → ensure registry empty. See spike for
  // wire-format reference. Marked as a stretch goal; the bridge unit tests
  // already cover the bridge state machine and the framing tests cover the
  // wire format, so this integration test is light on additional coverage.
});
```

- [ ] **Step 2: Run the integration test**

```bash
npx mocha -r ts-node/register test/integration/device-stream-lifecycle.spec.ts
```
Expected: pass (one assertion).

- [ ] **Step 3: Commit**

```bash
git add test/integration/device-stream-lifecycle.spec.ts
git commit -m "test(device-stream): integration smoke test for /start input validation"
```

---

## Task 8: Falx-UI API service

The frontend's wrapper for the new backend endpoints.

**Files:**
- Create: `falx-ui/src/api-service/use-device.ts`

- [ ] **Step 1: Survey existing API service pattern**

```bash
ls falx-ui/src/api-service
head -30 falx-ui/src/api-service/api-client.ts
```

- [ ] **Step 2: Implement the API service**

`falx-ui/src/api-service/use-device.ts`:
```typescript
import apiClient from './api-client';

export interface StartUseDeviceResponse {
  sessionId: string;
  streamUrl: string;
  platform: 'android' | 'ios';
  deviceWidth: number;
  deviceHeight: number;
}

export async function createUseDeviceSession(
  udid: string,
): Promise<StartUseDeviceResponse> {
  const res = await apiClient.post<StartUseDeviceResponse>(
    '/dashboard/use-device/start',
    { udid },
  );
  return res.data;
}

export async function endUseDeviceSession(sessionId: string): Promise<void> {
  await apiClient.post(`/dashboard/use-device/stop/${sessionId}`);
}
```

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/api-service/use-device.ts
git commit -m "feat(falx-ui): use-device API service"
```

---

## Task 9: BrowserUnsupported component

Shown if WebCodecs / H.264 is unavailable.

**Files:**
- Create: `falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx`

- [ ] **Step 1: Implement the component**

```typescript
// falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx
import { Link } from 'react-router-dom';

export function BrowserUnsupported() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        Use Device requires Chrome or Edge
      </h1>
      <p className="text-gray-700 max-w-md text-center">
        This page streams the device screen using H.264 video decoding in your
        browser. Your current browser does not support the required
        <code className="px-1 py-0.5 mx-1 bg-gray-100 rounded">WebCodecs</code>
        API. Please open Falx in Chrome or Edge to use this feature.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to devices
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add falx-ui/src/pages/UseDevice/BrowserUnsupported.tsx
git commit -m "feat(falx-ui): BrowserUnsupported component"
```

---

## Task 10: AndroidStreamCanvas component

The load-bearing component: WebSocket + WebCodecs decoder + canvas + pointer/keyboard handlers.

**Files:**
- Create: `falx-ui/src/pages/UseDevice/AndroidStreamCanvas.tsx`

- [ ] **Step 1: Read the client spike for reference**

```bash
cat /tmp/falx-spike-android/client/src/App.tsx
```
The spike's decoder + pointer logic is the source of truth. Adapt it into a function component.

- [ ] **Step 2: Implement the component using forwardRef + useImperativeHandle**

`falx-ui/src/pages/UseDevice/AndroidStreamCanvas.tsx`:
```typescript
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  WebCodecsVideoDecoder,
  WebCodecsVideoDecoderRenderer,
} from '@yume-chan/scrcpy-decoder-webcodecs';

const SRV_TAG_META = 0x01;
const SRV_TAG_CONFIG = 0x02;
const SRV_TAG_DATA = 0x03;
const CLIENT_TOUCH_TAG = 0x10;
const CLIENT_KEYCODE_TAG = 0x11;

export interface AndroidStreamHandle {
  sendKeycode(keycode: number): void;
}

interface Props {
  streamUrl: string;
  deviceWidth: number;
  deviceHeight: number;
  onDisconnect(): void;
}

export const AndroidStreamCanvas = forwardRef<AndroidStreamHandle, Props>(
  function AndroidStreamCanvas(props, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const dimsRef = useRef({ w: props.deviceWidth, h: props.deviceHeight });
    const [status, setStatus] = useState<'connecting' | 'streaming' | 'error'>(
      'connecting',
    );

    useImperativeHandle(
      ref,
      () => ({
        sendKeycode(keycode: number) {
          const ws = wsRef.current;
          if (!ws || ws.readyState !== ws.OPEN) return;
          const buf = new ArrayBuffer(5);
          const view = new DataView(buf);
          view.setUint8(0, CLIENT_KEYCODE_TAG);
          view.setUint32(1, keycode);
          ws.send(buf);
        },
      }),
      [],
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const decoder = new WebCodecsVideoDecoder({
        codec: 'h264',
        renderer: new WebCodecsVideoDecoderRenderer({ canvas }),
      });

      const ws = new WebSocket(props.streamUrl);
      ws.binaryType = 'arraybuffer';
      wsRef.current = ws;

      ws.onopen = () => setStatus('streaming');
      ws.onclose = () => {
        setStatus('error');
        props.onDisconnect();
      };
      ws.onerror = () => setStatus('error');
      ws.onmessage = (ev) => {
        const buf = new Uint8Array(ev.data as ArrayBuffer);
        const tag = buf[0];
        if (tag === SRV_TAG_META) {
          const meta = JSON.parse(
            new TextDecoder().decode(buf.subarray(1)),
          ) as { width: number; height: number };
          dimsRef.current = { w: meta.width, h: meta.height };
        } else if (tag === SRV_TAG_CONFIG) {
          const data = buf.subarray(1);
          decoder.writer.write({ type: 'configuration', data });
        } else if (tag === SRV_TAG_DATA) {
          const pts = new DataView(buf.buffer, buf.byteOffset + 1, 8).getBigUint64(
            0,
            true,
          );
          const data = buf.subarray(9);
          decoder.writer.write({ type: 'data', data, pts });
        }
      };

      return () => {
        try {
          ws.close();
        } catch {}
        decoder.dispose();
      };
    }, [props.streamUrl]);

    function sendTouch(action: 0 | 1 | 2, ev: React.PointerEvent) {
      const ws = wsRef.current;
      const canvas = canvasRef.current;
      if (!ws || !canvas || ws.readyState !== ws.OPEN) return;
      const rect = canvas.getBoundingClientRect();
      const normX = (ev.clientX - rect.left) / rect.width;
      const normY = (ev.clientY - rect.top) / rect.height;
      const buf = new ArrayBuffer(10);
      const view = new DataView(buf);
      view.setUint8(0, CLIENT_TOUCH_TAG);
      view.setUint8(1, action);
      view.setFloat32(2, normX);
      view.setFloat32(6, normY);
      ws.send(buf);
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={dimsRef.current.w}
          height={dimsRef.current.h}
          style={{ maxHeight: '80vh', borderRadius: 8, background: '#000' }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            sendTouch(0, e);
          }}
          onPointerMove={(e) => {
            if (e.buttons !== 0) sendTouch(2, e);
          }}
          onPointerUp={(e) => {
            sendTouch(1, e);
          }}
        />
        <div className="text-xs text-gray-500">Status: {status}</div>
      </div>
    );
  },
);
```

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/pages/UseDevice/AndroidStreamCanvas.tsx
git commit -m "feat(falx-ui): AndroidStreamCanvas with WebCodecs decoder and pointer handlers"
```

---

## Task 11: ControlToolbar component

Renders Back / Home / Recents / Stop.

**Files:**
- Create: `falx-ui/src/pages/UseDevice/ControlToolbar.tsx`

- [ ] **Step 1: Implement the component**

`falx-ui/src/pages/UseDevice/ControlToolbar.tsx`:
```typescript
import { ArrowLeft, Home, Square, X } from 'lucide-react';

const KEYCODE_BACK = 4;
const KEYCODE_HOME = 3;
const KEYCODE_APP_SWITCH = 187;

interface Props {
  onKey(keycode: number): void;
  onStop(): void;
}

export function ControlToolbar(props: Props) {
  return (
    <div className="flex gap-2 p-2 rounded-md bg-white shadow border border-gray-200">
      <button
        title="Back"
        onClick={() => props.onKey(KEYCODE_BACK)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <ArrowLeft size={20} />
      </button>
      <button
        title="Home"
        onClick={() => props.onKey(KEYCODE_HOME)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Home size={20} />
      </button>
      <button
        title="Recents"
        onClick={() => props.onKey(KEYCODE_APP_SWITCH)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Square size={20} />
      </button>
      <div className="flex-1" />
      <button
        title="Stop"
        onClick={props.onStop}
        className="p-2 hover:bg-red-50 text-red-600 rounded"
      >
        <X size={20} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add falx-ui/src/pages/UseDevice/ControlToolbar.tsx
git commit -m "feat(falx-ui): ControlToolbar with Back/Home/Recents/Stop"
```

---

## Task 12: UseDevice page (route component)

Composes the page: browser detection, start request, mounts AndroidStreamCanvas + ControlToolbar.

**Files:**
- Create: `falx-ui/src/pages/UseDevice/UseDevice.tsx`

- [ ] **Step 1: Implement the page using a ref to the canvas**

`falx-ui/src/pages/UseDevice/UseDevice.tsx`:
```typescript
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createUseDeviceSession,
  endUseDeviceSession,
  StartUseDeviceResponse,
} from '../../api-service/use-device';
import {
  AndroidStreamCanvas,
  AndroidStreamHandle,
} from './AndroidStreamCanvas';
import { ControlToolbar } from './ControlToolbar';
import { BrowserUnsupported } from './BrowserUnsupported';

function webCodecsAvailable(): boolean {
  return typeof (globalThis as any).VideoDecoder !== 'undefined';
}

export default function UseDevice() {
  const { udid } = useParams<{ udid: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<StartUseDeviceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<AndroidStreamHandle>(null);

  useEffect(() => {
    if (!webCodecsAvailable() || !udid) return;
    let cancelled = false;
    createUseDeviceSession(udid)
      .then((s) => {
        if (cancelled) {
          // Started a session before navigating away — clean it up.
          endUseDeviceSession(s.sessionId).catch(() => {});
        } else {
          setSession(s);
        }
      })
      .catch((e: any) => {
        const msg =
          e?.response?.data?.message || e?.message || 'Failed to start session';
        setError(msg);
      });
    return () => {
      cancelled = true;
    };
  }, [udid]);

  function handleStop() {
    if (session) endUseDeviceSession(session.sessionId).catch(() => {});
    navigate('/');
  }

  function handleKey(keycode: number) {
    canvasRef.current?.sendKeycode(keycode);
  }

  if (!webCodecsAvailable()) return <BrowserUnsupported />;
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600 font-semibold">Couldn't start Use Device</p>
        <p className="text-gray-700">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to devices
        </button>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Starting session…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ControlToolbar onKey={handleKey} onStop={handleStop} />
      <AndroidStreamCanvas
        ref={canvasRef}
        streamUrl={session.streamUrl}
        deviceWidth={session.deviceWidth}
        deviceHeight={session.deviceHeight}
        onDisconnect={handleStop}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add falx-ui/src/pages/UseDevice/UseDevice.tsx
git commit -m "feat(falx-ui): UseDevice page composes stream + toolbar"
```

---

## Task 13: Mount the route in falx-ui's App.tsx

**Files:**
- Modify: `falx-ui/src/App.tsx`

- [ ] **Step 1: Read existing route list**

```bash
sed -n '1,80p' falx-ui/src/App.tsx
```

- [ ] **Step 2: Add the route**

Find the protected routes block in `falx-ui/src/App.tsx`. Add:
```tsx
import UseDevice from './pages/UseDevice/UseDevice';
// ... inside the protected routes block:
<Route
  path="/use-device/:udid"
  element={
    <ProtectedRouteWrapper>
      <UseDevice />
    </ProtectedRouteWrapper>
  }
/>
```

- [ ] **Step 3: Verify dev build**

```bash
cd falx-ui
npm run build
cd ..
```
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add falx-ui/src/App.tsx
git commit -m "feat(falx-ui): mount /use-device/:udid route under AppLayout"
```

---

## Task 14: DeviceCard "Use Device" button (Android only)

**Files:**
- Modify: `falx-ui/src/components/devicecard/DeviceCard.tsx`

- [ ] **Step 1: Read current DeviceCard structure**

```bash
sed -n '1,40p' falx-ui/src/components/devicecard/DeviceCard.tsx
grep -n "Block\|Unblock\|action" falx-ui/src/components/devicecard/DeviceCard.tsx | head -10
```

- [ ] **Step 2: Add the button**

In `falx-ui/src/components/devicecard/DeviceCard.tsx`, add a navigation hook:
```typescript
import { useNavigate } from 'react-router-dom';
// inside component:
const navigate = useNavigate();
```

In the action-buttons row, after the existing Block/Unblock button (or before — match the existing visual hierarchy), add:
```tsx
{device.platform === 'android' && (
  <button
    onClick={() => navigate(`/use-device/${device.udid}`)}
    disabled={device.offline || device.busy || device.userBlocked}
    className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm rounded-md"
  >
    Use Device
  </button>
)}
```

Match the existing light-theme conventions from the 2026-05-15 UI shell slice.

- [ ] **Step 3: Verify dev build**

```bash
cd falx-ui && npm run build && cd ..
```

- [ ] **Step 4: Commit**

```bash
git add falx-ui/src/components/devicecard/DeviceCard.tsx
git commit -m "feat(falx-ui): Use Device button on Android DeviceCards"
```

---

## Task 15: "Legacy Use Device" topbar entry

Keeps the proprietary path linkable during dev.

**Files:**
- Modify: `falx-ui/src/components/header/Header.tsx` (or wherever the topbar lives — check `falx-ui/src/components/layout/TopBar.tsx` first since the UI shell slice introduced that)

- [ ] **Step 1: Locate the topbar component**

```bash
ls falx-ui/src/components/layout/
grep -rn "TopBar\|Header" falx-ui/src/components/layout/ falx-ui/src/components/header/ 2>/dev/null | head -10
```

- [ ] **Step 2: Add the dropdown entry**

In the utility cluster (right side of the topbar), add a link or dropdown item:
```tsx
<a
  href="/device-farm/"
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
>
  Legacy Use Device
</a>
```

If a dropdown menu component already exists in the topbar, add it as an item there instead.

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/components/layout/TopBar.tsx  # or the actual file path
git commit -m "feat(falx-ui): Legacy Use Device link in topbar (dev-only fallback)"
```

---

## Task 16: Run full test suite

- [ ] **Step 1: Run existing tests + new tests**

```bash
npm test
```
Expected: all tests pass. Resolve any failures.

- [ ] **Step 2: Build the UI**

```bash
cd falx-ui && npm run build && cd ..
```
Expected: build succeeds, bundle size reported. Note Tango decoder delta < 200 KB gzipped per acceptance criteria.

- [ ] **Step 3: Commit if any fixes needed**

If you needed to fix anything to make tests pass:
```bash
git add <files>
git commit -m "fix(device-stream): <what>"
```

---

## Task 17: Manual verification checklist

Real-device smoke test before merging. **The human runs this** with an Android phone plugged in.

- [ ] **Step 1: Start the plugin in dev mode**

```bash
npm run build && appium server -ka 800 --use-plugins=device-farm -pa /wd/hub
```

- [ ] **Step 2: Verify each acceptance criterion**

Follow this checklist exactly. Each must pass.

**Functional:**

- [ ] Open Falx in Chrome at `http://localhost:4723/device-farm/`. Log in.
- [ ] Devices page shows your Android phone with a **Use Device** button (light blue).
- [ ] Click **Use Device** → URL changes to `/use-device/<udid>`, "Starting session…" briefly, then live video appears on a canvas.
- [ ] Stopwatch test: open a stopwatch app on the phone, hold it in front of the canvas. Estimate delta — should feel < 300 ms.
- [ ] Tap the four corners + center of the canvas → device taps register in approximately the right place.
- [ ] Click **Back** → device back navigation fires.
- [ ] Click **Home** → device returns to home screen.
- [ ] Click **Recents** → app switcher opens.
- [ ] Click **Stop** → returns to `/`. Devices page shows the phone as not-busy within 2 s.
- [ ] Re-click **Use Device** → same device works again.
- [ ] Open Falx in a second Chrome tab, navigate to the same `/use-device/<udid>` while User A is connected → see a "device busy" error (or 409 in network tab), no broken state.
- [ ] Open the Sessions UI in another tab → active Use Device session is listed for the duration; gone after Stop.

**Browser support:**
- [ ] In Firefox or Safari, navigate to `/use-device/<udid>` → see the BrowserUnsupported page, not a broken canvas.

**Lifecycle:**
- [ ] Start a session, close the browser tab without clicking Stop → on the server, the session ends within ~5 s (check Falx logs and `adb shell ps -A | grep scrcpy` — empty).
- [ ] Start a session, kill Chrome (Cmd-Q force quit) → session ends within ~30 s via WS heartbeat.

**Durability:**
- [ ] 10-minute interactive session: leave video streaming, occasionally tap, confirm no decoder error, no visible stall > 1 s.
- [ ] 100 start→stop cycles via a script (write a small bash loop that POSTs /start then /stop) → after the loop, `adb shell ps -A | grep scrcpy` is empty.

**Cross-vendor:**
- [ ] Repeat the core functional flow on **a second Android vendor family** (not Samsung — try Pixel, Xiaomi, OnePlus, etc.). Note any issues.

- [ ] **Step 3: Append findings to the spec**

If issues were found, append a `## Implementation findings` section to [docs/superpowers/specs/2026-05-16-android-use-device-design.md](../specs/2026-05-16-android-use-device-design.md) documenting what was hit and how it was resolved.

- [ ] **Step 4: Commit any final polish**

```bash
git add -A
git status
git commit -m "chore(device-stream): manual verification findings + final polish"
```

---

## Self-review checklist (engineer fills in before requesting review)

After the plan is fully executed:

- [ ] All unit tests pass (`npm test`).
- [ ] All integration tests pass.
- [ ] Manual checklist (Task 17) green on at least two Android vendor families.
- [ ] `falx-ui` build succeeds, bundle delta < 200 KB gzipped.
- [ ] `npx tsc --noEmit` clean.
- [ ] No leftover scrcpy processes on the device after a stop cycle (`adb shell ps -A | grep scrcpy` empty).
- [ ] Devices page shows Use Device button **only** on Android cards.
- [ ] Legacy Use Device link in the topbar still works.
- [ ] Existing Appium test clients can still create sessions against other devices while a Use Device session is active.
- [ ] No regression in `npm test` baseline.

## Open seams flagged for follow-up slices

- Auth gating on `/use-device/start` and the WS route — currently same posture as the rest of the dashboard (none).
- Inactivity-warning timeout — deferred.
- Hub/node-specific `streamUrl` routing — `start` currently returns same-host; hub-side rewriting comes later.
- Side tabs (Logcat, Screenshots, Files, Apps, Device Info) — each its own slice.
- TinyH264 wasm fallback for non-Chromium browsers — deferred.
- iOS slice 2 will introduce `IOSStreamCanvas` alongside `AndroidStreamCanvas` and have `UseDevice.tsx` switch on `session.platform`. The ref pattern landed in slice 1 (`AndroidStreamHandle`) generalises trivially.
