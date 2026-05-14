# Falx — Claude Code project context

## What this is

Falx is an on-prem device farm for mobile test automation. This repo is a fork of
`AppiumTestDistribution/appium-device-farm` (tracked as `upstream` remote). We
build our product on top — UI, control logic, integrations, ops — while keeping
the appium plugin engine intact underneath.

## Naming

- **Plugin slug stays `device-farm`** — that's the Appium plugin name. Don't
  rename it in `package.json`, plugin registration, or internal references.
- **"Falx"** is the product/UI/dashboard brand. The customer never sees
  "appium" in deployed UI text, container names, deployment artifacts, or
  customer-facing docs. Branding wrapping happens at the Docker / Terraform /
  Ansible layer and inside `falx-ui/`.

## Repo layout

- `src/`, `prisma/` — upstream code. We edit freely when needed for speed.
  Conflicts on upstream merges are our problem to manage later. Keep edits
  focused, commit them in their own commits with clear messages so they're
  easy to spot during merges.
- `dashboard-frontend/` — **upstream UI. Do not modify.** Kept as-is so upstream
  UI updates merge cleanly. Not served in our build.
- `falx-ui/` — our UI. Copied from `dashboard-frontend/` and modified here. This
  is what the plugin's static server actually serves.
- `docs/` — discovery, slices, decisions, backlog. Living documents.
- `infra/` — Docker compose, Terraform, Ansible, CI runners.
- `CLAUDE.md` — this file.

## Upstream relationship

- `upstream` remote: <https://github.com/AppiumTestDistribution/appium-device-farm>
- We merge from `upstream/main` periodically.
- Conflicts in `src/`, `prisma/` are expected and resolved manually.
- Conflicts in `dashboard-frontend/` should never happen (we don't touch it).
- `falx-ui/` is entirely ours; no upstream conflicts possible there.

## Stack (committed)

- Backend: Node.js + Express (upstream's stack), Prisma ORM, Appium 2.x plugin runtime
- DB: **PostgreSQL** (migrate from upstream's SQLite as part of Slice 1)
- Object storage: **MinIO** (S3-compatible, on-prem-friendly)
- UI: React 18 + Vite (upstream's stack); MUI + Flowbite + Tailwind kept for now
- Realtime: WebSockets (upstream's `ws`)
- Logging: Pino structured JSON to stdout

UI library refresh (shadcn/ui + Tremor) and a separate control-plane API
(NestJS) are deferred — see `docs/BACKLOG.md`.

## Methodology

This project uses **obra/superpowers**. Follow its skills.

- Brainstorm before designing.
- Plan before implementing.
- Subagent-driven execution for tasks spanning >1 file or >1 concern.
- Main context stays orchestrator; spawn subagents for actual work.

## Roles you play

Per task, take whichever lens applies — architect, engineer, tester, product
owner, DevOps, SRE, designer, UX, analytics expert. Most slices need 2–3 of
these. State which lens you're using when you switch.

## Hard rules

- **Never modify `dashboard-frontend/`.** All UI work happens in `falx-ui/`.
- Postgres only after Slice 1. No new SQLite usage.
- New top-level dependencies require an ADR in `docs/decisions/`.
- Start simple. No premature abstraction.
- One slice per PR. If it grows, split it.
- After any merge from `upstream`, run discovery refresh on affected paths
  (see Workflow below).

## Workflow

### When starting a new slice

1. Read `docs/SLICES.md`, pick the lowest unchecked one.
2. Read its spec in `docs/slices/NN-*.md`. If missing, write it first.
3. Brainstorm (superpowers will prompt this).
4. Plan (superpowers will prompt this).
5. Execute via subagents.
6. Update relevant `docs/discovery/*.md` files if behavior changed.
7. Tick the slice in `SLICES.md`. Open PR.

### After merging from upstream

1. `git diff upstream/main..HEAD~1 --stat` to see what changed.
2. Ask Claude Code:

   > Upstream merge just landed. Diff:
   > <paste output of `git diff HEAD~1..HEAD --stat`>
   >
   > Refresh `docs/discovery/*.md` for any files affected. Update only what
   > changed; don't rewrite. Note anything in `docs/BACKLOG.md` under
   > "Lessons" if relevant.

3. Commit the refreshed docs.

### Discovery refresh

Discovery docs are living. Trigger a refresh when:

- Upstream merge brings substantial changes (workflow above)
- A slice fundamentally changes a subsystem (part of slice done-criteria)
- More than ~10 slices have shipped since last refresh on a given doc (audit run)

## Commands

(Filled in during Slice 1 — depends on what the foundation setup lands on.)

## Current focus

- `docs/SLICES.md` — work the lowest unchecked slice.
- `docs/discovery/` — current understanding of the codebase.
- `docs/BACKLOG.md` — deferred ideas, future tech, lessons logged.
