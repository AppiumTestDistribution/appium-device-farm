**Lens:** engineer + security

# 06 — Auth & RBAC

> Discovery snapshot: 2026-05-14. Covers the authentication subsystem and RBAC
> layer introduced in migration `20250509132713_authentication`. All behaviour
> described is upstream-inherited unless labelled **[Falx]**.

---

## 1. Auth subsystem layout

```
src/auth/
├── controllers/
│   ├── auth.controller.ts          — login, me, change-password, activate/deactivate
│   ├── user.controller.ts          — CRUD for users (admin-gated)
│   ├── team.controller.ts          — team + membership + device assignment
│   ├── device-allocation.controller.ts — device↔team wiring, per-user access checks
│   └── api-tokens.controllers.ts   — token create / list / delete
├── middleware/
│   └── auth.middleware.ts          — JWT verify, Basic (accessKey) verify, role guards
├── routers/
│   ├── index.ts                    — mounts all sub-routers under /api
│   ├── auth.router.ts              — /auth routes
│   ├── users.router.ts             — /users routes
│   ├── team.router.ts              — /teams routes
│   ├── device-allocation.router.ts — /device-allocations routes
│   └── api-tokens.router.ts        — /api-tokens routes
└── services/
    ├── user.service.ts             — bcrypt hash/verify, JWT sign, user lifecycle
    ├── team.service.ts             — team CRUD, member/device join tables
    ├── device-allocation.service.ts— device access checks, user→team→device resolution
    └── api-token.service.ts        — UUID token generate, expiry check
```

All sub-routers are mounted in
[`src/app/index.ts:56`](../../src/app/index.ts#L56):

```ts
registerAuthenticationRoutes(apiRouter, pluginArgs);
```

which calls [`src/auth/routers/index.ts:10-14`](../../src/auth/routers/index.ts#L10):

```ts
router.use('/auth',              getAuthRoutes(pluginArgs));
router.use('/users',             getUsersRoutes(pluginArgs));
router.use('/teams',             getTeamsRoutes(pluginArgs));
router.use('/device-allocations',getDeviceAllocationsRoutes(pluginArgs));
router.use('/api-tokens',        getApiTokensRoutes(pluginArgs));
```

Effective prefix is `/api/<sub-router>` (e.g. `/api/auth/login`).

---

## 2. Identity model

Schema source: [`prisma/schema.prisma:96-179`](../../prisma/schema.prisma#L96)  
Migration DDL: [`prisma/migrations/20250509132713_authentication/migration.sql`](../../prisma/migrations/20250509132713_authentication/migration.sql)

### `User`

```prisma
model User {
  id           String       @id @default(uuid())
  firstname    String
  lastname     String
  username     String       @unique @map("username")
  password     String       @map("password")          // bcrypt hash
  role         String       @default("user") @map("role")  // "admin" | "user"
  isActive     Boolean      @default(true) @map("is_active")
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")
  accessKey    String       @unique @map("access_key") // user-scoped credential prefix
  teamMembers  TeamMember[] @relation("UserToTeamMember")
  apiTokens    ApiToken[]   @relation("UserToApiToken")
  nodes        Node[]       @relation("UserToNode")
}
```

Role is a free-form `String` column with two known values: `"admin"` and
`"user"`. There is no separate `Role` or `Permission` model — RBAC is
implemented entirely by string comparison in middleware and controllers.

**Risk:** Role is stored as an unconstrained string. A typo in a code path
could create a user with an unrecognised role that passes neither `"admin"` nor
`"user"` checks, leaving their access undefined.

### `Team` + join tables

```prisma
model Team {
  id          String       @id @default(uuid())
  name        String       @unique
  description String?
  teamMembers TeamMember[]
  teamDevices TeamDevice[]
}

model TeamMember {        // User ↔ Team M:M
  userId    String        @map("user_id")
  teamId    String        @map("team_id")
  @@unique([userId, teamId])
}

model TeamDevice {        // Device ↔ Team M:M
  deviceId  String        @map("device_id")
  teamId    String        @map("team_id")
  @@unique([deviceId, teamId])
}
```

Teams own both **users** (via `TeamMember`) and **devices** (via
`TeamDevice`). Sessions, apps, and builds are **not** scoped to teams in the
data model; only device access is team-gated.

### `ApiToken`

```prisma
model ApiToken {
  id        String    @id
  name      String
  userId    String    @map("user_id")
  token     String                    // raw UUID, stored in plaintext
  expiresAt DateTime? @map("expires_at")
  user      User      @relation(...)
  @@unique([userId, name])
}
```

**Risk:** The `token` value is stored **plaintext** in the database. A database
dump exposes all API tokens directly with no additional cracking step.

---

## 3. Login / session

[`src/auth/controllers/auth.controller.ts:39-54`](../../src/auth/controllers/auth.controller.ts#L39)

```ts
async login(req: Request, res: Response) {
  const { username, password } = req.body;
  const result = await userService.login(username, password);
  return res.status(200).json(result);
}
```

[`src/auth/services/user.service.ts:72-121`](../../src/auth/services/user.service.ts#L72)
shows the full flow:

1. Look up user by `username` (unique index).
2. `bcrypt.compare(password, user.password)` — SALT_ROUNDS = 10.
3. Check `user.isActive`.
4. Sign a JWT with payload `{ userId, username, role }` using `JWT_SECRET`,
   expiry `JWT_EXPIRES_IN` (default `"24h"`).
5. Return `{ token, user }` — **no cookie is set**.

**Session storage:** stateless. The JWT is the session. No server-side session
table exists.

**JWT secret bootstrapping**
([`src/auth/middleware/auth.middleware.ts:9`](../../src/auth/middleware/auth.middleware.ts#L9)):

```ts
const JWT_SECRET = process.env.JWT_SECRET || uuidv4();
```

**Risk:** If `JWT_SECRET` is not set in the environment, a random UUID is
generated **at process start**. All issued JWTs are invalidated on every
process restart, logging out all users silently.

**Default admin bootstrap**
([`src/auth/services/user.service.ts:296-320`](../../src/auth/services/user.service.ts#L296)):

```ts
const defaultAdminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';
```

**Risk:** If the environment variables are not set, the initial admin account
has credentials `admin / admin`, which are well-known defaults.

---

## 4. API tokens

[`src/auth/services/api-token.service.ts`](../../src/auth/services/api-token.service.ts)

Generation: `uuidv4()` — 122-bit random UUID v4, stored verbatim in the
`ApiToken.token` column. No hashing.

```ts
const token = uuidv4();
const apiToken = await prisma.apiToken.create({ data: { id: uuidv4(), name, userId, token, expiresAt } });
```

Lifecycle: optional `expiresAt` (`DateTime?`). Tokens with no expiry are
permanent. Ownership enforced: delete checks `{ id: tokenId, userId }`.

**Scopes / permissions:** none. There is no scope or permission field on
`ApiToken`. A token carries the same RBAC role as its owner (looked up via
`userId` at request time).

**Wire format** — API tokens are used via `Basic` auth
([`src/auth/middleware/auth.middleware.ts:67-69`](../../src/auth/middleware/auth.middleware.ts#L67)):

```ts
if (authType.toLowerCase() === 'basic') {
  const [username, password] = Buffer.from(token, 'base64').toString().split(':');
  user = await authenticateUserWithAccessKey(username, password);
}
```

`authenticateUserWithAccessKey` in
[`src/utils/auth.ts:35-47`](../../src/utils/auth.ts#L35):

```ts
export async function authenticateUserWithAccessKey(accessKey: string, secretToken: string) {
  const user = await userService.getUserByAccessKey(accessKey);
  // secretToken validated against ApiToken.token via apiTokenService.isTokenValid
}
```

So the Basic credential pair is `<User.accessKey>:<ApiToken.token>`.

`User.accessKey` is generated at user creation
([`src/utils/auth.ts:13-22`](../../src/utils/auth.ts#L13)):

```ts
export function generateAccessKey(prefix: string) {
  const accessKeyPrefix = `${prefix}`.substring(0, 12) + '_';
  const randomKey = generateApiKey({ method: 'string', length: 20 - accessKeyPrefix.length, pool: KEY_POOL });
  return `${accessKeyPrefix}${randomKey}`;
}
```

Format: `<first-12-chars-of-username>_<random-alphanum>` (total ~20 chars).

**Capability-based auth (Appium sessions)**
([`src/utils/auth.ts:49-63`](../../src/utils/auth.ts#L49)):

Programmatic Appium clients pass credentials in session capabilities:

| Capability     | Meaning                            |
|----------------|------------------------------------|
| `df:jwt`       | A UI-issued JWT passed directly    |
| `df:accesskey` | `User.accessKey`                   |
| `df:token`     | `ApiToken.token`                   |

After session creation, `sanitizeSessionCapabilities` strips these keys from
the session response to avoid leaking credentials in Appium output.

**Risk:** `df:accesskey` and `df:token` travel inside Appium capability
payloads. Depending on Appium log levels, they may appear in server-side logs
in cleartext.

---

## 5. Teams

[`src/auth/services/team.service.ts`](../../src/auth/services/team.service.ts)

A `Team` groups users and devices. What a team owns:

| Resource  | How  |
|-----------|------|
| **Users** | `TeamMember` join row (`userId`, `teamId`) |
| **Devices** | `TeamDevice` join row (`deviceId`, `teamId`) |
| Sessions  | Not tracked at team level |
| Apps      | Not tracked at team level |

Key operations:

- [`addUserToTeam`](../../src/auth/services/team.service.ts#L149) — bulk add; checks for duplicate memberships.
- [`removeUserFromTeam`](../../src/auth/services/team.service.ts#L220) — bulk remove via `deleteMany`.
- [`addDeviceToTeam`](../../src/auth/services/team.service.ts#L242) — links a `Device.id` to a team.
- [`getTeamsForUser`](../../src/auth/services/team.service.ts#L332) — returns teams a user belongs to, including their `teamDevices`.

`TeamController.addUserToTeam`
([`src/auth/controllers/team.controller.ts:102-118`](../../src/auth/controllers/team.controller.ts#L102))
takes `{ add: string[], remove: string[] }` in a single request body — it
removes then re-adds, implementing an atomic replace-membership pattern.

Routes summary (all require `authMiddleware`):

| Method | Path | Guard |
|--------|------|-------|
| `POST /teams` | create team | `adminOnly` |
| `GET /teams` | list all | authenticated |
| `GET /teams/:id` | get team | authenticated |
| `PUT /teams/:id` | update | `adminOnly` |
| `DELETE /teams/:id` | delete | `adminOnly` |
| `POST /teams/:id/members` | set members | `adminOnly` |
| `GET /teams/user/:userId` | teams for user | authenticated |
| `POST /teams/:id/devices` | set devices | `adminOnly` |

---

## 6. Device allocation

[`src/auth/controllers/device-allocation.controller.ts`](../../src/auth/controllers/device-allocation.controller.ts)  
[`src/auth/services/device-allocation.service.ts`](../../src/auth/services/device-allocation.service.ts)

The allocation layer enforces **which users can access which physical
devices** at session-request time.

`userHasAccessToDevice(userId, deviceUdid)`
([`device-allocation.service.ts:164`](../../src/auth/services/device-allocation.service.ts#L164)):

1. If `user.role === 'admin'` → unconditionally returns `true`.
2. Otherwise: look up user's `TeamMember` rows → collect `teamId`s → query
   `TeamDevice` for any row matching `{ deviceId, teamId: { in: teamIds } }`.
3. Returns `allocations.length > 0`.

`getAccessibleDevicesForUser(userId)`
([`device-allocation.service.ts:212`](../../src/auth/services/device-allocation.service.ts#L212)):

- Admin: returns all devices from `ATDRepository.DeviceModel` (in-memory LokiJS).
- Non-admin: resolves team memberships → `TeamDevice.deviceId` list → filters
  LokiJS by `{ id: { $in: deviceIds } }`.

This is also enforced at Appium session creation in
[`src/device-utils.ts:113-131`](../../src/device-utils.ts#L113):

```ts
if (pluginArgs.enableAuthentication) {
  if (!DevicePlugin.IS_HUB) {
    await verifyJwt(firstMatch['df:jwt']);        // node: JWT only
  } else {
    const user = await getUserFromCapabilities(firstMatch);
    if (user.role !== 'admin') {
      const devices = await getTeamDevicesForUser(user.id);
      if (!devices.length) throw new Error(`User … does not have access to any devices`);
      filters['userId'] = user.id;               // scopes device query
    }
  }
}
```

Dashboard routes exposed by `device-allocation.router.ts`:

| Method | Path | Guard |
|--------|------|-------|
| `GET /device-allocations/all` | all devices | `adminOnly` |
| `GET /device-allocations/team/:teamId` | devices for team | authenticated |

**Unknown:** `getDeviceAllocationsForTeam` and `getAllDeviceAllocations` in the
controller currently return hard-coded `[]`
([`device-allocation.controller.ts:61,79`](../../src/auth/controllers/device-allocation.controller.ts#L61)).
The service implementations exist but are commented out. The UI may be calling
dead endpoints.

---

## 7. Middleware

[`src/auth/middleware/auth.middleware.ts`](../../src/auth/middleware/auth.middleware.ts)

### `authMiddleware(pluginArgs)`

Behaviour varies on the `pluginArgs.enableAuthentication` flag
([`IPluginArgs.ts:81`](../../src/interfaces/IPluginArgs.ts#L81)):

**When `enableAuthentication` is `false`** (default if not configured):

```ts
const user = await userService.getDefaultUser();  // first admin in DB
(req as AuthenticatedRequest).user = { userId, username, role };
return next();
```

All routes run as the default admin — **no token required**. This is the
upstream open-by-default posture.

**When `enableAuthentication` is `true`:**

```ts
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'No authorization token provided' });
// ...
if (authType.toLowerCase() === 'basic') {
  user = await authenticateUserWithAccessKey(username, password);
} else {
  user = await getUserFromToken(token);  // JWT verify
}
if (!user.isActive) return res.status(401).json({ message: 'User is not active' });
```

**Risk:** `console.log(token)` on
[line 61](../../src/auth/middleware/auth.middleware.ts#L61) prints the raw
token (JWT or Basic base64) to stdout on every authenticated request. In
production this leaks credentials to whatever captures stdout/stderr.

### `authorizeRoles(roles: string[])`

Checks `req.user.role` against an allowlist of strings. Used generically but
in practice only `"admin"` appears in the allowlist.

### `adminOnly`

Shorthand guard: `req.user.role !== 'admin'` → 403. Applied inline in routers.

---

## 8. Route protection summary

Routes without `authMiddleware` are accessible without any token regardless of
`enableAuthentication`:

| Route | File | Notes |
|-------|------|-------|
| `POST /api/auth/login` | [`auth.router.ts:10`](../../src/auth/routers/auth.router.ts#L10) | intentional — login endpoint |
| `GET /api/cliArgs` | [`app/index.ts:35`](../../src/app/index.ts#L35) | leaks plugin CLI args including `accessKey`, `token` |
| `POST /api/register` (grid) | [`grid.ts:271`](../../src/app/routers/grid.ts#L271) | node self-registration |
| `POST /api/updateDeviceInfo` | [`grid.ts:272`](../../src/app/routers/grid.ts#L272) | device heartbeat |
| `POST /api/block` / `unblock` | [`grid.ts:273-274`](../../src/app/routers/grid.ts#L273) | device lock/unlock |
| `GET /api/queue/length` | [`grid.ts:276`](../../src/app/routers/grid.ts#L276) | session queue depth |
| `GET /api/queue` | [`grid.ts:277`](../../src/app/routers/grid.ts#L277) | queued session list |
| `GET /api/node` | [`grid.ts:280`](../../src/app/routers/grid.ts#L280) | node list |
| `GET /api/node/status` | [`grid.ts:281`](../../src/app/routers/grid.ts#L281) | node ADB status |
| `GET /api/status` | [`grid.ts:287`](../../src/app/routers/grid.ts#L287) | health/version |
| `GET /api/session` | [`dashboard/router.ts:745`](../../src/dashboard/router.ts#L745) | all sessions |
| `GET /api/build` | [`dashboard/router.ts:746`](../../src/dashboard/router.ts#L746) | build list |
| `POST /api/cleanup` | [`dashboard/router.ts:747`](../../src/dashboard/router.ts#L747) | cleanup builds |
| `GET /api/servers` | [`dashboard/router.ts:750`](../../src/dashboard/router.ts#L750) | server list |
| `GET /api/session/:id/liveVideo` | [`dashboard/router.ts:755`](../../src/dashboard/router.ts#L755) | video stream |
| `GET /api/session/:id/device_logs` | [`dashboard/router.ts:756`](../../src/dashboard/router.ts#L756) | device logs |
| `GET /api/session/:id/session_log` | [`dashboard/router.ts:757`](../../src/dashboard/router.ts#L757) | session logs |
| `POST /api/upload` | [`dashboard/router.ts:771`](../../src/dashboard/router.ts#L771) | app upload |
| `GET /api/uploadedApps` | [`dashboard/router.ts:769`](../../src/dashboard/router.ts#L769) | app list |

**Risk:** `/api/cliArgs` is wide open and returns the full parsed plugin
arguments object, which includes `accessKey` and `token` fields
([`IPluginArgs.ts:82-83`](../../src/interfaces/IPluginArgs.ts#L82)) used for
node-to-hub authentication. An unauthenticated caller can retrieve these from a
running hub.

---

## 9. Password & token storage

| Credential | Algorithm | Storage |
|------------|-----------|---------|
| `User.password` | bcrypt, cost factor 10 [`user.service.ts:10`](../../src/auth/services/user.service.ts#L10) | PostgreSQL `password` column |
| `User.accessKey` | `generateApiKey` (alphanumeric random) | PostgreSQL `access_key` column, **plaintext** |
| `ApiToken.token` | `uuidv4()` | PostgreSQL `token` column, **plaintext** |
| JWT secret | `uuidv4()` fallback if env unset | in-process memory only (not persisted) |

**Risk:** `accessKey` and API token values are stored plaintext. Treat the
`ApiToken` and `User` tables as high-sensitivity; a read-only DB compromise
yields all active API tokens and access keys immediately.

---

## 10. Unknowns

- **Unknown:** No audit log for login attempts, failed auth, token creation/revocation, or role changes.
- **Unknown:** No rate limiting on `/api/auth/login` — susceptible to credential stuffing.
- **Unknown:** `User.nodes` relation links users to `Node` records; it is unclear whether node ownership enforces any access control downstream.
- **Unknown:** The `enableAuthentication` flag default. `IPluginArgs` types it as `boolean | undefined`; if omitted from the config file, the middleware treats it as `false` (open). Need to confirm what the Docker/Ansible deployment sets.
- **Unknown:** Token revocation — there is no `/api/auth/logout` endpoint. Issued JWTs remain valid for 24 h after logout. API tokens must be explicitly deleted to be revoked.
