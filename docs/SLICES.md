# Falx — Vertical Slices Roadmap

Each row is a shippable, end-to-end change. Work the lowest unchecked slice.
Tick `[x]` when merged to `main`. Add the spec file in `docs/slices/`.

## Status

| # | Status | Slice | Spec |
|---|--------|-------|------|
| 0 | [x] | **Discovery** — foundational read of the codebase across all roles. Produces `docs/discovery/`. | `docs/slices/00-discovery.md` |
| 1 | [ ] | **Falx baseline** — Postgres swap, MinIO swap, `falx-ui/` copy + serve, visual rebrand, `docker-compose.dev.yml`, hub-node verified on dev host. | `docs/slices/01-falx-baseline.md` |
| 2 | [ ] | (concrete proposal below; specs written before each starts) | — |

## After Discovery

Discovery surfaced 14 docs + a strengths/weaknesses synthesis
(`docs/discovery/15-strengths-weaknesses-risks.md`) and 38 open questions
(`docs/discovery/16-open-questions.md`). Slice 2 onwards is ordered by
"smallest blast radius / highest leverage first." Each slice gets a full spec
file (`docs/slices/NN-name.md`) written before any code lands.

Concrete Slice 2+ candidates (refine into specs as each is reached):

- **Slice 2 — Security hardening sweep.** Restrict CORS to allowlisted
  origins, add `helmet`, hash `ApiToken.token` and `User.accessKey`, flip
  `enableAuthentication` default to true, add rate limit on `/auth/login`.
  Rationale: `13-security.md § 2, § 8` catalogues wildcard CORS, no helmet,
  no CSRF, plaintext tokens — these compound with W1-W7 in
  `15-strengths-weaknesses-risks.md`. Cheap wins (W1-W3, W11) already shipped
  in Slice 1; this is the bigger pass.
- **Slice 3 — Auth coverage of dashboard endpoints.** Add `authMiddleware`
  (and `adminOnly` where appropriate) to the 18 unguarded routes catalogued
  in `06-auth-rbac.md § 8` and `13-security.md § 2`. Includes the
  destructive `/cleanup`, `/deleteUploadedApp`, `/block`, `/unblock`
  endpoints and the credential-leaking `/cliArgs`. Includes test coverage
  for the auth middleware (gap noted in `11-testing.md § 9`).
- **Slice 4 — Logging rework: npmlog → Pino structured JSON + request IDs.**
  Address the gaps catalogued in `12-observability.md § 1, § 7`. Wrap
  `@appium/support` logger or replace at the boundary; propagate
  `appium:requestId` into log context for hub→node correlation.
- **Slice 5 — Health endpoint + Dockerfile HEALTHCHECK + retention cron.**
  Replace shallow `/api/status` with a real readiness probe (DB ping,
  storage ping, device manager state) per `12-observability.md § 4, § 7`.
  Add a retention cron driven by config, replacing the operator-only
  `/cleanup` endpoint and capping asset growth per
  `08-session-lifecycle.md § 7` and `14-performance.md § 5`.
- **Slice 6 — Dead-code cleanup.** Remove `AdbServer.ts`
  (`07-device-management.md § 1`), fix the tvOS casing bug
  (`07-device-management.md § Surprises`), backend cleanup for the
  removed `AdminDashboard.tsx` routes, dead EventBus events review per
  `08-session-lifecycle.md § 4`. Small, safe, surface-reducing.
- **Slice 7 — Visual UI refresh in `falx-ui/`.** Drop MUI + Flowbite, move
  to shadcn + Tremor, consolidate the four icon libraries down to lucide,
  add design tokens, fix the slate-on-slate MUI dark-mode hack per
  `09-ui-inventory.md § 5, § 6`. Larger and visible; do once auth and
  logging are solid.
- **Slice 8 — Audit logging.** New `AuditEvent` Prisma model; instrument
  auth, role, token, device-block, build-cleanup events; UI screen for
  search/export. Closes the gap in `06-auth-rbac.md § 10`.

Past Slice 8 the BACKLOG list takes over: multi-device parallel verify,
WebRTC streaming, App Store Connect / Google Play integration, hub HA,
SSO, etc. See `docs/BACKLOG.md` for the long tail and `docs/discovery/16-open-questions.md`
Group 3 for the deferred decisions.

See `docs/BACKLOG.md` for the long tail.

## Rules

- One slice per PR. If it grows, split it.
- Each slice has a spec in `docs/slices/NN-name.md` **before** any code.
- Discovery (Slice 0) is a hard prerequisite. Don't skip it.
- After any slice, update relevant `docs/discovery/*.md` if behavior changed.
- Branding (Falx vs. appium): customer-facing names always say Falx. Internal
  Appium plugin names stay unchanged (`device-farm`).
