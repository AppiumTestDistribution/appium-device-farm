# UI Shell + Light-Theme Devices Page — Design

**Date:** 2026-05-15
**Status:** Design approved by user; ready for implementation plan.
**Slice positioning:** First sub-slice of the planned **Slice 7 — Visual UI refresh**
([SLICES.md](../../SLICES.md)). Lands the new shell + Devices reference page;
leaves the rest of Slice 7 (other pages, MUI retirement, Tremor, full icon
consolidation) for follow-up sub-slices.

---

## 1. Context & Motivation

Falx's current UI ([falx-ui/](../../../falx-ui/)) is the upstream
`dashboard-frontend/` copy, lightly modified. It uses a dark theme
(`bg-[#0F172A]` and `bg-gray-900` baked into components), a horizontal top
nav with yellow accents, and four icon libraries mixed across the codebase
(MUI icons, Heroicons, lucide-react, Flowbite icons).

The product target — referenced via LambdaTest TestMu AI — is a **light,
brand-elegant** shell: a slim top bar carrying page title + utilities,
plus a collapsible left sidebar that reveals on hover (icon rail → labeled
drawer). This design is the first slice of that migration.

### Why first

- The shell touches every protected route — getting it right first unblocks
  per-page light-theme work later.
- The Devices page is the landing route; making it the visual reference
  defines the target aesthetic for all subsequent page migrations.
- Doing **only** the shell + Devices keeps PR scope small and ships a
  visible win without committing to the full theme migration in one go.

---

## 2. Goals & Non-Goals

### In scope (this slice)

1. New `AppLayout` component owning the top bar + sidebar shell.
2. New `TopBar` with page title (left) + utility cluster (right).
3. New `Sidebar` with icon rail + hover-to-peek drawer + pin toggle
   (persisted in `localStorage`).
4. Light theme tokens added to `tailwind.config.js`.
5. Devices page (`device-explorer/`, `devicecard/`) converted to light
   theme using the new tokens.
6. Audit of remaining protected pages to ensure each sets its own dark
   background, since the wrapping `bg-gray-900` div in
   `ProtectedRouteWrapper` is being removed. Pages to verify, from
   [App.tsx](../../../falx-ui/src/App.tsx): `Builds`, `AppList`,
   `EnhancedTrends`, `AdminDashboard`, `Users`, `Teams`, `Devices` (admin),
   `Servers`, `ProfilePage`. Each must explicitly set `bg-gray-900` (or
   equivalent) on its own root element; add it where missing.
7. Old `Header` component deleted; route wrapper updated to compose
   `AppLayout` around children.

### Explicitly out of scope (deferred)

- Builds, Apps, Stats, Servers, terminal, session modals — pages stay dark.
- `ProfilePopup` internals — kept on dark styling; touched in a later slice.
- Login page — keeps its current standalone layout (no shell wrap).
- Runtime light/dark **theme toggle** — single-theme per phase for now.
- Cmd-K global search, notifications bell, breadcrumbs.
- Replacing MUI / Flowbite / Heroicons. Existing components in untouched
  pages keep their styling and dependencies. **No new MUI usage in any
  new code.**
- Introducing shadcn/ui. This slice's shell is custom composition; shadcn/ui
  earns its keep when we need primitives (Dialog, DropdownMenu, Select,
  Tooltip, Popover, Command, DataTable) in subsequent slices. That
  introduction will arrive with its own ADR per CLAUDE.md.

---

## 3. Design

### 3.1 Component architecture

```
falx-ui/src/components/layout/
├── AppLayout.tsx           # composes TopBar + Sidebar + <main>
├── TopBar.tsx              # page title (left) + utilities (right)
├── Sidebar.tsx             # rail + drawer; owns hover/pin state
├── SidebarItem.tsx         # icon + label + active styling
├── usePinned.ts            # localStorage-backed pin state hook
└── useCurrentPageTitle.ts  # derives page title from route
```

Composition wiring in `App.tsx`:

```tsx
// ProtectedRouteWrapper
<ProtectedRoute adminOnly={adminOnly}>
  <AppLayout>
    {children}
  </AppLayout>
</ProtectedRoute>
```

`AppLayout` shape:

```tsx
<div className="min-h-screen bg-app-bg text-text">
  <TopBar />                                {/* sticky top, h-14 */}
  <Sidebar />                               {/* fixed left, h-screen-minus-topbar */}
  <main className={pinned ? 'ml-[240px]' : 'ml-[56px]'}>
    {children}
  </main>
</div>
```

- **Pin state** is owned by a `SidebarLayoutContext` provider rendered
  inside `AppLayout` (so both `Sidebar` and `<main>` see the same source
  of truth). `Sidebar` writes to it (via `usePinned()` which also handles
  the `localStorage` round-trip); `<main>` reads from it to compute its
  left margin. Avoids prop-drilling and keeps each consumer's surface small.
- **`/login` is not wrapped** — it keeps its existing standalone layout.
- The existing `<Header />` component is **deleted**, not kept for fallback.
- The page-level `<div className="bg-gray-900">` wrapper currently in
  `ProtectedRouteWrapper` is **removed**. Pages that still need dark
  backgrounds must set them on their own root element. Audit + add where
  missing as part of this slice.

### 3.2 Sidebar

**Dimensions**

- Rail (collapsed): 56px wide.
- Drawer (expanded): 240px wide.
- Top bar height: 56px. Sidebar starts at `top: 56px` and extends to viewport
  bottom. Top bar spans full width above. (L-corner formed by top-bar +
  rail.)

**Behavior**

- **Hover-peek**: cursor enters rail → 120ms open delay → drawer expands as
  **overlay** (drop shadow, z above page content, page content does not
  shift). Cursor leaves drawer → 250ms close delay (forgiving for diagonal
  travel toward an active link).
- **Pin**: chevron-double-right icon in drawer header (visible when
  expanded). Click → `pinned=true` → drawer stays open AND `<main>`'s
  left margin shifts from 56px to 240px (content now sits beside the
  drawer, not under it). Chevron flips. Click again → `pinned=false`.
  State persisted in `localStorage` under key `falx.sidebar.pinned`.
- **Keyboard**: `[` toggles pin. Tab moves through items in DOM order.
- **No drill-in**: flat list. Admin section sits below the primary section
  separated by a thin divider.

**Animation** (using framer-motion, already a dependency)

- Width animates with `spring` (stiffness 300, damping 30) — gentle
  settle, no bounce.
- Labels wrap in `<motion.span>` with `opacity: 0 → 1` and `x: -4 → 0`,
  staggered ~20ms per item.
- Respect `prefers-reduced-motion`: drop to a 100ms `tween` with no x-offset.

**Content layout** (top → bottom)

```
┌─────────────────────────────────┐
│  ◆  Falx              [pin]     │   header: logo + wordmark + pin button
├─────────────────────────────────┤
│  📱  Devices                    │   primary section
│  🔨  Builds                     │
│  📦  Apps                       │
│  📊  Stats                      │
│  🖥️  Servers                    │
├─────────────────────────────────┤    divider (admin-only users)
│  👥  Users                      │   admin section
│  🏢  Teams                      │
│  ⚙️  Device admin               │
│  🛡️  Admin dashboard            │
│                                  │
│         (flex spacer)            │
│                                  │
├─────────────────────────────────┤
│  ❓  Help (GitHub link)         │   bottom utility section
│  👤  Profile (avatar + name)    │
└─────────────────────────────────┘
```

Items are routed via `react-router-dom` `NavLink`; active state derives
from `useLocation()` matching `path`.

**Active state styling**

- Active item: `bg-brand-soft text-brand` with a 2px left border in `bg-brand`.
- Hover: `bg-surface-2 text-text-strong`.
- Default: `text-text-muted`.
- Icons inherit color via `currentColor`.

**Icons** — exclusively `lucide-react` (already installed): `Smartphone`,
`Hammer`, `Package`, `BarChart3`, `Server`, `Users`, `Building2`,
`Settings`, `ShieldCheck`, `LifeBuoy`, `User`. MUI icons stay in untouched
existing pages.

### 3.3 Top bar

**Container**

- `position: sticky; top: 0`, full width.
- Height 56px (matches sidebar rail width — visually clean L-corner).
- `bg-surface border-b border-border-soft`.
- z-index above page content, below sidebar drawer (so drawer shadow falls
  over the top bar when it expands).

**Layout**

```
┌────────────────────────────────────────────────────────────────────┐
│ Devices                                          [GitHub]  [Avatar]│
└────────────────────────────────────────────────────────────────────┘
```

- **Left**: page title — `text-lg font-semibold text-text-strong`,
  padded `pl-6` from rail edge. Source: `useCurrentPageTitle()`.
- **Right**: utility cluster, `gap-3 pr-6`:
  - GitHub link → `text-text-muted hover:text-text-strong`
  - Avatar button → reuses existing `<Avatar />` + `<ProfilePopup />`
    (popup gets its light-theme touch-up in a later slice).

**Dropped from current header**

- Horizontal nav tabs (Devices / Builds / Apps / Stats / Servers) — now in sidebar.
- Yellow accent — replaced by indigo, but not in the top bar itself
  (top bar stays neutral).
- `FalX` wordmark — moves to sidebar drawer header.

### 3.4 Theme tokens

Added under `theme.extend.colors` in `tailwind.config.js`. Semantic names
so an eventual dark-theme variant is a config swap rather than a
search-and-replace.

```js
colors: {
  // Surfaces
  'app-bg':       '#F8FAFC',  // slate-50  — page background
  'surface':      '#FFFFFF',  //            — cards, drawer, top bar
  'surface-2':    '#F1F5F9',  // slate-100 — sidebar rail, hover
  'border-soft':  '#E2E8F0',  // slate-200 — dividers
  'border':       '#CBD5E1',  // slate-300 — card outlines

  // Text
  'text-strong':  '#0F172A',  // slate-900 — titles
  'text':         '#334155',  // slate-700 — body
  'text-muted':   '#64748B',  // slate-500 — labels, helper text
  'text-faint':   '#94A3B8',  // slate-400 — placeholders, default icons

  // Brand (indigo)
  'brand':        '#4F46E5',  // indigo-600 — primary actions, active states
  'brand-hover':  '#4338CA',  // indigo-700
  'brand-soft':   '#EEF2FF',  // indigo-50  — active item bg in sidebar
  'brand-ring':   '#A5B4FC',  // indigo-300 — focus rings

  // Status (light-bg-tuned; existing pages keep their tones)
  'status-ok':    '#10B981',
  'status-warn':  '#F59E0B',
  'status-err':   '#EF4444',
  'status-info':  '#3B82F6',
}
```

Token usage in this slice:

| Surface | Tokens |
|---|---|
| `AppLayout` root | `bg-app-bg text-text` |
| `TopBar` | `bg-surface border-b border-border-soft` |
| `Sidebar` rail | `bg-surface-2 border-r border-border-soft` |
| `Sidebar` drawer | `bg-surface shadow-xl` |
| Active sidebar item | `bg-brand-soft text-brand` + `border-l-2 border-brand` |
| Focus ring (interactive) | `ring-2 ring-brand-ring` |

Existing dark pages continue to use their hardcoded `bg-gray-900`,
`text-white` etc. — they are **not** retrofitted in this slice.

### 3.5 Devices page light treatment

The Devices page is the reference for "what light-theme Falx looks like."

- **Page background**: `bg-app-bg` (slate-50). Dark backdrop removed.
- **Cards**: `bg-surface border border-border-soft rounded-lg shadow-sm`.
  Hover: `shadow-md` + `translate-y-[-1px]` (subtle lift).
- **Device name** (currently yellow): `text-text-strong font-semibold`.
  The yellow accent read as "highlight" on dark; in light theme the
  weight alone is sufficient.
- **OS version pill** (`v10`, `v11`): `bg-surface-2 text-text-muted`, no border.
- **Status badges** (Real / Local / Ready / Booted): keep color encoding but
  switch to light tints — e.g. `bg-emerald-50 text-emerald-700
  border border-emerald-100`. The existing badge component gets a light
  variant; the dark variant remains for the still-dark pages.
- **Metadata row** (IP, uptime, tags): icons `text-text-faint`, values
  `text-text-muted text-sm`.
- **"Use Device" button** (primary): `bg-brand text-white hover:bg-brand-hover`.
- **"Block" button** (secondary): `bg-surface border border-border
  text-text hover:bg-surface-2`.
- **Filter bar**:
  - Search input: `bg-surface border border-border-soft rounded-md` with
    leading `Search` icon (`text-text-faint`). Focus: `ring-2 ring-brand-ring
    border-brand`.
  - "Filter" button: secondary outlined style (matches Block).

**Scope discipline:** only the Devices page tree is touched
(`device-explorer/`, `devicecard/`, plus the filter/header within
`device-explorer`). All other pages are untouched.

---

## 4. Acceptance Criteria

1. Sidebar rail visible on all protected routes; hover-peek + pin work;
   pin state persists across reload.
2. Top bar shows the correct page title for each route; avatar opens the
   existing `ProfilePopup`.
3. Devices page renders fully light-themed — no dark patches in cards,
   badges, buttons, filter bar, or backdrop.
4. Other protected pages still render correctly with their own dark
   backgrounds — no regressions from the removed `bg-gray-900` wrapper.
5. Keyboard: Tab order through sidebar is logical; `[` toggles pin;
   focus rings are visible on all interactive elements.
6. `prefers-reduced-motion`: drawer opens/closes without spring animation.
7. Light-theme contrast: every text-on-background pair meets WCAG AA
   (4.5:1 for body, 3:1 for large text).
8. `npm run build` succeeds; `npm run lint` reports clean.

---

## 5. Execution Approach

- **Methodology**: follow `superpowers:subagent-driven-development`.
  Controller (main thread) stays in coordination role; per-task subagents
  perform the work. Per-task model selection in the plan. Two-stage review
  at each task. Group-end consistency audit before declaring done.
- **Task decomposition**: tokens → layout primitives → sidebar →
  top bar → Devices page → audit dark pages for missing wrapper →
  verification. Each task is bounded to a single concern.
- **One PR for the whole slice** (per CLAUDE.md "one slice per PR").
- **Verification (manual, since this is visual)**: dev server up, click
  through every protected route, take screenshots, compare against design
  intent. State explicitly what was tested and what wasn't — no claiming
  "done" without browser verification.

---

## 6. Open Questions

None blocking. Decisions deferred to follow-up slices:

- Whether to formally renumber this as Slice 7a (vs. keeping it as a sub-task
  of Slice 7). User decision when reconciling with [SLICES.md](../../SLICES.md).
- Whether the eventual full migration retires MUI entirely or keeps it for
  isolated complex pages. ADR when Slice 7's next sub-slice begins.
- Timing of shadcn/ui introduction — driven by the first slice that needs a
  primitive (Dialog, DropdownMenu, Select, Tooltip, Popover, Command,
  DataTable, etc.). ADR at that point.

---

## 7. References

- [CLAUDE.md](../../../CLAUDE.md) — project conventions, "no new MUI usage"
  is consistent with the stated UI refresh direction.
- [SLICES.md](../../SLICES.md) — Slice 7 (Visual UI refresh) is the parent
  initiative this slice belongs to.
- [docs/discovery/09-ui-inventory.md](../../discovery/09-ui-inventory.md) —
  inventory of current UI dependencies (MUI + Flowbite + four icon
  libraries, slate-on-slate hack), motivation for the refresh.
- LambdaTest TestMu AI screenshots (user-supplied in brainstorming
  conversation) — visual reference for hover-peek drawer pattern.
