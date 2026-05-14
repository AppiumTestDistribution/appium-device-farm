**Lens:** security

# 13 — Security Posture

> Discovery snapshot: 2026-05-14. Describes upstream (appium-device-farm) behaviour
> as-is unless labelled **[Falx]**. Auth flow details are in
> [`06-auth-rbac.md`](./06-auth-rbac.md); this doc references that subsystem at a
> high level and focuses on the broader security surface.

---

## 1. Network Surface

### Ports

| Port (default) | Listener | Bound to | Notes |
|---|---|---|---|
| 31337 | Hub Appium server + plugin HTTP | `bindHostOrIp` (config) | Default from [`sample-config.json:3`](../../sample-config.json#L3) |
| 31338 | Node Appium server | `bindHostOrIp` (config) | Default from [`node-config.json:3`](../../node-config.json#L3) |
| 4723 | Remote/stand-alone server | `bindHostOrIp` (config) | Default Appium port; seen in [`remote-config.json:3`](../../remote-config.json#L3) |
| Dynamic | WDA local port, MJPEG, systemPort | Host-local | Allocated at session start from `portRange` config |

**Binding behaviour:** `bindHostOrIp` defaults to `ip.address()` (the machine's
non-loopback IP) per [`src/interfaces/IPluginArgs.ts:114`](../../src/interfaces/IPluginArgs.ts#L114).
This means the server listens on a LAN-reachable interface by default, not
`127.0.0.1`. The `sample-config.json` example overrides this to `"127.0.0.0"`
but that value is not the default.

**Risk:** Both hub and node ports are public-by-default on any interface returned
by `ip.address()`. No firewall rules are enforced at the application layer.

In Docker the container exposes port `4723` only
([`docker/Dockerfile:17-18`](../../docker/Dockerfile#L17)). Host-to-container
port mapping is left to the operator; no network isolation policy is provided.

---

## 2. AuthN/AuthZ Summary

Full detail: [`06-auth-rbac.md`](./06-auth-rbac.md).

Security-relevant facts:

### Authentication is opt-in

Authentication is **disabled by default** (`enableAuthentication` defaults to
`false` per [`src/interfaces/IPluginArgs.ts:81`](../../src/interfaces/IPluginArgs.ts#L81)).
When disabled, `authMiddleware` bypasses all token checks and injects the first
admin user as the request context
([`src/auth/middleware/auth.middleware.ts:40-51`](../../src/auth/middleware/auth.middleware.ts#L40)).

**Risk:** A deployment that omits `--plugin-device-farm-enable-authentication`
has no access control on any authenticated endpoint.

### Unauthenticated endpoints (no `authMiddleware`)

The following routes have no authentication guard regardless of configuration:

| Route | File | Notes |
|---|---|---|
| `POST /api/register` | [`src/app/routers/grid.ts:270`](../../src/app/routers/grid.ts#L270) | Registers a device; no auth |
| `POST /api/updateDeviceInfo` | [`src/app/routers/grid.ts:271`](../../src/app/routers/grid.ts#L271) | Updates device metadata |
| `POST /api/block` | [`src/app/routers/grid.ts:272`](../../src/app/routers/grid.ts#L272) | Blocks a device |
| `POST /api/unblock` | [`src/app/routers/grid.ts:273`](../../src/app/routers/grid.ts#L273) | Unblocks a device |
| `GET /api/queue/length` | [`src/app/routers/grid.ts:276`](../../src/app/routers/grid.ts#L276) | Session queue info |
| `GET /api/queue` | [`src/app/routers/grid.ts:277`](../../src/app/routers/grid.ts#L277) | Full session queue |
| `GET /api/node` | [`src/app/routers/grid.ts:280`](../../src/app/routers/grid.ts#L280) | Node list |
| `GET /api/status` | [`src/app/routers/grid.ts:287`](../../src/app/routers/grid.ts#L287) | Status + version |
| `POST /api/handleTestExecutionMetaData` | [`src/app/routers/grid.ts:297`](../../src/app/routers/grid.ts#L297) | Writes test metadata |
| `GET /api/dashboard/session` | [`src/dashboard/router.ts:745`](../../src/dashboard/router.ts#L745) | Lists all sessions |
| `GET /api/dashboard/build` | [`src/dashboard/router.ts:746`](../../src/dashboard/router.ts#L746) | Lists all builds |
| `POST /api/dashboard/cleanup` | [`src/dashboard/router.ts:747`](../../src/dashboard/router.ts#L747) | Deletes build data |
| `GET /api/dashboard/servers` | [`src/dashboard/router.ts:749`](../../src/dashboard/router.ts#L749) | Lists hub/nodes |
| `GET /api/dashboard/session/:id/liveVideo` | [`src/dashboard/router.ts:755`](../../src/dashboard/router.ts#L755) | Live MJPEG stream |
| `GET /api/dashboard/session/:id/device_logs` | [`src/dashboard/router.ts:756`](../../src/dashboard/router.ts#L756) | Device logs |
| `GET /api/dashboard/session/:id/session_log` | [`src/dashboard/router.ts:757`](../../src/dashboard/router.ts#L757) | Session command log |
| `GET /api/dashboard/server/:nodeId/appium_logs` | [`src/dashboard/router.ts:762`](../../src/dashboard/router.ts#L762) | Appium log stream |
| `POST /api/dashboard/uploadedAppInformation` | [`src/dashboard/router.ts:768`](../../src/dashboard/router.ts#L768) | Writes app metadata |
| `GET /api/dashboard/uploadedApps` | [`src/dashboard/router.ts:769`](../../src/dashboard/router.ts#L769) | Lists uploaded apps |
| `POST /api/dashboard/deleteUploadedApp` | [`src/dashboard/router.ts:770`](../../src/dashboard/router.ts#L770) | Deletes an app file |
| `POST /api/dashboard/upload` | [`src/dashboard/router.ts:771`](../../src/dashboard/router.ts#L771) | File upload |
| `POST /api/auth/login` | [`src/auth/routers/auth.router.ts:10`](../../src/auth/routers/auth.router.ts#L10) | Login (intentionally public) |

**Risk:** Even with `enableAuthentication=true`, all dashboard data endpoints,
the file upload endpoint, and destructive actions (cleanup, deleteUploadedApp,
block/unblock) are accessible without credentials.

### Default credentials

On first boot with no users in the database, `createInitialAdminIfNeeded()`
creates an admin user with:
- username: `process.env.DEFAULT_ADMIN_USERNAME || 'admin'`
- password: `process.env.DEFAULT_ADMIN_PASSWORD || 'admin'`

Source: [`src/auth/services/user.service.ts:306-307`](../../src/auth/services/user.service.ts#L306).

**Risk:** Default `admin`/`admin` credentials are created unless the operator
sets environment variables before first boot.

### Token lifetime and JWT secret

JWT expiry defaults to `24h` (`JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'`).
JWT secret defaults to a random `uuidv4()` generated at process start
(`JWT_SECRET = process.env.JWT_SECRET || uuidv4()`).

Source: [`src/auth/middleware/auth.middleware.ts:9-11`](../../src/auth/middleware/auth.middleware.ts#L9).

**Risk:** The ephemeral UUID secret means all tokens are invalidated on every
process restart. If `JWT_SECRET` is not set in the environment, horizontal
scaling (multiple process instances) is impossible because tokens signed by one
instance will not verify on another.

**Risk:** The raw JWT token value is logged to stdout at every auth check
(`console.log(token)` at
[`src/auth/middleware/auth.middleware.ts:61`](../../src/auth/middleware/auth.middleware.ts#L61)).

### Password policy

No minimum length, complexity, or breach-check policy is enforced. Passwords are
hashed with `bcrypt` at `SALT_ROUNDS=10`
([`src/auth/services/user.service.ts:10`](../../src/auth/services/user.service.ts#L10)),
which is adequate. No rate-limiting on `/api/auth/login` was found.

**Risk:** No brute-force protection on the login endpoint.

---

## 3. Input Handling

### Request body validation

No schema validation library (zod, joi, ajv, yup) was found in
[`package.json`](../../package.json) dependencies. Request bodies are consumed
directly from `req.body` without validation in dashboard routes:

- `cleanupBuilds` validates `retentionDays` type manually
  ([`src/dashboard/router.ts:92`](../../src/dashboard/router.ts#L92)) — the only
  example of any validation.
- `registerNode`, `deleteUploadedApp`, `addDeviceTags`, `handleDeviceNameUpdate`,
  `uploadAppInformation` trust `req.body` fields directly.

**Risk:** No systematic input validation. Malformed or oversized payloads will
either cause unhandled exceptions or be passed silently to Prisma.

### File upload

Multer handles multipart uploads at `POST /api/dashboard/upload`
([`src/dashboard/router.ts:57`](../../src/dashboard/router.ts#L57)).

Configuration:

```typescript
const storage = multer.diskStorage({ ... });
const upload = multer({ storage: storage });
```

No `limits` object is passed to multer (no `fileSize` cap, no `files` cap).
No `fileFilter` callback checks MIME type or extension before writing to disk.

Upload destination: `~/.cache/appium-device-farm/assets/`
([`src/dashboard/router.ts:39`](../../src/dashboard/router.ts#L39)).

File naming: most uploads get `fieldname-<Date.now()>.<ext>` where `ext` is
taken from `file.originalname` via `path.extname`
([`src/dashboard/router.ts:51`](../../src/dashboard/router.ts#L51)).

**Risk:** No file size limit — an attacker can exhaust disk space.

**Risk:** Extension is derived from `file.originalname` (user-controlled). A
malicious upload with a `.js` or `.sh` extension in the name will be stored
with that extension, although it is not executed by the server.

### Path traversal

`getAppiumLogs` resolves `logFile` via `path.resolve(DevicePlugin.serverArgs.logFile)`
([`src/dashboard/router.ts:444`](../../src/dashboard/router.ts#L444)) — this
uses a server-controlled config value, not user input.

Session IDs passed to `getDeviceLogs` and `getSessionLogs` are used in
`prisma.session.findFirst` queries before any filesystem access, which acts as
an implicit guard against fabricated session IDs reaching the filesystem. Paths
are then constructed with `path.join(config.sessionAssetsPath, existingSession.deviceLogs)`
([`src/dashboard/router.ts:307`](../../src/dashboard/router.ts#L307)). The
`existingSession.deviceLogs` value originates from the database, not directly
from user input — path traversal risk is low but not zero if that column can be
set adversarially.

**Unknown:** Whether `req.params.sessionId` is validated (e.g., UUID format
check) before being passed into `SESSION_MANAGER.getSession()`.

---

## 4. Secrets Handling

### Environment variables expected but not documented as required

| Variable | Used in | Effect if absent |
|---|---|---|
| `JWT_SECRET` | [`src/auth/middleware/auth.middleware.ts:9`](../../src/auth/middleware/auth.middleware.ts#L9) | Ephemeral UUID — tokens invalidated on restart |
| `JWT_EXPIRES_IN` | [`src/auth/middleware/auth.middleware.ts:11`](../../src/auth/middleware/auth.middleware.ts#L11) | Defaults to `24h` |
| `DEFAULT_ADMIN_USERNAME` | [`src/auth/services/user.service.ts:306`](../../src/auth/services/user.service.ts#L306) | Defaults to `admin` |
| `DEFAULT_ADMIN_PASSWORD` | [`src/auth/services/user.service.ts:307`](../../src/auth/services/user.service.ts#L307) | Defaults to `admin` |
| `CLOUD_USERNAME` / `CLOUD_KEY` | [`src/helpers.ts:185`](../../src/helpers.ts#L185), [`src/device-managers/cloud/CapabilityManager.ts:21-22`](../../src/device-managers/cloud/CapabilityManager.ts#L21) | Cloud auth unavailable |
| `DATABASE_URL` | [`prisma/schema.prisma:3`](../../prisma/schema.prisma#L3) | Prisma fails to connect |
| `GO_IOS` | [`src/goIOSTracker.ts:32`](../../src/goIOSTracker.ts#L32) | Falls back to cached binary |

### Config files committed to repo

The following JSON files are committed and contain no credentials — they use
placeholder IPs and public cloud endpoint URLs:

- [`sample-config.json`](../../sample-config.json) — placeholder IPs, no tokens.
- [`server-config.json`](../../server-config.json) — no credentials.
- [`node-config.json`](../../node-config.json) — hub URL with private IP (example only).
- [`remote-config.json`](../../remote-config.json) — loopback hub URL.
- [`serverConfig/bs-config.json`](../../serverConfig/bs-config.json) — BrowserStack cloud URL, no API key.
- [`serverConfig/sauce-config.json`](../../serverConfig/sauce-config.json) — Sauce cloud URL, no API key.
- [`serverConfig/lt-config.json`](../../serverConfig/lt-config.json) — LambdaTest cloud URL, no API key.
- [`serverConfig/hs-config.json`](../../serverConfig/hs-config.json) — Headspin URL with `v0//` path placeholder.

Cloud API keys for BrowserStack, Sauce, LambdaTest, pCloudy, and Headspin are
expected via `CLOUD_USERNAME` / `CLOUD_KEY` environment variables, not in these
files. The `.gitignore` excludes `.env`
([`.gitignore`](../../.gitignore#L10)).

### `accessKey` / `token` in plugin config

The Appium schema accepts `accessKey` and `token` as plugin config values
([`package.json:305-309`](../../package.json#L305)). These can be passed via
`--plugin-device-farm-access-key` CLI flags or placed in the JSON config file.
The `docker/README.md` shows passing them as environment variables mapped to CLI
args ([`docker/README.md:68-70`](../../docker/README.md#L68)). Config files
containing these values should not be committed; no `.gitignore` rule for
`server-config.json` is present.

**Risk:** If an operator adds `accessKey` / `token` to a committed config file
(e.g., `server-config.json`) that is not git-ignored, credentials would appear
in the repository.

---

## 5. Shell-Out Surface

### Identified `exec` / `execSync` / `spawn` call sites

| File | Line | Tool | Arguments controlled by |
|---|---|---|---|
| [`src/goIOSTracker.ts:107`](../../src/goIOSTracker.ts#L107) | `exec(startTunnelCmd, ...)` | `go-ios` binary | `GO_IOS` env var + `config.goIOSTunnelInfoPort` (server config) |
| [`src/goIOSTracker.ts:39`](../../src/goIOSTracker.ts#L39) | `new SubProcess(goIOSPath, ['listen'])` | `go-ios` binary | `GO_IOS` env var |
| [`src/app-utils/appUtils.ts:11`](../../src/app-utils/appUtils.ts#L11) | `spawn(bsdtar, [...])` | `bsdtar` | Static args — no user input in arguments |
| [`src/device-managers/AdbServer.ts:3`](../../src/device-managers/AdbServer.ts#L3) | `spawn('adb', [...])` | `adb` | Static args |
| [`src/device-managers/AdbServer.ts:17`](../../src/device-managers/AdbServer.ts#L17) | `execSync('adb kill-server')` | `adb` | Static string — no user input |
| [`src/dashboard/app-profiling/android-profiling.ts:148,154,160`](../../src/dashboard/app-profiling/android-profiling.ts#L148) | `exec(this.adb.path, args)` | `adb shell ...` | Device UDID from DB; ADB path from Appium config |
| [`src/device-managers/IOSDeviceManager.ts:531`](../../src/device-managers/IOSDeviceManager.ts#L531) | `` execAsync(`xcrun simctl uninstall ${device.udid} ${bundleId}`) `` | `xcrun simctl` | `device.udid` and `bundleId` from DB |
| [`src/chromeUtils.ts:104`](../../src/chromeUtils.ts#L104) | `exec('uname', ['-m'])` | `uname` | Static |

**Risk (medium):** The `xcrun simctl uninstall` call at
[`src/device-managers/IOSDeviceManager.ts:531`](../../src/device-managers/IOSDeviceManager.ts#L531)
interpolates `device.udid` and `bundleId` directly into a template string passed
to `execAsync`. If either value contains shell metacharacters and the execution
path uses a shell (depends on `child_process.exec` vs `execFile`), command
injection is possible. The values originate from the database; a compromised
insertion path could exploit this.

**Risk (low):** The `go-ios` tunnel command at
[`src/goIOSTracker.ts:104`](../../src/goIOSTracker.ts#L104) also uses template
string interpolation (`startTunnelCmd`), but the variable parts are the
`GO_IOS` env var path and `config.goIOSTunnelInfoPort` — both server-operator
controlled, not user-request-controlled.

**Note:** `teen_process`'s `exec` (used in `android-profiling.ts` and
`chromeUtils.ts`) passes arguments as an array to the underlying process and
does not invoke a shell, which reduces injection risk for those call sites.

---

## 6. Dependency Surface

### Direct production dependencies: 47 packages

Notable entries from [`package.json`](../../package.json):

| Package | Version pinned | Notes |
|---|---|---|
| `express` | `5.2.0` (exact) | Express 5 RC — production use; not semver-ranged |
| `multer` | `^1.4.5-lts.1` | Maintained LTS fork |
| `jsonwebtoken` | `^9.0.2` | Current |
| `bcrypt` | `^5.1.1` | Current |
| `axios` | `^1.6.7` | Current |
| `lokijs` | `^1.5.12` | Last release 2021; considered dormant |
| `ip` | `^1.1.8` | CVE-2024-29415 (SSRF via `ip.isPublic`) — used for `bindHostOrIp` default |
| `q` | `^1.5.1` | Deprecated promise library; last release 2019 |
| `rxjs` | `^6.6.7` | Version 6 is in LTS-only mode; v7 is current |
| `bluebird` | `^3.7.2` | Stable but largely superseded by native Promises |
| `mjpeg-proxy` | `^0.3.0` | Small unmaintained package |
| `node-persist` | `^3.1.3` | Filesystem key-value store |
| `listr` | `^0.14.3` | Last release 2019; archived |
| `emittery` | `0.13.1` (exact pin) | Pinned, not ranged |

**Risk:** `ip@1.1.8` has CVE-2024-29415 — `ip.isPublic()` misclassifies some
private-range addresses as public. The package is used at
[`src/interfaces/IPluginArgs.ts:1`](../../src/interfaces/IPluginArgs.ts#L1)
only for `ip.address()` (getting the local interface IP), not `ip.isPublic()`,
so this CVE's exploit path is not directly triggered. However the package should
be upgraded or replaced.

**Renovate:** [`renovate.json`](../../renovate.json) is configured with
`config:base` and auto-merges `patch`, `pin`, `digest`, `minor` — major version
bumps require manual review. This provides reasonable automated dependency
hygiene.

---

## 7. Plugin Trust Model

### Docker: runs as root

The [`docker/Dockerfile`](../../docker/Dockerfile) uses the base image
`appium/appium:v2.19.0-p4` and switches to `USER root` at line 6 to run
`apt-get` and `npm install -g`. The `CMD` then runs Appium as root (no `USER`
directive reverts to non-root before startup).

**Risk:** The plugin process runs as root inside the container. A container
escape or a command injection vulnerability in the shell-out surface would yield
root access on the container host.

### What a compromised node can see

An Appium node has access to:

- All ADB-connected Android devices (physical access equivalent).
- All iOS simulators via `simctl` (Xcode developer certificate trust).
- iOS real devices via `go-ios` tunnel (USB pairing trust).
- All session screenshots, videos, and device logs under
  `~/.cache/appium-device-farm/assets/`.
- The SQLite database at `~/.cache/appium-device-farm/device-farm-latest.db`.
- Any `CLOUD_KEY` / `CLOUD_USERNAME` in the process environment.

---

## 8. CORS / CSRF

### CORS

CORS is applied with `cors()` (no options — wildcard `*` origin) to all three
routers:

```typescript
router.use(cors());
apiRouter.use(cors());
staticFilesRouter.use(cors());
```

Source: [`src/app/index.ts:24-26`](../../src/app/index.ts#L24).

**Risk:** All origins are permitted. Any web page on any domain can make
credentialed cross-origin requests to the API. Combined with
`enableAuthentication=false` by default, this means any web page can read or
mutate data.

### CSRF

No CSRF protection library (`csurf`, `csrf-csrf`, or equivalent) was found in
`package.json` or `src/`. The API is JSON-based (REST), which reduces CSRF risk
for endpoints that require `Content-Type: application/json`, but endpoints
accepting form data or URL-encoded bodies remain vulnerable. The file upload
endpoint (`multipart/form-data`) has no CSRF token check.

**Risk:** File upload and data-mutation endpoints that accept non-JSON bodies
have no CSRF protection.

### Security headers

No `helmet` usage was found. Response headers like `X-Content-Type-Options`,
`X-Frame-Options`, `Strict-Transport-Security`, and `Content-Security-Policy`
are not set by the application (the appium log streaming endpoint does set
`X-Content-Type-Options: nosniff` manually, but that is isolated).
