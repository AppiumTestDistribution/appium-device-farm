# Slice 1 — Falx baseline

## Goal

Stand up a Falx-branded, Postgres-backed, MinIO-backed plugin build that runs
hub + node locally via `docker-compose.dev.yml`, served from `falx-ui/` instead
of upstream `dashboard-frontend/`.

## Why this matters

Slice 1 is the foundation every later slice depends on. Today the plugin runs
on SQLite (single-writer bottleneck per
[14-performance § 2](../discovery/14-performance.md)), stores assets on the
local filesystem ([08-session-lifecycle § 7](../discovery/08-session-lifecycle.md)),
serves the unmodified upstream UI ([10-devops § 1](../discovery/10-devops.md):
`buildAndCopyWeb.sh` targets `dashboard-frontend/`), and the Docker images
install `appium-device-farm` from npm rather than this fork
([10-devops § 2](../discovery/10-devops.md)). None of that is acceptable for
even a single on-prem customer. Until Slice 1 lands, Falx is just upstream with
documentation around it.

## Scope

### A. Postgres swap

- Change the Prisma datasource provider from `sqlite` to `postgresql` in
  [`prisma/schema.prisma:2`](../../prisma/schema.prisma#L2).
- Delete the existing SQLite-only migration tree (`prisma/migrations/*`) and
  regenerate a single squashed initial migration against Postgres. The current
  migrations rely on `PRAGMA foreign_keys=OFF` table-redefine patterns (see
  [`20240311161212_naming_convention`](../../prisma/migrations/20240311161212_naming_convention/migration.sql),
  [`20240503172755_file_size`](../../prisma/migrations/20240503172755_file_size/migration.sql),
  [`20240509132829_bundle_id`](../../prisma/migrations/20240509132829_bundle_id/migration.sql)) —
  these will not translate.
- Cite the auth migration ([`20250509132713_authentication`](../../prisma/migrations/20250509132713_authentication/migration.sql))
  for verification that all 7 auth models end up in the new schema with the
  same FKs, unique constraints, and cascade rules.
- Update [`src/prisma.ts:4`](../../src/prisma.ts#L4) to read
  `process.env.DATABASE_URL` directly. Drop the inline
  `file:${config.databasePath}` construction and the `?connection_limit=1`
  query param (SQLite-only; Postgres uses Prisma's default pool).
- Keep [`src/config.ts:45`](../../src/config.ts#L45) `databasePath` declaration
  for any tooling that still references it, but `prisma.ts` no longer uses it.
- Note that LokiJS ([data-service/db.ts](../../src/data-service/db.ts))
  coexists in Slice 1 — Q2 in [16-open-questions § Group 1](../discovery/16-open-questions.md)
  defers the LokiJS replacement.
- Update `postinstall` / `run-db-migration` scripts
  ([package.json:7-48](../../package.json#L7)) to run `prisma migrate deploy`
  against Postgres instead of the SQLite path-based bootstrap.

### B. MinIO swap (asset storage)

Current asset paths (filesystem):
- App uploads at `~/.cache/appium-device-farm/assets/*.{apk,ipa,aab,app,zip}`
  ([13-security § 3](../discovery/13-security.md),
  [dashboard/router.ts:39](../../src/dashboard/router.ts#L39),
  [dashboard/router.ts:57](../../src/dashboard/router.ts#L57)).
- WDA bundles at `assets/wda-resign.ipa` and `assets/wda-resign_tvos.ipa`
  ([01-product](../discovery/01-product.md),
  [dashboard/router.ts:685](../../src/dashboard/router.ts#L685)).
- Per-session artefacts at
  `assets/sessions/<sessionId>/{screenshots,video,device_log.json,profiling.json}`
  ([08-session-lifecycle § 7](../discovery/08-session-lifecycle.md),
  [dashboard/asset-manager.ts](../../src/dashboard/asset-manager.ts)).

Changes:

- Target bucket layout (single `falx-assets` bucket, prefixes match current
  paths):
  - `apps/<filename>` for uploads.
  - `wda/wda-resign.ipa`, `wda/wda-resign_tvos.ipa`.
  - `sessions/<sessionId>/screenshots/<uuid>.jpg`.
  - `sessions/<sessionId>/video/<sessionId>.mp4`.
  - `sessions/<sessionId>/device_log.json`.
  - `sessions/<sessionId>/profiling.json`.
- Add `@aws-sdk/client-s3` as a dependency (S3-compatible; works against
  MinIO). Document the new dep in
  `docs/decisions/0001-minio-and-s3-sdk.md` per CLAUDE.md ("New top-level
  dependencies require an ADR").
- New module `src/falx/storage/uploader.ts` exposing
  `saveAsset(bucketKey, buffer)`, `readAsset(bucketKey)`, `signUrl(bucketKey)`.
  Behind this interface, switch implementations by env var:
  `FALX_STORAGE_BACKEND=minio` → S3 client pointed at MinIO endpoint;
  `FALX_STORAGE_BACKEND=filesystem` → current behaviour (dev fallback).
- Rewrite the four writers in
  [`src/dashboard/asset-manager.ts`](../../src/dashboard/asset-manager.ts)
  (`saveScreenShot`, `saveVideoRecording`, `saveDeviceLogs`,
  `saveProflingLog`) to call the uploader interface.
- Rewrite the multer destination in
  [`dashboard/router.ts:39`](../../src/dashboard/router.ts#L39) to use
  `multer-s3` or stream the upload through the uploader interface to MinIO.
  Add a 500 MB `fileSize` limit per Q14 in
  [16-open-questions § Group 2](../discovery/16-open-questions.md).
- Update read paths
  ([dashboard/router.ts:307-311](../../src/dashboard/router.ts#L307),
  [357-361](../../src/dashboard/router.ts#L357)) to resolve via the uploader
  (presigned URLs or stream-through).
- `AppInformation.path` (Prisma) now stores the S3 key, not a filesystem path.
- **Out-of-scope for Slice 1:** WDA fan-out behaviour
  ([dashboard/router.ts:685](../../src/dashboard/router.ts#L685)) — keep the
  current hub-pushes-to-each-node logic; Q12 (pull-from-MinIO) is deferred.

### C. `falx-ui/` copy + serve

- One-time `cp -R dashboard-frontend falx-ui` at repo root. Tracked in git
  (it's now ours, not upstream).
- Update `falx-ui/package.json` `name` to `falx-ui`; `homepage` stays
  `/device-farm` (the plugin's serve mount point —
  [02-architecture § Inbound surface](../discovery/02-architecture.md)).
- Delete dead files identified in
  [09-ui-inventory § 3, § 6](../discovery/09-ui-inventory.md):
  - `falx-ui/src/components/header/NewHeader.tsx`
  - `falx-ui/src/components/navbar/Navbar.tsx`
  - `falx-ui/src/components/sidebar/Sidebar.tsx`
  - `falx-ui/src/components/auth/UserMenu.tsx`
  - `falx-ui/src/router/RootRouter.tsx`
  - `falx-ui/src/DataContext.tsx`
  - `falx-ui/src/pages/Auth/AdminDashboard.tsx` (calls non-existent
    `/device-farm/admin/*` backend routes per
    [09-ui-inventory § 1](../discovery/09-ui-inventory.md))
  - Remove the commented `/servers/:nodeId/terminal` route in
    `falx-ui/src/App.tsx`.
  - Remove `axios` from `falx-ui/package.json` (half-removed leftover per
    [09-ui-inventory § 1](../discovery/09-ui-inventory.md)).
  - Remove `@xterm/*` and `xterm` deps (unused after terminal route removal).
- Rewrite `buildAndCopyWeb.sh` to target `falx-ui/` instead of
  `dashboard-frontend/`. The script ([buildAndCopyWeb.sh](../../buildAndCopyWeb.sh))
  currently `cd`s into `dashboard-frontend/` and runs `npm install --force &&
  npm run build`; change the directory and the install command (no `--force`
  if `falx-ui/package-lock.json` is committed).
- Leave `dashboard-frontend/` completely untouched per
  [CLAUDE.md] hard rule.
- CI: `buildWithSubmodule` jobs in
  [`.github/workflows/test.yml`](../../.github/workflows/test.yml) and
  [`.github/workflows/prtest.yml`](../../.github/workflows/prtest.yml) should
  continue to pass after the script change. If the previous `npm install
  --force` in `dashboard-frontend/` was load-bearing for any test, document it
  and replicate in `falx-ui/`.

### D. Visual rebrand (strings only)

Per Q6 in [16-open-questions § Group 1](../discovery/16-open-questions.md),
strings only — no color changes.

- `falx-ui/src/contexts/ConfigContext.tsx:19` — change
  `document.title = 'Appium Device Farm'` to `'Falx'`.
- `falx-ui/index.html` — set `<title>Falx</title>` so the title is correct
  before JS loads.
- `falx-ui/src/components/header/Header.tsx:116` — remove or replace the
  hardcoded `AppiumTestDistribution/appium-device-farm` GitHub link.
- `falx-ui/src/components/header/Header.tsx` — title text "Device Farm"
  (search the file) becomes "Falx".
- `falx-ui/src/components/auth/LoginForm.tsx` — strip or rewrite the
  marketing "screens" carousel (~half the 509 lines per
  [09-ui-inventory § 3](../discovery/09-ui-inventory.md)). Keep username/password
  form, replace branding text.
- `README.md` and `CHANGELOG.md` — replace the few mentions of "Appium Device
  Farm" that show up in shipped UI / install output with "Falx". Do not
  rewrite the full README — that's a later docs slice.
- Do **not** touch `package.json` `name` (`appium-device-farm`),
  `pluginName: "device-farm"` ([package.json:212](../../package.json#L212)),
  plugin slug, or any internal class names. Per [CLAUDE.md], the slug stays.

### E. `docker-compose.dev.yml`

New file at repo root: `docker-compose.dev.yml`. Services:

| Service | Image | Purpose |
|---|---|---|
| `postgres` | `postgres:16-alpine` (pinned) | Falx DB |
| `minio` | `minio/minio:RELEASE.2024-10-02T17-50-41Z` (pinned, or current) | S3-compatible asset store |
| `minio-init` | `minio/mc:RELEASE.2024-10-02T08-27-28Z` | One-shot `mc mb local/falx-assets` bucket bootstrap |
| `hub` | Built from `docker/Dockerfile.falx` | Plugin in hub mode |
| `node` | Built from `docker/Dockerfile.falx` | Plugin in node mode (points at `hub:31337`) |
| `android-emulator` | `docker/Dockerfile.local`-derived (profile `android` only, optional per Q18) | Android API 34 emulator |

Pinned env vars inline in the compose:

```
POSTGRES_USER=falx
POSTGRES_PASSWORD=falx
POSTGRES_DB=falx
DATABASE_URL=postgresql://falx:falx@postgres:5432/falx
MINIO_ROOT_USER=falxdev
MINIO_ROOT_PASSWORD=falxdevsecret
FALX_STORAGE_BACKEND=minio
FALX_MINIO_ENDPOINT=http://minio:9000
FALX_MINIO_ACCESS_KEY=falxdev
FALX_MINIO_SECRET_KEY=falxdevsecret
FALX_MINIO_BUCKET=falx-assets
JWT_SECRET=dev-jwt-secret-change-me
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
```

Dev defaults per Q9 in [16-open-questions § Group 1](../discovery/16-open-questions.md).
Document prominently in compose comments that prod must override.

`docker/Dockerfile.falx` (per Q10):

- Base: `appium/appium:v2.19.0-p4` (matches upstream Dockerfile).
- Builder stage: copy repo, `npm install`, `npm run build` (rewritten
  `buildAndCopyWeb.sh` now bundles `falx-ui/`).
- Runtime stage: copy `lib/`, install via `appium plugin install --source=local
  /opt/falx`.
- Add `HEALTHCHECK` directive that curls
  `http://localhost:${APPIUM_PORT}/device-farm/api/status` (W21 partial fix —
  shallow but better than nothing).
- Add `USER appium` before `CMD` (W12 fix).

### F. Hub-node verification on dev host

`docker compose up` (or `docker compose --profile android up` for emulator)
must result in:

- Postgres accepts connections; Prisma migration runs cleanly; `User` row
  exists for `admin`.
- MinIO is up; `falx-assets` bucket is created.
- Hub container starts; `/device-farm/api/status` returns
  `{"status":"ok","version":...}`.
- Node container starts; calls `GET /device-farm/api/status` against the hub,
  registers via `POST /device-farm/api/dashboard/node` per
  [03-hub-node-protocol § 4](../discovery/03-hub-node-protocol.md), and shows
  up in `GET /device-farm/api/dashboard/servers`.
- Optionally with `--profile android`, the emulator container's emulator
  shows up via the node's ADB push to the hub.
- Browser loads `http://localhost:31337/device-farm/` — title says "Falx",
  no "Appium Device Farm" string visible on screen.

### G. Slice 1 cheap security wins (Q7 (b))

Five-line changes from
[15-strengths-weaknesses-risks § W1-W3, W11](../discovery/15-strengths-weaknesses-risks.md):

- W1: Make `JWT_SECRET` env required. Fail-fast in `updateServer` if absent.
  Replace `process.env.JWT_SECRET || uuidv4()` in
  [`auth.middleware.ts:9`](../../src/auth/middleware/auth.middleware.ts#L9).
- W2: Delete `console.log(token)` at
  [`auth.middleware.ts:61`](../../src/auth/middleware/auth.middleware.ts#L61).
- W3: Require `DEFAULT_ADMIN_PASSWORD` env on first boot; fail fast if absent.
  Compose provides one in dev.
- W11: Add `adminOnly` middleware to
  [`/api/cliArgs`](../../src/app/index.ts#L35) (or redact sensitive keys
  before serialising).

These are the only auth changes in Slice 1; the larger hardening (W4-W7) is
Slice 2.

## Out of scope

Explicitly excluded:

- Security hardening sweep beyond G — wildcard CORS, helmet, CSRF, 18
  unguarded endpoints, plaintext API tokens, flipping
  `enableAuthentication` default. See Slice 2.
- Observability rework — npmlog stays; no Pino, no metrics, no tracing, no
  request IDs (per Q4 in
  [16-open-questions § Group 1](../discovery/16-open-questions.md)).
- UI restyle — strings only; no color theme, no shadcn migration, no MUI
  removal. Visual refresh has its own slice.
- MinIO production sizing — defaults are fine for dev; production capacity
  planning happens at deploy time.
- Audit logging — see deferred Q29.
- Dead-route backend cleanup beyond trivial — `/device-farm/admin/*` is
  already unreachable; we delete the UI page (D) and leave the (non-existent)
  backend alone.
- LokiJS replacement — see Q2.
- WDA fan-out refactor — see Q12.
- `AdbServer.ts` deletion (W16) — leave for the dead-code cleanup slice.
- tvOS casing bug (W17) — leave for the cleanup slice.
- Cron jitter (W19) — leave for the perf-hygiene slice.
- Hub HA design — see Q21.
- Webpack obfuscator changes (W23 / Q28) — leave alone.

## Done when

- `docker compose -f docker-compose.dev.yml up` runs Postgres + MinIO + hub +
  node from a clean checkout with no extra setup.
- `prisma migrate deploy` completes against Postgres on hub startup; the
  initial admin user exists.
- File upload via `POST /device-farm/api/dashboard/upload` lands in MinIO,
  visible via `mc ls local/falx-assets/apps/`.
- A session run against the dev hub produces screenshots / video in MinIO at
  `sessions/<id>/...`.
- Browser at `http://localhost:31337/device-farm/` shows "Falx" in the title,
  no "Appium Device Farm" branding visible.
- `falx-ui/` directory exists; `buildAndCopyWeb.sh` builds it (not
  `dashboard-frontend/`); `dashboard-frontend/` is unchanged from upstream
  (verifiable with `git diff upstream/main -- dashboard-frontend/` returning
  empty).
- Hub `GET /device-farm/api/dashboard/servers` lists both hub and node as
  online.
- All seven dead components listed in D are absent from `falx-ui/`.
- `JWT_SECRET`, `DEFAULT_ADMIN_PASSWORD` required at startup; `console.log(token)`
  is removed; `/api/cliArgs` requires admin.
- CI green: existing test suite passes against the new
  `Dockerfile.falx` + Postgres + MinIO topology. Test-only paths still use
  the SQLite fallback or migrate over (one-shot decision — see Risk callouts).
- `docs/discovery/05-data-model.md`, `10-devops.md`, `13-security.md`, and
  `14-performance.md` updated to reflect the new state (per CLAUDE.md
  "After Discovery refresh" rule).
- Slice 1 row in `docs/SLICES.md` ticked `[x]`.

## Estimated effort

Solo dev, mostly mechanical:

- A (Postgres swap): 4-6h. Most of the cost is regenerating the migration
  cleanly and verifying all 13 models from `schema.prisma` round-trip
  correctly. Test suite breakage will absorb a chunk.
- B (MinIO swap): 6-8h. Four asset writers + multer destination + read-path
  rewrites + the uploader interface module + filesystem fallback.
- C (`falx-ui/` copy + dead-code removal): 1-2h. Mostly `cp -R` and `rm`.
- D (visual rebrand strings only): 1h.
- E (`docker-compose.dev.yml` + `Dockerfile.falx`): 3-4h. Includes pinning
  versions and verifying healthchecks.
- F (hub-node verification): 1-2h once everything else works.
- G (cheap security wins): 1h.

**Total: 17-24h** (roughly 2-3 focused days). Easily 30-40h if Prisma
migration generation surprises us, or if test fixtures need a Postgres-aware
rewrite.

## Open decisions

Lifted from
[16-open-questions § Group 1](../discovery/16-open-questions.md). Each must be
decided before the corresponding scope item can be executed:

- **Q1.** SQLite → Postgres data migration: pure cutover (drop existing data)
  or import existing rows? Recommendation: pure cutover.
- **Q2.** LokiJS in-memory grid state in Slice 1: keep, replace, or hybrid?
  Recommendation: keep.
- **Q3.** MinIO bucket layout: single `falx-assets` bucket with prefixes, or
  multiple buckets? Recommendation: single bucket.
- **Q4.** Logging stance for Slice 1: defer Pino, or swap now?
  Recommendation: defer.
- **Q5.** `falx-ui/` initial sync strategy: one-time copy and diverge,
  sync-able layer, or per-file annotation? Recommendation: one-time copy.
- **Q6.** Branding scope in Slice 1: strings only, strings + tokens, or full
  theme? Recommendation: strings only.
- **Q7.** Security holes: which to fix in Slice 1? Recommendation: W1-W3 +
  W11 only; defer the rest.
- **Q8.** Dead UI components: delete during the `falx-ui/` copy, or later?
  Recommendation: delete during copy.
- **Q9.** Postgres credentials in dev compose: hardcoded defaults or required
  env vars? Recommendation: hardcoded with a prominent comment.
- **Q10.** Docker base image strategy: fork the upstream Dockerfile, or new
  `Dockerfile.falx`? Recommendation: new `Dockerfile.falx`.

## Risk callouts

- **Prisma migration translation.** Regenerating the migrations against
  Postgres ([data-model § 4](../discovery/05-data-model.md)) is the most
  uncertain piece. The auth migration alone defines 7 models with FK cascades.
  If the regenerated DDL doesn't match the runtime SELECTs, the auth subsystem
  silently breaks. Mitigation: spot-check each of the 13 Prisma models against
  the regenerated SQL; run the unit test pack (which exercises Prisma) against
  Postgres before merging.
- **Test fixtures.** `test/unit/cleanup-builds.spec.ts` and
  `test/integration/cleanup-builds.spec.ts` use the real `prisma` singleton
  ([testing § 8](../discovery/11-testing.md)). They expect a SQLite path. Either
  point them at a test Postgres (slow CI), or keep a SQLite fallback in
  `src/prisma.ts` for `process.env.NODE_ENV === 'test'`. Pick one explicitly.
- **`buildAndCopyWeb.sh` change breaks upstream CI jobs.** `buildWithSubmodule`
  in [test.yml](../../.github/workflows/test.yml) currently builds
  `dashboard-frontend/`. Repointing to `falx-ui/` may fail until
  `falx-ui/package.json` is correct. Mitigation: copy `dashboard-frontend/`'s
  `package-lock.json` over, test the build script locally before opening the
  PR.
- **MinIO presigned URL expiry.** Per Q13, the dashboard reads asset paths
  from `AppInformation.path` (now an S3 key). Building presigned URLs at read
  time means responses include short-lived URLs; UI must handle 403 on expiry.
  Mitigation: 1 h URL expiry default; UI refreshes the URL on stream-error.
- **`appium-device-farm` plugin registration vs. fork install.** The Docker
  image installs locally via `appium plugin install --source=local /opt/falx`
  ([install.sh](../../install.sh) is the precedent). If the build artefact
  doesn't expose a valid `package.json appium.mainClass`, Appium refuses to
  load the plugin. Mitigation: keep the upstream `package.json` `appium` block
  unchanged.
- **Hub→node WDA fan-out still synchronous.** Slice 1 keeps the
  hub-pushes-binary-to-each-node behaviour
  ([01-product](../discovery/01-product.md),
  [dashboard/router.ts:685](../../src/dashboard/router.ts#L685)) even though
  MinIO is available. A new admin uploading a WDA bundle will see the same
  upload-time fan-out latency as before. Document and address in a later
  slice.
- **`USER appium` in Dockerfile.falx** may break ADB/iproxy access depending
  on device permissions inside the container. Mitigation: test with a real
  device or emulator before merging; fall back to root if needed (W12 then
  becomes Slice 2 work).
- **Cheap security wins (G) might break dev workflows** that rely on the
  `JWT_SECRET` default. Mitigation: compose supplies a dev value; document the
  break in the PR description.
- **Upstream merge surface.** Touching `prisma/schema.prisma`,
  `src/prisma.ts`, `src/dashboard/asset-manager.ts`, `dashboard/router.ts`,
  and `buildAndCopyWeb.sh` creates conflict potential on any upstream merge
  per
  [04-plugin-lifecycle § 11](../discovery/04-plugin-lifecycle-and-extension-points.md).
  Mitigation: each scope item gets its own commit so conflicts during merge
  are easy to identify and reapply.
