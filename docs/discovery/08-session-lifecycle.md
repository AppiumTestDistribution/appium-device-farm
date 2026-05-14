# 08 — Session lifecycle & queueing

**Lens:** engineer + SRE

Scope of this doc: end-to-end behaviour of a single Appium W3C `New Session`
request — from capability arrival, through device matching, forwarding,
in-session command interception, teardown, and artifact lifecycle. Upstream
behaviour is documented as-is; Falx-specific changes are not implied unless
present in the source.

Out of scope (covered by other discovery docs): plugin bootstrap and
hub/node handshake (02), device matching internals beyond what the session
flow touches (06), Prisma schema (05), auth/RBAC (04), UI (07),
ops/observability (09), security/perf (10).

---

## 1. Session create flow

The plugin's W3C `createSession` hook is
[`DevicePlugin.createSession`](../../src/plugin.ts#L342-L524). It runs on
whichever Appium server received the client request; if that server is a
node, the hub-level `wd-command-proxy` does **not** intercept the
`POST /session` (a node accepts its own session requests; routing decisions
are made later by inspecting `device.nodeId`).

The flow:

1. **Request enters the proxy.** Before the W3C hook is called, the proxy
   middleware in
   [`wd-command-proxy.handler`](../../src/proxy/wd-command-proxy.ts#L57-L132)
   detects a `POST /session`, assigns a UUID `requestId`, stamps it into
   `capabilities.alwaysMatch['appium:requestId']`, and adds the request to
   the in-memory `sessionRequestMap`
   ([`wd-command-proxy.ts:16`](../../src/proxy/wd-command-proxy.ts#L16)).
   The map is cleaned up on socket close
   ([`wd-command-proxy.ts:80-82`](../../src/proxy/wd-command-proxy.ts#L80-L82)).
   This is how the device allocator detects client disconnects mid-wait
   (see §3).

2. **Pending session row.** `createSession` pulls `requestId` out of
   `requiredCaps['appium:requestId']`, then writes a
   `pending-sessions` entry through
   [`addNewPendingSession`](../../src/data-service/pending-sessions-service.ts#L3-L5),
   which is a LokiJS collection (in-memory + autoloaded JSON), **not**
   Prisma. The pending row records the merged caps, the `capability_id`,
   and a `createdAt` epoch
   ([`plugin.ts:363-368`](../../src/plugin.ts#L363-L368)).

3. **Lock per capability class.**
   [`getLockName`](../../src/plugin.ts#L331-L340) hashes `platformName +
   platformVersion + udids` into a normalised key, then
   `commandsQueueGuard.acquire(lockName, ...)`
   ([`plugin.ts:374-391`](../../src/plugin.ts#L374-L391)) wraps device
   allocation. The lock is an
   [`AsyncLock`](../../src/plugin.ts#L83); concurrent requests for the
   same capability class are serialised through `allocateDeviceForSession`.
   Different capability classes (different platform/version/udid combos)
   acquire different locks and proceed in parallel.

4. **Device allocation.**
   [`allocateDeviceForSession`](../../src/device-utils.ts#L101-L215)
   computes filters from caps
   ([`getDeviceFiltersFromCapability`](../../src/device-utils.ts#L304-L375)),
   does JWT or user-team filtering if `enableAuthentication` is on
   ([`device-utils.ts:113-131`](../../src/device-utils.ts#L113-L131)),
   then enters a `waitUntil` loop bounded by
   `deviceAvailabilityTimeoutMs` / `deviceAvailabilityQueryIntervalMs`
   ([`device-utils.ts:134-165`](../../src/device-utils.ts#L134-L165)).
   Per iteration it checks:
   - Was the client's `requestId` removed from `sessionRequestMap`? If
     yes, throw — client disconnected
     ([`device-utils.ts:145-152`](../../src/device-utils.ts#L145-L152)).
   - Is busy-device count already at `pluginArgs.maxSessions`? Wait
     ([`device-utils.ts:153-161`](../../src/device-utils.ts#L153-L161)).
   - Otherwise call `getDevice(filters)`. If `undefined`, wait.

5. **Block the matched device.** Once a candidate exists, `blockDevice`
   marks it busy and `updatedAllocatedDevice` writes `newCommandTimeout`
   ([`device-utils.ts:190-211`](../../src/device-utils.ts#L190-L211)).
   `updateCapabilityForDevice`
   ([`device-utils.ts:223-260`](../../src/device-utils.ts#L223-L260))
   then rewrites the caps in-place: assigns `appium:udid`,
   `appium:systemPort`, `appium:chromeDriverPort`,
   `appium:mjpegServerPort`, `appium:wdaLocalPort`, derived-data path,
   and so on, via
   [`androidCapabilities`](../../src/CapabilityManager.ts#L59-L87) or
   [`iOSCapabilities`](../../src/CapabilityManager.ts#L89-L151).

6. **Local vs. remote vs. cloud branching.** Back in
   `createSession`, the plugin compares `device.nodeId` to its own
   `DevicePlugin.NODE_ID`:

   - **Local** (`device.nodeId === DevicePlugin.NODE_ID`, no cloud flag):
     fire `BeforeSessionCreatedEvent`, then `await next()` — i.e. hand
     control to the real Appium driver via the base-plugin
     `next()`. iOS real devices then have their MJPEG port
     port-forwarded through
     [`DEVICE_CONNECTIONS_FACTORY.requestConnection`](../../src/plugin.ts#L425-L432).
     `SessionType.LOCAL`.
   - **Remote** (different `nodeId`, not cloud):
     [`forwardSessionRequest`](../../src/plugin.ts#L563-L652) builds an
     axios POST to `${nodeUrl(device, basePath)}/session`, stamps a
     `df:udid` and `df:jwt` into the forwarded caps, and returns the
     remote `value` as a `CreateSessionResponseInternal`.
     `SessionType.REMOTE`. After success,
     [`addProxyHandler`](../../src/proxy/wd-command-proxy.ts#L22-L51)
     maps `sessionId → device.host`; in-session traffic for that
     sessionId is reverse-proxied via `http-proxy-middleware`.
   - **Cloud** (`device.cloud` set): same `forwardSessionRequest` path,
     with LambdaTest-specific shape stripping at
     [`plugin.ts:570-588`](../../src/plugin.ts#L570-L588).
     `SessionType.CLOUD`. The session type is decided in
     [`plugin.ts:407-411`](../../src/plugin.ts#L407-L411) for the local
     branch; for the remote/cloud branch the type is decided later
     inside
     [`Dashboard.handleNewSessionEvent`](../../src/dashboard/index.ts#L138-L176).

7. **Post-creation bookkeeping.** Whether local or forwarded, on a valid
   `CreateSessionResponseInternal`
   ([`plugin.ts:445-514`](../../src/plugin.ts#L445-L514)):
   - `sanitizeSessionCapabilities` strips auth-sensitive fields.
   - `updatedAllocatedDevice` writes `busy: true`, `session_id`,
     `sessionStartTime`, `sessionResponse`, `mjpegServerPort`,
     optional `activeUser`, and `deviceFarmCapabilities`.
   - If forwarded, `addProxyHandler(sessionId, device.host)`.
   - Unless `df:skipReport` is set, fire
     `SessionCreatedEvent`
     ([`plugin.ts:482-492`](../../src/plugin.ts#L482-L492)).
   - For iOS local sessions, snapshot the WDA proxy URL/port/sessionId
     and persist via `updatedAllocatedDevice` (and forward to hub if
     this is a node)
     ([`plugin.ts:499-514`](../../src/plugin.ts#L499-L514)).

8. **Failure path.** If the response is not a valid internal session
   response,
   [`unblockDevice`](../../src/plugin.ts#L516-L520) releases the device
   and `throwProperError` translates whatever shape came back into an
   `Error`. The pending-sessions row is removed in either branch by
   [`removePendingSession`](../../src/plugin.ts#L442) (and on the
   allocator-failure branch by
   [`plugin.ts:386-389`](../../src/plugin.ts#L386-L389)).

---

## 2. Session classes

All session classes live in [`src/dashboard/sessions/`](../../src/dashboard/sessions/).
They are dashboard-side wrappers; they do not own the Appium driver, they
wrap the `sessionResponse` and provide screenshot/video/log/profile
accessors used by the dashboard event manager.

### `DeviceFarmSession` (abstract)
[`DeviceFarmSession.ts`](../../src/dashboard/sessions/DeviceFarmSession.ts)
holds `sessionId`, the parsed `deviceFarmCapabilities` map, and the
`sessionResponse`. Subclasses must implement screenshot, video
start/stop, device-log fetch, app-profiling start/stop, live-video URL,
and `getType()`
([`DeviceFarmSession.ts:33-53`](../../src/dashboard/sessions/DeviceFarmSession.ts#L33-L53)).

### `RemoteSession` (and CloudSession via inheritance)
[`RemoteSession.ts`](../../src/dashboard/sessions/RemoteSession.ts) reaches the
node holding the device by HTTP. `getScreenShot` hits
`${baseUrl}/session/${sessionId}/screenshot`
([`RemoteSession.ts:30-42`](../../src/dashboard/sessions/RemoteSession.ts#L30-L42));
video start/stop calls `appium/start_recording_screen` and
`appium/stop_recording_screen`
([`RemoteSession.ts:44-90`](../../src/dashboard/sessions/RemoteSession.ts#L44-L90));
device logs are pulled from the remote node's dashboard API
`/device-farm/api/dashboard/session/:id/device_logs`
([`RemoteSession.ts:106-123`](../../src/dashboard/sessions/RemoteSession.ts#L106-L123));
app profiling is start/stopped through
`/device-farm/api/dashboard/session/:id/start_app_profiling` and
`/app_profiling`
([`RemoteSession.ts:125-158`](../../src/dashboard/sessions/RemoteSession.ts#L125-L158)).
Default `getType()` returns `SessionType.REMOTE`. Live video URL is
served by the hub from `/device-farm/api/session/:id/liveVideo` when the
session's `mjpegServerPort` is present
([`RemoteSession.ts:92-100`](../../src/dashboard/sessions/RemoteSession.ts#L92-L100)).

### `LocalSession`
[`LocalSession.ts`](../../src/dashboard/sessions/LocalSession.ts) extends
`RemoteSession` but points the `baseUrl` at the in-process driver's own
`http://${address}:${port}${basePath}/wd-internal`
([`LocalSession.ts:24-33`](../../src/dashboard/sessions/LocalSession.ts#L24-L33)).
The `wd-internal` prefix is a marker — the proxy middleware strips it and
forwards the call locally rather than through the dashboard intercept
loop ([`wd-command-proxy.ts:61-64`](../../src/proxy/wd-command-proxy.ts#L61-L64),
[`index.ts:42-45`](../../src/dashboard/index.ts#L42-L45)). This is how
`screenshot`/`stop_recording_screen` calls on the local node bypass the
event manager and avoid recursion. `getType()` is `SessionType.LOCAL`.
`getLiveVideoUrl` returns the raw MJPEG URL of the driver's port
([`LocalSession.ts:39-47`](../../src/dashboard/sessions/LocalSession.ts#L39-L47)).
`startAppProfiling` instantiates an
[`AndroidAppProfiler`](../../src/dashboard/app-profiling/android-profiling.ts)
only when platform is Android and `appPackage` is known
([`LocalSession.ts:88-104`](../../src/dashboard/sessions/LocalSession.ts#L88-L104)).
**Unknown:** no iOS-equivalent profiler.

`getDeviceLogs` reaches into the driver's internal session structure
(`driver.sessions[sessionId]`) and pulls log entries keyed by
`automationName` via a hardcoded `logKey` map for `uiautomator2`,
`xcuitest`, and `flutterintegration`
([`LocalSession.ts:53-86`](../../src/dashboard/sessions/LocalSession.ts#L53-L86)).
The log object is then read via `getAllLogs` / `getLogs` / `.logs`.

### `CloudSession`
[`CloudSession.ts`](../../src/dashboard/sessions/CloudSession.ts) extends
`RemoteSession`. `getType()` is `SessionType.CLOUD`. Screenshot,
video, and live-video calls are stubbed to throw or no-op
([`CloudSession.ts:9-27`](../../src/dashboard/sessions/CloudSession.ts#L9-L27)).
Sessions of this type are explicitly excluded from dashboard
interception
([`index.ts:66-69`](../../src/dashboard/index.ts#L66-L69)).

### `SessionManager`
[`SessionManager.ts`](../../src/dashboard/sessions/SessionManager.ts) is a
process-local `Map<sessionId, DeviceFarmSession>` exported as the
`SESSION_MANAGER` singleton
([`SessionManager.ts:23`](../../src/dashboard/sessions/SessionManager.ts#L23)).
Three methods: `addSession`, `getSession`, `removeSession`, plus
`isValidSession`. No locking, no persistence — if the hub process
restarts, this map is empty and in-flight sessions become orphans
(Prisma `Session.status` rows are rewritten to `unmarked` on plugin
boot at [`plugin.ts:204-213`](../../src/plugin.ts#L204-L213)).

---

## 3. Queueing

There is **no persistent queue and no rejection-on-busy.** The model is a
poll-with-timeout: the client request blocks inside
`allocateDeviceForSession` until either a device becomes free, the
client disconnects, or the timeout fires.

Mechanics:

- **Wait loop.**
  [`waitUntil`](../../src/device-utils.ts#L143-L165) (from the
  `async-wait-until` package) re-runs the predicate every
  `deviceAvailabilityQueryIntervalMs` (default `10_000`,
  [`IPluginArgs.ts:108`](../../src/interfaces/IPluginArgs.ts#L108))
  until the timeout `deviceAvailabilityTimeoutMs` (default `300_000`
  ms = 5 min,
  [`IPluginArgs.ts:107`](../../src/interfaces/IPluginArgs.ts#L107)).
  Both can be overridden per-request via the `df:deviceAvailabilityTimeout`
  and `df:deviceRetryInterval` caps
  ([`device-utils.ts:134-137`](../../src/device-utils.ts#L134-L137)).

- **Visible pending entries.** Every blocking request inserts a row
  into the LokiJS `pending-sessions` collection
  ([`pending-sessions-service.ts:3-5`](../../src/data-service/pending-sessions-service.ts#L3-L5),
  [`plugin.ts:363-368`](../../src/plugin.ts#L363-L368)). The UI/API can
  observe these as a queue, but the queue **does not control ordering**
  — `allocateDeviceForSession` just polls for any matching free device.
  If two requests are waiting for the same device class, whichever poll
  cycle wins gets the device. There is no FIFO guarantee. The
  `commandsQueueGuard` AsyncLock
  ([`plugin.ts:374-391`](../../src/plugin.ts#L374-L391)) serialises
  requests inside the same capability hash but `AsyncLock` itself
  serves waiters in arrival order — so within a single
  platform+version+udid bucket there is approximate FIFO; across buckets
  there is no coordination.

- **Pending cleanup cron.**
  [`cleanPendingSessions`](../../src/device-utils.ts#L584-L603) sweeps
  expired pending rows every `checkBlockedDevicesIntervalMs`
  (default `30_000` ms,
  [`IPluginArgs.ts:111`](../../src/interfaces/IPluginArgs.ts#L111)),
  with a TTL of `deviceAvailabilityTimeoutMs + 10_000` ms
  ([`plugin.ts:306-309`](../../src/plugin.ts#L306-L309)). This is purely
  cosmetic — removes stale UI rows; the underlying `waitUntil` in the
  request thread is what actually decides timeout.

- **Global concurrency cap.** Inside the poll loop,
  [`device-utils.ts:153-161`](../../src/device-utils.ts#L153-L161)
  refuses to consider any device while
  `busyDevicesCount === pluginArgs.maxSessions` (default `8`,
  [`IPluginArgs.ts:100`](../../src/interfaces/IPluginArgs.ts#L100)).
  The cap is read from
  [`DeviceFarmManager.getMaxSessionCount`](../../src/device-managers/index.ts#L53-L55).
  **Surprise:** `maxSessions` applies globally to busy devices, not
  per-node — and is only enforced on the **hub** because the allocator
  runs on the hub. **Unknown:** behaviour when a node has its own
  smaller capacity than the hub's `maxSessions`.

- **Client disconnect detection.** The poll predicate checks
  `sessionRequestMap.has(requestId)` and throws if absent
  ([`device-utils.ts:145-152`](../../src/device-utils.ts#L145-L152)).
  The socket-close handler in the proxy
  ([`wd-command-proxy.ts:80-82`](../../src/proxy/wd-command-proxy.ts#L80-L82))
  is responsible for removing the entry; this is the only mechanism
  that lets a waiting allocator abandon early.

- **Timeout error shape.** When `waitUntil` rejects, the catch block at
  [`device-utils.ts:166-188`](../../src/device-utils.ts#L166-L188)
  attempts a single recovery: re-query without `busy`/`userBlocked`
  filters to distinguish "no device matches" from "device exists but is
  busy/blocked". If the matching device is `busy && !session_id`, the
  allocator unblocks it (a self-healing for stale blocks) then throws a
  friendly message. The pending row is removed by the
  `commandsQueueGuard` failure handler
  ([`plugin.ts:386-389`](../../src/plugin.ts#L386-L389)).

[SRE] Operational implications: queue depth is observable only via
LokiJS `pending-sessions` count; there is no histogram of wait time, no
per-client backpressure, no priority. Spike behaviour at request rates
> device count + maxSessions will produce a thundering herd at every
`deviceAvailabilityQueryIntervalMs` tick.

---

## 4. Session lifecycle events

The event bus is a singleton
[`EventBus`](../../src/notifier/event-bus.ts) wrapping
[`emittery`](../../src/notifier/event-bus.ts#L3). Four events exist
under [`src/events/`](../../src/events/):

| Event | Fire site | Listener | Effect |
| ----- | --------- | -------- | ------ |
| `BeforeSessionCreatedEvent` | [`plugin.ts:412-414`](../../src/plugin.ts#L412-L414) (local branch only) | **None** in repo | No-op. The class exists; no `.listener(...)` is registered. |
| `SessionCreatedEvent` | [`plugin.ts:482-492`](../../src/plugin.ts#L482-L492) (both branches) | [`Dashboard.handleNewSessionEvent`](../../src/dashboard/index.ts#L33), [`dashboard/index.ts:138-176`](../../src/dashboard/index.ts#L138-L176) | Builds the `LocalSession`/`RemoteSession`/`CloudSession`, registers it in `SESSION_MANAGER`, then calls `DASHBOARD_EVENT_MANAGER.onSessionStarted`. |
| `AfterSessionDeletedEvent` | [`plugin.ts:760`](../../src/plugin.ts#L760) | **None** in repo. | No-op — class is defined and fired, but nothing listens. The actual teardown work happens inline in `deleteSession` and in the proxy `res.end` intercept. |
| `UnexpectedServerShutdownEvent` | [`plugin.ts:136`](../../src/plugin.ts#L136) | **None** in repo. | No-op. |

[engineer] Two of the four events are wired only on the producer side.
They are extension points; nothing in upstream consumes them. **Unknown:**
whether downstream forks rely on these — Falx is free to add listeners.

### In-flight per-command events

These are not `EventBus` events but per-request hooks layered on top of
the HTTP proxy:

- **`dashboard.requestInterceptingMiddleware`**
  ([`dashboard/index.ts:42-64`](../../src/dashboard/index.ts#L42-L64)) is
  registered on the hub's Express router via
  [`registerProxyMiddlware`](../../src/plugin.ts#L197-L199). For each
  incoming WebDriver call that has a `sessionId` in the URL it calls:
  - `preSessionCommandHook` →
    [`DASHBOARD_EVENT_MANAGER.beforeSessionCommand`](../../src/dashboard/event-manager.ts#L82-L134)
    — handles `devicefarm:` custom scripts, and on `deleteSession`
    captures the final video/log/profiling assets.
  - If `shouldInterceptRequest` (hub only, non-CLOUD)
    ([`dashboard/index.ts:66-69`](../../src/dashboard/index.ts#L66-L69)),
    monkey-patches `res.write`/`res.end` to buffer the response and
    invoke either
    [`DASHBOARD_EVENT_MANAGER.onSessionStopped`](../../src/dashboard/event-manager.ts#L66-L80)
    on a `deleteSession`, or
    [`DASHBOARD_EVENT_MANAGER.afterSessionCommand`](../../src/dashboard/event-manager.ts#L136-L157)
    otherwise.

- **`afterSessionCommand`** writes a `SessionLog` Prisma row per command
  ([`event-manager.ts:218`](../../src/dashboard/event-manager.ts#L218)),
  optionally takes a screenshot when `screenshotOnAll` or
  `screenshotOnFailure` are set
  ([`event-manager.ts:194-216`](../../src/dashboard/event-manager.ts#L194-L216)),
  and tags the entry with an `eventId` from
  [`getEventId`](../../src/wdio-service/wdio-service.ts#L45-L57) (links
  to a WDIO test event journal).

- **`commands/handle.ts`** is registered onto the plugin prototype via
  `Object.assign(DevicePlugin.prototype, commands)`
  ([`plugin.ts:827`](../../src/plugin.ts#L827)) — every WebDriver command
  routed through the Appium base plugin's `handle` hook calls
  [`updateCmdExecutedTime`](../../src/commands/handle.ts#L8) to refresh
  the device's `lastCmdExecutedAt`. This is what keeps the
  `releaseBlockedDevices` cron
  ([`device-utils.ts:516-539`](../../src/device-utils.ts#L516-L539))
  from unblocking an active device on idle timeout. The proxy also
  updates this on every URL match
  ([`wd-command-proxy.ts:92`](../../src/proxy/wd-command-proxy.ts#L92)).

### Status state machine (Prisma `Session.status`)

Possible values
([`types/SessionStatus.ts`](../../src/types/SessionStatus.ts)):
`running`, `success`, `failed`, `unmarked`, `timeout`. Default at row
creation is `running`
([`schema.prisma:23`](../../prisma/schema.prisma#L23)).

Transitions observed:
- `running` → set on insert
  ([`event-manager.ts:35-47`](../../src/dashboard/event-manager.ts#L35-L47)).
- `passed` / `failed` → set via the `devicefarm: setSessionStatus`
  client script
  ([`dashboard/commands.ts:53-66`](../../src/dashboard/commands.ts#L53-L66)).
  Accepted values are restricted to `'passed' | 'failed'`
  ([`commands.ts:59`](../../src/dashboard/commands.ts#L59)) — note this
  is a string mismatch vs. the enum (`SessionStatus.SUCCESS = 'success'`,
  but the only accepted client value is `'passed'`).
  **Surprise:** the enum's `success`/`failed` values are not used as
  inputs anywhere.
- `unmarked` → applied at end-of-session if the session is still
  `running` (i.e. the client never called `setSessionStatus`)
  ([`event-manager.ts:71-78`](../../src/dashboard/event-manager.ts#L71-L78))
  and applied on plugin boot to any rows left in `running`/with
  `hasLiveVideo: true`
  ([`plugin.ts:204-213`](../../src/plugin.ts#L204-L213)).
- `timeout` — **declared in the enum but never written** anywhere in the
  repo (`grep` returns only the enum line).

---

## 5. Session teardown

Three independent teardown paths run on a normal `DELETE /session/:id`:

### 5a. Plugin-level (`DevicePlugin.deleteSession`)
[`plugin.ts:709-824`](../../src/plugin.ts#L709-L824). Sequence:

1. Look up the device row by `session_id`
   ([`plugin.ts:710-712`](../../src/plugin.ts#L710-L712)).
2. Collect every port to release — from the device record (`wdaLocalPort`,
   `mjpegServerPort`, `goIOSAgentPort`, `systemPort`, `adbPort`) and
   from `device.sessionResponse.capabilities`
   (`appium:systemPort`, `appium:chromeDriverPort`,
   `appium:flutterSystemPort`, `appium:wdaLocalPort`,
   `appium:mjpegServerPort`)
   ([`plugin.ts:715-755`](../../src/plugin.ts#L715-L755)).
3. `unblockDeviceMatchingFilter({ session_id })` clears the busy flag
   ([`plugin.ts:757`](../../src/plugin.ts#L757)).
4. `await next()` — Appium runs its real `deleteSession` (driver
   teardown).
5. Fire `AfterSessionDeletedEvent` (no listeners).
6. iOS real device: `DEVICE_CONNECTIONS_FACTORY.releaseConnection(udid)`
   ([`plugin.ts:761-767`](../../src/plugin.ts#L761-L767)).
7. App cleanup: per platform, look up `androidCleanUpApps` /
   `iosCleanUpApps` from `device.deviceFarmCapabilities` or plugin
   args, then call the matching device manager's `uninstallApp` for each
   ([`plugin.ts:769-812`](../../src/plugin.ts#L769-L812)).
8. `releasePorts(validPorts)`
   ([`plugin.ts:815-820`](../../src/plugin.ts#L815-L820)).

This path runs on **the node holding the device** because that's where
the W3C `deleteSession` hook is reached after proxy forwarding. The hub
performs the dashboard intercept (§5b) in parallel.

### 5b. Hub dashboard intercept (`onSessionStopped`)
The hub's response interceptor
([`dashboard/index.ts:112-135`](../../src/dashboard/index.ts#L112-L135))
catches the `deleteSession` response body and calls
[`DASHBOARD_EVENT_MANAGER.onSessionStopped`](../../src/dashboard/event-manager.ts#L66-L80):

1. Look up the in-memory session.
2. Promote `running` → `unmarked` if still that, write `endTime: new
   Date()`, clear `hasLiveVideo`.
3. `SESSION_MANAGER.removeSession(sessionId)`.

The hub interceptor also runs `beforeSessionCommand` for
`deleteSession` **before** the request is forwarded
([`event-manager.ts:99-122`](../../src/dashboard/event-manager.ts#L99-L122)):

- `stopVideoRecording` → if a recording was active, fetch the base64
  blob and save via `saveVideoRecording`.
- `getDeviceLogs` → save via `saveDeviceLogs`.
- `stopAppProfiling` → save via `saveProflingLog`.
- Persist the resulting paths through `updateSessionDetails`.

For remote sessions these calls all go HTTP-via `RemoteSession` to the
holding node's `/device-farm/api/dashboard/...` endpoints; for local
sessions they happen in-process.

### 5c. Proxy unblock fallback
The proxy's downstream handler also unblocks on `DELETE /session/:id`
([`wd-command-proxy.ts:111-117`](../../src/proxy/wd-command-proxy.ts#L111-L117))
and removes the `addProxyHandler` map entry. This is a belt-and-braces
unblock in case the node's `deleteSession` hook fails to run.

### Unexpected shutdown
[`DevicePlugin.onUnexpectedShutdown`](../../src/plugin.ts#L118-L137) is
the Appium-driver-crash callback. It unblocks the device(s) matched by
`sessionId`/`udid`. If the plugin is a node, it forwards the unblock to
the hub via `NodeDevices.unblockDevice`. It fires
`UnexpectedServerShutdownEvent` (no listeners). [SRE] **Surprise:** the
dashboard's `SESSION_MANAGER` map is **not** cleaned, and the Prisma
session row is **not** marked failed — those only get rewritten on the
next plugin boot via [`plugin.ts:204-213`](../../src/plugin.ts#L204-L213).
A crashed driver leaves a stale row visible to the UI until restart.

### Stale-block cron
[`releaseBlockedDevices`](../../src/device-utils.ts#L516-L539) runs every
`checkBlockedDevicesIntervalMs` (default 30 s). For each device that is
busy with no `userBlocked` flag and a known `lastCmdExecutedAt`, if the
time-since-last-command exceeds `newCommandTimeout` (per-device or
`pluginArgs.newCommandTimeoutSec`, default 60 s), the device is
unblocked. This catches sessions where the client died without sending
`DELETE`. **Note:** unblocking the device does **not** also tear down
the Appium driver session itself — there is no kill of the upstream
session.

---

## 6. Concurrency

| Limit | Where | Default | Scope |
| ----- | ----- | ------- | ----- |
| `maxSessions` | [`device-managers/index.ts:53-55`](../../src/device-managers/index.ts#L53-L55), checked in [`device-utils.ts:153-161`](../../src/device-utils.ts#L153-L161) | `8` ([`IPluginArgs.ts:100`](../../src/interfaces/IPluginArgs.ts#L100)) | Global across all devices known to the hub. Compared against `busyDevicesCount` from `getAllDevices()` filter. |
| Per-device | implicit via `busy` flag | 1 | One session per device — the allocator filters `busy: false` ([`device-utils.ts:357`](../../src/device-utils.ts#L357)) and `blockDevice` sets it. |
| Per-capability-class lock | [`plugin.ts:374-391`](../../src/plugin.ts#L374-L391) | n/a | `AsyncLock` keyed on a sorted hash of `platformName + appium:platformVersion + appium:udids`. Serialises allocation within a capability bucket; does not throttle execution after allocation. |
| Per-node | **Unknown** | — | No code path enforces a per-node session cap. Devices are claimed by `nodeId` filter when caps specify one, but there is no node-level concurrency gate. |
| Client wait-window | [`device-utils.ts:134-165`](../../src/device-utils.ts#L134-L165) | 5 min timeout, 10 s interval | Per-request. Exceeding this throws "No device matching request" / "Device is busy or blocked". |
| WebDriver newCommandTimeout | [`device-utils.ts:198-202`](../../src/device-utils.ts#L198-L202), unblock cron at [`device-utils.ts:516-539`](../../src/device-utils.ts#L516-L539) | 60 s | Per-session. Unblocks device after idle. |

[SRE] No explicit cap on session creation rate or concurrent
`waitUntil` callers; each request occupies one Node.js async context plus
one LokiJS row. Memory pressure scales with concurrent waiters, not just
running sessions.

---

## 7. Session logs and artifacts

### Storage layout
Root path is
[`config.sessionAssetsPath`](../../src/config.ts#L46) =
`${DEVICE_FARM_HOME}/assets/sessions/`, where `DEVICE_FARM_HOME` is
either the env var or `~/.cache/appium-device-farm/`
([`config.ts:7-19`](../../src/config.ts#L7-L19)). Per-session subdir is
created up-front by
[`prepareDirectory`](../../src/dashboard/asset-manager.ts#L9-L14) when
`onSessionStarted` runs
([`event-manager.ts:49`](../../src/dashboard/event-manager.ts#L49)).

Structure per session:
```
${sessionAssetsPath}/${sessionId}/
  screenshots/<uuid>.jpg
  video/${sessionId}.mp4
  device_log.json
  profiling.json
```

Writers (all in
[`asset-manager.ts`](../../src/dashboard/asset-manager.ts)):
- [`saveScreenShot`](../../src/dashboard/asset-manager.ts#L32-L37) — one
  file per call, UUID-named, base64 decoded. Called from
  [`event-manager.ts:213`](../../src/dashboard/event-manager.ts#L213) when
  `screenshotOnAll` / `screenshotOnFailure` triggers fire.
- [`saveVideoRecording`](../../src/dashboard/asset-manager.ts#L39-L44) —
  single mp4 named `${sessionId}.mp4`, written from base64. Called from
  [`event-manager.ts:105`](../../src/dashboard/event-manager.ts#L105)
  during `beforeSessionCommand` on `deleteSession`.
- [`saveDeviceLogs`](../../src/dashboard/asset-manager.ts#L46-L51) —
  one `device_log.json` per session. Same call site as video.
- [`saveProflingLog`](../../src/dashboard/asset-manager.ts#L53-L61) —
  one `profiling.json` per session. **Surprise:** function name is
  misspelled ("Profling"). Saves `{ device_info, profiling_log }`
  shape.

All writers route through
[`createAssetFile`](../../src/dashboard/asset-manager.ts#L16-L30), which
**skips writes if the file already exists**
([`asset-manager.ts:18-20`](../../src/dashboard/asset-manager.ts#L18-L20))
— re-running teardown for the same session is idempotent (and silently
lossy if the original write was partial).

### Stored paths in Prisma
Asset locations are stored on the Prisma `Session` row as relative paths
under `sessionAssetsPath`
([`schema.prisma:28-30`](../../prisma/schema.prisma#L28-L30)):
`videoRecording`, `deviceLogs`, `appProfiling`. `SessionLog.screenshot`
holds the relative path for per-command screenshots
([`schema.prisma:54`](../../prisma/schema.prisma#L54)). The paths are
relative to `sessionAssetsPath` — the dashboard router prepends it on
read ([`dashboard/router.ts:307-311`](../../src/dashboard/router.ts#L307-L311),
[`router.ts:357-361`](../../src/dashboard/router.ts#L357-L361)).

### Video capture
Started in
[`onSessionStarted`](../../src/dashboard/event-manager.ts#L51-L56) when
`df:recordVideo` is truthy, with `df:videoResolution` and
`df:videoTimeLimit` (default 1800 s in
[`RemoteSession.ts:78`](../../src/dashboard/sessions/RemoteSession.ts#L78)).
`RemoteSession.startVideoRecording` POSTs to
`/session/:id/appium/start_recording_screen` with `libx264` and
`videoFps: 10`. **Surprise:** the video time-limit cap is per the
Appium docs the maximum a single recording can run; if the session
runs longer the video is truncated. No chunked-recording logic.

### App profiling
Android-only (see §2 LocalSession). Captured by an `adb shell top`
subprocess
([`android-profiling.ts:37-92`](../../src/dashboard/app-profiling/android-profiling.ts#L37-L92)),
parsed line-by-line, deduped on timestamp on retrieval
([`android-profiling.ts:127`](../../src/dashboard/app-profiling/android-profiling.ts#L127)).
Started in `LocalSession.startAppProfiling`
([`LocalSession.ts:88-104`](../../src/dashboard/sessions/LocalSession.ts#L88-L104))
and stopped in `LocalSession.stopAppProfiling`
([`LocalSession.ts:106-115`](../../src/dashboard/sessions/LocalSession.ts#L106-L115)).
For remote sessions, profiling start/stop is delegated to the holding
node via HTTP
([`RemoteSession.ts:125-158`](../../src/dashboard/sessions/RemoteSession.ts#L125-L158)).

### Cleanup
The only deliberate asset cleanup path is the dashboard
`/device-farm/api/dashboard/cleanup` endpoint
([`router.ts:747`](../../src/dashboard/router.ts#L747)) →
[`cleanupBuilds`](../../src/dashboard/router.ts#L88-L262). It takes a
`retentionDays` body param, finds builds older than the cutoff, deletes
their `SessionLog`, `Session`, and `Build` rows in Prisma (in that
order, with explicit try/catches per step), and then
`fs.rmSync(sessionDir, { recursive: true, force: true })` per session
([`router.ts:233-249`](../../src/dashboard/router.ts#L233-L249)).
There is no cron driving this; cleanup is operator-triggered.

[SRE] Implications: with no automatic retention, asset directory grows
unbounded. The 1800 s video default and the per-command screenshot
behaviour can produce large per-session footprints. **Unknown:** total
disk-usage accounting / quotas — not present in source.

---

## Summary of surprises

- Two of four `EventBus` events (`BeforeSessionCreatedEvent`,
  `AfterSessionDeletedEvent`, `UnexpectedServerShutdownEvent`) have no
  listeners — they are extension hooks that ship dormant.
- `SessionStatus.SUCCESS = 'success'` is defined but the dashboard
  client command only accepts `'passed' | 'failed'`. `SessionStatus.TIMEOUT`
  is defined but never written.
- Pending-sessions storage is LokiJS (in-memory + JSON dump), separate
  from Prisma `Session`. Pending rows are advisory only — they don't
  control allocation order.
- `maxSessions` is global, not per-node — it gates `busyDevicesCount`
  across the entire hub.
- Local-session HTTP calls use a `wd-internal/` URL prefix as an
  in-band signal to the proxy to bypass the dashboard intercept loop.
- The pending-session cleanup cron and the request's own `waitUntil`
  timeout are independent; the cron is cosmetic.
- `createAssetFile` silently no-ops if the file exists.
- The function name `saveProflingLog` is misspelled in the source.
- iOS profiling is not implemented (`LocalSession.startAppProfiling`
  only branches on Android).
- Stale-block release unblocks the device record but does **not** tear
  down the upstream Appium driver session — a crashed client leaves an
  orphan driver until process restart.
