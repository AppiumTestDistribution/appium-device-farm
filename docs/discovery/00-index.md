# Discovery Index

Foundation knowledge produced by Slice 0 — Discovery. Every doc opens with a
role-lens header and cites source paths with line numbers. Living docs:
refresh after any upstream merge or after a slice fundamentally changes a
subsystem (see `CLAUDE.md § Workflow`).

## Read order

For full context, read in order. For targeted work, jump to the relevant doc.

| # | Doc | Lens | Approximate length |
|---|-----|------|--------------------|
| 01 | [Product](01-product.md) | product | 144L |
| 02 | [Architecture](02-architecture.md) | architect | 396L |
| 03 | [Hub/node protocol](03-hub-node-protocol.md) | architect + engineer | 370L |
| 04 | [Plugin lifecycle & extension points](04-plugin-lifecycle-and-extension-points.md) | engineer | 426L |
| 05 | [Data model](05-data-model.md) | engineer | 386L |
| 06 | [Auth & RBAC](06-auth-rbac.md) | engineer + security | 463L |
| 07 | [Device management](07-device-management.md) | engineer | 690L |
| 08 | [Session lifecycle & queueing](08-session-lifecycle.md) | engineer + SRE | 638L |
| 09 | [UI inventory](09-ui-inventory.md) | UX + designer + frontend | 386L |
| 10 | [DevOps](10-devops.md) | DevOps | 331L |
| 11 | [Testing](11-testing.md) | tester | 247L |
| 12 | [Observability](12-observability.md) | SRE | 199L |
| 13 | [Security posture](13-security.md) | security | 377L |
| 14 | [Performance & scale](14-performance.md) | SRE + architect | 261L |
| 15 | [Strengths, weaknesses, risks](15-strengths-weaknesses-risks.md) | architect synthesis | 434L |
| 16 | [Open questions](16-open-questions.md) | synthesis | 465L |

Total: ~5,700 lines across 16 docs.

## After reading

- Decisions blocked on the user: see [16-open-questions § Group 1](16-open-questions.md) (10 items must-decide-before-Slice-1).
- Slice 1 spec: [`docs/slices/01-falx-baseline.md`](../slices/01-falx-baseline.md).
- Slice 2+ roadmap: [`docs/SLICES.md`](../SLICES.md).
- Long-tail ideas: [`docs/BACKLOG.md`](../BACKLOG.md).

## Conventions used in these docs

- `**Lens:** <role>` header at the top of each doc; inline tags like `[architect]`, `[SRE]` mark lens switches.
- Citations as relative markdown links: `[plugin.ts:42](../../src/plugin.ts#L42)`.
- `**Unknown:**` flags claims the code didn't answer; `**Risk:**` flags security/operational hazards (factual, not editorial — opinions live in 15-strengths-weaknesses-risks.md).
- Upstream behavior described as-is. Falx hasn't diverged yet; divergence will be tracked in slice specs and discovery refreshes.

## Refresh triggers

Per [CLAUDE.md § Workflow](../../CLAUDE.md):

1. Upstream merge brings substantial changes to a covered subsystem.
2. A shipped slice fundamentally changes a covered subsystem.
3. More than ~10 slices have shipped since last refresh on a doc.

Refresh = update what changed; don't rewrite. Note lessons in `docs/BACKLOG.md` if relevant.
