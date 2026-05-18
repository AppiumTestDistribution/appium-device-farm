# Falx — Backlog

Deferred ideas, future tech, and lessons logged for later. Anything that
doesn't need to happen now but shouldn't be lost. Move items into
`docs/SLICES.md` when ready to work on them.

## Features (deferred)

- **Audit logging** — full audit trail of user/device actions, exportable
- **Remote script execution** — sandboxed JS/Python script run inside a session
- **App Store Connect / TestFlight integration** — pull builds, auto-install
- **Google Play (Internal Track) integration** — same for Android
- **Firebase App Distribution integration**
- **WebRTC device streaming** — P2P browser ↔ node, hub does signaling only.
  Critical design rule: never proxy media through the hub.
- **Tunneling** — dev machines → hub from outside the LAN (WireGuard-based or
  Cloudflare Tunnel wrapper)
- **Notifications** — Slack / email / webhook on session events
- **Video recordings per session** — store in MinIO, link from session detail
- **iOS WDA auto-rebuild pipeline** — kicks in when new iOS major versions drop
- **Public API tokens + rate limiting**
- **Self-healing flaky devices** — auto power-cycle via Cambrionix-class hub
- **Teams + RBAC extensions** — admin / member / read-only (upstream has some;
  extend as needed)
- **SSO** — Authentik / Zitadel / Keycloak via OIDC
- **Lago metering** — emit usage events from day 1 (cheap), bill later if
  going multi-tenant SaaS
- **Multi-tenant SaaS mode** — only after on-prem is rock-solid

## Tech / architecture (deferred)

- **Monorepo split** (pnpm workspaces: `apps/web`, `apps/api`, `apps/worker`,
  `packages/*`) — useful once the codebase gets unwieldy. Not now.
- **NestJS control plane** — separate API service for our features, talking to
  the Appium plugin via REST. Lets us own the API contract independently of
  upstream. Reasonable to do when our backend code in `src/` starts feeling
  uncomfortable to commingle with upstream.
- **shadcn/ui + Tremor UI migration** — drop MUI + Flowbite from `falx-ui/`.
  Migrate screen-by-screen as part of feature slices that touch those screens.
  Worth doing once the inconsistency becomes painful.
- **OpenTelemetry tracing** — Pino logs are fine for now; add traces when
  debugging cross-process flows starts hurting.
- **Grafana LGTM stack** (Loki + Grafana + Tempo + Mimir/Prometheus) for full
  observability. Self-hostable, fits the on-prem story.
- **Read-replica Postgres** — when DB load justifies it.
- **DB detachment** — Postgres on its own host with PgBouncer connection
  pooling. User has flagged this as future direction.
- **HA setup** — two hubs behind a load balancer with shared DB. Only when
  uptime SLO requires it.
- **Refine.dev evaluation** — B2B admin framework. Could speed up admin-screen
  delivery. Revisit if many CRUD screens to build.
- **Biome** — replace ESLint + Prettier with single tool. Cheap upgrade.
- **Dashboard availability source-of-truth alignment with `UseDeviceRegistry`** —
  surfaced 2026-05-17 during concurrency-fix verification. Repro: Tab B holds
  an active Use Device session; Tab A sees the device with an **Unblock**
  button; clicking Unblock marks it available in Tab A's view but the live
  Use Device session in Tab B continues. `/start` correctly returns 409 if
  Tab A tries to claim, so the registry is authoritative; the dashboard
  derives availability from the older upstream `IDevice.busy` flag. Fix:
  either (a) extend the Unblock route to also call
  `useDeviceRegistry.stop(...)` for the device's session, or (b) make the
  dashboard's availability check consult `UseDeviceRegistry` first. Small
  slice when convenient.
- **WDA accessibility-snapshot-skip patch spike (iOS input latency)** —
  surfaced 2026-05-19 closing the iOS input responsiveness slice. WDA's
  `/wda/tap` and `/actions` handlers internally call
  `Requesting snapshot of accessibility hierarchy` per move step (~50 ms
  × N), per Appium issue
  [#16230](https://github.com/appium/appium/issues/16230) — no upstream
  fix. ≤2-day spike: clone WDA, patch the snapshot calls out of the tap/
  actions hot path, rebuild, measure tap p50. If <300 ms, ship the patch
  as a build-time `.patch` file under `infra/` (NOT a fork). Validate the
  on-device gesture remains correct. Only attempt this when iOS demo
  responsiveness becomes a priority again — the rest of the OSS iOS
  ecosystem hits the same ceiling, so no rush from competitive standpoint.
  See `docs/spikes/04-ios-input-latency-spike.md` for the baseline
  numbers this would aim to beat.
- **Track `tddworks/baguette` for real-device iOS HID injection** —
  simulator-only today (uses iOS 26 private input APIs without WDA). If
  the author extends to real devices via a runner-side injector, that's
  the path to BrowserStack-grade iOS input feel without forking WDA.
  Revisit quarterly.

## Operations / infra (deferred)

- **Terraform** — provision cloud and on-prem infra reproducibly
- **Ansible** — host configuration on Linux mini PCs (provider nodes)
- **Self-hosted GitHub Actions runner** — for CI on customer infra
- **Cambrionix industrial USB hubs** — per-port power switching for fleet hosts
- **Mac signing host runbook** — WDA rebuild + re-sign workflow
- **Customer-facing branding wrapper** — Docker image names, helm chart names,
  systemd unit names, dashboard chrome — all say "Falx", never "appium"

## Lessons / decisions log

Capture surprises, gotchas, and things you'd warn future-you about. Add as
you go.

- Upstream `appium-device-farm` is fully Apache 2.0 as of late 2025 (was a
  hybrid MIT + obfuscated-proprietary model before; check git log on
  `LICENSE` if you ever doubt it).
- Upstream uses SQLite by default — we migrate to Postgres in Slice 1. Likely
  need to regenerate Prisma migrations rather than convert SQLite ones, since
  some SQL is dialect-specific.
- Plugin slug `device-farm` is the Appium plugin name. Don't rename — brand
  only at UI / product / deployment layer.
- `dashboard-frontend/` is upstream — never modify. All UI work happens in
  `falx-ui/`.
- iOS on Linux via go-ios + tunneld is supported but expect ~5–10% extra
  flake vs. native Mac. iOS major-version releases break things until
  go-ios catches up.
- **iOS interactive input dispatch via vanilla WDA has a 600–1800 ms
  per-call latency floor on iOS 26** (measured against `kry-phone`
  iPhone 12 Pro Max iOS 26.4.2 in spike 04, `docs/spikes/04-...`). This
  is intrinsic to WDA's XCTest-based dispatch — every public OSS iOS
  device farm hits the same ceiling (GADS, Sonic, ControlFloorAgent,
  STF-iOS, atxserver2, tidevice — all use a WDA-shaped runner). There
  is no public sub-100 ms alternative for iOS 26 real devices today.
  Falx ships the same input feel as the rest of the OSS landscape; do
  not promise BrowserStack-grade live drag until either Appium issue
  #16230 lands or a non-WDA channel emerges. See the WDA-patch-spike
  backlog item above for the one identified local lever.
- Apple Developer Program limits 100 devices/year per Individual account;
  constrains iOS device count more than hardware does. Plan account strategy
  before buying 100+ iOS devices.
- Per-host realistic ceilings: ~15 Android **or** ~10 iOS devices on a mid-tier
  mini PC. Mixing reduces totals (~1.5× cost per iOS vs. Android).
- USB hub quality and power matter more than CPU above ~10 devices per host.
  Cambrionix-class hubs with switched per-port power are the gold standard.
- Don't use rack servers as device hosts — distribute as small machines on
  rack shelves with industrial USB hubs. Failure isolation beats consolidation.
- WebRTC must be P2P (browser ↔ node) with hub only doing signaling. Never
  proxy media. 100+ streams through a hub melts it.
- `falx-ui/` started as a copy of `dashboard-frontend/`. Keep upstream
  `dashboard-frontend/` untouched so upstream UI updates can be cherry-picked
  if useful.
- **WDA + iOS 26 tap regression (spike 02, 2026-05-15).** WDA 12.2.2 (stock
  Appium fork, May 2026 main) on iOS 26.4.2 silently no-ops every
  tap-injection endpoint: `/wda/tap`, W3C `/actions`,
  `/wda/dragfromtoforduration`, and `/element/<id>/click` all return
  `200 null` with no visible UI effect. READ APIs and element finders
  work fine; only write/dispatch is broken. Spike 03 is the prerequisite
  follow-up before iOS device-use can ship. Hardware-button presses
  (`/wda/pressButton`) showed anecdotal evidence of working — useful
  fallback channel worth confirming.
- **go-ios `runwda` bundle-ID convention shifted for iOS 17+ / Xcode 15+.**
  Both `--bundleid` and `--testrunnerbundleid` must be the `.xctrunner`
  runner-app bundle id (e.g. `com.you.WebDriverAgentRunner.xctrunner`).
  The pre-iOS-17 convention of passing the test bundle id without the
  `.xctrunner` suffix returns "Did not find test app for '…' on device"
  on iOS 26. Update any internal docs that still show the old form.
- **go-ios RSD tunnel daemon serialises poorly under concurrent
  connections.** Spawning `ios runwda` + the two `ios forward`s in
  parallel causes two of three to die with
  `could not connect to RSD: read: connection reset by peer`. Spawn
  sequentially with ~3 s after runwda and ~0.5 s between forwards.
  Reliable. Documented in spike 02's server bridge.
- **WDA's `/wda/tap/0` legacy element-id slot endpoint is removed.**
  Use `/wda/tap` (no `/0`). The slot was deprecated years ago and 12.2.2
  finally drops it; old tutorials that say "pass `0` for absolute screen
  taps" return 404 now.
- **WDA's MJPEG server uses a non-standard multipart boundary in
  `Content-Type`.** The header value already includes the `--` prefix
  that RFC 2046 says belongs only in the body delimiter
  (`boundary=--BoundaryString`; body separator is exactly
  `--BoundaryString`). Clients parsing the stream must use the header
  value verbatim — *don't* prepend `--`.
- **WDA's MJPEG server is single-client.** A second connection gets the
  Content-Type but no body data. Falx must multiplex one upstream MJPEG
  into N browser viewers on the hub.
- **WDA cannot unlock past Face ID / passcode.** `/wda/unlock` only
  wakes the screen; the device must be manually unlocked.
  Long-running automation needs Auto-Lock = Never. Locked-state shows
  as a black MJPEG frame with no error indicator — Falx UI needs a
  "device is locked" overlay driven by `/wda/locked`.
- **WDA tap coords are iOS POINTS, not physical pixels.** The MJPEG
  stream returns native pixels (1284×2778 on iPhone 12 Pro Max @3x)
  but WDA's `/wda/screen` reports `screenSize: {428, 926}, scale: 3`
  and tap APIs work in the 428×926 point space. Client must divide
  pixel coords by `screen.scale` (or compute scale from
  `screen.screenSize / image.naturalWidth`) before posting taps.

## Open questions

(Things we haven't decided and don't need to yet. Move to slices when forced.)

- Auth: keep upstream's JWT setup, or switch to a library (Lucia / Auth.js)
  when SSO arrives?
- Queue: BullMQ via Redis is the obvious choice when we need real background
  jobs. Discovery will tell us if upstream already has anything.
- Real-time: stay on raw `ws`, or move to socket.io? Decide when a slice
  actually needs richer protocols.
- Hub-node coordination: HTTP polling works at 100–200 devices. Push-based
  (WebSocket from node to hub) is a future option past ~500 devices.
