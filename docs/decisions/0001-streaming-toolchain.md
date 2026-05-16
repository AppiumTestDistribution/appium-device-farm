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
