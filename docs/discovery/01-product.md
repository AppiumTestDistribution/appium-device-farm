# 01 — Product

**Lens:** product

## What this is

Falx is an on-prem device farm for mobile test automation, forked from
`appium-device-farm`. Under the hood it is an Appium 2.x plugin
(`pluginName: "device-farm"`, see [package.json:212](../../package.json#L212))
that turns one or more machines with attached Android/iOS/tvOS devices,
emulators, and simulators into a pooled grid for WebDriver-protocol clients.

End-to-end flow [product]:

1. A tester or a CI job sends a W3C `POST /session` request to the Falx hub
   with desired capabilities (platform, version, etc.).
2. The plugin queues the request, finds a free matching device across all
   connected nodes, and either creates the session locally or forwards the
   request to the node that owns the device — see the create-session pipeline
   in [plugin.ts:342](../../src/plugin.ts#L342).
3. WebDriver commands are reverse-proxied to the chosen node for the lifetime
   of the session ([proxy/wd-command-proxy.ts:22](../../src/proxy/wd-command-proxy.ts#L22)).
4. A dashboard records the session, screenshots key commands, captures device
   and Appium logs, and (optionally) live-streams MJPEG video — wired up in
   [dashboard/index.ts:138](../../src/dashboard/index.ts#L138) and
   [dashboard/router.ts:377](../../src/dashboard/router.ts#L377).
5. On `DELETE /session/:id` the device is unblocked and ports are released
   ([plugin.ts:709](../../src/plugin.ts#L709)).

## Users

The product description in the upstream
[README.md:13](../../README.md#L13) and the routes exposed by the dashboard
together imply four user roles:

- **Automation engineers** — primary consumers. They point WebDriver clients
  (WDIO, Appium-Java, etc.) at the Falx hub URL and run tests in parallel.
  Reach the system at `POST /wd/hub/session` (Appium's standard endpoint).
- **Manual QA** — interact with a device through the dashboard's
  device-explorer screen and "manual control" features. Live video stream:
  `GET /device-farm/api/dashboard/session/:sessionId/liveVideo`
  ([dashboard/router.ts:755](../../src/dashboard/router.ts#L755)). Manual
  sessions can opt out of reporting via the `df:skipReport` capability
  ([plugin.ts:479](../../src/plugin.ts#L479)).
- **CI systems** — authenticate with an access key + token and create
  automated runs. Tokens are managed under
  [auth/routers/api-tokens.router.ts](../../src/auth/routers/api-tokens.router.ts);
  hub→node auth happens via `DeviceFarmApiClient`
  ([plugin.ts:246](../../src/plugin.ts#L246)).
- **Admins** — manage users, teams, devices, nodes, WDA signing assets, and
  retention policies. Admin-only routes are gated by `adminOnly` middleware,
  e.g. `GET /device-farm/api/dashboard/devices`
  ([dashboard/router.ts:724](../../src/dashboard/router.ts#L724)) and the
  build cleanup endpoint `POST /cleanup`
  ([dashboard/router.ts:747](../../src/dashboard/router.ts#L747)).

## Problem solved vs. cloud device farms

[product] Cloud device farms (Sauce Labs, BrowserStack, LambdaTest, pCloudy)
offer hosted device pools billed per-minute. Falx is the on-prem alternative:

- **Data residency / privacy** — physical devices and apps under upload never
  leave the customer's network. App binaries live on local disk at
  `~/.cache/appium-device-farm/assets`
  ([config.ts:48](../../src/config.ts#L48)).
- **Cost shape** — fixed hardware capex / opex instead of per-minute SaaS
  fees. Teams already owning device labs get utilisation telemetry without
  rebuying access.
- **Hardware coverage you actually own** — internal-build hardware, kiosk
  devices, region-locked SKUs, and rooted/jailbroken devices that public
  clouds prohibit.
- **Cloud passthrough is still available** — the same plugin can register a
  cloud provider as a node (BrowserStack, LambdaTest, Sauce, pCloudy), see
  [device-managers/cloud/](../../src/device-managers/cloud) and the `cloud`
  CLI / plugin arg. Falx can therefore act as a single hub on top of mixed
  on-prem + cloud capacity.

## Primary value proposition

A single Appium-compatible endpoint that pools every Android/iOS/tvOS device
across many host machines, allocates them safely under concurrent demand, and
ships with a self-hosted dashboard for monitoring, debugging, and admin —
without changing client-side test code (the WebDriver protocol is preserved
end-to-end).

## Headline features (cited to UI routes)

The upstream React app at `dashboard-frontend/` enumerates the user-facing
screens in
[dashboard-frontend/src/App.tsx:49](../../dashboard-frontend/src/App.tsx#L49):

| Feature | UI route | Backend evidence |
|---|---|---|
| Live device explorer (filter, claim, manual control) | `/` and `/device-farm` (`DeviceExplorer`) | `GET /device-farm/api/device` ([grid.ts:268](../../src/app/routers/grid.ts#L268)) |
| Builds & sessions browsing | `/builds`, `/builds/:buildId/session/:sessionId` | `GET /api/dashboard/build`, `GET /api/dashboard/session` ([dashboard/router.ts:745](../../src/dashboard/router.ts#L745)) |
| Apps catalog (upload APK / IPA) | `/apps` | `POST /api/dashboard/uploadedAppInformation`, `GET /uploadedApps` ([dashboard/router.ts:768](../../src/dashboard/router.ts#L768)) |
| Stats / trends | `/stats` | `EnhancedTrends` consumes session+build data |
| Admin dashboard | `/admin` (admin-only) | gated by `ProtectedRoute adminOnly` ([App.tsx:59](../../dashboard-frontend/src/App.tsx#L59)) |
| User management | `/users` (admin-only) | [auth/routers/users.router.ts](../../src/auth/routers/users.router.ts) |
| Team management | `/teams` (admin-only) | [auth/routers/team.router.ts](../../src/auth/routers/team.router.ts) |
| Device admin (rename, tag, CRUD) | `/devices` (admin-only) | [dashboard/router.ts:724](../../src/dashboard/router.ts#L724) |
| Server / node registry | `/servers` | `GET /api/dashboard/servers` ([dashboard/router.ts:750](../../src/dashboard/router.ts#L750)) |
| Profile / API tokens | `/profile` | [auth/routers/api-tokens.router.ts](../../src/auth/routers/api-tokens.router.ts) |
| Login | `/login` | [auth/routers/auth.router.ts:10](../../src/auth/routers/auth.router.ts#L10) |

Cross-cutting features evidenced in the backend but exposed inside the
above screens:

- **MJPEG live video** of an active session — `GET /api/dashboard/session/:sessionId/liveVideo`
  ([dashboard/router.ts:377](../../src/dashboard/router.ts#L377)).
- **Per-session Appium and device logs** —
  `GET /api/dashboard/session/:sessionId/session_log` and `/device_logs`
  ([dashboard/router.ts:756](../../src/dashboard/router.ts#L756)).
- **Streaming Appium server log tail** —
  `GET /api/dashboard/server/:nodeId/appium_logs` proxies the on-disk log
  with `fs.watch` ([dashboard/router.ts:438](../../src/dashboard/router.ts#L438)).
- **App profiling start/stop** — per-session, surfaced in the session detail
  view ([dashboard/router.ts:327](../../src/dashboard/router.ts#L327)).
- **WDA signing / upload pipeline for iOS & tvOS** — admin uploads
  `wda-resign.ipa` (and `wda-resign_tvos.ipa` for Apple TV); the hub
  fans the file out to every iOS node
  ([dashboard/router.ts:685](../../src/dashboard/router.ts#L685),
  [README.md:124](../../README.md#L124)).
- **Build retention cleanup** — admin triggers `POST /api/dashboard/cleanup`
  with `retentionDays`; cascades to sessions, logs, journals, asset dirs
  ([dashboard/router.ts:88](../../src/dashboard/router.ts#L88)).
- **Test-execution metadata ingest** — WDIO service posts run metadata back
  to the hub at `POST /device-farm/api/handleTestExecutionMetaData`
  ([grid.ts:297](../../src/app/routers/grid.ts#L297)).
- **tvOS support** — additional platform handled by the same plugin with
  a separate resigned WDA bundle ([README.md:124](../../README.md#L124)).
- **Initial-admin bootstrap** — on first boot the plugin auto-creates an
  admin user if none exists ([app/index.ts:52](../../src/app/index.ts#L52)).

**Unknown:** the precise authoring/ownership model for "automation runs with
access key authentication" mentioned in the v10 changelog
([README.md:25](../../README.md#L25)) — auth/RBAC agent will cover this.

## Falx-specific notes [product]

- Falx hasn't diverged yet — everything documented here is upstream behavior
  as of v12.0.0 ([package.json:3](../../package.json#L3)).
- Customer-facing branding will wrap the dashboard in `falx-ui/` (per
  `CLAUDE.md`); upstream UI text still says "Appium Device Farm".
