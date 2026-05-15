# UI Shell + Light-Theme Devices Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Per-task fresh subagents; two-stage review at each task; group-end consistency audit. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a new light-theme app shell (top bar + hover-peek/pinnable sidebar) and convert the Devices page to match. Other pages stay dark for now.

**Architecture:** Single `AppLayout` composer owns the top bar and sidebar. `SidebarLayoutContext` carries pin/hover state from `Sidebar` (writer) to `<main>` (reader). Semantic Tailwind tokens (`bg-app-bg`, `text-brand`, etc.) added to `tailwind.config.js` — no new dependencies. framer-motion (already installed) drives the rail→drawer animation. lucide-react (already installed) supplies icons.

**Tech Stack:** React 18, TypeScript, react-router-dom 6, Tailwind 3, framer-motion (existing), lucide-react (existing). No new packages.

**Spec:** [docs/superpowers/specs/2026-05-15-ui-shell-light-theme-design.md](../specs/2026-05-15-ui-shell-light-theme-design.md)

**Verification discipline:** falx-ui currently has no test infrastructure (no vitest/jest, no spec files). Introducing one is its own slice (needs an ADR per CLAUDE.md). For this slice, each task uses **TypeScript compile + lint + browser verification** as the discipline. TypeScript types act as the lightweight contract; pure-logic hooks are written so their behavior is obvious from reading their 10-20 lines.

---

## File Map

### New files (all under `falx-ui/src/components/layout/`)

| File | Responsibility |
|---|---|
| `AppLayout.tsx` | Composes provider + shell. Public export of the slice. |
| `SidebarLayoutContext.tsx` | React context + provider for pin/hover state. |
| `usePinned.ts` | localStorage-backed `pinned` boolean hook. |
| `useCurrentPageTitle.ts` | Maps current route to a page title string. |
| `TopBar.tsx` | Sticky bar: page title left, utilities right. |
| `Sidebar.tsx` | Fixed rail + hover drawer + pin button + nav sections. |
| `SidebarItem.tsx` | One NavLink row with icon + (drawer-only) label. |
| `logo.ts` | Re-export of existing logo from `header/logo.ts` for layout use. |

### Modified files

| File | Change |
|---|---|
| `falx-ui/tailwind.config.js` | Add semantic token palette under `theme.extend.colors`. |
| `falx-ui/src/App.tsx` | Replace `<Header />` wrapper with `<AppLayout>`; drop `bg-gray-900` shell div. |
| `falx-ui/src/components/devicecard/DeviceCard.tsx` | Light theme. |
| `falx-ui/src/components/device-explorer/device-explorer.tsx` | Light theme for page-level chrome (page bg, filter bar, search). |
| 9 page roots (see Task 11) | Add explicit `bg-gray-900` to roots that relied on the removed wrapper. |

### Deleted files

| File | Reason |
|---|---|
| `falx-ui/src/components/header/Header.tsx` | Replaced by `AppLayout`. |
| `falx-ui/src/components/header/NewHeader.tsx` | Dead code (no imports anywhere). |

### Kept as-is

- `falx-ui/src/components/header/ProfilePopup.tsx` — reused by `TopBar`. Light-theme touch-up deferred.
- `falx-ui/src/components/header/logo.ts` — kept; a re-export wrapper in `layout/logo.ts` lets the layout import cleanly without a header coupling. (When the header/ dir is fully retired in a later slice, we move it.)

---

## Group A — Foundation (tokens + hooks)

### Task 1: Add light-theme tokens to Tailwind

**Files:**
- Modify: `falx-ui/tailwind.config.js`

- [ ] **Step 1: Extend `theme.extend.colors` with the semantic palette**

In `tailwind.config.js`, inside `theme.extend`, add a `colors` block:

```js
colors: {
  // Surfaces
  'app-bg':      '#F8FAFC',
  'surface':     '#FFFFFF',
  'surface-2':   '#F1F5F9',
  'border-soft': '#E2E8F0',
  'border':      '#CBD5E1',

  // Text
  'text-strong': '#0F172A',
  'text':        '#334155',
  'text-muted':  '#64748B',
  'text-faint':  '#94A3B8',

  // Brand (indigo)
  'brand':       '#4F46E5',
  'brand-hover': '#4338CA',
  'brand-soft':  '#EEF2FF',
  'brand-ring':  '#A5B4FC',

  // Status (light-bg-tuned)
  'status-ok':   '#10B981',
  'status-warn': '#F59E0B',
  'status-err':  '#EF4444',
  'status-info': '#3B82F6',
},
```

Place this **before** the existing `animation` key inside `extend`, so the block reads `extend: { colors: {...}, animation: {...}, keyframes: {...} }`.

- [ ] **Step 2: Verify the build still passes**

Run: `cd falx-ui && npm run build`
Expected: build succeeds. No TS errors.

- [ ] **Step 3: Commit**

```bash
git add falx-ui/tailwind.config.js
git commit -m "feat(ui): add semantic light-theme tokens to tailwind config"
```

---

### Task 2: `useCurrentPageTitle` hook + route title map

**Files:**
- Create: `falx-ui/src/components/layout/useCurrentPageTitle.ts`

- [ ] **Step 1: Create the hook**

Write `falx-ui/src/components/layout/useCurrentPageTitle.ts`:

```ts
import { useLocation } from 'react-router-dom';

const TITLE_BY_PATH: Array<[RegExp, string]> = [
  [/^\/(device-farm)?\/?$/, 'Devices'],
  [/^\/builds(\/|$)/, 'Builds'],
  [/^\/device-farm\/builds(\/|$)/, 'Builds'],
  [/^\/apps(\/|$)/, 'Apps'],
  [/^\/stats(\/|$)/, 'Stats'],
  [/^\/servers(\/|$)/, 'Servers'],
  [/^\/admin(\/|$)/, 'Admin'],
  [/^\/users(\/|$)/, 'Users'],
  [/^\/teams(\/|$)/, 'Teams'],
  [/^\/devices(\/|$)/, 'Device administration'],
  [/^\/profile(\/|$)/, 'Profile'],
];

export function useCurrentPageTitle(): string {
  const { pathname } = useLocation();
  for (const [pattern, title] of TITLE_BY_PATH) {
    if (pattern.test(pathname)) return title;
  }
  return 'Falx';
}
```

- [ ] **Step 2: Verify TypeScript compile**

Run: `cd falx-ui && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/components/layout/useCurrentPageTitle.ts
git commit -m "feat(ui): add useCurrentPageTitle hook"
```

---

### Task 3: `SidebarLayoutContext` + `usePinned` hook

**Files:**
- Create: `falx-ui/src/components/layout/usePinned.ts`
- Create: `falx-ui/src/components/layout/SidebarLayoutContext.tsx`

- [ ] **Step 1: Create `usePinned` hook**

Write `falx-ui/src/components/layout/usePinned.ts`:

```ts
import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'falx.sidebar.pinned';

function readInitial(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function usePinned(): [boolean, (next: boolean) => void] {
  const [pinned, setPinnedState] = useState<boolean>(readInitial);

  const setPinned = useCallback((next: boolean) => {
    setPinnedState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // localStorage may be disabled; silent.
    }
  }, []);

  // Keyboard shortcut: `[` toggles pin.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '[') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      setPinned(!pinned);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned, setPinned]);

  return [pinned, setPinned];
}
```

- [ ] **Step 2: Create `SidebarLayoutContext`**

Write `falx-ui/src/components/layout/SidebarLayoutContext.tsx`:

```tsx
import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { usePinned } from './usePinned';

interface SidebarLayoutValue {
  pinned: boolean;
  setPinned: (next: boolean) => void;
  hovering: boolean;
  setHovering: (next: boolean) => void;
  /** True when the drawer is visible (pinned or hovering). */
  expanded: boolean;
}

const SidebarLayoutContext = createContext<SidebarLayoutValue | undefined>(undefined);

export function SidebarLayoutProvider({ children }: { children: ReactNode }) {
  const [pinned, setPinned] = usePinned();
  const [hovering, setHovering] = useState(false);
  const value = useMemo<SidebarLayoutValue>(
    () => ({
      pinned,
      setPinned,
      hovering,
      setHovering,
      expanded: pinned || hovering,
    }),
    [pinned, setPinned, hovering],
  );
  return <SidebarLayoutContext.Provider value={value}>{children}</SidebarLayoutContext.Provider>;
}

export function useSidebarLayout(): SidebarLayoutValue {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) throw new Error('useSidebarLayout must be used inside <SidebarLayoutProvider>');
  return ctx;
}
```

- [ ] **Step 3: Verify TypeScript compile**

Run: `cd falx-ui && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add falx-ui/src/components/layout/usePinned.ts falx-ui/src/components/layout/SidebarLayoutContext.tsx
git commit -m "feat(ui): add SidebarLayoutContext and usePinned hook"
```

---

## Group A — Consistency audit

Before moving to Group B:

- [ ] **Confirm**: `tailwind.config.js` colors block sits inside `theme.extend`, sibling to `animation` and `keyframes`. (Not at `theme` root — that would replace the default palette.)
- [ ] **Confirm**: `usePinned`'s storage key `falx.sidebar.pinned` matches the spec's documented key.
- [ ] **Confirm**: `useCurrentPageTitle` regexes cover every protected route from `App.tsx`. Spot-check against [App.tsx:50-64](../../../falx-ui/src/App.tsx#L50-L64).

---

## Group B — Shell primitives

### Task 4: `SidebarItem` component

**Files:**
- Create: `falx-ui/src/components/layout/SidebarItem.tsx`

- [ ] **Step 1: Create the component**

Write `falx-ui/src/components/layout/SidebarItem.tsx`:

```tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useSidebarLayout } from './SidebarLayoutContext';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  /** When provided, treat any path starting with this prefix as active. */
  matchPrefix?: string;
}

export function SidebarItem({ icon: Icon, label, to, matchPrefix }: SidebarItemProps) {
  const { expanded } = useSidebarLayout();

  return (
    <NavLink
      to={to}
      end={!matchPrefix}
      aria-label={label}
      title={!expanded ? label : undefined}
      className={({ isActive }) => {
        const active =
          isActive ||
          (matchPrefix !== undefined && window.location.pathname.startsWith(matchPrefix));
        const base =
          'relative flex items-center h-10 mx-2 rounded-md text-sm transition-colors';
        const state = active
          ? 'bg-brand-soft text-brand'
          : 'text-text-muted hover:bg-surface-2 hover:text-text-strong';
        return `${base} ${state}`;
      }}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              aria-hidden
              className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-brand"
            />
          )}
          <span className="flex items-center justify-center w-10 shrink-0">
            <Icon size={18} strokeWidth={2} />
          </span>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap pr-3 font-medium"
            >
              {label}
            </motion.span>
          )}
        </>
      )}
    </NavLink>
  );
}
```

- [ ] **Step 2: Verify TypeScript compile**

Run: `cd falx-ui && npx tsc --noEmit`
Expected: no errors. (lucide-react ships its own types; framer-motion ships its own types.)

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/components/layout/SidebarItem.tsx
git commit -m "feat(ui): add SidebarItem component"
```

---

### Task 5: `Sidebar` component (rail + drawer + sections)

**Files:**
- Create: `falx-ui/src/components/layout/logo.ts`
- Create: `falx-ui/src/components/layout/Sidebar.tsx`

- [ ] **Step 1: Re-export the logo for layout use**

Write `falx-ui/src/components/layout/logo.ts`:

```ts
export { logo } from '../header/logo';
```

This lets `Sidebar` import from `./logo` without leaking the header path. When `header/` is fully retired in a later slice, only this file moves.

- [ ] **Step 2: Create the Sidebar component**

Write `falx-ui/src/components/layout/Sidebar.tsx`:

```tsx
import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Smartphone,
  Hammer,
  Package,
  BarChart3,
  Server,
  Users,
  Building2,
  Settings,
  ShieldCheck,
  LifeBuoy,
  ChevronsRight,
  Github,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebarLayout } from './SidebarLayoutContext';
import { SidebarItem } from './SidebarItem';
import { logo } from './logo';

const RAIL_WIDTH = 56;
const DRAWER_WIDTH = 240;
const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 250;

export function Sidebar() {
  const { pinned, setPinned, hovering, setHovering, expanded } = useSidebarLayout();
  const { isAdmin } = useAuth();
  const reduceMotion = useReducedMotion();

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  const handleEnter = () => {
    if (pinned) return;
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    openTimer.current = window.setTimeout(() => setHovering(true), OPEN_DELAY_MS);
  };

  const handleLeave = () => {
    if (pinned) return;
    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    closeTimer.current = window.setTimeout(() => setHovering(false), CLOSE_DELAY_MS);
  };

  useEffect(() => clearTimers, []);

  return (
    <motion.aside
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      animate={{ width: expanded ? DRAWER_WIDTH : RAIL_WIDTH }}
      transition={
        reduceMotion
          ? { duration: 0.1 }
          : { type: 'spring', stiffness: 300, damping: 30 }
      }
      className={[
        'fixed left-0 top-14 bottom-0 z-40',
        'flex flex-col',
        'bg-surface-2 border-r border-border-soft',
        // Drawer overlay shadow only when hover-expanded (not pinned).
        expanded && !pinned ? 'bg-surface shadow-xl' : '',
        pinned ? 'bg-surface' : '',
      ].join(' ')}
      aria-label="Primary"
    >
      {/* Header row: logo (+ wordmark + pin when expanded) */}
      <div className="flex items-center h-12 px-3 shrink-0">
        <img src={logo} alt="" className="h-7 w-7 shrink-0" />
        {expanded && (
          <>
            <span className="ml-2 font-semibold text-text-strong tracking-tight">Falx</span>
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              aria-label={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
              aria-pressed={pinned}
              className="ml-auto rounded p-1 text-text-muted hover:bg-surface-2 hover:text-text-strong focus:outline-none focus:ring-2 focus:ring-brand-ring"
            >
              <ChevronsRight
                size={16}
                className={`transition-transform ${pinned ? 'rotate-180' : ''}`}
              />
            </button>
          </>
        )}
      </div>

      <div className="h-px bg-border-soft mx-2" />

      {/* Primary section */}
      <nav className="flex flex-col py-2 gap-0.5">
        <SidebarItem icon={Smartphone} label="Devices" to="/" />
        <SidebarItem icon={Hammer} label="Builds" to="/builds" matchPrefix="/builds" />
        <SidebarItem icon={Package} label="Apps" to="/apps" />
        <SidebarItem icon={BarChart3} label="Stats" to="/stats" />
        <SidebarItem icon={Server} label="Servers" to="/servers" matchPrefix="/servers" />
      </nav>

      {/* Admin section (only for admins) */}
      {isAdmin() && (
        <>
          <div className="h-px bg-border-soft mx-2" />
          <nav className="flex flex-col py-2 gap-0.5">
            <SidebarItem icon={Users} label="Users" to="/users" />
            <SidebarItem icon={Building2} label="Teams" to="/teams" />
            <SidebarItem icon={Settings} label="Device admin" to="/devices" />
            <SidebarItem icon={ShieldCheck} label="Admin" to="/admin" />
          </nav>
        </>
      )}

      <div className="flex-1" />

      {/* Bottom utility section */}
      <div className="h-px bg-border-soft mx-2" />
      <div className="flex flex-col py-2 gap-0.5">
        <a
          href="https://github.com/AppiumTestDistribution/appium-device-farm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          title={!expanded ? 'GitHub' : undefined}
          className="relative flex items-center h-10 mx-2 rounded-md text-sm text-text-muted hover:bg-surface-2 hover:text-text-strong transition-colors"
        >
          <span className="flex items-center justify-center w-10 shrink-0">
            <Github size={18} strokeWidth={2} />
          </span>
          {expanded && <span className="whitespace-nowrap pr-3 font-medium">GitHub</span>}
        </a>
        <a
          href="#"
          aria-label="Help"
          title={!expanded ? 'Help' : undefined}
          onClick={(e) => e.preventDefault()}
          className="relative flex items-center h-10 mx-2 rounded-md text-sm text-text-muted hover:bg-surface-2 hover:text-text-strong transition-colors"
        >
          <span className="flex items-center justify-center w-10 shrink-0">
            <LifeBuoy size={18} strokeWidth={2} />
          </span>
          {expanded && <span className="whitespace-nowrap pr-3 font-medium">Help</span>}
        </a>
      </div>
    </motion.aside>
  );
}
```

**Notes:**
- The drawer is `position: fixed` starting below the top bar (`top-14` = 56px). When `!pinned && expanded`, it's still fixed-positioned — it overlays content because `<main>` keeps its `ml-[56px]`. When `pinned`, `<main>` shifts to `ml-[240px]` so the drawer sits beside, not over.
- The "Help" link is currently a no-op (placeholder for a future help page). It's marked `href="#"` with a `preventDefault` — explicit non-functional, not a TODO.
- `useReducedMotion` from framer-motion respects `prefers-reduced-motion` automatically.

- [ ] **Step 3: Verify TypeScript compile**

Run: `cd falx-ui && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add falx-ui/src/components/layout/logo.ts falx-ui/src/components/layout/Sidebar.tsx
git commit -m "feat(ui): add Sidebar with hover-peek + pin"
```

---

### Task 6: `TopBar` component

**Files:**
- Create: `falx-ui/src/components/layout/TopBar.tsx`

- [ ] **Step 1: Create the TopBar component**

Write `falx-ui/src/components/layout/TopBar.tsx`:

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import ProfilePopup from '../header/ProfilePopup';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrentPageTitle } from './useCurrentPageTitle';

export function TopBar() {
  const title = useCurrentPageTitle();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isAuthDisabled } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/device-farm/#/');
  };

  return (
    <header
      className="sticky top-0 z-50 h-14 bg-surface border-b border-border-soft"
      role="banner"
    >
      <div className="flex items-center justify-between h-full pl-[72px] pr-6">
        {/* pl-[72px] = 56px rail + 16px page gutter */}
        <h1 className="text-lg font-semibold text-text-strong truncate">{title}</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-text hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-brand-ring"
              aria-label="Open profile menu"
            >
              <Avatar
                firstname={user?.firstname || ''}
                lastname={user?.lastname || ''}
                size="sm"
                variant="text"
              />
              <span className="text-sm font-medium">{user?.username}</span>
            </button>

            <ProfilePopup
              isOpen={profileOpen}
              onClose={() => setProfileOpen(false)}
              username={user?.username || ''}
              isAdmin={isAdmin()}
              onLogout={handleLogout}
              isAuthDisabled={isAuthDisabled}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
```

**Notes:**
- The GitHub link from the old header is moved into the Sidebar's bottom section (Task 5), not duplicated here.
- The page title spans the full content area; `truncate` handles long titles.
- `pl-[72px]` aligns the title with the page content area (rail 56px + 16px gutter). Visually anchors title with content, not with the rail.

- [ ] **Step 2: Verify TypeScript compile**

Run: `cd falx-ui && npx tsc --noEmit`
Expected: no errors. (`ProfilePopup` and `Avatar` already export with the props we use.)

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/components/layout/TopBar.tsx
git commit -m "feat(ui): add TopBar with page title + profile"
```

---

### Task 7: `AppLayout` composer

**Files:**
- Create: `falx-ui/src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Create the AppLayout composer**

Write `falx-ui/src/components/layout/AppLayout.tsx`:

```tsx
import React, { type ReactNode } from 'react';
import { SidebarLayoutProvider, useSidebarLayout } from './SidebarLayoutContext';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarLayoutProvider>
      <Shell>{children}</Shell>
    </SidebarLayoutProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { pinned } = useSidebarLayout();
  return (
    <div className="min-h-screen bg-app-bg text-text">
      <TopBar />
      <Sidebar />
      <main
        className="transition-[margin-left] duration-200 ease-out"
        style={{ marginLeft: pinned ? 240 : 56 }}
      >
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
```

**Notes:**
- `Shell` is split out so it can consume `useSidebarLayout()` (only valid inside the provider).
- Margin is set via inline `style` so the transition picks up numeric values; Tailwind arbitrary values would also work but inline keeps it tied to the same numeric constants as `Sidebar.tsx`.

- [ ] **Step 2: Verify TypeScript compile**

Run: `cd falx-ui && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add falx-ui/src/components/layout/AppLayout.tsx
git commit -m "feat(ui): add AppLayout composer"
```

---

## Group B — Consistency audit

Before moving to Group C:

- [ ] **Confirm**: rail width (56px) is consistent across `Sidebar.tsx`, `TopBar.tsx` (`pl-[72px]` = 56 + 16), and `AppLayout.tsx` (`marginLeft: 56`).
- [ ] **Confirm**: drawer width (240px) is consistent in `Sidebar.tsx` and `AppLayout.tsx` (`marginLeft: 240`).
- [ ] **Confirm**: `top-14` (= 56px) on Sidebar matches TopBar's `h-14`. The sidebar starts exactly where the top bar ends.
- [ ] **Confirm**: `isAdmin` is a function call (`isAdmin()`) in `Sidebar.tsx`, matching `AuthContext`'s API used elsewhere ([Header.tsx:144](../../../falx-ui/src/components/header/Header.tsx#L144)).

---

## Group C — Wire-up

### Task 8: Wire `AppLayout` into routes; delete old headers

**Files:**
- Modify: `falx-ui/src/App.tsx`
- Delete: `falx-ui/src/components/header/Header.tsx`
- Delete: `falx-ui/src/components/header/NewHeader.tsx`

- [ ] **Step 1: Update `App.tsx`**

In `falx-ui/src/App.tsx`:

Remove the line `import Header from './components/header/Header';`

Add: `import { AppLayout } from './components/layout/AppLayout';`

Replace the `ProtectedRouteWrapper` body:

```tsx
// BEFORE
const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  children,
  adminOnly = false,
}) => {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <div className="bg-gray-900">
        <Header />
        {children}
      </div>
    </ProtectedRoute>
  );
};

// AFTER
const ProtectedRouteWrapper: React.FC<ProtectedRouteWrapperProps> = ({
  children,
  adminOnly = false,
}) => {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
};
```

- [ ] **Step 2: Verify nothing else imports the old Header components**

Run: `cd falx-ui && grep -rn "from.*header/Header\|from.*header/NewHeader" src`
Expected: no matches (other than the lines we just removed from `App.tsx`).

If matches exist, update those imports before deletion — they should target `./components/layout/AppLayout` or the relevant new component.

- [ ] **Step 3: Delete the old header components**

```bash
rm falx-ui/src/components/header/Header.tsx
rm falx-ui/src/components/header/NewHeader.tsx
```

Keep `ProfilePopup.tsx` and `logo.ts` in `header/` — they're still imported.

- [ ] **Step 4: Verify build**

Run: `cd falx-ui && npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add falx-ui/src/App.tsx
git add -u falx-ui/src/components/header/
git commit -m "feat(ui): wire AppLayout into protected routes; remove old Header"
```

---

### Task 9: Manual smoke — shell renders on all routes

This is the first opportunity to see the new shell in a browser. Do not skip it — the next task removes a wrapper that other pages may have been relying on.

- [ ] **Step 1: Start the dev server**

Run: `cd falx-ui && npm run dev`
Expected: Vite starts on its usual port (printed to console).

- [ ] **Step 2: Manual checks** — visit each route and confirm:

| Route | Expectation |
|---|---|
| `/` | Sidebar rail + top bar visible. Title says "Devices". |
| `/builds` | Title says "Builds". |
| `/apps` | Title says "Apps". |
| `/stats` | Title says "Stats". |
| `/servers` | Title says "Servers". |
| `/profile` | Title says "Profile". |
| `/users` (as admin) | Title says "Users". |
| `/login` | NO sidebar/top bar — bare login page. |

- [ ] **Step 3: Behavior checks**

- Hover over the sidebar rail → drawer expands smoothly after ~120ms, shows labels.
- Move cursor away → drawer collapses after ~250ms.
- Press `[` → drawer pins open; press `[` again → unpins.
- Reload page → if pinned, stays pinned; if unpinned, stays collapsed.
- Click chevron in drawer header → toggles pin.

- [ ] **Step 4: Note any visible regressions**

Pages other than Devices will look "off" because their dark backgrounds may not extend correctly without the removed wrapper. **This is expected** — Task 10 audits and fixes that. Note the offenders to confirm Task 10 catches them.

- [ ] **No commit** — this task is verification only.

---

### Task 10: Audit dark pages — restore explicit dark backgrounds

The wrapping `<div className="bg-gray-900">` is gone (Task 8). Each protected page that needs a dark background must now own that explicitly.

**Files (audit each, modify as needed):**
- `falx-ui/src/pages/Builds.tsx`
- `falx-ui/src/components/apps/Apps.tsx`
- `falx-ui/src/components/stats/trends.tsx` (the `EnhancedTrends` export)
- `falx-ui/src/pages/Auth/AdminDashboard.tsx`
- `falx-ui/src/pages/Users/Users.tsx`
- `falx-ui/src/pages/Teams.tsx`
- `falx-ui/src/pages/Devices.tsx`
- `falx-ui/src/pages/Servers.tsx`
- `falx-ui/src/pages/Profiles/ProfilePage.tsx`

(Devices page — `device-explorer.tsx` — is intentionally **not** in this list. It gets the light treatment in Task 12.)

- [ ] **Step 1: For each file above, inspect its top-level returned JSX**

Look at the root element it renders. Three possible states:

1. Already sets a dark bg (`bg-gray-900`, `bg-slate-900`, etc.) and reaches full viewport (`min-h-screen` or `h-full`): **no change needed**.
2. Already sets a dark bg but no viewport sizing: **add `min-h-[calc(100vh-56px)]`** so the dark area covers below the top bar even when content is short.
3. Sets no dark bg: **wrap the root in `<div className="bg-gray-900 min-h-[calc(100vh-56px)] text-white">`** or add those classes to the existing root.

- [ ] **Step 2: Apply changes**

For pages in state (2) or (3), edit. Keep the change minimal: a single class addition is preferable to a wrapping div if the root already has a className.

- [ ] **Step 3: Re-smoke each affected route in the browser**

Confirm no white gaps below/around dark content. The seam between the white top bar and dark page content should be clean (a single 1px border-bottom on the top bar).

- [ ] **Step 4: Commit**

```bash
git add falx-ui/src/pages falx-ui/src/components/apps falx-ui/src/components/stats
git commit -m "fix(ui): pages that lost the outer wrapper now set their own dark bg"
```

---

## Group C — Consistency audit

- [ ] **Confirm**: `grep -rn "import Header from" falx-ui/src` returns no results.
- [ ] **Confirm**: `grep -rn "from.*components/header/Header" falx-ui/src` returns no results.
- [ ] **Confirm**: Every page in Task 10's list, when visited, shows a clean seam between the white top bar and its dark content area — no gray-100 / white gap below the top bar where the dark bg should reach.

---

## Group D — Devices page light treatment

### Task 11: Light-theme the DeviceCard

**Files:**
- Modify: `falx-ui/src/components/devicecard/DeviceCard.tsx`

- [ ] **Step 1: Read the current DeviceCard to understand its structure**

Run: `cd falx-ui && cat src/components/devicecard/DeviceCard.tsx`
Note the JSX shape: card root, header (device name + version pill), badge row, metadata row, action buttons.

- [ ] **Step 2: Apply the light treatment**

Replace dark-theme classes with light-theme equivalents. The mapping:

| Element | Old (dark) | New (light) |
|---|---|---|
| Card root | `bg-gray-800` or similar | `bg-surface border border-border-soft rounded-lg shadow-sm hover:shadow-md hover:-translate-y-px transition-all` |
| Device name | `text-yellow-400` | `text-text-strong font-semibold` |
| Version pill | `bg-gray-700 text-gray-300` | `bg-surface-2 text-text-muted text-xs px-2 py-0.5 rounded` |
| Status badge "Real" | dark blue tint | `bg-blue-50 text-blue-700 border border-blue-100` |
| Status badge "Local" | dark purple tint | `bg-violet-50 text-violet-700 border border-violet-100` |
| Status badge "Ready" | dark green tint | `bg-emerald-50 text-emerald-700 border border-emerald-100` |
| Status badge "Booted" | dark teal tint | `bg-teal-50 text-teal-700 border border-teal-100` |
| Metadata icons | `text-gray-400` | `text-text-faint` |
| Metadata values | `text-gray-300` | `text-text-muted text-sm` |
| "Use Device" button | dark filled | `bg-brand text-white hover:bg-brand-hover px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-ring` |
| "Block" button | dark filled | `bg-surface border border-border text-text hover:bg-surface-2 px-3 py-1.5 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-ring` |

For badges where the existing component logic maps status strings to colors: update the mapping table in-place, don't add a new component.

- [ ] **Step 3: Build + lint**

```bash
cd falx-ui && npm run build && npm run lint
```
Expected: both clean.

- [ ] **Step 4: Browser check**

Reload `/`. The card should look light, with crisp shadows, indigo "Use Device" button, light-tinted status badges, no yellow text.

- [ ] **Step 5: Commit**

```bash
git add falx-ui/src/components/devicecard/DeviceCard.tsx
git commit -m "feat(ui): light-theme DeviceCard"
```

---

### Task 12: Light-theme the Devices page chrome

**Files:**
- Modify: `falx-ui/src/components/device-explorer/device-explorer.tsx`

- [ ] **Step 1: Read the current device-explorer to find the page-level chrome**

Identify:
- The outermost div (page root) — currently `bg-gray-900` or similar
- The filter bar container at the top
- The search input
- The "Filter" button

- [ ] **Step 2: Apply the light treatment**

| Element | New classes |
|---|---|
| Page root | `bg-app-bg min-h-[calc(100vh-56px)] text-text px-6 py-6` |
| Filter bar row | Keep layout (`flex justify-end gap-2 mb-4` or current equivalent); remove dark bg if present |
| Search input | `bg-surface border border-border-soft rounded-md pl-9 pr-3 py-2 text-sm text-text placeholder-text-faint focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-brand` |
| Search leading icon | Use `Search` from lucide-react, absolute-positioned inside the input wrapper, `text-text-faint w-4 h-4` |
| "Filter" button | `bg-surface border border-border text-text hover:bg-surface-2 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center gap-1.5` |
| Empty state / "no devices" text | `text-text-muted` |

- [ ] **Step 3: Build + lint + browser check**

```bash
cd falx-ui && npm run build && npm run lint
```

Reload `/`. The page should be cohesively light: slate-50 background, white cards, indigo "Use Device", light-tinted badges. No dark patches.

- [ ] **Step 4: Commit**

```bash
git add falx-ui/src/components/device-explorer/device-explorer.tsx
git commit -m "feat(ui): light-theme Devices page chrome"
```

---

## Group D — Consistency audit

- [ ] **Confirm**: Devices page (`/`) renders with zero dark patches. Background is slate-50, cards are white with `border-border-soft`, no `text-yellow-*` anywhere.
- [ ] **Confirm**: Other protected routes (Builds, Apps, Stats, Servers, Users, Teams, Devices admin, Admin, Profile) still render with their dark backgrounds intact — no regressions.
- [ ] **Confirm**: Status badge color encoding is preserved (Real=blue, Local=violet, Ready=green, Booted=teal); only the tone shifted from saturated/dark to soft/light.

---

## Group E — Final verification

### Task 13: Full route walkthrough + accessibility spot-check

This is the gate before declaring the slice done. Manual, since this is visual.

- [ ] **Step 1: Start dev server, take screenshots of every route**

```bash
cd falx-ui && npm run dev
```

Visit each route, take a screenshot:
- `/` (Devices, light)
- `/builds` (dark — expect intact bg)
- `/apps` (dark)
- `/stats` (dark)
- `/servers` (dark)
- `/profile` (dark)
- `/users`, `/teams`, `/devices`, `/admin` (dark; admin-only — log in as admin)
- `/login` (unchanged)

Look for: white gaps, broken layouts, console errors.

- [ ] **Step 2: Hover and pin behavior on multiple routes**

On `/`, `/builds`, `/apps`, `/profile`: confirm hover-peek opens drawer, pin-then-reload persists state, pinned-mode shifts main content right (not overlay), unpinned-mode keeps content under drawer.

- [ ] **Step 3: Keyboard accessibility**

- Tab through the top bar → Avatar button receives focus with visible ring.
- Tab through the sidebar → each NavLink receives focus in order; active item still shows the brand-left indicator.
- Press `[` outside any text input → toggles pin. Press inside the Devices page search input → types `[` into the input, does NOT toggle. (Verifies the guard in `usePinned`.)

- [ ] **Step 4: Reduced motion**

In DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce. Hover the rail → drawer opens without spring; reload — same behavior. Disable the emulation when done.

- [ ] **Step 5: Contrast spot-check**

For each of these foreground/background pairs on the Devices page, run a quick contrast check (DevTools "color contrast" picker or any WCAG tool):

| Foreground | Background | Target |
|---|---|---|
| Page title `text-text-strong` (#0F172A) | TopBar `bg-surface` (#FFFFFF) | ≥ 4.5:1 |
| Body text `text-text` (#334155) | `bg-surface` | ≥ 4.5:1 |
| Muted `text-text-muted` (#64748B) | `bg-surface` | ≥ 4.5:1 |
| Faint `text-text-faint` (#94A3B8) | `bg-surface` | ≥ 3:1 (large/icon only) |
| `text-brand` (#4F46E5) | `bg-brand-soft` (#EEF2FF) | ≥ 4.5:1 |
| White button text | `bg-brand` (#4F46E5) | ≥ 4.5:1 |
| Status badges (Ready, etc.) | their `*-50` bg | ≥ 4.5:1 |

Note any failures. Adjust palette in `tailwind.config.js` if needed (this is the one place where the design may need a small tweak post-implementation).

- [ ] **Step 6: Final lint + build**

```bash
cd falx-ui && npm run lint && npm run build
```
Expected: both clean.

- [ ] **Step 7: No commit needed if no issues found.** If contrast adjustments were made:

```bash
git add falx-ui/tailwind.config.js
git commit -m "fix(ui): adjust palette for WCAG AA contrast"
```

---

## Final consistency audit

Before opening the PR:

- [ ] **Confirm**: Every acceptance criterion in the [spec § 4](../specs/2026-05-15-ui-shell-light-theme-design.md#4-acceptance-criteria) is met. Walk the list; mark each.
- [ ] **Confirm**: No file outside the scope listed in this plan was modified. Run `git diff --stat main` and inspect.
- [ ] **Confirm**: No new top-level npm dependencies were added. Run `git diff main -- falx-ui/package.json` — should show no change.
- [ ] **Confirm**: All commits follow conventional-commit style (`feat(ui):`, `fix(ui):`).

---

## PR

- [ ] Open PR with title: `feat(ui): light-theme app shell + Devices page`
- [ ] PR body: link to the spec, summarize the slice, attach the route walkthrough screenshots from Task 13 § 1.
- [ ] Note in the PR description: "Sub-slice of planned Slice 7. Follow-ups: remaining pages, ProfilePopup light theme, MUI retirement, shadcn/ui introduction (with ADR)."

---

## Notes for the executor

- **Subagent-driven**: dispatch one subagent per task. Pass the relevant context (spec link + this plan section). Two-stage review: spec compliance, then code quality. Group-end audits are listed inline above.
- **Model selection**: tasks 1, 2, 3, 4, 7, 8 are mechanical — Haiku is fine. Tasks 5, 6, 10, 11, 12 involve more judgement (existing code edits, visual decisions) — use Sonnet. Task 13 is multi-tool verification — Sonnet.
- **Per CLAUDE.md**: do not commit unless the operator explicitly approves. If the executor is configured for auto-commit, fine; otherwise stop at each commit step and ask.
- **Branding**: customer-facing strings say "Falx". The internal plugin name `device-farm` is unchanged. New links/URLs remain `/device-farm/...` where they already did — we are not touching routing in this slice.
