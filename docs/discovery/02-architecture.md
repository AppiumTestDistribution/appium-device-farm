# 02 — Architecture

**Lens:** architect

Scope: high-level shape of the system. Hub-node mechanics, data model,
device management internals, session lifecycle internals, UI inventory, and
ops/security are owned by the other discovery agents.

## Top-level diagram

```text
                    ┌────────────────────────────────────────────────────────────────┐
                    │                       Appium 2.x process                       │
                    │  (one OS process per machine, started via `appium server …`)   │
                    │                                                                │
   WebDriver        │   ┌───────────────────────────────────────────────────────┐    │
   clients  ───────►│   │  Appium core HTTP server  (Express, basePath e.g.     │    │
   (WDIO,           │   │  /wd/hub)                                             │    │
   Appium-Java,     │   │   • routes /session, /session/:id/...                 │    │
   manual UI)       │   └─────┬─────────────────────────────────────────────────┘    │
                    │         │ plugin hooks: createSession / handle /             │
                    │         │ deleteSession / updateServer                       │
                    │         ▼                                                    │
                    │   ┌──────────────────────────────────────────────────────┐  │
                    │   │  DevicePlugin (src/plugin.ts)                         │  │
                    │   │   • hub/node role decided from --plugin-…-hub arg     │  │
                    │   │   • allocateDeviceForSession → forward or run locally │  │
                    │   │   • addProxyHandler(sessionId → remote host)          │  │
                    │   └─────┬───────────────────────────────┬────────────────┘  │
                    │         │                               │                    │
                    │         ▼                               ▼                    │
                    │  ┌────────────────────────┐   ┌────────────────────────┐    │
                    │  │ /device-farm router    │   │ /device-farm/api/      │    │
                    │  │  (src/app)             │   │ dashboard router       │    │
                    │  │   • grid/auth/static UI│   │  (src/dashboard)       │    │
                    │  └────────────────────────┘   └────────────────────────┘    │
                    │                                                                │
                    │  ┌──────────────────────────────────────────────────────────┐  │
                    │  │ Device managers (src/device-managers)                    │  │
                    │  │  AndroidDeviceManager → adbkit / appium-adb              │  │
                    │  │  IOSDeviceManager     → appium-ios-device, go-ios        │  │
                    │  │  NodeDevices          → HTTP to remote node              │  │
                    │  │  Cloud managers       → BS / Sauce / LT / pCloudy        │  │
                    │  └──────────────────────────────────────────────────────────┘  │
                    │  ┌──────────────────────────────────────────────────────────┐  │
                    │  │ Persistence: Prisma+SQLite (per-process) + LokiJS in-mem │  │
                    │  └──────────────────────────────────────────────────────────┘  │
                    └────────────────────────────────────────────────────────────────┘
                                          │                              ▲
                                          │ HTTP (forward session,        │ HTTP (poll
                                          │ block/unblock, registerNode)  │ device list,
                                          ▼                              │  proxy WDA)
                                ┌────────────────────────┐               │
                                │ Other Falx processes   │───────────────┘
                                │ in "node" mode         │
                                └────────────────────────┘
                                          │
                              ┌───────────┴────────────┐
                              ▼                        ▼
                       ADB devices /            iOS / tvOS devices,
                       emulators                simulators (Xcode/WDA)
```

## Process model

There is exactly one Node.js process per host — Appium itself
([package.json:141](../../package.json#L141), peer dep `appium ^3.0.0`).
It is launched with the device-farm plugin enabled, e.g.

```sh
appium server -ka 800 --use-plugins=device-farm -pa /wd/hub \
  --plugin-device-farm-platform=android --plugin-device-farm-max-sessions=8
```

(see the `run-server` script in [package.json:43](../../package.json#L43)).

Appium loads the plugin's `mainClass: "DevicePlugin"`
([package.json:213](../../package.json#L213)) from `lib/src/main.js`.
`src/main.ts` is a thin re-export of `src/index.ts`
([main.ts:1](../../src/main.ts#L1), [index.ts:1](../../src/index.ts#L1)),
which sets `setDefaultResultOrder('ipv4first')`, registers FFmpeg on
`PATH`, installs error handlers, and exports `DevicePlugin`.

`DevicePlugin.updateServer` ([plugin.ts:139](../../src/plugin.ts#L139)) is
the one-shot bootstrap that Appium calls with the Express app, HTTP server,
and merged CLI args. That function mounts every Falx HTTP surface, decides
hub vs. node, starts cron jobs, kicks off WDA installation, and registers
the WebDriver-command proxy.

Concurrency inside the process:

- WebDriver protocol — async Express handlers.
- Session allocation — guarded by `async-lock` keyed on
  `platformName+platformVersion+udids` so equivalent capability requests
  don't race ([plugin.ts:331](../../src/plugin.ts#L331),
  [plugin.ts:373](../../src/plugin.ts#L373)).
- Background work — interval-based "crons": stale-device sweeps, blocked
  device release, node→hub device-list sync, pending-session cleanup
  ([device-utils.ts:438](../../src/device-utils.ts#L438),
  [plugin.ts:296](../../src/plugin.ts#L296)).
- Node-health monitor (hub mode only) every 30 s
  ([plugin.ts:84](../../src/plugin.ts#L84),
  [plugin.ts:285](../../src/plugin.ts#L285)).

Dependency injection: `typedi` (`Container.set(DeviceFarmManager, …)`)
provides ambient access to the device manager registry
([plugin.ts:239](../../src/plugin.ts#L239)).

## Modes: hub vs. node vs. standalone

The role is decided by the presence of the `hub` plugin arg
([plugin.ts:172](../../src/plugin.ts#L172), `DevicePlugin.IS_HUB = !pluginArgs.hub`):

- **Hub** (`hub` is unset). The process serves the dashboard and aggregates
  devices from itself plus any registered nodes. Branch starting at
  [plugin.ts:277](../../src/plugin.ts#L277): registers itself in the Node
  table, starts `NodeHealthMonitor`, runs `updateDeviceList`, and listens
  on `bindHostOrIp:port`. Sample config: `server-config.json` (port 31337,
  no `hub`).
- **Node** (`hub` is set to a hub URL). Branch at
  [plugin.ts:244](../../src/plugin.ts#L244): pings hub for readiness, creates
  `DeviceFarmApiClient(accessKey, token, hubUrl)`, optionally authenticates,
  starts a cron at `sendNodeDevicesToHubIntervalMs` that re-posts its device
  list to the hub. Sample config: `node-config.json` (port 31338, `hub:
  http://192.168.1.16:31337`).
- **Standalone** — same code path as "hub" with no nodes registered. A hub
  with its own attached devices behaves identically.

The plugin also supports a fourth shape: **cloud passthrough**, gated by
`pluginArgs.cloud`. Several cron jobs are skipped because cloud devices
don't need local liveness checks ([plugin.ts:315](../../src/plugin.ts#L315)).

`DevicePlugin.NODE_ID` is a UUID persisted in
`~/.cache/appium-device-farm/metadata.json`
([config.ts:22](../../src/config.ts#L22),
[plugin.ts:171](../../src/plugin.ts#L171)), stable across restarts.

## Inbound surface

Mounted on the same Express app by `updateServer`:

1. **WebDriver protocol** — Appium's own router (default basePath `/wd/hub`,
   configurable). The plugin participates via `createSession`,
   `deleteSession`, and `handle` hooks (the latter just stamps
   `updateCmdExecutedTime`, [commands/handle.ts:1](../../src/commands/handle.ts#L1)).
2. **Plugin REST routes**, mounted under `/device-farm`
   ([plugin.ts:195](../../src/plugin.ts#L195),
   [app/index.ts:48](../../src/app/index.ts#L48)):
   - `/device-farm/api/*` — grid + auth, see
     [app/routers/grid.ts:267](../../src/app/routers/grid.ts#L267)
     (e.g. `GET /api/device`, `POST /api/register`, `POST /api/block`,
     `GET /api/node/status`, `GET /api/queue`, `GET /api/status`).
   - `/device-farm/api/auth`, `/users`, `/teams`, `/api-tokens`,
     `/device-allocation` — registered by `registerAuthenticationRoutes`
     ([app/index.ts:56](../../src/app/index.ts#L56)).
   - `/device-farm/assets/*`, `/device-farm/apps/*`,
     `/device-farm/ui-assets/*` — static asset serving from
     `~/.cache/appium-device-farm/...`
     ([app/index.ts:43](../../src/app/index.ts#L43)).
3. **Dashboard router** under `/device-farm/api/dashboard`
   ([dashboard/index.ts:38](../../src/dashboard/index.ts#L38),
   [dashboard/router.ts:720](../../src/dashboard/router.ts#L720)) —
   sessions, builds, devices CRUD, MJPEG live video, Appium log streaming,
   WDA upload, profiling, cleanup.
4. **WebDriver-command reverse proxy** — a custom middleware registered
   *before* the route stack
   ([proxy/wd-command-proxy.ts:134](../../src/proxy/wd-command-proxy.ts#L134))
   that, for any `:basePath/session/...` path, looks up the session's
   remote host and proxies via `http-proxy-middleware`. Dashboard
   intercepts the same traffic to record screenshots/journal entries
   ([dashboard/index.ts:42](../../src/dashboard/index.ts#L42)).
5. **UI (single-page app)** — the dashboard build is copied to
   `src/public` by `buildAndCopyWeb.sh` and served as static files at the
   plugin's root prefix ([app/index.ts:39](../../src/app/index.ts#L39)).

## Outbound dependencies

- **ADB / Android** via `@devicefarmer/adbkit` and `appium-adb`
  (`enhancedADBManager.initializeLocalADB`,
  [plugin.ts:165](../../src/plugin.ts#L165)). Remote ADB hosts may be added
  through the `adbRemote` config array (see
  [sample-config.json:13](../../sample-config.json#L13)).
- **Xcode / WebDriverAgent / Simulator** — `appium-xcuitest-driver` plus
  `node-simctl` for simulators. WDA bundle is built (or pre-built path
  supplied) and re-signed; per-platform variants live at
  `~/.cache/appium-device-farm/assets/wda-resign.ipa` (iOS) and
  `wda-resign_tvos.ipa` (tvOS), pushed to nodes by
  [dashboard/router.ts:685](../../src/dashboard/router.ts#L685).
- **go-ios** — used by `goIOSTracker` to enumerate iOS real devices and
  open tunnels to iOS 17+ devices
  ([goIOSTracker.ts:42](../../src/goIOSTracker.ts#L42),
  [goIOSTracker.ts:93](../../src/goIOSTracker.ts#L93)).
- **iproxy / appium-ios-device** for USB port forwarding to MJPEG /
  WDA ([iProxy.ts:12](../../src/iProxy.ts#L12),
  [plugin.ts:425](../../src/plugin.ts#L425)).
- **Cloud providers** — BrowserStack, Sauce Labs, LambdaTest, pCloudy
  under `src/device-managers/cloud/`. Selected via the `cloud` plugin arg.
- **Chromedriver** — `ChromeDriverManager` auto-downloads matching driver
  unless `skipChromeDownload: true`
  ([plugin.ts:228](../../src/plugin.ts#L228)).
- **FFmpeg** — added to `PATH` for Appium session video recording
  ([index.ts:10](../../src/index.ts#L10)).
- **Other nodes** — hub→node and node→hub speak plain HTTP/JSON over
  the same `/device-farm` REST surface via `axios` (`DeviceFarmApiClient`,
  `NodeDevices`).
- **Database** — Prisma on a per-process SQLite file at
  `~/.cache/appium-device-farm/device-farm-latest.db`
  ([config.ts:45](../../src/config.ts#L45)). LokiJS is also used in
  memory for transient grid state
  ([data-service/db.ts](../../src/data-service/db.ts), referenced in
  [grid.ts:2](../../src/app/routers/grid.ts#L2)).

## File ownership map (entry points)

| Concern | File |
|---|---|
| Plugin entry / Appium re-export | [src/main.ts](../../src/main.ts) → [src/index.ts](../../src/index.ts) |
| Plugin lifecycle, role decision, session create/delete | [src/plugin.ts](../../src/plugin.ts) |
| Global config, metadata UUID, cache paths | [src/config.ts](../../src/config.ts) |
| Plugin Express router (grid, auth, static UI) | [src/app/index.ts](../../src/app/index.ts) |
| Grid HTTP routes | [src/app/routers/grid.ts](../../src/app/routers/grid.ts) |
| Dashboard event bus, request interception, session-type dispatch | [src/dashboard/index.ts](../../src/dashboard/index.ts) |
| Dashboard HTTP routes | [src/dashboard/router.ts](../../src/dashboard/router.ts) |
| WebDriver command proxy | [src/proxy/wd-command-proxy.ts](../../src/proxy/wd-command-proxy.ts) |
| Plugin command pass-through | [src/commands/handle.ts](../../src/commands/handle.ts) |
| Domain events | [src/events/](../../src/events) |
| Auth (users, tokens, teams, RBAC) | [src/auth/](../../src/auth) |
| Device discovery and lifecycle | [src/device-managers/](../../src/device-managers), [src/device-utils.ts](../../src/device-utils.ts) |
| iOS port forwarding | [src/iProxy.ts](../../src/iProxy.ts), [src/goIOSTracker.ts](../../src/goIOSTracker.ts) |
| Cron jobs | [src/device-utils.ts](../../src/device-utils.ts) (`setupCron*`) |
| Persistence (Prisma + LokiJS adapters) | [src/data-service/](../../src/data-service), [src/prisma.ts](../../src/prisma.ts) |

## Request flows

### 1. Appium session create

```text
client                hub                                    node                      device
  │ POST /wd/hub/session
  ├──────────────────►│ proxy middleware tags req with
  │                   │ appium:requestId = uuid             (wd-command-proxy.ts:72)
  │                   │
  │                   │ DevicePlugin.createSession         (plugin.ts:342)
  │                   │  • strip appium: prefixes
  │                   │  • addNewPendingSession
  │                   │  • acquire lock for capability key (plugin.ts:374)
  │                   │  • allocateDeviceForSession
  │                   │      ─ polls free device matching caps
  │                   │      ─ blocks/holds the device
  │                   │
  │                   │ device.nodeId === NODE_ID ?
  │                   │   yes ──► next()  (Appium creates the driver session here)
  │                   │   no  ──► forwardSessionRequest:
  │                   │           POST {nodeUrl}/session ──────►│ node's same plugin
  │                   │           with df:udid + optional df:jwt│  receives POST, runs
  │                   │                                          │  next() locally on the
  │                   │           ◄──── W3C session response ────┤  device → IPA/APK→port
  │                   │           addProxyHandler(sessionId, host)
  │                   │
  │                   │ updatedAllocatedDevice(busy=true, session_id, …)
  │                   │ EventBus.fire(SessionCreatedEvent)
  │                   │  → Dashboard.handleNewSessionEvent (dashboard/index.ts:138)
  │                   │      creates LocalSession / RemoteSession / CloudSession
  │                   │
  │ ◄── session response (W3C, value=[sid, caps, "W3C"])
```

Subsequent commands on the same session flow through `addProxyHandler`'s
proxy ([wd-command-proxy.ts:22](../../src/proxy/wd-command-proxy.ts#L22))
which forwards to `remoteHost` while the dashboard intercepts the response
for screenshotting and journaling
([dashboard/index.ts:94](../../src/dashboard/index.ts#L94)).

`deleteSession` ([plugin.ts:709](../../src/plugin.ts#L709)) collects every
port the device used (system port, wda local, mjpeg, go-ios agent),
calls `unblockDeviceMatchingFilter`, fires `AfterSessionDeletedEvent`,
optionally uninstalls cleanup apps, and releases ports.

### 2. Dashboard pageview

```text
browser GET /device-farm/                       (App.tsx route /)
  → Express static file handler                 (app/index.ts:40)
    serves index.html + JS bundle from src/public/

browser then issues XHR calls, e.g.
  GET /device-farm/api/device                   → grid.ts:268 getDevices
  GET /device-farm/api/dashboard/servers        → dashboard/router.ts:432 getServers
  GET /device-farm/api/auth/me                  → auth.router.ts:11 (authMiddleware)
  GET /device-farm/api/dashboard/build          → dashboard/router.ts:746 getBuilds
```

The `wd-command-proxy` middleware short-circuits non-WebDriver paths on
nodes ([wd-command-proxy.ts:65](../../src/proxy/wd-command-proxy.ts#L65))
so dashboard XHRs pass straight through to the router stack. On the hub
all routes are served directly.

### 3. Hub → node session forward (detail)

```text
hub.createSession picks remote device (different nodeId)
  │
  ├── builds capabilities envelope (plugin.ts:563)
  │   • injects df:udid = chosen device udid
  │   • if auth enabled, mints JWT per user via generateTokenForNode
  │     and adds df:jwt
  │
  ├── axios POST http(s)://{device.host}/session
  │   with keep-alive http/https agents (plugin.ts:618)
  │   optionally routed via HTTP_PROXY / pluginArgs.proxy
  │
  ▼
node Appium process
  │   wd-command-proxy on node sees POST /wd/hub/session
  │   stamps a fresh requestId (only meaningful on hub really)
  │   forwards into the plugin
  │   DevicePlugin.createSession runs in NODE mode:
  │     • allocateDeviceForSession filters by df:udid → exact match
  │     • next() → Appium creates a real driver session on the device
  │     • posts /device-farm/api/updateDeviceInfo back to hub later
  │       with proxiedInfo (plugin.ts:509)
  │
  ▼
hub stores: addProxyHandler(sessionId, device.host)
            updatedAllocatedDevice(sessionResponse, mjpegServerPort, …)

subsequent /session/:id/* commands from client
  → hub wd-command-proxy → remoteProxyMap[sessionId] → node Appium → driver
```

Hub→node "node manager" calls (block, unblock, device list refresh,
register) go through `NodeDevices`
([device-managers/NodeDevices.ts:7](../../src/device-managers/NodeDevices.ts#L7))
or the `DeviceFarmApiClient` ([src/api-client.ts](../../src/api-client.ts)) —
plain JSON over `/device-farm/api/*`.

## Event bus

Internal events fan-out through `EventBus` (Emittery wrapper,
[src/notifier/event-bus.ts](../../src/notifier/event-bus.ts)):

- `BeforeSessionCreatedEvent` — fired only when the session will be created
  locally ([plugin.ts:412](../../src/plugin.ts#L412)).
- `SessionCreatedEvent` — fired in all non-`df:skipReport` cases
  ([plugin.ts:482](../../src/plugin.ts#L482)). Dashboard subscribes
  ([dashboard/index.ts:32](../../src/dashboard/index.ts#L32)).
- `AfterSessionDeletedEvent` — fired after `next()` in `deleteSession`
  ([plugin.ts:760](../../src/plugin.ts#L760)).
- `UnexpectedServerShutdownEvent` — fired from `onUnexpectedShutdown`
  ([plugin.ts:136](../../src/plugin.ts#L136)).

Dashboard sessions are subclassed by where the underlying driver lives:
`LocalSession` (same node), `RemoteSession` (different node), `CloudSession`
(BrowserStack/Sauce/LT/pCloudy) — selected in
[dashboard/index.ts:145](../../src/dashboard/index.ts#L145).

## Configuration surface

Plugin args are declared in the schema at
[package.json:214](../../package.json#L214); typed defaults in
`src/interfaces/IPluginArgs.ts` (`DefaultPluginArgs`). Headline knobs:
`platform`, `androidDeviceType`, `iosDeviceType`, `simulators`, `emulators`,
`hub`, `maxSessions`, `enableDashboard`, `enableAuthentication`, `accessKey`,
`token`, `nodeName`, `bindHostOrIp`, `portRange`,
`deviceAvailabilityTimeoutMs`, `sendNodeDevicesToHubIntervalMs`,
`checkStaleDevicesIntervalMs`, `checkBlockedDevicesIntervalMs`,
`newCommandTimeoutSec`, `liveStreaming`, `wdaBundleId`, `preBuildWDAPath`,
`androidCleanUpApps`, `iosCleanUpApps`, `cloud`.

Sample configs in repo:
[sample-config.json](../../sample-config.json) (kitchen sink),
[server-config.json](../../server-config.json) (hub),
[node-config.json](../../node-config.json) (node).

Filesystem state lives under `~/.cache/appium-device-farm/`
([config.ts:7](../../src/config.ts#L7)), overridable with the
`DEVICE_FARM_HOME` env var ([config.ts:12](../../src/config.ts#L12)):
`metadata.json` (node id), `device-farm-latest.db` (SQLite),
`assets/sessions/*` (session artefacts), `assets/*.ipa|*.apk` (app uploads).

## Notes on Falx vs. upstream

- Falx hasn't forked the runtime yet; everything above is upstream v12.0.0
  ([package.json:3](../../package.json#L3)) and Appium peer `^3.0.0`.
- The plugin slug stays `device-farm`; `falx` only appears in
  `CLAUDE.md` and the (currently empty) `falx-ui/` plans.

**Unknown:** exact semantics of `enableAuthentication=false` for
node→hub forwarding (a JWT is conditionally minted but never validated
upstream is unclear from this scope) — auth/RBAC agent will resolve.

**Unknown:** whether multi-process scaling on a single host is supported;
all evidence here is single-process per machine, and the plugin uses
`Container.set` and module-level mutable state
([plugin.ts:87](../../src/plugin.ts#L87)) that suggests multi-process on
one host is not a design goal.
