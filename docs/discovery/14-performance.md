**Lens:** SRE + architect

# 14 — Performance & Scale

> Discovery snapshot: 2026-05-14. Describes upstream (appium-device-farm) behaviour
> as-is unless labelled **[Falx]**. Claims that cannot be backed by code are
> flagged **Unknown:**. No load testing or profiling data exists for this codebase;
> this doc is a structural analysis only.

---

## 1. Process Model

The plugin runs inside a single Appium server process — a single-threaded Node.js
event loop. There are no worker threads, cluster forks, or child processes used
for computation. The `@appium/base-plugin` architecture is synchronous/async
within one process.

Heavy operations that block the event loop:

- `fs.mkdirSync`, `fs.writeFileSync`, `fs.existsSync` are called synchronously
  in [`src/dashboard/asset-manager.ts`](../../src/dashboard/asset-manager.ts)
  on every screenshot save.
- `execSync('adb kill-server')` in
  [`src/device-managers/AdbServer.ts:17`](../../src/device-managers/AdbServer.ts#L17)
  blocks the loop during teardown.
- `JSON.parse(fs.readFileSync(...))` for device and session logs in
  [`src/dashboard/router.ts:310`](../../src/dashboard/router.ts#L310).

**Unknown:** Whether the event loop regularly saturates under parallel session
load. No profiling baseline exists.

---

## 2. Database Engines and Bottlenecks

### Two concurrent stores

The codebase uses **two databases in parallel**:

1. **LokiJS** — an in-memory JSON store, used for the live device list and
   pending sessions. Backed by a flat `.json` file (node-persist for persistence
   across restarts). Source: [`src/data-service/db.ts:2`](../../src/data-service/db.ts#L2).

2. **Prisma + SQLite** — used for persistent records: sessions, builds, session
   logs, users, teams, devices, nodes, API tokens. Schema at
   [`prisma/schema.prisma`](../../prisma/schema.prisma).

### SQLite constraints

SQLite enforces **one writer at a time** with a file-level lock. The Prisma
`DATABASE_URL` is set as `file:<path>?connection_limit=1`
([`src/scripts/initialize-database.ts:6`](../../src/scripts/initialize-database.ts#L6)),
explicitly limiting to a single connection to avoid SQLITE_BUSY errors.

Under parallel sessions, any concurrent write (session creation, log append,
device update) serializes behind that single connection. With many short sessions
this becomes a throughput ceiling.

**[Falx]** Slice 1 plans to migrate to PostgreSQL. PostgreSQL removes the
single-writer constraint and supports connection pooling. Until that migration
lands, SQLite is the active backend.

### LokiJS limitations

LokiJS holds the entire device collection in memory. For large fleets (hundreds
of devices) this is negligible, but the lack of indexes beyond LokiJS's internal
binary-index means collection scans on every device query. LokiJS is
single-threaded and non-transactional — concurrent mutations depend on
`async-lock` wrappers at the service layer.

---

## 3. Session Concurrency

### Effective limit per node

`maxSessions` defaults to `8`
([`src/interfaces/IPluginArgs.ts:100`](../../src/interfaces/IPluginArgs.ts#L100)).
The plugin enforces this via a check against busy device count in
[`src/device-utils.ts:153-158`](../../src/device-utils.ts#L153).

Practical concurrency is also bounded by:
- Physical device count attached to the node.
- WDA startup time for iOS (can be 30–120 s per device cold start).
- ADB `adb shell top` subprocess per session (app profiling) competing for
  CPU/IO.
- MJPEG streaming subprocesses if `liveStreaming=true`.

**Unknown:** What happens when `maxSessions` exceeds the device count. The code
waits up to `deviceAvailabilityTimeoutMs` (default 300 000 ms = 5 min)
([`src/interfaces/IPluginArgs.ts:107`](../../src/interfaces/IPluginArgs.ts#L107))
polling every `deviceAvailabilityQueryIntervalMs` (default 10 000 ms)
([`src/interfaces/IPluginArgs.ts:108`](../../src/interfaces/IPluginArgs.ts#L108)).
Under high concurrency this polling occurs inside `commandsQueueGuard.acquire`
(an `async-lock` mutex per capability fingerprint), so sessions with the same
capability set serialize. Sessions with different fingerprints do not.

### Session creation cost

Session creation is the hottest path:

1. Acquire `async-lock` on capability fingerprint.
2. Poll LokiJS device table until a free matching device is found.
3. Write pending session to LokiJS.
4. Proxy WDA/UIAutomator2 session create to the driver (can take 30–90 s for iOS
   real devices from cold).
5. Write session record to SQLite via Prisma.
6. Fire `SessionCreatedEvent` (triggers screenshot setup, profiling setup,
   WebSocket notifications).
7. Release lock.

Steps 4 and 6 dominate wall-clock time. The SQLite write in step 5 contends
with any other concurrent write.

---

## 4. Hot Paths — Background Polling Loops

The plugin starts several `setInterval`-based cron loops at startup
([`src/plugin.ts:296-309`](../../src/plugin.ts#L296)):

| Loop | Default interval | Purpose |
|---|---|---|
| `setupCronUpdateDeviceList` | `sendNodeDevicesToHubIntervalMs` = 30 000 ms | Node → Hub device push |
| `setupCronCheckStaleDevices` | `checkStaleDevicesIntervalMs` = 30 000 ms | Remove offline devices |
| `setupCronReleaseBlockedDevices` | `checkBlockedDevicesIntervalMs` = 30 000 ms | Unblock timed-out devices |
| `setupCronCleanPendingSessions` | `checkBlockedDevicesIntervalMs` = 30 000 ms | Clean zombie pending sessions |

All four fire every 30 s by default. Each loop performs DB reads and potentially
writes to SQLite. On a busy hub with many nodes, `sendNodeDevicesToHubIntervalMs`
also triggers outbound HTTP calls from each node to the hub. A known bug (fix
merged Nov 2025) caused duplicate device update calls to the hub — see CHANGELOG
entry for `#1973`
([`CHANGELOG.md:68`](../../CHANGELOG.md#L68)).

### Device discovery

Device discovery (`updateDeviceList`) is not continuously polled — it runs once
at startup and then each time a node re-registers via
`setupCronUpdateDeviceList`. ADB device attachment events are handled via
`@devicefarmer/adbkit` (event-driven, not polling). iOS real device tracking
uses `go-ios listen` (a long-running subprocess emitting events).

**Unknown:** How quickly new devices are reflected in the hub after hot-plug on a
node, beyond the 30 s push interval.

---

## 5. Memory and Disk Accumulation

### Session assets

Every session that runs with `takeScreenshots` enabled accumulates:

- Per-command screenshots (JPEG) under
  `~/.cache/appium-device-farm/assets/sessions/<sessionId>/screenshots/`
  ([`src/dashboard/asset-manager.ts:6`](../../src/dashboard/asset-manager.ts#L6)).
- Video recording under `sessions/<sessionId>/video/<sessionId>.mp4`
  ([`src/dashboard/asset-manager.ts:40`](../../src/dashboard/asset-manager.ts#L40)).
- Device log JSON at `sessions/<sessionId>/device_log.json`
  ([`src/dashboard/asset-manager.ts:46`](../../src/dashboard/asset-manager.ts#L46)).
- Profiling JSON at `sessions/<sessionId>/profiling.json`
  ([`src/dashboard/asset-manager.ts:53`](../../src/dashboard/asset-manager.ts#L53)).

Screenshots are taken for `click`, `setUrl`, `setValue`, `performActions`
commands — potentially tens per session
([`src/config.ts:47`](../../src/config.ts#L47)).

### Retention

A manual cleanup endpoint exists (`POST /api/dashboard/cleanup` with
`retentionDays` body parameter) that deletes builds, sessions, session logs, and
test event journals from SQLite, and `fs.rmSync`s the session asset directory
([`src/dashboard/router.ts:234-248`](../../src/dashboard/router.ts#L234)).

There is **no automated retention policy**. No cron loop, no configurable
maximum disk usage, no TTL on session assets. Data accumulates until the operator
calls the cleanup endpoint or clears disk manually.

**Risk:** Unbounded disk growth. A farm running parallel sessions indefinitely
will fill its storage volume. No alerting or guard is provided.

### Uploaded apps

App binaries (APK, IPA) uploaded via the file upload endpoint are stored under
`~/.cache/appium-device-farm/assets/` with no size cap
([`src/dashboard/router.ts:39`](../../src/dashboard/router.ts#L39),
[`src/dashboard/router.ts:57`](../../src/dashboard/router.ts#L57) — multer has
no `limits` configured). The `deleteUploadedApp` endpoint removes individual
files on request; there is no quota enforcement.

### MJPEG proxy cache

`MJPEG_PROXY_CACHE` is a `Map<string, MjpegProxy>` that is module-level — it
grows with session IDs and is never pruned
([`src/dashboard/router.ts:375`](../../src/dashboard/router.ts#L375)).

**Unknown:** Whether MjpegProxy instances hold open TCP connections after the
session ends, potentially leaking sockets.

### LokiJS in-memory device list

The LokiJS device collection lives entirely in the Node.js heap. For typical
farms (tens of devices) this is negligible (~KB). At hundreds of devices with
full metadata objects (capabilities, session info, etc.), heap growth could be
measurable but is unlikely to be a practical concern.

---

## 6. Known Scale Failures (from CHANGELOG and Commits)

| Issue | Fix version | Source |
|---|---|---|
| Integer overflow (device/session counters) | 11.2.13 | [`CHANGELOG.md:35`](../../CHANGELOG.md#L35) |
| Duplicate device update calls to hub | 11.2.8 | [`CHANGELOG.md:68`](../../CHANGELOG.md#L68) |
| Race condition in port allocation (free port fetch) | 11.2.5 | [`CHANGELOG.md:86`](../../CHANGELOG.md#L86) |
| Port releasing logic improvement | 11.2.4 | [`CHANGELOG.md:92`](../../CHANGELOG.md#L92) |
| Port management rework | 11.2.3 | [`CHANGELOG.md:104`](../../CHANGELOG.md#L104) |
| iOS parallel execution port conflicts | Pre-11.0 | [`CHANGELOG.md:483`](../../CHANGELOG.md#L483) |
| WDA dynamic port allocation | Pre-11.0 | [`CHANGELOG.md:513`](../../CHANGELOG.md#L513) |

Port management has been a recurring source of failures across multiple releases,
indicating the dynamic port allocation / release logic is fragile under load.

---

## 7. What Is Unknown

The following claims cannot be verified from static analysis alone:

**Unknown:** Event loop utilisation under real parallel session load (10+ concurrent
sessions). No benchmark or profiling data is present in the repo.

**Unknown:** SQLite write latency at high session throughput. The `connection_limit=1`
Prisma URL is a safety valve, not a performance guarantee.

**Unknown:** Whether the LokiJS file-backed persistence (`node-persist`) causes
observable IO latency on write-heavy workloads (every device state change
triggers a flush).

**Unknown:** MJPEG proxy socket lifecycle — whether `MJPEG_PROXY_CACHE` entries
leak after session teardown.

**Unknown:** Memory behaviour over multi-day uptime. No heap snapshots or memory
leak reports are present in the CHANGELOG.

**Unknown:** The effective throughput ceiling of the hub when aggregating many
nodes' device lists on the 30 s interval. HTTP calls from all nodes hit the hub
simultaneously (no jitter).

**Unknown:** Whether `async-lock`'s per-capability fingerprint bucketing
prevents or merely defers event loop saturation when many sessions share a
fingerprint (e.g., all requesting `platform=android`).

**Unknown:** Disk I/O impact of per-command screenshots in long test suites.
Commands like `setValue` on a form with 50 fields would produce 50 screenshots
per session.

**Unknown:** Time-to-first-session on a cold node with no pre-built WDA (iOS
real device). Anecdotally, WDA build + launch can take 5–15 minutes.
