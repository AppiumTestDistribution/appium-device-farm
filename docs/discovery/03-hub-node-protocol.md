**Lens:** architect + engineer

# 03 — Hub-Node Protocol

> Scope: how two Appium-device-farm processes talk to each other — one acting as
> **hub** (no `hub` CLI arg), the other as a **node** (`hub` arg present).

---

## 1. Topology Overview

[architect]

```
  Client (test framework)
       |
       | POST /session, WD commands
       v
  ┌──────────────────────────────────────┐
  │  HUB process  (DevicePlugin)         │
  │  port: 31337 (typical)               │
  │                                      │
  │  DevicePlugin.IS_HUB = true          │
  │  Owns the device DB (LokiJS + Pg)    │
  │  Owns session routing                │
  └───────────────┬──────────────────────┘
                  │  HTTP/REST (no WebSocket)
        ┌─────────┴──────────┐
        │                    │
   ┌────▼─────┐         ┌────▼─────┐
   │  NODE A  │         │  NODE B  │
   │ port:4723│         │ port:31338│
   └──────────┘         └──────────┘
```

Hub and each node both run the full `device-farm` Appium plugin. The sole
differentiator is whether the `hub` key is present in the plugin config. Both
expose the same REST surface — the node just also calls outward to the hub on a
polling schedule.

**No WebSocket / reverse channel exists.** All communication is node → hub over
plain HTTP POST/GET.

---

## 2. Node Configuration

[engineer]

The minimal node config lives in [`node-config.json`](../../node-config.json):

```json
{
  "server": {
    "port": 31338,
    "plugin": {
      "device-farm": {
        "platform": "android",
        "hub": "http://192.168.1.16:31337"
      }
    }
  }
}
```

Full reference fields (from [`src/interfaces/IPluginArgs.ts`](../../src/interfaces/IPluginArgs.ts#L33)):

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `hub` | `string` | `undefined` | Hub URL; if set, this process is a node |
| `platform` | `'android'\|'ios'\|'both'\|'none'` | `'none'` | Device platform to manage |
| `bindHostOrIp` | `string` | `ip.address()` | IP this process advertises to the hub |
| `sendNodeDevicesToHubIntervalMs` | `number` | `30000` | Polling cadence (ms) |
| `checkStaleDevicesIntervalMs` | `number` | `30000` | Hub-side stale scan cadence |
| `checkBlockedDevicesIntervalMs` | `number` | `30000` | Blocked-device release cadence |
| `deviceAvailabilityTimeoutMs` | `number` | `300000` | Max wait for free device |
| `accessKey` / `token` | `string` | `undefined` | Basic-auth credentials for hub |
| `enableAuthentication` | `boolean` | `undefined` | Enable auth gate on hub |
| `nodeName` | `string` | `os.hostname()` | Friendly name stored in hub DB |

Node ID is generated once per Appium home directory, persisted in
`~/.cache/appium-device-farm/metadata.json`, and reused across restarts
([`src/config.ts:22-41`](../../src/config.ts#L22)). The ID is a UUID v4.

---

## 3. Node Startup and Registration

[engineer]

`updateServer` is the static Appium hook that runs once on plugin load.
Detection is purely presence-based:
[`src/plugin.ts:172`](../../src/plugin.ts#L172)

```typescript
DevicePlugin.IS_HUB = !pluginArgs.hub;
```

### 3a. Node path (hub arg present)

1. **Check hub liveness** — `isDeviceFarmRunning(hubArgument)` calls
   `GET {hub}/device-farm/api/status` with a 30 s timeout
   ([`src/helpers.ts:282-299`](../../src/helpers.ts#L282)).
   Throws if the hub is not reachable.

2. **Authenticate (optional)** — if `enableAuthentication` is true, calls
   `GET {hub}/device-farm/api/dashboard/node/authenticate` with Basic auth
   headers constructed from `accessKey:token`
   ([`src/api-client.ts:20-22`](../../src/api-client.ts#L20)).
   Throws on failure.

3. **Start polling loop** — `setupCronUpdateDeviceList(...)` is called
   immediately and then on the `sendNodeDevicesToHubIntervalMs` interval
   ([`src/device-utils.ts:554-582`](../../src/device-utils.ts#L554)):

   ```
   setupCronUpdateDeviceList
     └─ fn() (runs immediately, then every N ms)
         ├─ isDeviceFarmRunning(hub)      -- liveness gate
         ├─ NodeService.register(...)     -- upsert node record on hub
         └─ updateDeviceList(host, hub)   -- enumerate + push devices
   ```

### 3b. Hub path (no hub arg)

1. Registers itself in local Postgres:
   `NodeService.register(true, nodeName, url, NODE_ID)`
   ([`src/plugin.ts:279-284`](../../src/plugin.ts#L279)).

2. Starts `NodeHealthMonitor` on a 30 s interval to poll registered nodes for
   liveness ([`src/utils/node-heath-monitor.ts:19-43`](../../src/utils/node-heath-monitor.ts#L19)).

---

## 4. Node Registration Call

[engineer]

Inside `fn()` in `setupCronUpdateDeviceList`:

```typescript
await NodeService.register(false, pluginArgs.nodeName, `http://${host}:${port}`, NODE_ID);
```

`NodeService.register` ([`src/data-service/node-service.ts:9-26`](../../src/data-service/node-service.ts#L9)):

1. Builds a `Partial<Node>` payload:
   - `id` — stable UUID from `metadata.json`
   - `name` — `nodeName` arg or `os.hostname()`
   - `host` — `http://{bindHostOrIp}:{port}`
   - `os` — `'mac'` (darwin) or platform string
   - `jwtSecretToken` — JWT signing secret
   - `isHub: false`
   - `isOnline: true`
   - `tags: ''`

2. Upserts locally via `NodeService.addNode` (Prisma `node` table).

3. If `!isHub`, calls `DeviceFarmApiClient.registerNode(nodeDetails)`:
   `POST {hub}/device-farm/api/dashboard/node` with Basic-auth header
   ([`src/api-client.ts:24-26`](../../src/api-client.ts#L24)).

The hub-side handler is [`src/dashboard/router.ts:631-649`](../../src/dashboard/router.ts#L631)
(`registerNode`), which calls `NodeService.addNode(id, body, userId)` to upsert
the node record in the hub's Postgres.

---

## 5. Device Discovery and Push

[engineer]

After node registration, the same `fn()` calls `updateDeviceList(host, hub)`.

[`src/device-utils.ts:391-426`](../../src/device-utils.ts#L391):

1. `DeviceFarmManager.getDevices(existingDevices)` — enumerates locally
   connected devices via ADB / go-iOS / USB.
2. `addNewDevice(devices, host)` — upserts device records in local DB.
3. `NodeDevices(hub).postDevicesToHub(devices, 'add')` — sends the list to the
   hub.

`postDevicesToHub` ([`src/device-managers/NodeDevices.ts:33-64`](../../src/device-managers/NodeDevices.ts#L33)):

```http
POST {hub}/device-farm/api/register
Content-Type: application/json
?type=add

[{ udid, platform, host, mjpegServerPort, ... }]
```

Hub-side handler `registerDevice`
([`src/app/routers/grid.ts:73-87`](../../src/app/routers/grid.ts#L73)):
- `type=add` → calls `addNewDevice(requestBody)` (upserts devices with
  `host = node-host` from body's device records).
- `type=remove` → calls `removeDevice(requestBody)`.

Devices carry a `host` field equal to the node's URL, so the hub knows which
node owns each device.

---

## 6. Heartbeat / Polling Cadence

[engineer]

There is **no explicit heartbeat message**. The node proves liveness by the
periodic `sendNodeDevicesToHubIntervalMs` push (default 30 s). The hub detects
node death through two separate mechanisms:

| Mechanism | Location | Cadence | Action |
|-----------|----------|---------|--------|
| `NodeHealthMonitor` | [`src/utils/node-heath-monitor.ts`](../../src/utils/node-heath-monitor.ts) | 30 s | `GET /device-farm/api/status` on each known node; marks offline + removes devices |
| `setupCronCheckStaleDevices` | [`src/device-utils.ts:438-506`](../../src/device-utils.ts#L438) | `checkStaleDevicesIntervalMs` (30 s default) | Polls each device's `host` URL; removes devices whose host is unreachable |

`NodeHealthMonitor.checkNodeHealth` marks offline nodes with
`NodeService.setNodeOffline(nodeIds)` and calls
`removeDevicesForNodes(offlineNodes)`.

`removeStaleDevices` checks all devices whose `host` does not include the
current host IP, calling `isDeviceFarmRunning(host)` for non-cloud devices.
Unreachable hosts → devices removed from DB.

---

## 7. Session-Create Forwarding

[architect]

When a client POSTs `POST /session` to the hub, the flow is:

```
Client
  │  POST /wd/hub/session {caps}
  v
registerProxyMiddlware handler (wd-command-proxy.ts)
  │  Injects appium:requestId into caps
  │  Tracks request in sessionRequestMap
  v
DevicePlugin.createSession()
  │  allocateDeviceForSession()  -- waits for free device matching caps
  │
  ├─ device.nodeId == DevicePlugin.NODE_ID?
  │     YES → EventBus.fire(BeforeSessionCreatedEvent)
  │            → next()  (local Appium driver)
  │
  └─ NO (remote node)
        → forwardSessionRequest(device, caps)
            POST {device.host}{basePath}/session
            + df:udid = device.udid (injected)
            + df:jwt  = signed JWT (if auth enabled)
```

[engineer]

`forwardSessionRequest` ([`src/plugin.ts:563-652`](../../src/plugin.ts#L563)):

- Target URL: `nodeUrl(device, basePath) + '/session'`
  ([`src/helpers.ts:177-192`](../../src/helpers.ts#L177)).
  For non-cloud devices this is `http://{device.host}{basePath}`.
- Adds `df:udid` to `alwaysMatch` (or `firstMatch[0]`) so the node knows which
  specific device to use.
- Uses `axios` with `keepAlive: true`, 120 s keepAlive, `remoteConnectionTimeout`
  (default 60 s).
- On success, registers a `http-proxy-middleware` proxy handler
  `addProxyHandler(sessionId, device.host)` so subsequent WD commands for that
  session are transparently forwarded.

After session creation, proxy routes are set per-session in `remoteProxyMap`.
All subsequent `GET/POST/DELETE /session/{id}/...` requests hit the WD proxy
handler first and are forwarded to `device.host`.

Session delete also clears the proxy entry (`removeProxyHandler`) and unblocks
the device on the hub.

---

## 8. Reverse Channels (Node → Hub Push)

[architect]

There is no persistent connection (no WebSocket, no SSE). The node makes
outbound HTTP calls to the hub in the following specific cases only:

| Trigger | Endpoint called | Source |
|---------|-----------------|--------|
| Periodic device list push | `POST {hub}/device-farm/api/register?type=add` | [`NodeDevices.ts:38`](../../src/device-managers/NodeDevices.ts#L38) |
| Device list removal | `POST {hub}/device-farm/api/register?type=remove` | [`NodeDevices.ts:38`](../../src/device-managers/NodeDevices.ts#L38) |
| Node registration | `POST {hub}/device-farm/api/dashboard/node` | [`api-client.ts:24`](../../src/api-client.ts#L24) |
| iOS WDA proxy info update | `POST {hub}/device-farm/api/updateDeviceInfo` | [`plugin.ts:511`](../../src/plugin.ts#L511) |
| Unexpected shutdown unblock | `POST {hub}/device-farm/api/unblock` | [`plugin.ts:126`](../../src/plugin.ts#L126) |

The hub never initiates a connection to a node except via the dashboard's log
streaming proxy and node-status forwarding in `grid.ts`.

---

## 9. Failure Modes

[architect]

### 9a. Node goes offline

- Hub's `NodeHealthMonitor` (30 s) calls `GET {node}/device-farm/api/status`.
  On failure: `setNodeOffline([nodeId])` + `removeDevicesForNodes([nodeId])`.
- Hub's `removeStaleDevices` cron independently removes device records whose
  host is unreachable.
- Existing sessions that were being proxied to that node will get connection
  errors on the next WD command — there is no active session transfer or
  failover logic.

### 9b. Hub restarts

- Node's polling loop (`setupCronUpdateDeviceList`) re-runs every 30 s.
- Each iteration calls `isDeviceFarmRunning(hub)` first; if the hub is not yet
  up, the iteration is skipped (`log.warn(...)`, devices cleared from node local
  DB — [`src/device-utils.ts:414-416`](../../src/device-utils.ts#L414)).
- Once the hub comes back, the next iteration re-registers the node and
  re-pushes the device list — effectively self-healing within one polling cycle.

**Unknown:** whether devices that were mid-session when the hub restarted are
properly cleaned up. The hub clears device `busy` state on its own startup
([`src/plugin.ts:311`](../../src/plugin.ts#L311): `unblockDeviceMatchingFilter({})`),
so stale busy flags are cleared, but any proxied WD commands in-flight at hub
restart will fail to the client.

### 9c. Network partition (node reachable, hub not)

- Node skips each `fn()` tick — no devices pushed.
- If partition heals before 30 s, next tick pushes the full list again.
- No queuing of missed updates.

### 9d. Startup: hub not running when node starts

- `isDeviceFarmRunning(hub)` returns false during `updateServer`.
- Node throws `Error("Unable to connect with hub ...")` and aborts startup
  ([`src/plugin.ts:256-258`](../../src/plugin.ts#L256)).
- Node must be started after hub is ready.

---

## 10. Authentication Flow

[engineer]

If `enableAuthentication: true` (hub-side config):

1. Node startup: `DevicePlugin.apiClient.authenticate()` —
   `GET {hub}/device-farm/api/dashboard/node/authenticate` with
   `Authorization: Basic {base64(accessKey:token)}`
   ([`src/api-client.ts:20-22`](../../src/api-client.ts#L20)).

2. When forwarding a session: `generateTokenForNode(device.nodeId, userId)`
   produces a short-lived JWT. Added as `df:jwt` to forwarded capabilities.
   Node-side `allocateDeviceForSession` verifies the JWT via `verifyJwt`
   ([`src/device-utils.ts:113-131`](../../src/device-utils.ts#L113)).

---

## 11. Known Unknowns

- **Unknown:** what happens to active WD sessions if a node drops mid-session
  and then re-registers with the same `NODE_ID`. The proxy entry stays in hub's
  `remoteProxyMap` (in-memory) until session delete; it will just start failing.
- **Unknown:** the `savedDevices` endpoint (`GET /device-farm/api/device`) reads
  Postgres while the live device map is LokiJS — how these stay in sync under
  heavy churn is unclear.
- **Unknown:** `server-config.json` at repo root — purpose not found in code
  references; may be a sample or unused.
