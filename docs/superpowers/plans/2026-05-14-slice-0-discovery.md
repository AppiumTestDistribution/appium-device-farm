# Slice 0 — Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce comprehensive `docs/discovery/*.md` foundation knowledge for the Falx repo (forked from `appium-device-farm`), surface open questions, write the Slice 1 spec, and update `docs/SLICES.md` with informed Slice 2+ candidates.

**Architecture:** Pure documentation slice — no product code. Discovery is decomposed into independent topic groups, each handled by a focused subagent reading a bounded slice of the repo. A synthesis pass at the end produces cross-cutting docs (strengths/weaknesses/open questions), writes the Slice 1 spec, and updates the roadmap. The controller (main session) coordinates, never writes the discovery docs itself.

**Tech Stack:** Markdown only. Subagents may use Read/Grep/Bash for repo exploration; outputs go to `docs/discovery/`. No code changes anywhere.

---

## Conventions for all discovery docs

Every doc MUST:

1. **Open with a role-lens header**, e.g. `**Lens:** architect + engineer`. Switch lens mid-doc with inline tags like `[product]`, `[architect]`, `[SRE]` when the perspective shifts.
2. **Cite source paths** with line numbers where useful: `src/plugin.ts:42-78`. Markdown links preferred: `[plugin.ts:42](../../src/plugin.ts#L42)` from `docs/discovery/`.
3. **Be skimmable**: short sections with clear headers. Bullet lists over prose where it fits.
4. **State what is unknown**: if a section can't be answered from the code, write `**Unknown:** ...` rather than guessing.
5. **No editorialization in factual sections.** Save opinions for the `15-strengths-weaknesses-risks.md` and `16-open-questions.md` synthesis docs.
6. **Reflect upstream-vs-Falx reality**: this is a fork. Don't describe Falx-specific behavior that doesn't exist yet. Describe upstream's `appium-device-farm` as it currently sits, plus note where Falx will diverge.
7. **One Markdown file per agent task** (or two closely-related files where noted). Files numbered for ordering: `01-product.md`, `02-architecture.md`, etc.
8. **Cap file size at ~400 lines** to stay readable. If a topic needs more, split into sub-files within the topic group.

## File structure — final `docs/discovery/`

| # | File | Owner agent | Lens |
|---|------|-------------|------|
| 00 | `00-index.md` | controller (last) | — |
| 01 | `01-product.md` | Agent A | product |
| 02 | `02-architecture.md` | Agent A | architect |
| 03 | `03-hub-node-protocol.md` | Agent B | architect + engineer |
| 04 | `04-plugin-lifecycle-and-extension-points.md` | Agent B | engineer |
| 05 | `05-data-model.md` | Agent C | engineer |
| 06 | `06-auth-rbac.md` | Agent D | engineer + security |
| 07 | `07-device-management.md` | Agent E | engineer |
| 08 | `08-session-lifecycle.md` | Agent F | engineer + SRE |
| 09 | `09-ui-inventory.md` | Agent G | UX + designer + frontend |
| 10 | `10-devops.md` | Agent H | DevOps |
| 11 | `11-testing.md` | Agent H | tester |
| 12 | `12-observability.md` | Agent H | SRE |
| 13 | `13-security.md` | Agent I | security |
| 14 | `14-performance.md` | Agent I | SRE + architect |
| 15 | `15-strengths-weaknesses-risks.md` | Agent J (synth) | architect synthesis |
| 16 | `16-open-questions.md` | Agent J (synth) | synthesis |

Plus:
- `docs/slices/01-falx-baseline.md` — written by Agent J
- `docs/SLICES.md` — updated by Agent J (Slice 0 ticked, Slice 2+ candidates rewritten)

## Subagent dispatch strategy

**Group B (parallel)** — Agents A–I run simultaneously, since each touches a different slice of the repo. Dispatch all 9 in a single message so they run concurrently.

**Group C (sequential, after B)** — Agent J runs alone. It reads all of Group B's output, produces the synthesis docs, writes Slice 1, updates SLICES.md.

**Two-stage review** (per user memory `feedback_subagent_driven_execution`): after each agent returns, the controller (1) reads the produced files to verify they meet the conventions above, (2) spot-checks 2–3 citations to confirm they point at the right code. If a review fails, the controller dispatches a fix-up call to the same agent type with specific feedback.

**Group-end consistency audit** (after all of Group B): controller checks for contradictions across files (e.g. does the auth doc match the data model doc on User/Team relations? does the session doc agree with the architecture doc on which process owns scheduling?). If contradictions exist, dispatch a tie-breaker agent or fix-up call.

**Model selection per task:**
- Heavy-reading tasks (E device management, G UI inventory, F session lifecycle): Opus.
- Focused-scope tasks (C data model, D auth, I security, H devops/testing/observability, B hub-node): Sonnet.
- Product/architecture overview (A): Opus.
- Synthesis (J): Opus.

---

## Group B — Parallel Discovery Subagents

### Task A: Product + High-level architecture

**Files:**
- Create: `docs/discovery/01-product.md`
- Create: `docs/discovery/02-architecture.md`

**Agent type:** Explore (read-only). Model: Opus.

- [ ] **Step 1: Dispatch Agent A**

Subagent prompt (self-contained):

> Read this repo to write two discovery docs for the Falx project. Falx is a fork of `appium-device-farm` (an on-prem device farm for mobile test automation). This is documentation work — do not change any code.
>
> **Output 1: `docs/discovery/01-product.md`** — Lens: product.
> Cover: What does this app do, end-to-end? Who are the users (manual QA, automation engineers, CI systems, admins)? What problem does it solve vs. cloud device farms (Sauce, BrowserStack)? What's the primary value prop? What are the headline features the user-facing UI exposes? Cite specific routes/screens to ground each claim. Keep to ~150 lines.
>
> **Output 2: `docs/discovery/02-architecture.md`** — Lens: architect.
> Cover: Top-level architecture diagram (ASCII). Process model (single Node process running Appium 2.x with the device-farm plugin). Inbound surface (Appium driver protocol, plugin REST routes, dashboard UI). Outbound dependencies (ADB, Xcode/WDA, go-ios, optional cloud providers). Request flow for: (1) a typical Appium session create, (2) a UI dashboard pageview, (3) a hub→node session forward. State which files own each major concern (entry points: `src/main.ts`, `src/plugin.ts`, `src/index.ts`, `src/app/`, `src/dashboard/`). Distinguish hub-mode vs. node-mode vs. standalone-mode. Keep to ~300 lines.
>
> **Read at minimum:**
> - `README.md`, `CHANGELOG.md`, `package.json`
> - `src/main.ts`, `src/plugin.ts`, `src/index.ts`, `src/config.ts`
> - `src/app/index.ts`, `src/app/routers/grid.ts`
> - `src/dashboard/index.ts`, `src/dashboard/router.ts`
> - `sample-config.json`, `server-config.json`, `node-config.json`
> - skim `src/proxy/`, `src/commands/`, `src/events/`
>
> **Conventions** — every doc must: open with a Lens header; cite source paths with line numbers (use markdown relative links like `[plugin.ts:42](../../src/plugin.ts#L42)` from inside `docs/discovery/`); call out `**Unknown:**` rather than guessing; describe upstream behavior as-is (Falx hasn't diverged yet); no editorializing — save opinions for synthesis docs.

- [ ] **Step 2: Two-stage review**

After Agent A returns:
1. Read both files. Verify Lens headers, citations, no editorializing.
2. Spot-check 2 citations per file — Read the cited line range, confirm it backs the claim.
3. If issues: dispatch fix-up to same agent type with concrete feedback.

---

### Task B: Hub/node protocol + Plugin lifecycle + Extension points

**Files:**
- Create: `docs/discovery/03-hub-node-protocol.md`
- Create: `docs/discovery/04-plugin-lifecycle-and-extension-points.md`

**Agent type:** Explore. Model: Sonnet.

- [ ] **Step 1: Dispatch Agent B**

Subagent prompt:

> Read this repo to write two discovery docs for Falx (fork of `appium-device-farm`). Documentation only.
>
> **Output 1: `docs/discovery/03-hub-node-protocol.md`** — Lens: architect + engineer.
> Cover: hub-node topology overview. How a node registers with a hub (which endpoint, payload, polling/heartbeat cadence, what node-config.json fields control this). How devices on a node become visible to the hub. How session-create requests on the hub get forwarded to the right node. Failure modes: node going offline, hub restart, network partition. Reverse channels (does the node ever push to the hub?). Cite all claims with file paths + line numbers. ~250 lines.
>
> **Output 2: `docs/discovery/04-plugin-lifecycle-and-extension-points.md`** — Lens: engineer.
> Cover: how the device-farm plugin slots into Appium 2.x. Plugin entry (`src/plugin.ts`), the `updateServer` hook (REST routes), `onUnexpectedShutdown`, command middleware/proxying. Lifecycle: plugin load → device discovery → session ready → session teardown. Critically: **what extension points exist for Falx to add behavior WITHOUT modifying upstream files in `src/`?** Examples: hooking session-create, intercepting commands, custom routes, event emitters. Note any patterns (event bus, hook arrays, dynamic require) that look fork-friendly. List the upstream files where Falx-specific logic is most likely to need patches anyway (the unavoidable conflicts). ~300 lines.
>
> **Read at minimum:**
> - `src/plugin.ts`, `src/index.ts`, `src/main.ts`
> - `src/api-client.ts`, `src/device-managers/NodeDevices.ts`
> - `src/app/index.ts`, `src/app/routers/grid.ts`
> - `src/events/`, `src/commands/`
> - `node-config.json`, `sample-config.json`, `remote-config.json`
> - Search for `hub`, `register`, `heartbeat`, `updateServer`, `onUnexpectedShutdown` references with grep
>
> **Conventions:** Lens header, citations, `**Unknown:**` when applicable, no opinions.

- [ ] **Step 2: Two-stage review** — same procedure as Task A.

---

### Task C: Data model

**Files:**
- Create: `docs/discovery/05-data-model.md`

**Agent type:** Explore. Model: Sonnet.

- [ ] **Step 1: Dispatch Agent C**

Subagent prompt:

> Read this repo to write the data-model discovery doc for Falx (fork of `appium-device-farm`). Documentation only.
>
> **Output: `docs/discovery/05-data-model.md`** — Lens: engineer.
> Cover:
> 1. **Annotated Prisma schema** — go model-by-model in `prisma/schema.prisma`. For each model: purpose, key columns and what they mean, relationships, indexes. Quote relevant chunks of the schema inline.
> 2. **ERD** — ASCII or mermaid box-and-arrow diagram of the relations. Group related models (sessions cluster, auth cluster, device cluster).
> 3. **Migration history** — walk through `prisma/migrations/` directories in order. For each, one-sentence summary of what it added/changed and rough date inferred from the directory name. Highlight the `20250509132713_authentication` migration as the auth subsystem landing point.
> 4. **DB engine reality** — confirm the current engine (likely SQLite per upstream). Cite `prisma/schema.prisma` provider line and any related code. Note: Falx will migrate to Postgres in Slice 1; don't pre-document that, just flag it.
> 5. **Data-access patterns** — which files do most reads/writes? Cite `src/prisma.ts`, `src/data-service/` (skim what's there).
>
> ~400 lines max. Cite line numbers throughout. Use markdown links to schema and migration files.
>
> **Read:**
> - `prisma/schema.prisma` in full
> - `prisma/migrations/*/migration.sql` — skim each
> - `src/prisma.ts`, `src/data-service/`
> - `grep` for `prisma\\.` to see hot paths
>
> **Conventions:** Lens header, citations, `**Unknown:**`, no opinions.

- [ ] **Step 2: Two-stage review** — verify the ERD reflects actual relations; spot-check 2 model annotations against the schema.

---

### Task D: Auth, users, teams, API tokens, RBAC

**Files:**
- Create: `docs/discovery/06-auth-rbac.md`

**Agent type:** Explore. Model: Sonnet.

- [ ] **Step 1: Dispatch Agent D**

Subagent prompt:

> Read this repo to write the auth & RBAC discovery doc for Falx (fork of `appium-device-farm`). Documentation only.
>
> **Output: `docs/discovery/06-auth-rbac.md`** — Lens: engineer + security.
> Cover:
> 1. **Auth subsystem layout** — `src/auth/` directory map: routers, controllers, services, middleware. What each layer does.
> 2. **Identity model** — User, Team, Role/Permission models from Prisma. Quote relevant schema chunks.
> 3. **Login / session** — how a UI user signs in. Cookies? JWT? Where is the session stored? Cite `src/auth/controllers/auth.controller.ts` and `src/auth/services/user.service.ts`.
> 4. **API tokens** — how programmatic clients authenticate. Cite `api-tokens.*`. What scopes/permissions exist?
> 5. **Teams** — what does a team own/scope (devices? sessions? apps?). Cite `team.*` files.
> 6. **Device allocation** — `device-allocation.controller.ts`, `device-allocation.service.ts` — how teams/users get assigned devices.
> 7. **Middleware** — `src/auth/middleware/auth.middleware.ts`. Which routes are protected, which are not.
> 8. **Password storage / token storage** — algorithm, salt, where stored. Mark gaps as `**Risk:**` lines (not full editorializing, just flag).
>
> ~300 lines. Cite line numbers throughout.
>
> **Read:**
> - All files in `src/auth/`
> - `src/auth/routers/index.ts` to see route wiring
> - Auth-related models in `prisma/schema.prisma`
> - Migration `prisma/migrations/20250509132713_authentication/`
>
> **Conventions:** Lens header, citations, `**Unknown:**`. Risk flags allowed in this doc since it's security-relevant, but keep them factual, not editorial.

- [ ] **Step 2: Two-stage review** — confirm route protections match the middleware claims; spot-check token storage claim against code.

---

### Task E: Device management (Android / iOS / tvOS)

**Files:**
- Create: `docs/discovery/07-device-management.md`

**Agent type:** Explore. Model: Opus.

- [ ] **Step 1: Dispatch Agent E**

Subagent prompt:

> Read this repo to write the device-management discovery doc for Falx (fork of `appium-device-farm`). Documentation only.
>
> **Output: `docs/discovery/07-device-management.md`** — Lens: engineer.
> Cover platform-by-platform:
> 1. **Android (`AndroidDeviceManager.ts`, `AdbServer.ts`, `ChromeDriverManager.ts`)** — how devices are discovered, how ADB is used, what device properties get captured (model, OS version, screen size, etc.), how emulators differ from real devices, app install/launch, log capture, screen mirroring.
> 2. **iOS (`IOSDeviceManager.ts`, `iOSTracker.ts`, `IOSDeviceType.ts`, `goIOSTracker.ts`, `iProxy.ts`, `usbmux.ts`)** — discovery on macOS (Xcode/WDA) vs. Linux (go-ios/tunneld). Simulator vs. real device. WDA setup. iProxy for port forwarding. Differences between the two trackers.
> 3. **tvOS** — does it exist as a distinct path or is it folded into iOS? Search for `tvOS`, `tv` references.
> 4. **Cloud devices** — `src/device-managers/cloud/`. Which providers? How does a cloud device appear in the UI alongside local ones?
> 5. **Device state machine** — busy / free / offline / error. Where is it tracked? Cite `device-utils.ts`, `DeviceModel` in Prisma.
> 6. **Capabilities matching** — how does an incoming session's caps get matched to a device? Cite `CapabilityManager.ts`.
> 7. **Device farm options** — `device-farm` plugin args from config files. What controls platform selection, filtering, refresh interval.
>
> ~400 lines. Cite throughout. Use sub-headers per platform.
>
> **Read:**
> - All files in `src/device-managers/` (Android, iOS, cloud)
> - `src/device-utils.ts`, `src/CapabilityManager.ts`, `src/chromeUtils.ts`
> - `src/iProxy.ts`, `src/usbmux.ts`, `src/goIOSTracker.ts`
> - Device-related models in Prisma schema
> - `sample-config.json` for device-farm plugin options
>
> **Conventions:** Lens header, citations, `**Unknown:**`, no opinions.

- [ ] **Step 2: Two-stage review** — spot-check Android discovery flow against ADB calls; verify iOS macOS-vs-Linux split is described accurately.

---

### Task F: Session lifecycle + queueing

**Files:**
- Create: `docs/discovery/08-session-lifecycle.md`

**Agent type:** Explore. Model: Opus.

- [ ] **Step 1: Dispatch Agent F**

Subagent prompt:

> Read this repo to write the session-lifecycle discovery doc for Falx (fork of `appium-device-farm`). Documentation only.
>
> **Output: `docs/discovery/08-session-lifecycle.md`** — Lens: engineer + SRE.
> Cover end-to-end:
> 1. **Session create flow** — caps come in → device matched → session forwarded (local vs. remote node vs. cloud) → returned to client. Walk through code paths.
> 2. **Session classes** — `LocalSession`, `RemoteSession`, `CloudSession`, `DeviceFarmSession`, `SessionManager`. Responsibilities of each.
> 3. **Queueing** — what happens when no device is available? Is there a queue, a retry loop, an immediate reject? Cite the relevant code. Look in `SessionManager.ts`, `device-utils.ts`, `events/`.
> 4. **Session lifecycle events** — start, in-progress, end, error, timeout. Where are they emitted? Where consumed (logging, DB writes, dashboard updates)?
> 5. **Session teardown** — what cleans up devices, processes, ports, WDA, ADB streams.
> 6. **Concurrency** — what limits exist on parallel sessions per device, per node, globally.
> 7. **Session logs / artifacts** — per-session log capture, video, screenshots, profiling. Where stored, when cleaned up. Cite `src/dashboard/asset-manager.ts`, `src/dashboard/app-profiling/`.
>
> ~400 lines. Cite throughout.
>
> **Read:**
> - All files in `src/dashboard/sessions/`
> - `src/dashboard/event-manager.ts`, `src/dashboard/asset-manager.ts`
> - `src/events/`, `src/commands/`
> - `src/device-utils.ts`, `src/CapabilityManager.ts`
> - Session-related Prisma models
>
> **Conventions:** Lens header, citations, `**Unknown:**`, no opinions.

- [ ] **Step 2: Two-stage review** — verify session-create flow citations; spot-check queueing behavior claim.

---

### Task G: UI inventory (dashboard-frontend)

**Files:**
- Create: `docs/discovery/09-ui-inventory.md`

**Agent type:** Explore. Model: Opus.

- [ ] **Step 1: Dispatch Agent G**

Subagent prompt:

> Read this repo to write the UI inventory discovery doc for Falx (fork of `appium-device-farm`). Documentation only. The upstream UI lives in `dashboard-frontend/`. **Do not modify any file** — read only. Falx will copy this to `falx-ui/` in Slice 1.
>
> **Output: `docs/discovery/09-ui-inventory.md`** — Lens: UX + designer + frontend engineer.
> Cover:
> 1. **Stack** — React version, build tool (Vite), UI libraries (MUI, Flowbite, Tailwind — confirm by reading `package.json` and imports). Routing approach. State management approach (Context? Redux?). API client setup (`api-service/`).
> 2. **Route map / screen inventory** — walk through `src/router/` and `src/pages/`. For EACH top-level screen, write a short entry: name, route, what it shows, what actions it allows, which backend endpoints it calls, key components used. Use a table.
> 3. **Reusable component inventory** — walk `src/components/`. Group by purpose (forms, tables, charts, layout, device-specific widgets, session-specific widgets). Note which look generic/reusable in falx-ui vs. tightly coupled to upstream styles.
> 4. **Contexts and services** — `src/contexts/`, `src/services/`, `DataContext.tsx`. What global state and side-effects exist.
> 5. **Styling system** — Tailwind config, custom CSS, MUI theme, Flowbite usage. Where the visual identity lives.
> 6. **Reusability assessment for falx-ui** — categorize: (a) directly portable (logic + structure), (b) portable with restyle, (c) needs rewrite (tightly coupled, deprecated patterns, or unwanted dependency). Be specific per screen/component.
> 7. **WireMock / dev tooling** — note `wiremock/` directory and what it's for.
>
> ~400 lines. Cite paths to files.
>
> **Read:**
> - `dashboard-frontend/package.json`, `vite.config.js`, `tailwind.config.js`
> - `dashboard-frontend/src/App.tsx`, `main.tsx`, `DataContext.tsx`
> - All files in `dashboard-frontend/src/pages/` (list every page)
> - `dashboard-frontend/src/router/`
> - `dashboard-frontend/src/components/` — at least list each subdirectory + 1-line purpose for each component group
> - `dashboard-frontend/src/contexts/`, `dashboard-frontend/src/services/`, `dashboard-frontend/src/api-service/`
>
> **Conventions:** Lens header, citations, `**Unknown:**`. Reusability tags are allowed (they're factual categorization, not editorializing).

- [ ] **Step 2: Two-stage review** — sample 3 screens and verify the inventory entry matches what's in the page file.

---

### Task H: DevOps + Testing + Observability

**Files:**
- Create: `docs/discovery/10-devops.md`
- Create: `docs/discovery/11-testing.md`
- Create: `docs/discovery/12-observability.md`

**Agent type:** Explore. Model: Sonnet.

- [ ] **Step 1: Dispatch Agent H**

Subagent prompt:

> Read this repo to write three discovery docs for Falx (fork of `appium-device-farm`). Documentation only.
>
> **Output 1: `docs/discovery/10-devops.md`** — Lens: DevOps.
> Cover: Build (npm scripts in `package.json`, `buildAndCopyWeb.sh`, `webpack.config.js`, `tsconfig.json`). Dockerfile layout (`docker/Dockerfile`, `docker/Dockerfile.local`, `docker/start-appium.sh`, `docker/start-emulator.sh`). Install path (`install.sh`). CI (`azure-pipelines.yml` — stages, jobs, what it builds/tests/publishes). Release flow (`CHANGELOG.md` + semver pattern, any release scripts). Ports / env vars / config file precedence. `mkdocs.yml` for docs site. `renovate.json` for dep updates. What's missing vs. a proper on-prem deployment story (compose, Helm, Ansible — none of these will exist; just note absence). ~250 lines.
>
> **Output 2: `docs/discovery/11-testing.md`** — Lens: tester.
> Cover: Test runner setup (mocha + ts-node, jest used for one file). Test layout: `test/unit/`, `test/integration/`, `test/e2e/`. For each, list spec files and what they cover (one-liner per spec). Which platforms are exercised. CI test invocation. Coverage tooling (`nyc`). Test data setup (fixtures, factories, db seeding). Cloud provider test files (`browserstack`, `pcloudy`, `sauce`, `lambdaTest`). What's well-tested vs. notable gaps. ~250 lines.
>
> **Output 3: `docs/discovery/12-observability.md`** — Lens: SRE.
> Cover: Logging — what library, format, levels, output destination. Cite `src/logger.ts`, `src/debugLog.ts`, `log-filter.json`. Metrics — does anything emit metrics? (likely none beyond logs). Tracing — any OpenTelemetry? (likely none). Health checks — any endpoint? Search for `/health`, `/status`, `/ping`. Per-session log capture vs. process-level logs. Log retention. What's missing for a production on-prem deployment (structured JSON to stdout, Prometheus-style metrics, request IDs, etc.). ~200 lines.
>
> **Read:**
> - `package.json` scripts section, `webpack.config.js`, `tsconfig.json`, `buildAndCopyWeb.sh`, `install.sh`
> - `docker/` directory in full
> - `azure-pipelines.yml`, `renovate.json`, `mkdocs.yml`
> - `test/` directory tree — at least list files
> - `src/logger.ts`, `src/debugLog.ts`, `log-filter.json`
> - `grep` for `pino`, `winston`, `log4`, `prom`, `otel`, `tracing` in `src/`
> - `grep` for `/health`, `/status` route registrations
>
> **Conventions:** Lens header, citations, `**Unknown:**`, no opinions (gap-flagging in each doc is fine — that's factual observation).

- [ ] **Step 2: Two-stage review** — verify CI pipeline summary; spot-check logger setup citation; confirm test file list.

---

### Task I: Security posture + Performance characteristics

**Files:**
- Create: `docs/discovery/13-security.md`
- Create: `docs/discovery/14-performance.md`

**Agent type:** Explore. Model: Sonnet.

- [ ] **Step 1: Dispatch Agent I**

Subagent prompt:

> Read this repo to write two discovery docs for Falx (fork of `appium-device-farm`). Documentation only. Read prior outputs `docs/discovery/06-auth-rbac.md` and `docs/discovery/08-session-lifecycle.md` if they exist; reference them rather than re-stating.
>
> **Output 1: `docs/discovery/13-security.md`** — Lens: security.
> Cover the surface area:
> 1. **Network surface** — which ports are listened on, which are public-by-default vs. localhost-only. Cite config files.
> 2. **AuthN/AuthZ summary** — short pointer to `06-auth-rbac.md`, then call out: unauthenticated endpoints, default credentials (if any in seed data), token lifetime, password policy. Cite specific code/migrations.
> 3. **Input handling** — request validation. Are bodies parsed and validated (zod, joi, ajv)? Or trusted raw? File-upload endpoints — `src/dashboard/asset-manager.ts`, `uploads/`. Path traversal risk?
> 4. **Secrets handling** — where do secrets live? (env vars, config files committed to repo?). Check `sample-config.json`, `server-config.json` for what should be secret vs. what's there in plaintext.
> 5. **Shell-out surface** — `child_process.exec`/`spawn` calls (ADB, xcrun, go-ios, ffmpeg etc.). Are user-controlled inputs ever passed to shells? Search `grep`-style.
> 6. **Dependency surface** — `package.json` count of direct deps; flag any obviously old/abandoned. `renovate.json` usage.
> 7. **Plugin trust model** — does this plugin run as root anywhere (Docker)? What it'd see on a compromised node.
> 8. **CSRF / CORS** — what's configured.
> ~250 lines. Citations throughout. Risks flagged as `**Risk:**` lines (factual, not editorial — save opinions for synthesis).
>
> **Output 2: `docs/discovery/14-performance.md`** — Lens: SRE + architect.
> Cover what's known and unknown:
> 1. **Process model** — single Node process, event loop bound. Workers? (Likely none.)
> 2. **DB engine bottlenecks** — SQLite limits (single-writer). Will Postgres swap remove these? Cite.
> 3. **Session concurrency** — practical limit per node (device count + WDA/ADB overhead). Any global limit?
> 4. **Hot paths** — device discovery loops (cadence?), session create cost.
> 5. **Memory / disk** — uploaded apps, session logs, video, screenshots — where they accumulate, retention policy (if any).
> 6. **Known scale failures** — search `CHANGELOG.md`, issues referenced in commits, `docker/README.md` for hints.
> 7. **What is unknown** — flag every claim that can't be backed by code as `**Unknown:**`. Performance is the doc most likely to be honest about uncertainty.
> ~200 lines. Citations where possible.
>
> **Read:**
> - Config files: `sample-config.json`, `server-config.json`, `node-config.json`, `remote-config.json`
> - `src/dashboard/asset-manager.ts`, `uploads/` (just check existence)
> - `grep` for `exec(`, `spawn(`, `execSync(` in `src/`
> - `grep` for `cors`, `csrf`, `helmet` in `src/`
> - `package.json` deps section
> - `CHANGELOG.md`
> - `docker/README.md`
>
> **Conventions:** Lens header, citations, `**Risk:**` and `**Unknown:**` flags allowed. No editorial conclusions — that's for `15-strengths-weaknesses-risks.md`.

- [ ] **Step 2: Two-stage review** — spot-check 2 `Risk` flags against the cited code; verify SQLite identification is correct.

---

## Group C — Synthesis (sequential, after all of Group B)

### Task J: Synthesis + Slice 1 spec + SLICES.md update

**Files:**
- Create: `docs/discovery/15-strengths-weaknesses-risks.md`
- Create: `docs/discovery/16-open-questions.md`
- Create: `docs/slices/01-falx-baseline.md`
- Modify: `docs/SLICES.md`

**Agent type:** general-purpose (needs Write + Edit). Model: Opus.

- [ ] **Step 1: Run group-end consistency audit FIRST (controller, not agent)**

Before dispatching Agent J, the controller spot-reads pairs of docs that should agree:
- `05-data-model.md` ↔ `06-auth-rbac.md` (User/Team relations match?)
- `02-architecture.md` ↔ `08-session-lifecycle.md` (process model agrees on which path runs what?)
- `03-hub-node-protocol.md` ↔ `07-device-management.md` (device visibility across nodes consistent?)
- `09-ui-inventory.md` ↔ `02-architecture.md` (UI talks to the backend routes claimed in architecture?)

If contradictions: dispatch a fix-up to the relevant Group B agent before proceeding to J.

- [ ] **Step 2: Dispatch Agent J**

Subagent prompt:

> Read all files in `docs/discovery/01-product.md` through `docs/discovery/14-performance.md`. Read `CLAUDE.md`, `docs/SLICES.md`, `docs/BACKLOG.md`. Read `docs/slices/00-discovery.md` for context on Slice 1 expectations. Then produce four deliverables.
>
> **Deliverable 1: `docs/discovery/15-strengths-weaknesses-risks.md`** — Lens: architect synthesis.
> Three sections:
> - **Strengths (preserve)** — what the upstream codebase does well that Falx should NOT touch or replace. Cite the discovery doc backing each claim.
> - **Weaknesses (fix or wrap)** — concrete weak spots Falx should improve. For each: what it is, where it lives, why it's a problem, suggested approach (fix-in-place vs. wrap-around vs. replace). Don't propose timelines — that's the SLICES roadmap's job.
> - **Risks (watch)** — risks that aren't necessarily weaknesses but could bite later (upstream merge surface, scale ceilings, single points of failure). Each tagged with severity (low / medium / high) and a one-line trigger condition.
> Be concrete. No fluff. ~300 lines.
>
> **Deliverable 2: `docs/discovery/16-open-questions.md`** — Lens: synthesis.
> List every decision the user (Koray) needs to make before Slice 1 can start, plus other decisions deferred beyond Slice 1. Group by: must-decide-before-Slice-1, decide-during-Slice-1, can-defer. Each question is one short paragraph with: the question, why it matters, the realistic options, and your recommendation if you have one. Don't artificially cap the number — surface everything that surfaced. ~250 lines.
>
> **Deliverable 3: `docs/slices/01-falx-baseline.md`**
> Read `docs/SLICES.md` row for Slice 1 and the existing `docs/slices/00-discovery.md` for spec format conventions. Write a complete spec for Slice 1 ("Falx baseline") that includes:
> - Goal (one sentence)
> - Why it matters (2-3 sentences grounded in what Discovery found)
> - Scope (concrete bullet list): Postgres swap details (which SQLite features are used, what migration story), MinIO swap (where uploaded apps + assets currently land, target bucket layout), `falx-ui/` copy + serve (where the static server reads from now, where it should read from after), visual rebrand details (which strings to swap, header/title/branding spots — cite the dashboard-frontend places to update), `docker-compose.dev.yml` (services: app, postgres, minio, optional emulator), hub-node verification on dev host (two-process local test).
> - Out of scope (explicit)
> - Done when (testable criteria)
> - Estimated effort (rough — solo dev hours)
> - Open decisions for Koray (from `16-open-questions.md` filtered to must-decide-before-Slice-1)
> - Risk callouts (specific to this slice — upstream conflict surface, data migration risks)
>
> Keep grounded in code citations from the discovery docs.
>
> **Deliverable 4: Edit `docs/SLICES.md`**
> - Tick Slice 0 as `[x]` Done in the status table
> - Replace the speculative Slice 2+ candidate list with a concrete, prioritized list of Slice 2 through Slice ~8 candidates, each with a one-line rationale rooted in Discovery findings. Order them by "smallest blast radius / highest leverage first." Keep the longer tail in `docs/BACKLOG.md`. Don't write full specs for Slice 2+ — that happens after Slice 1 lands.
>
> **Conventions:** all four deliverables. Lens headers where doc-format applies. Citations into `docs/discovery/*.md` and source files. Spec file follows the same shape as `docs/slices/00-discovery.md`.

- [ ] **Step 3: Two-stage review of Agent J output**

1. Read all four deliverables.
2. Verify: SLICES.md tick happened. Slice 1 spec is concrete (no "TBD"). Open questions are decisions the user can actually answer. Strengths/weaknesses cite the discovery docs.
3. Spot-check 3 citations from the synthesis docs back to source.
4. If issues: targeted fix-up dispatch.

---

## Group D — Final wrap (controller)

### Task K: Index file

**Files:**
- Create: `docs/discovery/00-index.md`

- [ ] **Step 1: Controller writes the index**

A short `00-index.md` (no agent needed) listing every discovery doc in numbered order with a one-line description, plus pointers to `docs/slices/01-falx-baseline.md` and the updated `docs/SLICES.md`. ~50 lines. Acts as the entry point for future readers.

### Task L: Report back to user

- [ ] **Step 1: Summarize**

End-of-turn summary (1-2 sentences per CLAUDE.md tone guidance): Discovery complete; N docs written; Slice 1 spec drafted; key open questions surfaced for review. Link to `docs/discovery/00-index.md` and `docs/discovery/16-open-questions.md`.

Do NOT auto-commit (per user memory `feedback_no_auto_commit`).

---

## Self-review checklist (controller, before dispatching)

- [x] Every discovery topic from the spec maps to a task above (cross-checked against the bulleted list in `docs/slices/00-discovery.md` lines 36-55)
- [x] No placeholders / TBDs in any subagent prompt
- [x] Each subagent prompt is self-contained (an agent with zero session context can execute it)
- [x] File-naming convention is consistent (`NN-topic.md`)
- [x] Synthesis task explicitly depends on Group B output and lists the consistency-audit pairs
- [x] Slice 1 spec deliverable is concrete and matches CLAUDE.md description of Slice 1
- [x] SLICES.md update is explicit (tick + Slice 2+ rewrite)
- [x] No code changes anywhere — pure documentation
