# ADR 0002 — Test runner for `falx-ui/` is vitest

**Status:** Accepted
**Date:** 2026-05-18
**Decision drivers:** [iOS Input Responsiveness spec (Task 4)](../superpowers/specs/2026-05-18-ios-input-responsiveness-design.md), [iOS Input Responsiveness plan](../superpowers/plans/2026-05-18-ios-input-responsiveness.md), [the `overlay-renderer` unit-test commit `9cab3d7`](#).

## Context

`falx-ui/` is the Vite + React frontend that the device-farm plugin's static server serves. Until now it had no test runner — frontend behavior was verified only via manual smoke + Playwright MCP (agent-side) during slice verification.

The iOS Input Responsiveness slice (Phase 2 Task 4) adds a pure-function canvas overlay renderer (`overlay-renderer.ts`) — pointer-coords in, `CanvasRenderingContext2D` calls out. That kind of pure transformation is exactly the shape that benefits most from cheap fast unit tests, and the slice's TDD discipline calls for them. The Task 4 implementer landed those tests as part of the same commit that added vitest.

CLAUDE.md requires an ADR for new top-level dependencies. This ADR ratifies that addition.

## Decision

**Adopt `vitest` as the test runner for `falx-ui/`.** Tests live next to the module under test as `*.spec.ts`. Test environment is `node` for pure-function modules (no DOM needed); future tests that need a DOM can add `@vitest/browser` or switch the per-file environment to `jsdom` without affecting existing tests.

Dev-dependency added (`falx-ui/package.json`):
- `vitest` ^4.1.6 (all MIT).

Configuration added in `falx-ui/vite.config.js`:
```js
test: {
  environment: 'node',
},
```

`npm test` (in `falx-ui/`) runs the full suite via `vitest run`.

## Alternatives considered

- **No frontend unit tests.** Rely on Playwright MCP for verification. Rejected for pure-function modules where unit tests are 10× cheaper to run than a full Playwright round-trip and catch regressions earlier in the loop.
- **Mocha + chai (matches server convention).** The server uses these for `test/unit/*.spec.ts`. For Vite-bundled React code they require extra glue (TS loader, jsdom setup, module-resolution shims). Vitest is zero-config for a Vite project.
- **Jest.** Industry standard but slow on Vite projects and requires its own transform pipeline. Vitest is the Vite-native equivalent and a strict superset of jest's `expect` API in practice.

## Consequences

- The slice's overlay-renderer tests run green via `npx vitest run` from `falx-ui/`.
- Future falx-ui slices can add `*.spec.ts` files freely without a fresh ADR.
- Server-side tests stay on mocha + chai (no change). The split is deliberate: server tests live in the Node CommonJS world; UI tests live in the Vite ESM world; cross-runner unification would add complexity for no win.
- If a future slice needs DOM-backed component tests (e.g. React Testing Library), add `jsdom` + `@testing-library/react` as additional dev-deps; document in a follow-up ADR if you want, but treat them as natural extensions of this decision rather than fresh strategic choices.

## Retroactive ratification

The vitest install landed in commit `9cab3d7` (Task 4 of the iOS Input Responsiveness slice) as part of the same commit as the overlay renderer. The Task 4 implementer subagent should have reported BLOCKED per the plan's "STOP and ask" instruction; instead it installed vitest and continued. Operator decision after the fact: keep vitest, ratify with this ADR. No further action needed on the commit itself.
