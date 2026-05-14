# 09 — UI Inventory

**Lens:** UX + designer + frontend engineer

> Scope: the upstream `dashboard-frontend/` SPA. This is the untouched upstream
> copy — Falx will fork it to `falx-ui/` in a later slice. This doc inventories
> what's there and how reusable it is. Behavior is described as-is.

---

## 1. Stack [frontend]

### Runtime + build

- **React 18.2** ([`package.json:38`](../../dashboard-frontend/package.json#L38))
  with `react-dom` 18.2 ([`package.json:41`](../../dashboard-frontend/package.json#L41)).
- **Vite 5.1** as build tool, with `@vitejs/plugin-react` for Fast Refresh
  ([`vite.config.js:1`](../../dashboard-frontend/vite.config.js#L1)). Build emits
  assets under `device-farm/ui-assets/` so the appium plugin can serve them at
  `/device-farm/ui-assets/*` ([`vite.config.js:7`](../../dashboard-frontend/vite.config.js#L7)).
- **TypeScript 5.4** (`tsc && vite build`, see
  [`package.json:9`](../../dashboard-frontend/package.json#L9)).
- `homepage: "/device-farm"` in `package.json` pins the served path
  ([`package.json:6`](../../dashboard-frontend/package.json#L6)).

### UI libraries (confirmed via `package.json` + import scan)

The codebase mixes **three** UI systems, layered on top of Tailwind utilities:

| Library | Version | Where it shows up |
|---|---|---|
| **Tailwind CSS** | 3.4 | Everywhere — primary styling system. `tailwind.config.js` extends with custom animations only ([`tailwind.config.js:17`](../../dashboard-frontend/tailwind.config.js#L17)). |
| **MUI (`@mui/material`)** | 5.15 | Icons (`@mui/icons-material`), `Menu`/`MenuItem`/`Tooltip`/`IconButton`/`Typography`/`CircularProgress`. Heavily used in `Devices.tsx`, `Servers.tsx`, `Apps.tsx`. Wraps in `@emotion/react` + `@emotion/styled`. |
| **Flowbite + flowbite-react** | flowbite 2.5 / flowbite-react 0.7 | Root provider `<Flowbite>` wrap ([`App.tsx:77`](../../dashboard-frontend/src/App.tsx#L77)). Used for `Card`, `Tabs`, `Button`, `Alert`, `Badge` — concentrated in `AdminDashboard.tsx`, `LoginForm.tsx`, `Servers.tsx`. Flowbite Tailwind plugin registered in `tailwind.config.js:121`. |
| **Heroicons** | 2.2 | `@heroicons/react/24/outline` — used only in `AdminDashboard.tsx` ([`AdminDashboard.tsx:6`](../../dashboard-frontend/src/pages/Auth/AdminDashboard.tsx#L6)). |
| **lucide-react** | 0.424 | Most modern pages — `Builds`, `DeviceCard`, `BuildContainer`, `SessionCard`, `TextLogs`, `TableFilter`, `Trends`. |
| **react-icons** (`Fi*`, `Si*`) | 5.0 (transitive via flowbite-react) | Used in `Devices`, `Servers`, `Teams`, `Users`. |
| **framer-motion** | 12.4 | Animations in `ProfilePopup.tsx`. |

So in practice **MUI + Flowbite + Tailwind coexist**, and four icon libraries
(MUI icons, lucide, heroicons, react-icons) appear across the app. [designer]
This is the single biggest visual-inconsistency lever the codebase has.

### Routing

- `react-router-dom` 6.22 ([`package.json:45`](../../dashboard-frontend/package.json#L45)).
- App uses `<HashRouter>` at the very top
  ([`main.tsx:9`](../../dashboard-frontend/src/main.tsx#L9)) so URLs live in
  `#`-fragments (e.g. `/device-farm/#/builds`). This is to coexist with Appium's
  static path mounting.
- Routes are flat: an array of `{ path, element, adminOnly? }` mapped in
  [`App.tsx:49`](../../dashboard-frontend/src/App.tsx#L49). Catch-all redirects
  to `/`.
- A vestigial `src/router/RootRouter.tsx` ([`RootRouter.tsx:1`](../../dashboard-frontend/src/router/RootRouter.tsx#L1))
  exists but is **not** wired into `App.tsx`. It is dead code.

### State management

- **No Redux, no Zustand, no Jotai.** Global state is React Context only.
- Two contexts:
  - `AuthProvider` — user + login/logout/admin checks, JWT in localStorage
    ([`contexts/AuthContext.tsx:34`](../../dashboard-frontend/src/contexts/AuthContext.tsx#L34)).
  - `ConfigProvider` — minimal; just sets `document.title = 'Appium Device Farm'`
    ([`contexts/ConfigContext.tsx:19`](../../dashboard-frontend/src/contexts/ConfigContext.tsx#L19)).
- A third `DataContext.tsx` exists at `src/DataContext.tsx`
  ([`DataContext.tsx:1`](../../dashboard-frontend/src/DataContext.tsx#L1)) with
  a generic `data: any` shape, but it is **not** referenced anywhere in the
  codebase. **Dead code.**
- Per-page state is local `useState` / `useEffect`. No SWR, react-query, etc.

### API client setup

- `src/api-service/api-client.ts` — single `ApiClient` instance, fetch-based
  ([`api-client.ts:3`](../../dashboard-frontend/src/api-service/api-client.ts#L3)).
- Holds JWT statically in a class field, set by `AuthService.setAuthHeader()`
  ([`AuthService.ts:42`](../../dashboard-frontend/src/services/AuthService.ts#L42)).
- `formatUrl()` resolves relative URLs against
  `${window.location.origin}/device-farm/api` ([`api-client.ts:54`](../../dashboard-frontend/src/api-service/api-client.ts#L54)).
- Methods: `makeGETRequest`, `makePOSTRequest`, `makePUTRequest`,
  `makePATCHRequest`, `makeDELETERequest`, `makeStreamRequest`.
- High-level domain wrapper:
  `src/api-service/index.ts` → `DeviceFarmApiService` static class
  ([`index.ts:3`](../../dashboard-frontend/src/api-service/index.ts#L3)).
- Domain-specific services in `src/services/`:
  `AuthService`, `DeviceService`, `TeamsService`, `ApiTokenService`.
- `axios` is imported in `AuthService.ts:1` and `AdminDashboard.tsx:5` but the
  active code path uses `apiClient` (fetch) — `axios` is effectively a
  half-removed leftover. **Unknown:** whether `AdminDashboard`'s axios calls
  still work (it uses a `API_URL = '/device-farm/admin'` literal that may
  diverge from the plugin's actual auth/admin routes).

---

## 2. Route map / screen inventory [frontend + UX]

`App.tsx` registers public route `/login` and 16 protected route paths (some
are aliases or fragment variants of the same screen). Below: distinct screens.

| # | Screen | Route(s) | Source | Shows | User actions | Backend endpoints | Key components |
|---|---|---|---|---|---|---|---|
| 1 | **Login** | `/login` | [`pages/Auth/Login.tsx`](../../dashboard-frontend/src/pages/Auth/Login.tsx) → `components/auth/LoginForm.tsx` | Branded login screen with rotating marketing "screens" carousel (3-slide loop) and username/password form. | Submit credentials; auto-redirects authenticated users to `/`. | `POST /auth/login` ([`AuthService.ts:55`](../../dashboard-frontend/src/services/AuthService.ts#L55)). | `LoginForm`, `Button` (flowbite). |
| 2 | **Device Explorer** (home) | `/`, `/device-farm` | [`components/device-explorer/device-explorer.tsx`](../../dashboard-frontend/src/components/device-explorer/device-explorer.tsx) | Grid of `DeviceCard`s with platform/state/version/tag filters and search; queue counter. Polls every few seconds. | Filter devices, block/unblock, claim session, open live stream, watch session in progress. | `GET /device` (`getDevices`), `GET /queue/length`, `POST /block`, `POST /unblock` (see [`api-service/index.ts:4`](../../dashboard-frontend/src/api-service/index.ts#L4)). | `CustomDropdown` (inline), `MultiSelectDropdown` (inline), `DeviceCard`. |
| 3 | **Builds list & Session detail** | `/builds`, `/device-farm/builds`, `/builds/:buildId/session/:sessionId`, `/device-farm/builds/:buildId/session/:sessionId`, `/device-farm/#builds` | [`pages/Builds/index.tsx`](../../dashboard-frontend/src/pages/Builds/index.tsx) | Two modes: (a) build list with side rail + filterable session table, (b) session detail with logs + capabilities split. | Pick build, filter sessions by time window (24h/7d/30d/custom) and column predicates, clean up old builds, drill into a session, switch between text logs / device logs / app profiling, view desired vs actual caps. | `GET /dashboard/build`, `GET /dashboard/session`, `POST /dashboard/cleanup`, `GET /dashboard/session/:id/session_log`, `GET /dashboard/session/:id/device_logs`, `GET /dashboard/session/:id/app_profiling`. | `BuildContainer`, `SessionCard`, `TableFilter`, `CleanupModal`, `SessionInfo`, `SessionLogs`, `Capabilities`, `TextLogs`, `DeviceLogs`, `AppProfiling`, `react-datepicker`. |
| 4 | **Apps** | `/apps` | [`components/apps/Apps.tsx`](../../dashboard-frontend/src/components/apps/Apps.tsx) | Paginated, searchable table of uploaded APK/IPA/AAB/APP files. | Upload via dropzone modal (`AppUploader`), delete app, page through (50/page), inspect bundle. | `GET /dashboard/uploadedApps`, `POST /dashboard/uploadedAppInformation`, `POST /dashboard/deleteUploadedApp`. | `AppUploader` (`react-dropzone`), MUI `IconButton`. |
| 5 | **Stats / Trends** | `/stats` | [`components/stats/trends.tsx`](../../dashboard-frontend/src/components/stats/trends.tsx) | Charts: pass/fail/unmarked over time, per-device usage, durations. Uses `recharts` (and `chart.js` lives in deps but isn't used here — only in app-profiling). | Switch time window, drill into platform/device, hover for tooltips. | `GET /dashboard/build`, `GET /dashboard/session`. | `recharts` (`BarChart`, `PieChart`, `LineChart`, `AreaChart`), `lucide-react` icons. |
| 6 | **Admin Dashboard** (legacy) | `/admin` (admin only) | [`pages/Auth/AdminDashboard.tsx`](../../dashboard-frontend/src/pages/Auth/AdminDashboard.tsx) | Older admin UI with `Tabs`: teams, users, device allocations. | CRUD teams, allocate devices to teams, manage members. | `/device-farm/admin/*` via `axios` (literal URL prefix at [`AdminDashboard.tsx:9`](../../dashboard-frontend/src/pages/Auth/AdminDashboard.tsx#L9)). | flowbite `Card`, `Tabs`, `Button`, `Alert`; heroicons. |
| 7 | **Users** | `/users` (admin only) | [`pages/Users/Users.tsx`](../../dashboard-frontend/src/pages/Users/Users.tsx) | User table with create/edit/activate/deactivate/delete. | CRUD users, change role, toggle `isActive`. | `GET /users`, `POST /users`, `PUT /users/:id`, `PUT /auth/users/:id/activate`, `PUT /auth/users/:id/deactivate`, `DELETE /auth/users/:id`. | Inline `CustomSelect`, `Avatar`, modals, `Fi*` icons. |
| 8 | **Teams** | `/teams` (admin only) | [`pages/Teams.tsx`](../../dashboard-frontend/src/pages/Teams.tsx) | Team list with members and allocated devices. | Create/edit/delete teams, add/remove members, attach/detach devices, filter devices by platform/version. | `GET /teams`, `POST /teams`, `PUT /teams/:id`, `POST /teams/:id/members`, `POST /teams/:id/devices`, `DELETE /teams/:id`, `GET /device-allocations/all`. | `Avatar`, inline modals, `Fi*` icons. |
| 9 | **Devices** (admin) | `/devices` (admin only) | [`pages/Devices.tsx`](../../dashboard-frontend/src/pages/Devices.tsx) | All registered devices in a table with stats cards (Total/iOS/Android × online/offline counts). | Edit name + tags, flag/unflag with reason, delete device. | `GET /dashboard/devices`, `PUT /dashboard/devices/:id`, `DELETE /dashboard/devices/:id`. | MUI `Menu`/`MenuItem`/`Tooltip`, inline edit/delete modals, custom "phone" SVG thumbnail. |
| 10 | **Servers** | `/servers` | [`pages/Servers.tsx`](../../dashboard-frontend/src/pages/Servers.tsx) | List of hub/nodes with OS, online status, owner; right pane streams Appium logs from selected server via virtualized list. | Select server, watch live logs (streamed), download log file, toggle timestamps. Terminal link exists but route is commented out in `App.tsx`. | `GET /dashboard/servers`, `GET /dashboard/server/:nodeId/appium_logs` (stream). | `FixedSizeList` (react-window), `AutoSizer` (react-virtualized-auto-sizer), flowbite `Badge`, `Avatar`. |
| 11 | **Profile** | `/profile` | [`pages/Profiles/ProfilePage.tsx`](../../dashboard-frontend/src/pages/Profiles/ProfilePage.tsx) | Sidebar + content layout; two sections: password reset, API tokens. | Change password ([`PasswordAuth.tsx`](../../dashboard-frontend/src/pages/Profiles/sections/PasswordAuth.tsx)); create/list/delete API tokens ([`ApiToken.tsx`](../../dashboard-frontend/src/pages/Profiles/sections/ApiToken.tsx)). | `PUT /users/:id`, `GET /auth/me`, `GET /api-tokens`, `POST /api-tokens`, `DELETE /api-tokens/:id`. | `ProfileSidebar`. |

Server terminal route (`/servers/:nodeId/terminal`) is **commented out** in
[`App.tsx:65`](../../dashboard-frontend/src/App.tsx#L65) — the xterm dependencies
(`@xterm/*`, `xterm`) are installed but no live screen consumes them.

[UX] **Total distinct screens: 11** (Login + 10 protected). Effective dashboard
nav = 5 tabs (`Devices`, `Builds`, `Apps`, `Stats`, `Servers`) defined in
[`Header.tsx:31`](../../dashboard-frontend/src/components/header/Header.tsx#L31).
Admin screens (`/admin`, `/users`, `/teams`, `/devices`) are accessed via the
`ProfilePopup` avatar menu, not the main header.

---

## 3. Reusable component inventory [frontend]

Walked `src/components/`. Grouping by purpose:

### Layout / chrome

| Component | File | Lines | Purpose | Notes |
|---|---|---|---|---|
| `Header` | [`Header.tsx`](../../dashboard-frontend/src/components/header/Header.tsx) | 154 | Top nav bar with tabs, logo, GitHub link, profile button. | Hard-codes a GitHub link to `AppiumTestDistribution/appium-device-farm` ([`Header.tsx:116`](../../dashboard-frontend/src/components/header/Header.tsx#L116)). |
| `NewHeader` | [`NewHeader.tsx`](../../dashboard-frontend/src/components/header/NewHeader.tsx) | 92 | Older/alternate header. Not referenced anywhere. **Dead code.** | |
| `ProfilePopup` | [`ProfilePopup.tsx`](../../dashboard-frontend/src/components/header/ProfilePopup.tsx) | 126 | Animated dropdown with profile/admin/logout links. | Uses `framer-motion`. |
| `Navbar` | [`Navbar.tsx`](../../dashboard-frontend/src/components/navbar/Navbar.tsx) | 121 | Flowbite-styled left-side drawer skeleton with a `flowbite.com` link. Not imported anywhere. **Dead code.** | |
| `Sidebar` | [`Sidebar.tsx`](../../dashboard-frontend/src/components/sidebar/Sidebar.tsx) | 61 | Entire file is commented out. **Dead code.** | |
| `logo.ts` | [`logo.ts`](../../dashboard-frontend/src/components/header/logo.ts) | n/a | Base64-decoded inline logo helper. | Used by `Header`. |

### Auth widgets

| Component | File | Purpose |
|---|---|---|
| `LoginForm` | [`LoginForm.tsx`](../../dashboard-frontend/src/components/auth/LoginForm.tsx) | Marketing carousel + credential form. 509 lines — half of it is animated mock screens. |
| `ProtectedRoute` | [`ProtectedRoute.tsx`](../../dashboard-frontend/src/components/auth/ProtectedRoute.tsx) | 32 lines. Generic auth + admin guard. Cleanly reusable. |
| `UserMenu` | [`UserMenu.tsx`](../../dashboard-frontend/src/components/auth/UserMenu.tsx) | Older `<Menu>`-based user dropdown. Not referenced; superseded by `ProfilePopup`. **Dead code.** |

### Tables / filters

| Component | File | Purpose |
|---|---|---|
| `TableFilter` | [`table-filter.tsx`](../../dashboard-frontend/src/components/table-filter/table-filter.tsx) | Generic builder: column + operator (`=`, `!=`, `contains`, `starts with`, `ends with`) + value autocomplete from data. Used by `Builds`. Cleanly generic. |
| `CleanupModal` | [`cleanup-modal.tsx`](../../dashboard-frontend/src/components/cleanup-modal/cleanup-modal.tsx) | 63 lines. `react-modal` confirmation for retention-day cleanup. Generic. |

### Forms / inputs

| Component | File | Purpose |
|---|---|---|
| `TagInput` | [`tag-input.tsx`](../../dashboard-frontend/src/components/ui/tag-input.tsx) | Thin wrapper on `react-tag-input-component`. **Unknown** if used outside `Devices`. (Most pages reimplement tag input inline.) |
| Inline `CustomDropdown` / `MultiSelectDropdown` | inside [`device-explorer.tsx`](../../dashboard-frontend/src/components/device-explorer/device-explorer.tsx) | Custom dropdowns, only here. |
| Inline `CustomSelect` | inside [`Users.tsx:16`](../../dashboard-frontend/src/pages/Users/Users.tsx#L16) | Custom select, only used here. |

### Device-specific widgets

| Component | File | Purpose |
|---|---|---|
| `DeviceCard` | [`DeviceCard.tsx`](../../dashboard-frontend/src/components/devicecard/DeviceCard.tsx) | 304 lines. Card with platform icon, status, owner avatar, block/unblock/claim CTAs. Caches hub node id with a module-scope promise. |
| `device-explorer` | [`device-explorer.tsx`](../../dashboard-frontend/src/components/device-explorer/device-explorer.tsx) | 852 lines — the big "home" page. Includes filter sidebar, polling, queue count. |

### Build / session widgets

| Component | File | Purpose |
|---|---|---|
| `BuildContainer` | [`build-container.tsx`](../../dashboard-frontend/src/components/build-container/build-container.tsx) | Side rail list of builds with per-build status counters and search/date filter. |
| `SessionCard` | [`session-card.tsx`](../../dashboard-frontend/src/components/build-container/session-card/session-card.tsx) | Compact session summary card. |
| `SessionInfo` | [`session-info.tsx`](../../dashboard-frontend/src/components/session/session-info/session-info.tsx) | 63 lines. 3-col grid of session metadata. Very generic, easily reusable. |
| `SessionLogs` | [`session-logs.tsx`](../../dashboard-frontend/src/components/session/session-logs/session-logs.tsx) | Tabbed wrapper for text logs / device logs / app profiling. |
| `TextLogs` | [`text-logs.tsx`](../../dashboard-frontend/src/components/session/session-logs/text-logs/text-logs.tsx) | 460 lines. Syntax-highlighted log viewer (`prism-react-renderer`), JSON/XML pretty-printing, screenshots inline, error filter. |
| `DeviceLogs` | [`device-log.tsx`](../../dashboard-frontend/src/components/session/session-logs/device-logs/device-log.tsx) | Search + jump-to-match log list. |
| `AppProfiling` | [`app-profiling.tsx`](../../dashboard-frontend/src/components/session/session-logs/app-profiling/app-profiling.tsx) | `react-chartjs-2` line charts for CPU/memory series. Only place chart.js is actually used. |
| `Capabilities` | [`capabilities.tsx`](../../dashboard-frontend/src/components/session/capabilities/capabilities.tsx) | Toggle between desired vs effective capabilities, fullscreen JSON tree. |

### Charts

| Component | File | Purpose |
|---|---|---|
| `EnhancedTrends` | [`trends.tsx`](../../dashboard-frontend/src/components/stats/trends.tsx) | 763 lines. The entire stats page — recharts-only, gradient defs, custom palettes. |

### Apps

| Component | File | Purpose |
|---|---|---|
| `AppList` | [`Apps.tsx`](../../dashboard-frontend/src/components/apps/Apps.tsx) | Searchable, paginated app table. |
| `AppUploader` | [`AppUploader.tsx`](../../dashboard-frontend/src/components/apps/AppUploader.tsx) | `react-dropzone` modal restricted to `.apk/.aab/.ipa/.app/.zip`. |

### Atomic / shared

| Component | File | Purpose |
|---|---|---|
| `Avatar` | [`Avatar.tsx`](../../dashboard-frontend/src/components/common/Avatar.tsx) | Initials avatar with deterministic color. Cleanly reusable. |

[frontend] Of ~25 distinct component files, **5 are dead code** (`NewHeader`,
`Navbar`, `Sidebar`, `UserMenu`, and `RootRouter`).

---

## 4. Contexts and services [frontend]

### Contexts

- `AuthContext` ([`AuthContext.tsx`](../../dashboard-frontend/src/contexts/AuthContext.tsx)).
  Exposes `user`, `loading`, `error`, `login`, `logout`, `isAdmin`,
  `isCurrentUser`, `isAuthDisabled`. The `isAuthDisabled` flag flips when
  `/auth/me` returns a user without an existing local JWT — used to render
  admin-only menu items when the backend is running with auth turned off
  (consumed in [`ProfilePopup.tsx:44`](../../dashboard-frontend/src/components/header/ProfilePopup.tsx#L44)).
- `ConfigContext` ([`ConfigContext.tsx`](../../dashboard-frontend/src/contexts/ConfigContext.tsx)).
  Only sets the document title (`'Appium Device Farm'`). For Falx this is the
  one obvious branding hook — but the strings on screens (`'Device Farm'`,
  GitHub URL, login carousel copy) are still inline literals, not driven from
  here.
- `DataContext` ([`DataContext.tsx`](../../dashboard-frontend/src/DataContext.tsx)).
  Unused.

### Services (side-effects / API wrappers)

| Service | File | Responsibility |
|---|---|---|
| `AuthService` | [`services/AuthService.ts`](../../dashboard-frontend/src/services/AuthService.ts) | Login, logout, current user, JWT in `localStorage`, user CRUD, activate/deactivate. |
| `DeviceService` | [`services/DeviceService.ts`](../../dashboard-frontend/src/services/DeviceService.ts) | `listDevices`, `getDevice`, `updateDevice`, `deleteDevice`, `listDevicesForPermissions`. |
| `TeamsService` | [`services/TeamsService.ts`](../../dashboard-frontend/src/services/TeamsService.ts) | Team CRUD + member/device membership. |
| `ApiTokenService` | [`services/ApiTokenService.ts`](../../dashboard-frontend/src/services/ApiTokenService.ts) | Create/list/delete personal API tokens. |
| `DeviceFarmApiService` | [`api-service/index.ts`](../../dashboard-frontend/src/api-service/index.ts) | Static methods for dashboard endpoints (builds, sessions, apps, queue, blocking, servers, logs streams). |

[frontend] Interesting side-effect: `DeviceCard` uses a **module-scoped promise
cache** (`HUB_NODE_ID_PROMISE`) to dedupe a server lookup across many sibling
cards ([`DeviceCard.tsx:17`](../../dashboard-frontend/src/components/devicecard/DeviceCard.tsx#L17)).
This is the only manual cache layer; there is no react-query, SWR, or context
for it.

WebSockets: `react-use-websocket` is in `package.json` ([line 49](../../dashboard-frontend/package.json#L49))
but **not imported anywhere in `src/`**. Streaming is done via
`fetch` + `ReadableStream` reader (`Servers.tsx`, `text-logs`) using
`makeStreamRequest` ([`api-client.ts:76`](../../dashboard-frontend/src/api-service/api-client.ts#L76)).

---

## 5. Styling system [designer]

- **Tailwind 3.4** with `darkMode: 'class'` and a custom breakpoint set
  (`md: 640px, lg: 1024px, xl: 1440px`, see [`tailwind.config.js:12`](../../dashboard-frontend/tailwind.config.js#L12)).
- Theme `extend` block only adds keyframes/animations (fadeIn variants, slideIn,
  zoomIn/Out, scaleIn, hideScreen, ripple, buttonRipple, etc., at
  [`tailwind.config.js:17`](../../dashboard-frontend/tailwind.config.js#L17)).
  **No custom colors, no design tokens, no semantic palette in the config.**
  Colors are hardcoded as Tailwind utility class names per component
  (`bg-gray-900`, `text-emerald-400`, `bg-yellow-400`, etc.). The visual
  identity therefore **lives across every component file**, not in one place.
- Flowbite plugin is registered ([`tailwind.config.js:121`](../../dashboard-frontend/tailwind.config.js#L121))
  so `flowbite-react` components inherit Tailwind theming.
- MUI components style themselves via `@emotion` + the default MUI theme.
  No `ThemeProvider` is configured anywhere, so MUI uses its out-of-the-box
  light theme on a dark background — visible as the slate-on-slate menus
  in `Devices.tsx`, `Servers.tsx`, etc., where each page passes inline
  `sx={{ bgcolor: '#18181b', ... }}` to override.
- Hand-written CSS files:
  - [`src/App.css`](../../dashboard-frontend/src/App.css) (50 lines) — root max-width and legacy logo spin.
  - [`src/index.css`](../../dashboard-frontend/src/index.css) (114 lines) — Tailwind directives + `.modal-small`/`.modal-medium`/`.modal-large` legacy classes.
  - [`src/styles/datepicker-custom.css`](../../dashboard-frontend/src/styles/datepicker-custom.css) (62 lines) — `react-datepicker` dark-mode overrides.
  - [`src/components/session/style.css`](../../dashboard-frontend/src/components/session/style.css), `capabilities.css`, `session-card.css`, `app-profiling.css` (small, ~7–43 lines each).
- **Recurring color palette across the app**: backgrounds `bg-gray-900`,
  `bg-gray-800`, panels `bg-gray-800/30 + border-gray-700/30`, primary
  `bg-blue-600` / `text-blue-400`, success `text-emerald-400 bg-emerald-400/10`,
  warning `text-amber-400`, danger `text-red-500 bg-red-400/10`, accent
  `border-yellow-400` (selected tab in `Header`). [designer] These should
  become design tokens in the falx-ui theme.

---

## 6. Reusability assessment for falx-ui [UX + designer + frontend]

Tags:
- **(a) directly portable** — logic + structure is fine; restyle is optional cosmetic work.
- **(b) portable with restyle** — keep the model and behavior, swap visual library / restyle classes.
- **(c) needs rewrite** — tightly coupled to upstream branding, dead code, or
  carries an unwanted dependency we intend to drop.

### Screens

| Screen | Tag | Rationale |
|---|---|---|
| Login | **c** | 509 lines, half is marketing carousel of mock screens tied to upstream branding. Strip carousel, keep username/password form, restyle. |
| Device Explorer | **b** | Solid logic (filtering, polling, queue), but inlines two custom dropdowns and depends on `DeviceCard`. Restyle for falx-ui. |
| Builds + Session detail | **b** | Big composite (Builds page is the only place TableFilter, CleanupModal, SessionLogs, Capabilities, SessionInfo come together). Behavior is good; restyle and decompose the 405-line `index.tsx`. |
| Apps | **b** | Straightforward table + dropzone. Restyle, swap MUI `IconButton` for falx-ui control. |
| Stats / Trends | **b** | 763 lines of recharts. Logic-heavy; chart inputs and palettes are isolated. Port, retheme palette. |
| Admin Dashboard | **c** | Older `Tabs`-based screen, uses `axios` against a different prefix, partly duplicates `/users` and `/teams`. Drop, or fold into Users + Teams. |
| Users | **b** | Clean CRUD page; uses inline `CustomSelect` and modals. Restyle. |
| Teams | **b** | CRUD + membership/devices. Restyle. |
| Devices (admin) | **b** | Table + edit modal + stats cards. Restyle (stats card pattern reusable). |
| Servers | **b** | Useful (live log stream, virtualized list). Restyle and consider replacing per-platform OS icons. Terminal route should be wired up or removed. |
| Profile | **a** | Sidebar + section pattern; trivial. Directly portable. |

### Component groups

| Group | Tag | Rationale |
|---|---|---|
| `ProtectedRoute` | **a** | Tiny, generic. |
| `Avatar` | **a** | Pure-Tailwind initials avatar; trivial to keep. |
| `SessionInfo` | **a** | Pure presentational grid. |
| `TableFilter` | **a** | Generic builder; only depends on lucide icons. |
| `CleanupModal` | **a** | Generic confirm modal (uses `react-modal`). |
| `TagInput` | **b** | Wrapper on `react-tag-input-component`; replace if we standardize on a different chips input. |
| `BuildContainer`, `SessionCard`, `SessionLogs`, `TextLogs`, `DeviceLogs`, `AppProfiling`, `Capabilities` | **b** | Core "build/session" surface. Behavior worth keeping; restyle and consider extracting log-viewer as a falx primitive. |
| `DeviceCard`, `device-explorer` | **b** | Most business logic for live device claiming. Restyle but keep the polling/cache patterns. |
| `EnhancedTrends` | **b** | Charts retheme cleanly; restyle palette + gradients. |
| `Header`, `ProfilePopup` | **c** | Hardcoded GitHub link, brand text "Device Farm" — rewrite for falx. |
| `LoginForm` | **c** | See above. |
| `NewHeader`, `Navbar`, `Sidebar`, `UserMenu`, `RootRouter`, `DataContext` | **c** (drop) | Dead code; do not port. |
| `AdminDashboard` | **c** | Legacy, replaced by `Users`/`Teams`. |
| Inline `CustomDropdown`/`MultiSelectDropdown`/`CustomSelect` | **c** | Three near-identical, inlined dropdowns scattered across pages. Replace with a single shared select component in falx-ui. |
| MUI `Menu`/`Tooltip` overrides (`sx={{ bgcolor: '#18181b' ... }}`) | **c** | Every page reapplies the same `sx` overrides. Fold into a theme/wrapper. |

### Rollup

- **(a) directly portable: 6** — `Profile` screen, `ProtectedRoute`, `Avatar`,
  `SessionInfo`, `TableFilter`, `CleanupModal`.
- **(b) portable with restyle: 14** — `Device Explorer`, `Builds + Session
  detail`, `Apps`, `Stats / Trends`, `Users`, `Teams`, `Devices (admin)`,
  `Servers`, `TagInput`, `BuildContainer + session/logs group`, `DeviceCard +
  device-explorer`, `EnhancedTrends`, plus the two stats-card and modal
  patterns inlined in pages.
- **(c) needs rewrite or drop: 11** — `Login`, `Admin Dashboard`, `Header`,
  `ProfilePopup`, `LoginForm`, `NewHeader`, `Navbar`, `Sidebar`, `UserMenu`,
  `RootRouter`, `DataContext`, the inline custom dropdowns (counted as a
  single rewrite target), and the MUI `sx` overrides pattern.

[frontend] Net: roughly **20% directly portable**, **50% portable with
restyle**, **30% rewrite/drop**. The biggest leverage points for falx-ui are
(i) extracting a single themed dropdown/select, (ii) consolidating MUI overrides
into one theme, (iii) consolidating the four icon libraries to one (lucide is
the most consistently used in newer files), and (iv) replacing inline color
literals with a token set.

---

## 7. WireMock / dev tooling [frontend]

- Directory: `dashboard-frontend/wiremock/mappings/` with **8 stub mappings**
  (run `ls dashboard-frontend/wiremock/mappings/` to enumerate).
- Each mapping is a WireMock JSON record pinning a `request.url` to a canned
  `response.body`. Endpoints stubbed:
  - `/device-farm/api/dashboard/build`
  - `/device-farm/api/dashboard/session`
  - `/device-farm/api/dashboard/session/<sid>/app_profiling` (two variants)
  - `/device-farm/api/dashboard/session/<sid>/device_logs`
  - `/device-farm/api/dashboard/session/<sid>/session_log`
  - `/device-farm/api/device`
  - `/device-farm/api/queue_length`
- All records contain fixed payloads from April 2024. Cookie/CORS headers are
  preserved verbatim from the recording session.
- Intended use: run a local WireMock instance with `--root-dir
  dashboard-frontend/wiremock` so the SPA can be developed against canned data
  without a live plugin. **Unknown:** there is no npm script wiring WireMock
  in `package.json` — devs were expected to start WireMock externally.
- For Falx: keep the recording format as a low-cost UI dev harness, but extend
  it with fixtures for the auth flow (`/auth/me`, `/auth/login`), teams, users,
  api-tokens, and `/dashboard/devices` (none of these are currently stubbed).

---

## Loose ends / `Unknown:`

- **Unknown:** the `axios` calls in `AdminDashboard.tsx` against
  `/device-farm/admin/*` — whether the backend still serves this prefix or
  whether `AdminDashboard` is silently broken in production. Worth confirming
  against backend routes (out of this doc's scope, lives with Agent D auth/RBAC).
- **Unknown:** whether the commented terminal route
  (`/servers/:nodeId/terminal`) ever shipped; the `xterm` / `@xterm/*`
  dependencies are present but no live React component imports them.
- **Unknown:** the active visual designer of the upstream UI — comments and
  mixed icon libraries suggest multiple authors over time. The mix of MUI +
  Flowbite + lucide + heroicons is the most concrete evidence.
- **Unknown:** any e2e or component tests — there is no `tests/`, no Vitest /
  Jest config, no `*.test.tsx` in `dashboard-frontend/src/`. Falx-ui will start
  without inheriting test coverage.
