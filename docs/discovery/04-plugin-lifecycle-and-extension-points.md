**Lens:** engineer

# 04 — Plugin Lifecycle and Extension Points

> Scope: how `device-farm` hooks into Appium 2.x, what lifecycle events fire
> and when, and — critically — what extension points Falx can use **without
> modifying upstream `src/` files**. Unavoidable conflict zones are called out
> explicitly.

---

## 1. Appium 2.x Plugin Contract

Appium 2.x loads plugins discovered via `appium plugin install` (or local path).
Each plugin exports a class that extends `@appium/base-plugin`. The framework
calls three static/instance hooks:

| Hook | Type | Called when |
|------|------|-------------|
| `constructor(pluginName, cliArgs)` | instance | Plugin class instantiated per request context |
| `static updateServer(expressApp, httpServer, cliArgs)` | static | Once, after Appium's Express app is created but before listening |
| `async onUnexpectedShutdown(driver, cause)` | instance | Driver crashes unexpectedly during a session |
| `async createSession(next, driver, ...)` | instance | Client requests a new session (`POST /session`) |
| `async deleteSession(next, driver, sessionId)` | instance | Client deletes a session |
| `async handle(next, driver, commandName, ...args)` | instance | Every WD command (generic middleware) |

The plugin class is in [`src/plugin.ts`](../../src/plugin.ts). The export entry
point is [`src/index.ts`](../../src/index.ts#L14):

```typescript
export default DevicePlugin;
export { DevicePlugin };
```

`package.json` declares the plugin under the `appium` key (plugin slug
`device-farm`) — Appium uses this to locate and register the class.

---

## 2. `updateServer` Hook — Server Setup

[`src/plugin.ts:139-321`](../../src/plugin.ts#L139)

This is the most important lifecycle point. It runs once at startup and wires
everything together.

### Execution order

```
updateServer(expressApp, httpServer, cliArgs)
  │
  ├─ 1. getFreePort()                    → config.goIOSTunnelInfoPort
  ├─ 2. initializeLocalADB()             → DevicePlugin.adbInstance (Android only)
  ├─ 3. new Dashboard(EventBus, ...)     → subscribes to SessionCreatedEvent
  ├─ 4. Determine hub vs node role       → DevicePlugin.IS_HUB
  ├─ 5. initializeStorage()             → node-persist local cache
  ├─ 6. ATDRepository.DeviceModel.removeDataOnly() → clear stale device records
  ├─ 7. Boot emulators (if configured)
  ├─ 8. ChromeDriverManager.getInstance()
  ├─ 9. DeviceFarmManager init          → Container.set(DeviceFarmManager, ...)
  ├─ 10. addCLIArgs(cliArgs)            → persists cliArgs for later retrieval
  │
  ├─ 11. expressApp.use('/device-farm', createRouter(pluginArgs))
  │        └─ GridRouter.register(apiRouter, pluginArgs)
  │        └─ registerAuthenticationRoutes(apiRouter, pluginArgs)
  │
  ├─ 12. registerProxyMiddlware(expressApp, cliArgs, [
  │         dashboard.requestInterceptingMiddleware
  │       ])
  │
  ├─ 13. dashboard.addRoutes(expressApp)   → /device-farm/api/dashboard/*
  │
  ├─ 14. Sanitize DB session state (Prisma updateMany → status: 'unmarked')
  │
  ├─ 15a. IF NODE:
  │         setupCronUpdateDeviceList(...)  → node registration + device push loop
  │
  └─ 15b. IF HUB:
            NodeService.register(true, ...)
            NodeHealthMonitor.start(30000)
            updateDeviceList(bindHostOrIp)
            (cron tasks: stale devices, blocked devices, pending sessions)
```

### Route mounting

The plugin mounts its routes on the existing Appium Express app:

```
expressApp.use('/device-farm', router)       ← grid + auth + static
expressApp.use('/device-farm/api/dashboard', dashboardRouter)
expressApp.use('/', proxyMiddleware)          ← inserted at index 0 of router stack
```

The proxy middleware insertion trick
([`src/proxy/wd-command-proxy.ts:141-143`](../../src/proxy/wd-command-proxy.ts#L141))
splices the middleware to the front of the Express stack so it intercepts WD
requests before Appium's own route handlers.

---

## 3. Command Middleware — `handle`

[`src/commands/handle.ts`](../../src/commands/handle.ts)

```typescript
export default async function handle(next, driver, commandName, ...args) {
  updateCmdExecutedTime(driver.sessionId);
  return await next();
}
```

This is mixed into `DevicePlugin.prototype` via
[`src/commands/index.ts`](../../src/commands/index.ts):

```typescript
Object.assign(DevicePlugin.prototype, commands);
```

The `handle` method intercepts every WD command (click, setValue, etc.) and
updates a `lastCmdExecutedAt` timestamp for idle-timeout enforcement. It always
calls `next()` — no command suppression.

---

## 4. `createSession` — Session Allocation and Forwarding

[`src/plugin.ts:342-524`](../../src/plugin.ts#L342)

Key steps:

1. **Pending session tracking** — injects `appium:requestId` UUID via the proxy
   middleware; creates a pending session DB record.
2. **Device allocation** — `allocateDeviceForSession(...)` polls until a free
   device matching capabilities is available (up to
   `deviceAvailabilityTimeoutMs`).
3. **Route decision:**
   - `device.nodeId === DevicePlugin.NODE_ID` → local session, fires
     `BeforeSessionCreatedEvent`, calls `next()`.
   - otherwise → `forwardSessionRequest(device, caps)` — HTTP POST to node.
4. **Post-create** — fires `SessionCreatedEvent`, registers proxy handler for
   remote sessions, updates device record as busy.

---

## 5. `onUnexpectedShutdown`

[`src/plugin.ts:118-137`](../../src/plugin.ts#L118)

Called by Appium when a driver process crashes. Unblocks the device:

- If node: calls `NodeDevices(hub).unblockDevice(filter)` — remote HTTP call.
- If hub: calls `unblockDeviceMatchingFilter(filter)` — local DB.

Then fires `UnexpectedServerShutdownEvent` on the `EventBus`.

---

## 6. `deleteSession`

[`src/plugin.ts:709-824`](../../src/plugin.ts#L709)

1. Collects all ports associated with the session.
2. Calls `unblockDeviceMatchingFilter({ session_id })`.
3. Calls `next()` (lets Appium driver tear down).
4. Fires `AfterSessionDeletedEvent`.
5. Releases iOS USB proxy connection if applicable.
6. Runs app uninstall cleanup (if `androidCleanUpApps` / `iosCleanUpApps`
   configured).
7. Releases all ports via `releasePorts(validPorts)`.

---

## 7. Event Bus Architecture

[`src/notifier/event-bus.ts`](../../src/notifier/event-bus.ts) wraps
[Emittery](https://github.com/sindresorhus/emittery), an async typed event emitter.

### Published events

| Event class | Event name string | When fired | Payload type |
|-------------|-------------------|------------|--------------|
| `BeforeSessionCreatedEvent` | `'before-session-create'` | Just before local `next()` call | `{ device, sessionType, caps }` |
| `SessionCreatedEvent` | `'session-created'` | After session is confirmed created | `{ sessionId, device, sessionResponse, ... }` |
| `AfterSessionDeletedEvent` | `'after-session-deleted'` | After `next()` in deleteSession | `{ sessionId, device? }` |
| `UnexpectedServerShutdownEvent` | `'unexpected-server-shutdown-event'` | In `onUnexpectedShutdown` | `{ driver }` |

Each event class exposes a static `listener(handler)` factory method that
returns an `EventListener<T>` for subscription.

### Subscribing

```typescript
import EventBus from './notifier/event-bus';
import { SessionCreatedEvent } from './events/session-created-event';

EventBus.addListener(
  SessionCreatedEvent.listener(async (data) => {
    // data: IDeviceFarmSessionOptions
  })
);
```

`Dashboard` is the only current subscriber to `SessionCreatedEvent`
([`src/dashboard/index.ts:33`](../../src/dashboard/index.ts#L33)).

---

## 8. WD Request Proxy Middleware

[`src/proxy/wd-command-proxy.ts`](../../src/proxy/wd-command-proxy.ts)

The proxy middleware is the **most powerful interception surface** in the plugin.
It sits in front of all WD traffic on the hub.

### How it works

`registerProxyMiddlware(expressApp, cliArgs, middlewares)`:

1. Creates a `handler(cliArgs, middlewares)` closure.
2. Splices it to the front of Express's router stack
   ([line 141-143](../../src/proxy/wd-command-proxy.ts#L141)).

The handler:

- On `POST /session`: injects `appium:requestId`, stores request in
  `sessionRequestMap`.
- On any request with a session ID: calls `updateCmdExecutedTime`.
- If session has a remote proxy entry (`remoteProxyMap.has(sessionId)`): forwards
  via `http-proxy-middleware` to the node.
- Otherwise: calls `next()`.
- Wraps the default handler with each middleware in `middlewares` array
  (`wrapRequestWithMiddleware`).

**The `middlewares` parameter is the Falx injection point for request
interception.** Currently one middleware is registered:
`dashboard.requestInterceptingMiddleware` — which intercepts responses for
session commands (video streaming, screenshots, logs).

---

## 9. Dashboard Response Interceptor

[`src/dashboard/index.ts:42-136`](../../src/dashboard/index.ts#L42)

`Dashboard.requestInterceptingMiddleware`:

- Extracts `sessionId` from URL.
- Calls `DASHBOARD_EVENT_MANAGER.beforeSessionCommand(...)` — can short-circuit
  the request (return false = abort).
- If session exists and is not CLOUD: wraps `res.write` and `res.end` to capture
  the response body and call `DASHBOARD_EVENT_MANAGER.afterSessionCommand(...)`.
- On `deleteSession` command: calls `DASHBOARD_EVENT_MANAGER.onSessionStopped`.

`DashboardEventManager` records screenshots, video frames, device logs, and
profiling data per-command into Postgres.

---

## 10. Extension Points for Falx (Ranked)

[architect]

### EP-1: EventBus listeners (RECOMMENDED — zero conflict risk)

**How:** `EventBus.addListener(SomeEvent.listener(handler))` from any module
loaded at startup.

**What you get:**
- `BeforeSessionCreatedEvent` — capabilities + device known; can mutate data
  before Appium driver starts.
- `SessionCreatedEvent` — full session + device info; fire webhooks, update
  external DBs, stream analytics.
- `AfterSessionDeletedEvent` — session teardown; cleanup hooks.
- `UnexpectedServerShutdownEvent` — crash handling.

**Limitation:** the bus is a singleton module; listeners must be registered
before the first event fires (i.e., at startup). No dynamic removal API exists.

**How to wire without touching `src/`:** Import `EventBus` and event classes
from `src/` in Falx-owned code and call `addListener` during an initialization
step. The cleanest approach is an init function called from `updateServer` — but
that requires a one-line patch to `plugin.ts` (see unavoidable conflicts below).

---

### EP-2: Express custom routes (LOW conflict risk)

**How:** In a Falx-owned module, accept the `expressApp` reference and call
`expressApp.use('/device-farm/api/falx', myRouter)`.

**What you get:** Full REST surface for Falx-specific APIs (e.g., reporting
endpoints, control-plane callbacks) without touching the upstream router files.

**Limitation:** `updateServer` is the only place `expressApp` is available, so
Falx code needs to be invoked from there. A one-liner delegation call in
`plugin.ts` is the minimal required upstream touch.

---

### EP-3: WD proxy middleware injection (MODERATE conflict risk)

**How:** Add entries to the `middlewares` array passed to
`registerProxyMiddlware`. Currently only one middleware is in the array:
`dashboard.requestInterceptingMiddleware`.

**What you get:** Intercept and modify every WD request and response on the hub.
This is how the dashboard captures screenshots and video frames today. Falx can
add its own request/response interceptor here (e.g., inject custom headers,
log commands, gate commands by user policy).

**Limitation:** Adding a second middleware requires modifying the
`registerProxyMiddlware` call in `plugin.ts:197-199`. The middleware chain is
order-sensitive.

---

### EP-4: Prisma / DB layer augmentation (CLEAN if schema only grows)

**How:** Add new Prisma models or fields in `prisma/schema.prisma` for
Falx-specific data. Existing model reads are unaffected by additive schema
changes.

**What you get:** Structured persistence for Falx data (e.g., custom session
metadata, user-device assignments, billing events) co-located with the upstream
DB.

**Limitation:** Upstream merges that add schema changes will conflict at the
`prisma/schema.prisma` file level.

---

### EP-5: `typedi` Container injection (MODERATE — invasive)

**How:** `Container.set(MyService, new MyService(...))` and
`Container.get(MyService)` anywhere. The DI container is process-global.

**What you get:** Can replace or decorate upstream services (e.g., wrap
`DeviceFarmManager`) without modifying the class itself.

**Limitation:** Requires careful timing — must set before any code calls
`Container.get`. Not naturally fork-friendly as upstream code doesn't define
injection tokens consistently.

---

### EP-6: Dynamic require / module override (HIGH conflict risk, NOT recommended)

The codebase uses no dynamic require patterns for extensibility. No hook arrays,
no plugin-of-plugins mechanism, no `require(userConfiguredPath)`. This pattern
would require monkeypatching module exports — fragile.

---

## 11. Unavoidable Upstream Conflict Files

These files will need Falx-specific patches regardless of extension strategy:

| File | Why Falx must touch it | Risk level |
|------|------------------------|------------|
| [`src/plugin.ts`](../../src/plugin.ts) | `updateServer` is the only startup hook; adding Falx initialization (event listeners, routes, middleware injection) needs a call here | **High** — central file, frequent upstream changes |
| [`src/app/index.ts`](../../src/app/index.ts) | `createRouter` is where all API routes are assembled; Falx UI routes or API overrides go here | **Medium** — touched on feature additions |
| [`prisma/schema.prisma`](../../prisma/schema.prisma) | Any new Postgres tables or columns conflict if upstream adds fields | **Medium** — conflicts on upstream DB migrations |
| [`src/proxy/wd-command-proxy.ts`](../../src/proxy/wd-command-proxy.ts) | Adding a second WD interceptor middleware requires touching the call site | **Low** — stable, infrequently changed |
| [`src/dashboard/index.ts`](../../src/dashboard/index.ts) | Dashboard response interceptor call chain — if Falx wants to add pre/post command hooks alongside dashboard's | **Low** — could be delegated |

---

## 12. Fork-Friendly Patterns Observed

### What's already fork-friendly

- **EventBus / Emittery** — the cleanest extension surface. Emittery supports
  multiple listeners per event name natively. Falx can subscribe without
  any upstream change.
- **Prisma** — additive schema changes are non-destructive. New models don't
  affect existing queries.
- **Express mount points** — `/device-farm/api/falx/*` is untouched namespace.
- **`typedi` Container** — services are settable globally; replacement is
  possible if timing is managed.

### What is NOT fork-friendly

- **`updateServer` is static and monolithic** — all initialization is inline,
  not delegated to sub-modules. There is no plugin-of-plugins hook, no
  registered initializer list. Every new Falx startup behavior needs a call
  site here.
- **No event fired for `createSession` allocation failure** — there's no event
  for "device not available / queue full" scenarios.
- **No event for WD command interception** — `handle()` calls `next()` without
  emitting. Intercepting individual commands requires either extending `handle`
  or adding a proxy middleware.
- **No dynamic route registration API** — routes are registered once at
  `updateServer` time; adding routes later requires access to `expressApp` which
  is not stored as a module-level variable.

---

## 13. Recommended Falx Initialization Pattern

```typescript
// falx/init.ts (Falx-owned, never in src/)
import EventBus from '../src/notifier/event-bus';
import { SessionCreatedEvent } from '../src/events/session-created-event';
import { AfterSessionDeletedEvent } from '../src/events/after-session-deleted-event';
import { BeforeSessionCreatedEvent } from '../src/events/before-session-create-event';

export function initFalxExtensions(expressApp: any, pluginArgs: any) {
  // 1. Register EventBus listeners
  EventBus.addListener(SessionCreatedEvent.listener(onSessionCreated));
  EventBus.addListener(AfterSessionDeletedEvent.listener(onSessionDeleted));
  EventBus.addListener(BeforeSessionCreatedEvent.listener(onBeforeSession));

  // 2. Mount Falx-specific routes
  expressApp.use('/device-farm/api/falx', falxRouter);
}
```

In `src/plugin.ts` `updateServer`, add one line after step 13 above:
```typescript
// ONE upstream patch required:
await initFalxExtensions(expressApp, pluginArgs);
```

This approach minimizes the diff in `plugin.ts` to a single `import` +
single `await` call, making upstream merges easier to manage.
