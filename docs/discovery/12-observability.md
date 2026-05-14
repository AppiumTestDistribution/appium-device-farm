**Lens:** SRE

# Observability Discovery

## 1. Logging

### Library

The plugin uses **`@appium/support`'s logger** wrapper, which itself wraps
**`npmlog` 7.0.1**.

Source: [`src/logger.ts`](../../src/logger.ts)

```typescript
import { logger } from '@appium/support';
const which_appium = process.env.APPIUM_HOME || 'main';
const log = logger.getLogger(`device-farm-${which_appium}`);
export default log;
```

The logger prefix is `device-farm-<APPIUM_HOME value>`. When running a single
server this produces prefix `device-farm-main`; on multiple Appium HOME
instances the APPIUM_HOME path is included to distinguish them.

The underlying `@appium/support` logging layer is in
`node_modules/@appium/support/lib/logging.js`. It wraps `npmlog`, exposing
levels `['silly', 'verbose', 'debug', 'info', 'http', 'warn', 'error']`.
Key implementation notes:
- The global `npmlog` instance is shared across all Appium plugins via
  `global._global_npmlog`.
- In testing mode (`process.env._TESTING === '1'`), log calls are silently
  dropped via a mock logger.
- Timestamps can be added via `process.env._LOG_TIMESTAMP=1`.

### Format

**Not structured JSON.** Output is npmlog's default format: colored text to
stderr by default. Example:

```
[HH:MM:SS] device-farm-main  info  📱 Blocking device <udid> at host <host>
```

The level name and prefix are printed together. There is no JSON serialization,
no request IDs, no trace IDs in log lines.

### Log levels used in the codebase

Calls observed across `src/`:

| Level | Usage pattern |
|---|---|
| `log.debug` | High-frequency operational events: session capability dumps, device allocation steps, proxy forwarding |
| `log.info` | State transitions: node/hub announcements, emulator boot, session creation/unblocking, proxy config |
| `log.warn` | Non-fatal conditions: port conflicts (`iProxy.ts`), failed asset cleanup |
| `log.error` | Session creation failures, DB errors, streaming errors |

No `log.silly`, `log.verbose`, or `log.http` calls were observed in `src/`.

### Where logs go

Logs are written to **stderr** by npmlog unless Appium is started with `--log
<file>` (the `logFile` server argument). The dashboard route
`GET /server/:nodeId/appium_logs` streams the log file if `serverArgs.logFile`
is set; if no log file is configured, it returns HTTP 400.

Source: [`src/dashboard/router.ts`](../../src/dashboard/router.ts) lines 444-495.

This means: in the default Docker deployment (no `--log` flag), log file
streaming in the UI is unavailable. The log only exists on stdout/stderr of the
container.

### Sensitive value redaction

[`log-filter.json`](../../log-filter.json) defines seven regex patterns applied
by `@appium/support/lib/log-internal.js` (`SECURE_VALUES_PREPROCESSOR`) before
any log line is emitted. Redacts: `df:jwt`, `df:accesskey`, `df:token`,
`username`, `password`, `accesskey`, `token` fields from JSON-like log content.

### Debug mode

Source: [`src/debugLog.ts`](../../src/debugLog.ts)

A separate `debugLog` function (not the `log` object) prints to `console.log` /
`console.debug` only when `process.env.DEVICE_FARM_DEBUG` is truthy. Output is
wrapped in `****` banners. This is a debug escape hatch, not structured logging.

---

## 2. Metrics

**No metrics instrumentation.** There is no Prometheus client, StatsD emitter,
or OpenTelemetry metrics SDK in the dependency tree or in `src/`. The plugin
does not expose any `/metrics` endpoint.

Grepping for `prom`, `prometheus`, `statsd`, `otel`, `opentelemetry` across
`src/` produces zero matches.

---

## 3. Tracing

**No distributed tracing.** No OpenTelemetry SDK, no Jaeger/Zipkin client, no
trace context propagation. Request IDs (`appium:requestId`) are used internally
to correlate a pending session capability with its allocation slot, but these
are not propagated as HTTP headers and are not queryable outside the process.

Source: [`src/plugin.ts`](../../src/plugin.ts) lines 355-357; [`src/device-utils.ts`](../../src/device-utils.ts) lines 94-150.

---

## 4. Health / Status Endpoints

### `/device-farm/api/status` — plugin health

Source: [`src/app/routers/grid.ts`](../../src/app/routers/grid.ts) lines 287-295.

```
GET /device-farm/api/status
→ { status: "ok", version: "<npm_package_version>" }
```

Returns HTTP 200 with a JSON body. No deeper liveness checks (DB connectivity,
device enumeration status, etc.).

### `/device-farm/api/node/status` — ADB status on this node

```
GET /device-farm/api/node/status
```

Returns ADB device list for the current host.

### `/device-farm/api/node/:host/status` — ADB status on another node

```
GET /device-farm/api/node/:host/status
```

Proxies to the given host's status endpoint.

No `/health`, `/ping`, `/readyz`, or `/livez` routes exist. The single status
endpoint is minimal.

---

## 5. Per-Session Log Capture

The plugin maintains a `SessionLog` Prisma model. Session logs are written to
the database by the dashboard subsystem.

Dashboard route: `GET /device-farm/api/session/:sessionId/session_log` reads
from `prisma.sessionLog.findMany({ where: { sessionId } })`.

Source: [`src/dashboard/router.ts`](../../src/dashboard/router.ts) lines 286-295 (route
registered at line 757).

Appium's own session log (the Appium server's stderr / log file) is separately
streamable per node via `GET /device-farm/api/server/:nodeId/appium_logs`. This
tails the file using an `fs.FSWatcher` + `ReadStream` approach with a 64 KB
highWaterMark.

**Gap:** Session logs in the DB are only as durable as the database. No
retention policy is enforced at the storage layer (cleanup is manual via the
`POST /device-farm/api/cleanup` route). Log entries are deleted when a build is
cleaned up.

---

## 6. Log Retention

No automated retention policy. The `POST /device-farm/api/cleanup` endpoint
(source: [`src/dashboard/router.ts`](../../src/dashboard/router.ts) line 747)
performs:
1. Identifies builds to delete based on retention rules (source logic in
   `cleanup-builds.spec.ts` suggests count-based cleanup).
2. `prisma.sessionLog.deleteMany({ where: { sessionId: { in: ... } } })`
3. Removes session asset directories from `~/.cache/appium-device-farm/assets/`.

Process-level logs (stderr / log file) have no rotation or retention mechanism
in the plugin itself. Log rotation is the responsibility of the host OS or
container runtime.

---

## 7. Gaps vs. Production On-Prem Requirements

| Gap | Description |
|---|---|
| **No structured JSON logging** | npmlog emits colored text. A production deployment needs JSON-to-stdout (e.g. Pino or Winston with JSON transport) for log aggregation (Loki, Elasticsearch, Datadog). |
| **No log level runtime control** | Log level is set at Appium server startup via `--log-level`. No API to adjust it at runtime without restarting. |
| **No Prometheus metrics** | Zero metrics exported. Cannot build dashboards for: active sessions, device utilization %, session creation latency, queue depth, error rates. |
| **No request ID propagation** | HTTP requests carry no correlation ID. Impossible to trace a client request through hub → node → driver logs without manual log correlation by timestamp. |
| **No distributed tracing** | Multi-node deployments have no span propagation. Hub-to-node forwarding is opaque from an observability standpoint. |
| **Health check is shallow** | `/api/status` returns `{ status: "ok" }` unconditionally. No DB ping, no device manager readiness check, no Appium driver connectivity check. Not suitable as a Kubernetes readiness probe. |
| **No Dockerfile HEALTHCHECK** | Neither `docker/Dockerfile` nor `docker/Dockerfile.local` include a `HEALTHCHECK` instruction. Container orchestrators cannot detect an unhealthy plugin automatically. |
| **Log file optional** | The `--log` Appium flag must be explicitly set. The log streaming UI endpoint returns 400 if it is not set. No guidance in the Docker entrypoint to enable this. |
| **No alerting hooks** | No integration with PagerDuty, Alertmanager, or any notification system for device connectivity loss, session failures, or process crashes. |
| **Session log durability** | Session logs are stored in the application DB, not in a separate log store. Cleanup is on-demand only; old logs accumulate until manual cleanup. |
