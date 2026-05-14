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
