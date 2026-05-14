# 16 — Open Questions

**Lens:** synthesis

> Decisions that need a call from Koray before Falx can confidently keep moving.
> Grouped by urgency. Each entry: the question, why it matters, realistic
> options, and a recommendation where there is one. Cited into discovery docs
> where the underlying tension surfaced.

---

## Group 1 — Must decide before Slice 1 starts

### Q1. SQLite → Postgres data migration: pure cutover or migrate existing data?

The upstream provider line is `sqlite`
([data-model § 1](./05-data-model.md),
[schema.prisma:2](../../prisma/schema.prisma#L2)) and migrations use
SQLite-specific `PRAGMA foreign_keys=OFF` + table-redefine patterns that have
no Postgres equivalent
([data-model § 4](./05-data-model.md)). Whether to also import existing rows
or start fresh changes the migration script's complexity by an order of
magnitude.

- **(a) Pure cutover.** Drop existing `~/.cache/appium-device-farm/device-farm-latest.db`,
  regenerate Prisma migrations targeting Postgres from scratch, accept that
  any existing session/build/user data is gone.
- **(b) One-shot import.** Add a `scripts/sqlite-to-postgres.ts` that reads
  the SQLite file and bulk-inserts into Postgres. Tolerable for users/teams
  (small tables) but `SessionLog` can be millions of rows.
- **(c) Side-by-side dual write.** Keep SQLite for read-only "old data" and
  send new writes to Postgres. Most complex; not worth the cost unless
  customers have years of data to preserve.

**Recommendation: (a) pure cutover.** Falx has zero production users; there is
no data to preserve. Saves migration script work and lets us rewrite migrations
cleanly. Logged in [BACKLOG § Lessons](./../BACKLOG.md) ("Likely need to
regenerate Prisma migrations rather than convert SQLite ones").

### Q2. LokiJS in-memory grid state: replace with Postgres or keep in-memory?

The codebase runs Prisma + LokiJS in parallel ([data-model § 5](./05-data-model.md),
[performance § 2](./14-performance.md)). LokiJS owns `devices`,
`pending-sessions`, `cliArgs`. Replacing it with Postgres reads removes a
parallel data store and unlocks multi-process hub scaling later (R1, R2 in
`15-strengths-weaknesses-risks.md`). Keeping it in-memory preserves
allocator latency.

- **(a) Keep LokiJS untouched in Slice 1.** Just swap the durable store.
  Minimal blast radius.
- **(b) Replace LokiJS in Slice 1.** Doubles the size of Slice 1 — every
  call site in `device-service.ts` changes. High risk for a baseline slice.
- **(c) Hybrid.** Move pending sessions to Postgres (for visibility / HA);
  keep device hot-state in Loki.

**Recommendation: (a) — keep LokiJS in Slice 1.** Move it out later if/when
hub HA becomes a real requirement (R2). Document the dual store explicitly
in Slice 1 so the limit is visible.

### Q3. MinIO bucket layout for assets

Currently every asset lives under `~/.cache/appium-device-farm/assets/...`
([architecture § Configuration surface](./02-architecture.md),
[session-lifecycle § 7](./08-session-lifecycle.md),
[security § 3](./13-security.md)). Specifically:

- App uploads (apk/ipa/aab) at `assets/<filename>`.
- WDA bundles at `assets/wda-resign.ipa` and `assets/wda-resign_tvos.ipa`.
- Sessions at `assets/sessions/<sessionId>/{screenshots,video,device_log.json,profiling.json}`.

S3-style buckets need decisions on layout, lifecycle policies, and credential
boundaries.

- **(a) Single bucket, prefixes match current paths.** Easiest port; one
  `falx-assets` bucket with `apps/`, `wda/`, `sessions/<id>/...` prefixes.
- **(b) Bucket per concern.** `falx-apps`, `falx-sessions`, `falx-wda`.
  More granular lifecycle policies (e.g. expire `sessions/*` after 90d).
  Worth it once retention matters.
- **(c) Bucket per tenant (future-proofing).** Premature for single-tenant
  on-prem.

**Recommendation: (a) for Slice 1.** Re-evaluate at retention slice. Filesystem
fallback for dev (no MinIO required for `npm test`) is non-negotiable.

### Q4. Logging stance for Slice 1: keep npmlog or swap to Pino now?

npmlog emits colored text to stderr ([observability § 1](./12-observability.md)).
Pino swap is needed for log aggregation but is itself a Slice-sized change.

- **(a) Defer.** Keep npmlog in Slice 1; replace in Slice 3 alongside request
  IDs and health endpoint.
- **(b) Swap now.** Wrap `@appium/support/logger` so all calls route to
  Pino. Touches every `log.info`/`log.debug` call site indirectly.
- **(c) Compromise.** Add a Pino transport that pipes process stderr →
  structured JSON without touching call sites. Doable but the redaction
  layer breaks unless we re-implement `SECURE_VALUES_PREPROCESSOR`.

**Recommendation: (a) defer.** Slice 1 is already heavy; observability has
its own slice. Document in Slice 1 risk callouts that npmlog stays until
Slice ~3.

### Q5. `falx-ui/` initial sync strategy

`falx-ui/` is empty in the repo. Per [CLAUDE.md], we copy from
`dashboard-frontend/` and modify there.

- **(a) One-time copy, fully diverge.** `cp -R dashboard-frontend falx-ui`,
  immediately delete dead components ([UI inventory § 6](./09-ui-inventory.md)),
  apply visual rebrand, never sync again from upstream.
- **(b) Maintain a sync-able layer.** Keep `falx-ui/` as a thin shell that
  imports most components from `dashboard-frontend/` via TS path aliases.
  Re-export and override only what diverges. Hard to maintain — React
  component customisation breaks at the boundary fast.
- **(c) Per-file annotation.** Mark files in `falx-ui/` with a header noting
  upstream parity. Manual cherry-pick during upstream merges.

**Recommendation: (a) one-time copy.** CLAUDE.md already implies this (`copied
from dashboard-frontend/ and modified here`). Falx UI will diverge fast once
shadcn migration starts. Accept upstream UI updates as cherry-picks if a
specific component improvement is worth porting.

### Q6. Branding scope in Slice 1: visible strings only, or color theme too?

[UI inventory § 5](./09-ui-inventory.md) — no design tokens, color literals
scattered across components. Theme refresh is a known Slice 2+ candidate
(shadcn + Tremor).

- **(a) Strings only.** Document title (`ConfigContext.tsx`), header title
  (`Header.tsx`), GitHub link removal, README/CHANGELOG references. Don't
  touch colors.
- **(b) Strings + minimal color tokens.** Add a `tailwind.config.js` color
  extend with Falx primary/accent; still don't restyle every component.
- **(c) Full theme refresh.** Replace MUI dark-mode coercion with a proper
  theme. Out of scope for baseline slice.

**Recommendation: (a) strings only.** Baseline slice should be boring. The
visual refresh has its own slot in the SLICES.md plan.

### Q7. Security holes: fix in Slice 1 or Slice 2?

The defaults are alarming
([15-strengths-weaknesses-risks § W1-W7, W11-W12](./15-strengths-weaknesses-risks.md)):
`JWT_SECRET || uuidv4()`, `console.log(token)`, default `admin/admin`,
wildcard CORS, plaintext API tokens, `enableAuthentication=false` default, 18
unguarded endpoints.

- **(a) Defer to dedicated Slice 2.** Slice 1 stays small and predictable.
- **(b) Take the cheap wins in Slice 1.** Specifically W1 (require
  `JWT_SECRET`), W2 (delete `console.log(token)`), W3 (require admin env
  vars). Five-line changes that protect dev installs from leaking.
- **(c) Full hardening in Slice 1.** Slice grows beyond predictable; auth
  test coverage gap (W22) bites.

**Recommendation: (b) — cheap wins only.** Land W1-W3 + W11 in Slice 1
because they take five minutes each and any local-dev test of Slice 1 will
otherwise expose those defaults. Defer W4 (CORS), W5 (18 endpoints), W6
(token hash), W7 (default) to Slice 2.

### Q8. Dead UI components: delete in Slice 1 or keep for now?

The `falx-ui/` copy is a natural moment to drop the dead code listed in
[UI inventory § 6](./09-ui-inventory.md): `NewHeader`, `Navbar`, `Sidebar`,
`UserMenu`, `RootRouter`, `DataContext`, `AdminDashboard`, the commented
terminal route, the half-removed `axios` dep.

- **(a) Delete during copy.** `falx-ui/` starts clean.
- **(b) Copy verbatim, delete in Slice 2.** Safer; keeps Slice 1 trivially
  diffable against `dashboard-frontend/`.
- **(c) Keep around for "later."** Worst option — never gets deleted.

**Recommendation: (a) delete during copy.** Cost is one extra commit during
the Slice 1 copy step. Avoids carrying noise into the visual refresh slice.

### Q9. Default Postgres connection string in `docker-compose.dev.yml`

Slice 1 will introduce `docker-compose.dev.yml`. Postgres credentials in
dev need a position.

- **(a) Hardcoded dev defaults.** `postgres://falx:falx@postgres:5432/falx`
  in `docker-compose.dev.yml`. Document that prod must override.
- **(b) Mandatory env vars.** Require `POSTGRES_PASSWORD` even in dev; fail
  if absent. Annoying for dev iteration.

**Recommendation: (a) hardcoded dev defaults with prominent comment.**
`docker-compose.dev.yml` is dev-only; prod uses a different compose / k8s
manifest where credentials come from secrets.

### Q10. Docker base image for Falx-built artefact

[DevOps § 2](./10-devops.md) — both Dockerfiles install `appium-device-farm`
from npm, not from the fork (W13). Slice 1 needs a Falx-specific image.

- **(a) Fork `docker/Dockerfile`, install from local `npm pack`.** Smallest
  diff; reuses the existing base `appium/appium:v2.19.0-p4`.
- **(b) New `docker/Dockerfile.falx` alongside upstream.** Keeps upstream
  Dockerfile untouchable.
- **(c) Switch base image.** Premature optimisation.

**Recommendation: (b) new `docker/Dockerfile.falx`.** Mirrors the
`dashboard-frontend/` vs `falx-ui/` pattern: upstream stays clean, Falx
artefacts live alongside.

---

## Group 2 — Decide during Slice 1 (can be answered as work progresses)

### Q11. Should `falx-ui/`'s document title come from `ConfigContext` or `index.html`?

[UI inventory § 4](./09-ui-inventory.md) — `ConfigContext.tsx` sets
`document.title = 'Appium Device Farm'` at runtime; `index.html` has the
original `<title>` too. Two places to update.

**Recommendation:** Update both. Treat `ConfigContext` as the one Falx
branding hook, but also fix `index.html` so the title is correct before JS
loads.

### Q12. WDA fan-out — push to MinIO once or keep per-node copies?

[Architecture § Outbound dependencies](./02-architecture.md),
[dashboard/router.ts:685](../../src/dashboard/router.ts#L685) — current
behaviour is hub-pushes-to-each-node. With MinIO, nodes can pull on demand.

**Recommendation:** Keep current hub-push behaviour in Slice 1 (don't change
node code). After Slice 1, evaluate pull-from-MinIO as a separate refactor.

### Q13. `apps/` MinIO prefix vs. database storage of bundle metadata

The `AppInformation` Prisma table stores `path` as a filesystem path. After
MinIO swap, `path` should be an S3 key (or a presigned URL on the fly?).

**Recommendation:** Store the S3 key as `path`. Build presigned URLs at
read-time in the dashboard route; don't store URLs in the DB (they expire).

### Q14. Multer file size cap

[Security § 3](./13-security.md) — no `fileSize` limit on uploads. Slice 1
introduces MinIO; while we're touching the upload path, set a cap.

**Recommendation:** 500 MB hard cap (covers reasonable IPAs); configurable
via env. Cheap to add in Slice 1.

### Q15. `connection_limit` for Postgres

[Performance § 2](./14-performance.md) — Prisma URL currently has
`?connection_limit=1` for SQLite. Postgres can handle 10-20 per node.

**Recommendation:** Drop the query param; let Prisma's default kick in
(`num_physical_cpus * 2 + 1`). Document if we tune it.

### Q16. Where do we put the `DATABASE_URL` reading?

[Data model § 4](./05-data-model.md) — currently `src/prisma.ts` constructs
the URL inline. Slice 1 needs to read from env.

**Recommendation:** Read `DATABASE_URL` directly in `src/prisma.ts`; fall
back to `process.env.DATABASE_URL` if Falx is the entrypoint. Keep
`config.databasePath` as a legacy path for any tooling that still references
it.

### Q17. MinIO endpoint config — env var or plugin arg?

The plugin's `pluginArgs` schema in `package.json:214` could accept MinIO
config, or it could be pure env (`MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, etc.).

**Recommendation:** Pure env vars. Avoids touching the plugin schema (which
risks upstream merge conflicts).

### Q18. Should the Slice 1 dev compose run an Android emulator?

[DevOps § 2](./10-devops.md) — `docker/Dockerfile.local` builds an emulator
image. Including it in dev compose is convenient but heavy (Java 17 +
SDK + KVM).

**Recommendation:** Optional service via a compose profile (e.g. `--profile
android`); default `docker compose up` brings only app + postgres + minio.

### Q19. Falx-specific Express route prefix

The cleanest extension seam ([04 § EP-2](./04-plugin-lifecycle-and-extension-points.md))
is mounting Falx routes under `/device-farm/api/falx/*`. Do we need any in
Slice 1?

**Recommendation:** No new routes in Slice 1. Reserve `/device-farm/api/falx/*`
as the future namespace; document it.

### Q20. Hub-node verification — two processes on the dev host, or one Docker?

Slice 1 done-criteria includes "spin up two processes locally (hub + node),
confirm device visibility across the link." Compose makes this trivial
but doubles infrastructure.

**Recommendation:** Two compose services in `docker-compose.dev.yml`
(`hub`, `node`) sharing the same Falx image, different env vars. Mirrors
prod topology.

---

## Group 3 — Can defer (Slice 2+)

### Q21. Hub HA — design now or defer?

[15-strengths-weaknesses-risks § R2](./15-strengths-weaknesses-risks.md) +
[BACKLOG § Tech](./../BACKLOG.md) — module-level state plus typedi container
make multi-instance hub a major refactor.

**Recommendation: defer until SLO demands it.** Document the limit; don't
build for it speculatively. BACKLOG already records this.

### Q22. Observability stack: Grafana LGTM, Datadog, or roll-our-own?

[Observability § 7](./12-observability.md) gaps: no metrics, no traces, no
request IDs, shallow health. [BACKLOG](./../BACKLOG.md) notes Grafana LGTM
as the preferred direction.

- **(a) Grafana LGTM** (Loki + Tempo + Mimir/Prometheus). Self-hostable, fits
  on-prem.
- **(b) OpenTelemetry SDK, customer chooses backend.** Most flexible; more
  init code.
- **(c) Datadog / similar SaaS.** Conflicts with on-prem positioning.

**Recommendation: (a) for self-hosting; (b) for SDK choice.** Use OTLP
exporters so Grafana is the default but customers can repoint. Defer until
the observability slice.

### Q23. Multi-tenancy: single-tenant assumption or design for tenants now?

[BACKLOG](./../BACKLOG.md) marks multi-tenant SaaS mode as "only after
on-prem is rock-solid." [Auth § 5](./06-auth-rbac.md) — sessions, apps, and
builds are not team-scoped in the data model; only devices are.

**Recommendation: single-tenant.** Don't add a `tenantId` column until SaaS
mode is real.

### Q24. Upstream merge cadence

How often do we pull from `upstream/main`?

- **(a) Quarterly.** Conflict batches are large but rare.
- **(b) Monthly.** Smaller batches, more touch points.
- **(c) Per-release.** Pin to upstream releases; resolve conflicts at version
  boundaries.

**Recommendation: (c) per-release.** Upstream uses semantic-release; pinning
to their tags gives predictable points for our merge work.

### Q25. Token revocation API

[Auth § 10](./06-auth-rbac.md) — no `/auth/logout`; JWTs remain valid for 24h
after logout. API tokens require manual delete.

**Recommendation: defer.** Build only when an actual policy needs it; the
24h JWT TTL is acceptable for v1.

### Q26. Rate limiting on `/auth/login`

[Auth § 10](./06-auth-rbac.md) — no brute-force protection.

**Recommendation:** Slice 2 security hardening. `express-rate-limit` is a
five-line drop-in.

### Q27. Should we wrap `npmlog` or replace it?

[Observability § 1](./12-observability.md) — `@appium/support` uses a global
`_global_npmlog`. Replacing it entirely is invasive; wrapping is fragile.

**Recommendation:** Wrap. Implement a thin Pino transport that picks up the
existing `log.info` / `log.debug` calls. Falx-owned code uses Pino directly.

### Q28. Should we drop the webpack obfuscator?

[15-strengths-weaknesses-risks § W23 / R12](./15-strengths-weaknesses-risks.md) —
obfuscator runs in the publish pipeline. We don't currently publish to npm.

**Recommendation:** Add a `build:falx` script that skips obfuscation. Keep
the existing pipeline intact for any future npm publish path. Defer until
release tooling needs it.

### Q29. Audit logging scope and storage

[Auth § 10](./06-auth-rbac.md) — no audit trail. [BACKLOG](./../BACKLOG.md)
flags this as a feature slice candidate.

- **(a) New Prisma model `AuditEvent` with rotating retention.**
- **(b) Stream to a separate log file / external sink.**
- **(c) Reuse the existing `SessionLog` table.** Wrong shape.

**Recommendation: (a)** when the audit slice runs. Defer scope decision
(scope of events: auth-only vs. full CRUD audit) to that slice.

### Q30. Where do session video files live long-term?

Slice 1 stores them in MinIO. Long-term, MP4s are large.

**Recommendation: defer to retention slice.** Lifecycle policy in MinIO
(expire after N days) handles this once the retention slice configures it.

### Q31. Public API tokens with rate limiting

[BACKLOG](./../BACKLOG.md) features list — distinct from internal API tokens.

**Recommendation: defer.** Not on the near horizon.

### Q32. SSO via OIDC

[BACKLOG](./../BACKLOG.md) — Authentik / Zitadel / Keycloak. Requires auth
refactor.

**Recommendation: defer until a customer asks.**

### Q33. WebRTC streaming as MJPEG replacement

[BACKLOG § Features](./../BACKLOG.md) — P2P browser ↔ node, hub does
signaling only. Big architectural feature.

**Recommendation: defer.** Current MJPEG works.

### Q34. Self-healing flaky devices (Cambrionix integration)

[BACKLOG](./../BACKLOG.md) — auto power-cycle via per-port USB switching.
Hardware-dependent.

**Recommendation: defer; design when first customer has Cambrionix
hardware.**

### Q35. Pluggable cloud providers vs. baked-in five

[Device management § 4](./07-device-management.md) — five cloud providers
hard-coded. A pluggable system (drop a JS file under `providers/`) would
let customers add private clouds.

**Recommendation: defer.** Five providers cover the market; pluggability is
expensive.

### Q36. Switching `dashboard-frontend/` build to `falx-ui/` in CI

CI builds `dashboard-frontend/` today via `buildAndCopyWeb.sh`
([DevOps § 1](./10-devops.md)). Slice 1 repoints to `falx-ui/`. Do we keep
`dashboard-frontend/` building in CI?

**Recommendation:** Yes, keep building `dashboard-frontend/` separately in CI
(or just not building it but keeping the dir) so upstream merges don't break.
Production artefact uses only `falx-ui/`.

### Q37. Should Falx ship its own docs site or rely on `mkdocs.yml` upstream?

[DevOps § 6](./10-devops.md) — upstream has an `mkdocs.yml` deployed at
`appium-device-farm-eight.vercel.app`. Falx has no docs site.

**Recommendation: defer until customer-facing docs are needed.** Internal
docs (`docs/`) suffice for now.

### Q38. Test coverage for new Falx code — same mocha stack or move to vitest?

[Testing § 1](./11-testing.md) — upstream uses mocha + ts-node. The tooling
works.

**Recommendation:** Same stack. Pivoting to vitest is a Cheap Future Upgrade
([BACKLOG](./../BACKLOG.md) lists Biome as a similar candidate).

---

**Total questions:** 38 — 10 must-decide-before-Slice-1, 10 decide-during,
18 can-defer. The Group-1 questions are the actual blocking set; the Slice 1
spec (`docs/slices/01-falx-baseline.md`) lifts those into its `Open
decisions` section.
