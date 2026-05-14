# 15 — Strengths, Weaknesses, Risks

**Lens:** architect synthesis

> Distillation of the 14 prior discovery docs into things Falx should preserve,
> things Falx should fix or wrap, and things to watch even if we don't act on
> them now. Every claim cites a discovery doc and (where useful) a source path.

---

## 1. Strengths — preserve

These are working subsystems that Falx should leave alone (or treat as load-bearing
when refactoring). They are why we forked instead of writing from scratch.

### S1. Appium plugin contract is honoured and minimal

[Plugin lifecycle](./04-plugin-lifecycle-and-extension-points.md) — the plugin
exposes exactly the four Appium 2.x hooks (`updateServer`, `createSession`,
`deleteSession`, `handle`) plus `onUnexpectedShutdown`. Every Falx feature can
plug into the upstream lifecycle without forking the runtime. Replacing this
contract would mean rewriting the WD command pipeline.

### S2. Hub/node protocol is dirt-simple HTTP

[Hub-node protocol](./03-hub-node-protocol.md) — no WebSocket, no SSE, no gRPC.
Nodes push device lists on a 30 s tick (`POST /device-farm/api/register?type=add`)
and the hub polls `GET /device-farm/api/status` per node. Failure handling is
"retry next tick." For an on-prem product across heterogeneous LANs, this is
the easiest topology to debug and operate. Keep it.

### S3. Capability-based device matching with two-tier identity

[Device management § 6](./07-device-management.md) — `getDeviceFiltersFromCapability`
builds Loki queries from `df:*` capability prefixes
([CapabilityManager.ts:153](../../src/CapabilityManager.ts#L153)). The model is
"client sends caps → hub finds a free matching device → blocks it → forwards or
runs locally". This is exactly the right shape; no need to reinvent.

### S4. Single-Express-mountpoint extensibility

[Architecture § Inbound surface](./02-architecture.md) — every Falx HTTP surface
hangs off `/device-farm/api/*`. Adding `/device-farm/api/falx/*` requires no
upstream patch except a one-line call in `updateServer`
([plugin.ts:139](../../src/plugin.ts#L139)). The split between grid routes,
dashboard routes, and auth routes is already a clean separation Falx can mirror.

### S5. EventBus as a non-invasive extension seam

[Plugin lifecycle § 7-10](./04-plugin-lifecycle-and-extension-points.md) — four
domain events (`BeforeSessionCreatedEvent`, `SessionCreatedEvent`,
`AfterSessionDeletedEvent`, `UnexpectedServerShutdownEvent`) fire from
`plugin.ts`. Two have no listeners yet, so Falx can hook session
lifecycle without modifying upstream files. Emittery supports multiple listeners
per event natively. This is the single most valuable seam in the codebase.

### S6. WebDriver-command reverse proxy is centralised

[Architecture § Request flows](./02-architecture.md),
[wd-command-proxy.ts:141](../../src/proxy/wd-command-proxy.ts#L141) — every WD
request on the hub flows through one middleware that does proxy routing,
`requestId` injection, and a `middlewares` array hook for interception. Adding a
falx-side interceptor (audit log, policy gate, custom header) means appending
one entry to that array.

### S7. Dashboard interception captures every WD command for free

[Session lifecycle § In-flight per-command events](./08-session-lifecycle.md) —
`Dashboard.requestInterceptingMiddleware` monkey-patches `res.write`/`res.end`
to record every command into Prisma `SessionLog` with optional screenshots.
This is how trends/builds/session detail pages actually work. Falx gets full
session telemetry without writing any of the per-command capture code.

### S8. Cloud passthrough as a fifth provider

[Device management § 4](./07-device-management.md) — five providers wired
(BrowserStack, Sauce, LambdaTest, pCloudy, HeadSpin) under a uniform
`IDevice` shape. Falx can act as a single hub on top of mixed on-prem + cloud
capacity. The schema-validated cloud config is already extensible.

### S9. Per-session asset layout is conventional

[Session lifecycle § 7](./08-session-lifecycle.md) — `assets/sessions/<id>/{screenshots,video,device_log.json,profiling.json}`.
Asset paths are stored as relative paths in Prisma `Session.videoRecording` /
`deviceLogs` / `appProfiling`. Swap the storage backend (filesystem →
MinIO/S3) by reimplementing four `saveX` calls in `asset-manager.ts`; the
relative-path contract holds.

### S10. CI matrix is broad and pinned

[DevOps § 3](./10-devops.md) — GitHub Actions runs unit, Android integration
(API 29 emulator via `reactivecircus/android-emulator-runner`), iOS integration
(macos-latest), and E2E hub/node on every push. Renovate auto-merges patches.
The pre-push hook runs unit tests. Falx inherits a working CI; don't tear it
apart.

### S11. Sensitive-log redaction already wired

[DevOps § Ports and Env Vars](./10-devops.md),
[log-filter.json](../../log-filter.json) — seven regex patterns redact `df:jwt`,
`df:accesskey`, `df:token`, `username`, `password`, `accesskey`, `token` via
`@appium/support`'s `SECURE_VALUES_PREPROCESSOR` before npmlog ever emits.
Falx-side logging needs to preserve this if we replace the logger.

---

## 2. Weaknesses — fix or wrap

Ranked roughly by impact-to-fix-cost ratio (best leverage first).

### W1. JWT secret defaults to `uuidv4()` per process

[Auth § 3](./06-auth-rbac.md),
[auth.middleware.ts:9](../../src/auth/middleware/auth.middleware.ts#L9) — if
`JWT_SECRET` env is unset, a random UUID is generated at process start. Every
restart invalidates every token; multi-process scaling is impossible. **Fix in
place:** make the env var required, fail-fast in `updateServer` if absent.
One-line.

### W2. `console.log(token)` prints raw auth tokens on every request

[Auth § 7](./06-auth-rbac.md),
[auth.middleware.ts:61](../../src/auth/middleware/auth.middleware.ts#L61) —
prints the raw JWT or Basic-auth base64 on every authenticated request,
bypassing the npmlog redaction layer because it goes via `console.log`. **Fix
in place:** delete the line. Trivial. High impact: production deployments leak
credentials to stdout / container log aggregation.

### W3. Default `admin/admin` credentials

[Auth § 3](./06-auth-rbac.md), [Security § 2](./13-security.md),
[user.service.ts:306](../../src/auth/services/user.service.ts#L306) — first-boot
admin is created with username/password `admin`/`admin` unless the operator
sets `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD`. **Fix in place:**
require both env vars on first boot, or generate a random password and print it
once to stdout. Critical for any installation reachable from a LAN.

### W4. CORS is wildcard, no helmet, no CSRF

[Security § 8](./13-security.md),
[app/index.ts:24](../../src/app/index.ts#L24) — `cors()` with no options
applied to every router. No `helmet`, no `csurf`. Combined with W3 and W5,
any web page on any domain can mutate hub data when auth is off. **Fix in
place:** restrict CORS to allowlisted origins (read from env), add `helmet`,
add CSRF middleware on multipart endpoints.

### W5. 18 dashboard endpoints have no `authMiddleware`

[Auth § 8](./06-auth-rbac.md), [Security § 2](./13-security.md) — even with
`enableAuthentication=true`, the routes for session listing, build listing,
build cleanup, device logs, video stream, file upload, app delete, etc., are
all unguarded. The `/api/cliArgs` endpoint also leaks the plugin config which
contains `accessKey` and `token`. **Fix in place:** add `authMiddleware` (and
`adminOnly` where appropriate) to each route in `dashboard/router.ts` and
`app/index.ts`. Slice-sized — see Slice 2 candidate.

### W6. `ApiToken.token` and `User.accessKey` stored plaintext

[Auth § 9](./06-auth-rbac.md),
[prisma/schema.prisma:168](../../prisma/schema.prisma#L168) — both columns hold
the raw token string. A read-only DB compromise yields every active API
credential. **Fix:** store SHA-256 (or bcrypt) of the token; show the raw
value once at creation. Requires a migration + auth lookup change in
`api-token.service.ts`. Moderate cost, high impact.

### W7. `enableAuthentication=false` is the upstream default

[Auth § 7](./06-auth-rbac.md),
[IPluginArgs.ts:81](../../src/interfaces/IPluginArgs.ts#L81) — when the flag
is absent, `authMiddleware` injects the first admin as the request user. A
deployment that omits the flag has zero access control. **Fix:** flip the
default to `true` in Falx-shipped config, and make `false` require an
explicit `--unsafe-disable-auth` opt-in to deter mistakes. Could be done in
config wrapping; one-line in the default plugin args is even simpler.

### W8. SQLite single-writer model

[Data model § 4](./05-data-model.md), [Performance § 2](./14-performance.md) —
`?connection_limit=1` is a safety valve for SQLite's file-level lock. Every
session write, log append, device update serializes through a single
connection. **Fix:** migrate to Postgres (Slice 1 scope). Schema is already in
`prisma/schema.prisma`; rewrites of dialect-specific migrations are the cost.

### W9. Asset directory grows unbounded

[Session lifecycle § 7](./08-session-lifecycle.md),
[Performance § 5](./14-performance.md) — no retention cron, no quota.
`/api/dashboard/cleanup` exists but is operator-triggered only. Multer file
upload has no size cap ([dashboard/router.ts:57](../../src/dashboard/router.ts#L57)).
**Fix:** add a retention cron driven from a config value; cap multer
`fileSize`. Independent of MinIO swap.

### W10. Shell-out interpolation with DB-sourced inputs

[Security § 5](./13-security.md),
[IOSDeviceManager.ts:531](../../src/device-managers/IOSDeviceManager.ts#L531) —
`` execAsync(`xcrun simctl uninstall ${device.udid} ${bundleId}`) `` interpolates
DB values into a shell string. If the DB write path is ever compromised, this
becomes an RCE. **Fix in place:** swap `exec` for `execFile` with array args.
Single-line fix.

### W11. `/api/cliArgs` is open and leaks credentials

[Auth § 8](./06-auth-rbac.md),
[app/index.ts:35](../../src/app/index.ts#L35) — returns the full parsed plugin
arguments object, which includes `accessKey` and `token` used for node-to-hub
auth. **Fix in place:** add `adminOnly` middleware, or redact sensitive keys
before serialising.

### W12. `Dockerfile` runs as root

[Security § 7](./13-security.md),
[docker/Dockerfile:6](../../docker/Dockerfile#L6) — `USER root`, never reverts.
Combined with W10, a command injection becomes a container-root escalation.
**Fix:** add a non-root `USER appium` step before `CMD` (Dockerfile.local
already creates the user but doesn't switch).

### W13. Dockerfile pulls `appium-device-farm` from npm, not the fork

[DevOps § 2](./10-devops.md),
[docker/Dockerfile](../../docker/Dockerfile) — `npm install -g
appium-device-farm` pulls upstream from the public registry; Falx code in
the fork is never installed by either Dockerfile. **Fix in Slice 1:** add a
Falx-specific Dockerfile that builds from local source via `npm pack` or a
copy of `lib/`.

### W14. `buildAndCopyWeb.sh` builds `dashboard-frontend/`, not `falx-ui/`

[DevOps § 1](./10-devops.md),
[buildAndCopyWeb.sh](../../buildAndCopyWeb.sh) — bundles the upstream UI into
`src/public/`. Until this is repointed, the plugin serves the unmodified
upstream dashboard regardless of what we do in `falx-ui/`. **Fix in Slice 1:**
target `falx-ui/` in the script.

### W15. Dead UI components and routes

[UI inventory § 3, § 6](./09-ui-inventory.md) — 11 components/files are
unreferenced or commented out:
`NewHeader.tsx`, `Navbar.tsx`, `Sidebar.tsx`, `UserMenu.tsx`, `RootRouter.tsx`,
`DataContext.tsx`, `AdminDashboard.tsx` (calls non-existent
`/device-farm/admin/*` backend routes), the commented `/servers/:nodeId/terminal`
route, plus the half-removed `axios` dependency. **Fix:** delete during the
`falx-ui/` copy.

### W16. `AdbServer.ts` has no importers

[Device management § 1](./07-device-management.md),
[AdbServer.ts](../../src/device-managers/AdbServer.ts) — spawns `adb -a
nodaemon server start` then kills it after 5 s. No `src/` file imports it.
**Fix:** delete (after confirming no external script consumes it).

### W17. tvOS casing bug — `'tvos'` vs `'tvOS'`

[Device management § 3](./07-device-management.md),
[IOSDeviceManager.ts:447](../../src/device-managers/IOSDeviceManager.ts#L447) —
`getDevicePlatformName` returns lowercase `'tvos'` but `getProductModel`
compares against `'tvOS'`. The tvOS branch never fires. **Fix in place:**
normalise to one casing constant.

### W18. Cloud devices have unstable UDIDs

[Device management § Surprises](./07-device-management.md),
[cloud/Devices.ts:53](../../src/device-managers/cloud/Devices.ts#L53) — each
refresh allocates fresh `uuidv4()` UDIDs. Session history per cloud device is
not coherent across restarts. **Fix:** hash the provider-side identifier
(`device.udid` / `device.deviceName + platformVersion`) for a stable id.

### W19. Four cron loops fire on the same 30 s tick with no jitter

[Performance § 4](./14-performance.md) — `setupCronUpdateDeviceList`,
`setupCronCheckStaleDevices`, `setupCronReleaseBlockedDevices`,
`setupCronCleanPendingSessions` all use 30 000 ms by default. On a busy hub
with many nodes, every 30 s spawns concurrent DB reads + outbound HTTP. **Fix
in place:** add a per-cron `+ random(0, 5000)` jitter; configurable intervals
already exist.

### W20. No structured logging, no request IDs in logs

[Observability § 1, § 7](./12-observability.md) — npmlog emits colored text to
stderr. No request ID propagation: hub→node forwarding is opaque from a log
correlation perspective. **Fix:** wrap npmlog so calls route to Pino (or
replace at the `@appium/support` boundary), and inject `appium:requestId`
into log contexts. Slice-sized — see Slice 3 candidate.

### W21. Health endpoint is shallow

[Observability § 4](./12-observability.md),
[grid.ts:287](../../src/app/routers/grid.ts#L287) — `/api/status` returns
`{ status: "ok", version }` unconditionally. No DB ping, no device manager
check. Unsuitable as a Kubernetes readiness probe. **Fix:** new
`/api/health/ready` route, or extend `/api/status`. Dockerfile gets a
matching `HEALTHCHECK`.

### W22. No tests for auth or dashboard subsystems

[Testing § 9](./11-testing.md) — `src/auth/` has zero unit tests; dashboard
router and event manager are untested. **Fix:** add mocha specs for
`user.service`, `api-token.service`, `auth.middleware`, and the dashboard
route handlers. Best done in tandem with the auth coverage slice.

### W23. Bundle obfuscation makes upstream merges harder to audit

[DevOps § 1](./10-devops.md),
[webpack.config.js](../../webpack.config.js) — `webpack-obfuscator` runs as
the final stage. `CleanUpLibFolder` deletes most of `lib/src/` after
bundling. Falx doesn't need this if we control the deployment artefact;
shipping plain JS makes incident diagnosis easier on-prem. **Fix or wrap:**
add a Falx build path that skips obfuscation; keep the original for npm
publishing if we never publish.

### W24. UI mixes MUI + Flowbite + Tailwind + four icon libraries

[UI inventory § 1, § 5](./09-ui-inventory.md) — three UI systems coexist;
each page re-applies `sx={{ bgcolor: '#18181b' }}` to coerce MUI into dark
mode. No design tokens. **Fix:** scheduled for a dedicated UI refresh slice
(shadcn + Tremor), not Slice 1.

### W25. WDA artefact fan-out from hub at upload time

[Architecture § Outbound dependencies](./02-architecture.md),
[dashboard/router.ts:685](../../src/dashboard/router.ts#L685) — when an admin
uploads `wda-resign.ipa`, the hub iterates every iOS node and POSTs the
binary to each. Synchronous over HTTP. **Fix:** push the binary to MinIO
once, have nodes pull on demand. Tied to MinIO swap.

---

## 3. Risks — watch

Risks aren't broken today but could bite later. Tagged severity (low / medium /
high) and a one-line trigger condition.

### R1. Single-process-per-host hard assumption — **high**

Module-level mutables (`DevicePlugin.IS_HUB`, `DevicePlugin.NODE_ID`,
`DevicePlugin.adbInstance`) and a `typedi` Container that is process-global
([Architecture § Process model](./02-architecture.md),
[plugin.ts:87](../../src/plugin.ts#L87)). Trigger: any attempt to run two plugin
processes on one host, or to do hub HA, requires a substantial refactor.

### R2. Hub is a single point of failure — **high**

[Hub-node protocol § 9b](./03-hub-node-protocol.md) — hub restart re-syncs
nodes within one 30 s cycle, but in-flight client requests fail. No active
session transfer. Trigger: customer SLA demands >99.5% uptime; current
architecture cannot meet it.

### R3. LokiJS in-memory state is process-local — **medium**

[Data model § 5](./05-data-model.md),
[data-service/db.ts](../../src/data-service/db.ts) — device allocation state,
pending sessions, and `SESSION_MANAGER` live in heap, persisted only as
`db.json` via node-persist. Process restart loses pending sessions
("running" rows get rewritten to `unmarked`). Trigger: HA, container restart
during peak, or any need to introspect state across instances.

### R4. Upstream merge surface is concentrated in `plugin.ts` — **medium**

[Plugin lifecycle § 11](./04-plugin-lifecycle-and-extension-points.md) —
`updateServer` is monolithic (~180 lines, all wiring). Any Falx initialisation
needs a call site here. Trigger: aggressive upstream activity in `plugin.ts`
creates merge conflicts on every sync.

### R5. Schema drift across upstream merges — **medium**

[Plugin lifecycle § EP-4](./04-plugin-lifecycle-and-extension-points.md) —
new Falx Prisma models are additive-safe; any upstream change to existing
models (e.g. column rename) requires manual reconciliation. Trigger: upstream
adds new auth fields, or renames in `Session`/`Device` — see migration
`20240311_naming_convention` for the precedent.

### R6. Port management is a recurring failure source — **medium**

[Performance § 6](./14-performance.md), CHANGELOG entries v11.2.3 to v11.2.13.
Trigger: running >10 parallel sessions on a single node; iOS in particular.

### R7. Cloud provider drift — **medium**

[Device management § 4](./07-device-management.md) — five providers, each with
its own schema, each with `capability` shaped per the provider's API. Trigger:
any cloud provider changes their API; e.g. BrowserStack adding a required
`os_version` format.

### R8. Apple Developer Program 100-device limit — **medium**

[BACKLOG § Lessons](./../BACKLOG.md) — Individual accounts cap at 100
devices/year. Trigger: scaling past 100 iOS devices requires Enterprise
Program or account-multiplexing.

### R9. No audit trail for login / token / role changes — **medium**

[Auth § 10](./06-auth-rbac.md) — no log of failed logins, token creation, or
role mutations. Trigger: a security incident or compliance question
("who deactivated this user?") — answer is "we don't know."

### R10. iOS on Linux flakiness vs. native Mac — **low**

[BACKLOG § Lessons](./../BACKLOG.md) — go-ios + tunneld supports iOS 17+ but
expect ~5–10% extra flake. Trigger: iOS major version release, go-ios catches
up later.

### R11. Plugin slug `device-farm` is the npm name — **low**

[CLAUDE.md] — renaming breaks plugin registration. Trigger: if we ever
publish to a private npm and want a Falx-branded slug. Decision: don't.

### R12. Webpack obfuscator is in the release path — **low**

[DevOps § 1](./10-devops.md) — `webpack-obfuscator` rewrites strings, indices,
keys before publishing. Trigger: stack traces in customer support tickets are
unreadable; merging fixes from upstream that depend on string identity (rare)
fails silently.

### R13. `BeforeSessionCreatedEvent` / `AfterSessionDeletedEvent` /
`UnexpectedServerShutdownEvent` have no listeners — **low**

[Session lifecycle § 4](./08-session-lifecycle.md) — these events fire but
nothing consumes them. Trigger: Falx writes a listener assuming the event
carries a certain payload, upstream changes the payload shape. Low impact
because we control the listener and can adapt.

### R14. `ip@1.1.8` (CVE-2024-29415) — **low**

[Security § 6](./13-security.md) — used for `ip.address()`, not `ip.isPublic()`,
so the CVE's exploit path is not triggered. Trigger: future code accidentally
calls `ip.isPublic()`.

---

**Top takeaway for slice planning:** W1-W7 + W11-W12 form the security
hardening surface (Slice 2 candidate). W5 alone covers 18 endpoints — best
addressed in its own pass. W8 + W13-W14 are Slice 1. W19-W21 form the
observability slice. R1 / R2 / R3 should be revisited only when uptime
demand justifies the cost.
