# Slice 0 — Discovery

## Goal

Build complete foundational understanding of the codebase, from every role
lens (architect, engineer, tester, product owner, DevOps, SRE, designer,
UX, analytics expert).

This is reference material we (Claude Code + user) will use for every
subsequent slice. It also surfaces open questions and informs which slices
come next.

## Why this matters

Without this, every later slice starts guessing about the codebase. Discovery
is cheap relative to one wrong architectural decision later. Don't skip it.

## How to run

Open Claude Code in the `falx` repo root. Paste the prompt below as your
first message. Walk away. Come back in a few hours and read.

```text
Follow superpowers. Slice 0 is Discovery, per docs/slices/00-discovery.md.

Read this repo top to bottom:
- src/ (the upstream appium plugin code)
- prisma/ (schema and migrations)
- dashboard-frontend/ (upstream UI — read for understanding, do not modify)
- root config: package.json, tsconfig, README, CHANGELOG, scripts, etc.
- infra-adjacent files if any (Docker, CI, Makefile, etc.)

Produce foundation knowledge as a set of docs/discovery/*.md files. You
decide how many files and how to name them — organize for clarity, not to
hit a quota. At minimum cover (each as its own file or grouped sensibly):

- What the app does and who uses it (product lens)
- High-level architecture and request flow
- Hub/node design and protocol (how nodes register, how sessions route)
- Plugin lifecycle inside Appium 2.x
- Data model (annotated Prisma schema + ERD if useful)
- Auth, users, teams, API tokens, RBAC
- Device management (Android via ADB, iOS via Xcode/WDA on Mac and
  go-ios/tunneld on Linux, tvOS)
- Session lifecycle and queueing
- Plugin extension points (where can we hook in without touching upstream files?)
- UI inventory: every screen in dashboard-frontend, what it does, which
  components are reusable in falx-ui
- DevOps surface (Docker, CI, deploy, env vars, ports)
- Testing surface (what's tested, how, what's not)
- Observability (logs, metrics, traces — what exists, what's missing)
- Security posture (what's good, what's gaps, surface area)
- Performance characteristics and known limits at scale
- Strengths — things we want to preserve
- Weaknesses and risks — things we want to fix, replace, or wrap
- Open questions or decisions for me to make

Take whatever role lens applies for each section. State which lens you're
using when you switch (e.g. "[architect] ...", "[product] ...").

No product code yet. This slice is documentation only.

End with whatever open questions or decisions surfaced naturally — don't
artificially cap the number. Then update docs/SLICES.md to:
- tick Slice 0 as done
- write the Slice 1 spec at docs/slices/01-falx-baseline.md based on what
  you found
- propose concrete Slice 2+ candidates with brief rationale, replacing the
  speculative list currently there
```

## Done when

- All discovery docs in `docs/discovery/` exist and read coherently end-to-end
- Open questions surfaced for review
- `docs/slices/01-falx-baseline.md` written and grounded in reality
- `docs/SLICES.md` updated with informed Slice 2+ candidates
- Slice 0 ticked in `SLICES.md`

## Estimated time

2–4 hours of Claude Code work, mostly reading. Walk away during; review after.

## After Discovery

1. Read everything. Take notes on anything you disagree with or want changed.
2. Come back to chat with the user-facing decisions Claude surfaced.
3. Approve / revise the Slice 1 spec.
4. Start Slice 1.
