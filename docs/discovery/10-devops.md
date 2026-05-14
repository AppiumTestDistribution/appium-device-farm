**Lens:** DevOps

# DevOps Discovery

## 1. Build

### TypeScript compilation

[`tsconfig.json`](../../tsconfig.json) targets `ES2016`, outputs CommonJS to
`./lib/`, with `rootDirs: ["src/"]`. `strict: true` is set. Both `src/` and
`test/` are included in compilation. Source maps are disabled (commented out).

### npm scripts (key entries)

Source: [`package.json`](../../package.json) lines 7-48.

| Script | What it does |
|---|---|
| `build` | `rm -rf lib && tsc -b && buildAndCopyWeb && copy-files` |
| `bundle` | `build` then `webpack` (produces obfuscated `lib/bundle.js`) |
| `buildAndCopyWeb` | Shell script: builds `dashboard-frontend`, copies dist to `src/public/` |
| `build-web-and-plugin` | `tsc -b + buildAndCopyWeb + copy-files` (no clean step) |
| `copy-files` | `cp -R src/public lib` |
| `prepublishOnly` | `tsc + buildAndCopyWeb + copy-files + bundle` — full release build |
| `install-plugin` | `buildAndCopyWeb + bundle + appium plugin install --source=local` |
| `run-db-migration` | Runs `lib/src/scripts/initialize-database.js` or ts-node fallback |
| `postinstall` | Automatically runs `run-db-migration` after `npm install` |
| `lint` | `eslint . --ext .ts,.tsx --fix` |
| `prettier-check` | `prettier 'src/**/*.ts' --check` (used in PR CI) |
| `coverage` | `nyc npm run test` |
| `db:inject-sample-data` | `ts-node src/scripts/inject-sample-data.ts` |

Pre-commit hooks (husky): `lint-staged` runs prettier + git add on staged
`src/*.{js,ts,json,...}` files. Pre-push hook runs `npm run test`.

### `buildAndCopyWeb.sh`

Source: [`buildAndCopyWeb.sh`](../../buildAndCopyWeb.sh)

If `dashboard-frontend/` directory exists and has a `package.json`:
1. `npm install --force` inside `dashboard-frontend/`
2. `npm run build` (Vite output to `dashboard-frontend/dist/`)
3. Deletes `src/public/`, recreates it, copies `dist/*` into it
4. Writes a `src/public/version.txt` with timestamp

**Note for Falx:** This script targets `dashboard-frontend/` (the upstream UI
that must not be modified). Falx should point this script at `falx-ui/` instead,
or create a parallel script `buildAndCopyFalxWeb.sh`. Until that is done,
`npm run build` copies the upstream UI into `lib/`, not the Falx UI.

### `webpack.config.js`

Source: [`webpack.config.js`](../../webpack.config.js)

Entry point: `./lib/src/index.js` (post-tsc output). Output: `lib/bundle.js`
(UMD library). Plugin-specific sub-config at `src/modules/webpack.config.js` is
merged if it exists.

Notable plugins:
- **`webpack-obfuscator`**: Obfuscates bundle with `rotateStringArray`,
  `splitStrings`, `transformObjectKeys`, `unicodeEscapeSequence`. Source maps
  are emitted (`nosources-source-map`).
- **`remove-files-webpack-plugin`** (`CleanUpLibFolder`): After bundling,
  removes all `lib/src/` files except paths matching `/src\/scripts/`,
  `/config.js/`, `/main.js/`. This means the installed plugin delivers only the
  obfuscated bundle, not raw JS.
- **`DynamicFileGenerator`**: Writes `lib/src/main.js` (re-exports bundle
  default as `DevicePlugin`) and `lib/src/modules/index.js` (re-exports
  `FakeModuleLoader`) at compile time.

### `install.sh`

Source: [`install.sh`](../../install.sh)

Sets `APPIUM_HOME=/tmp/device-farm`, runs `npm run build`, uninstalls then
reinstalls the plugin from local source, installs the `uiautomator2` and
`xcuitest` Appium drivers.

---

## 2. Docker

### `docker/Dockerfile` (production-ish, Android-only)

Source: [`docker/Dockerfile`](../../docker/Dockerfile)

- Base: `appium/appium:v2.19.0-p4` (pinned)
- Installs `git` and `mjpeg-consumer` globally
- Installs `appium-uiautomator2-driver@4.2.9` and `appium-device-farm` from npm
  (not from local source — uses the published upstream package, not Falx)
- Exposes `$APPIUM_PORT` (default `4723`)
- Entrypoint: `/start-appium.sh`

**Gap:** This Dockerfile installs upstream `appium-device-farm` from npm, not
the Falx fork. A Falx-specific Dockerfile would need to build and install from
local source.

### `docker/Dockerfile.local` (with Android emulator support)

Source: [`docker/Dockerfile.local`](../../docker/Dockerfile.local)

Multi-stage build:
- **Builder stage:** `appium/appium:v2.19.0-p4`, installs Java 17
  (`openjdk-17-jdk`), Android SDK command-line tools (version
  `commandlinetools-linux-9477386_latest.zip`), accepts SDK licenses, installs
  `platform-tools`, `platforms;android-34`, `build-tools;34.0.0`. Creates an
  AVD named `test_emulator` for Android 34; ABI is `x86_64` for `amd64` targets
  and `arm64-v8a` for `arm64` — supports multi-arch builds via `$TARGETARCH`.
- **Final stage:** Copies SDK from builder, installs KVM/QEMU deps, audio
  (`pulseaudio`), X11 (`Xvfb`), OpenGL (`libgl1-mesa-dev`), `socat`.
  Installs `mjpeg-consumer`, `uiautomator2@4.2.9`, `appium-device-farm` (again,
  from npm).
- Exposes ports `$APPIUM_PORT`, `5554`, `5555`, `7000`.
- Creates a non-root `appium` user.
- Entrypoint: `/start-appium.sh` (emulator script is available but not in CMD).

### `docker/start-appium.sh`

Source: [`docker/start-appium.sh`](../../docker/start-appium.sh)

Starts `socat` TCP forwarders for ports 5554 and 5555 to
`host.docker.internal` (Android emulator ADB console ports). Then constructs an
`appium server` command dynamically from environment variables.

**Supported env vars → CLI args mapping (full list):**

| Env var | `--plugin-device-farm-*` arg |
|---|---|
| `PLUGIN_DEVICE_FARM_PLATFORM` | `--plugin-device-farm-platform` |
| `PLUGIN_DEVICE_FARM_HUB` | `--plugin-device-farm-hub` |
| `PLUGIN_DEVICE_FARM_MAX_SESSIONS` | `--plugin-device-farm-max-sessions` |
| `PLUGIN_DEVICE_FARM_ENABLE_DASHBOARD` | `--plugin-device-farm-enable-dashboard` (flag) |
| `PLUGIN_DEVICE_FARM_ENABLE_AUTHENTICATION` | `--plugin-device-farm-enable-authentication` (flag) |
| `PLUGIN_DEVICE_FARM_ACCESS_KEY` | `--plugin-device-farm-access-key` |
| `PLUGIN_DEVICE_FARM_TOKEN` | `--plugin-device-farm-token` |
| `PLUGIN_DEVICE_FARM_NODE_NAME` | `--plugin-device-farm-node-name` |
| `CONFIG_FILE` | `--config=$CONFIG_FILE` |

(Plus ~20 more `add_arg`/`add_flag` calls for device types, timeouts, IPs, etc.)

Server defaults: `APPIUM_PORT=4723`, `APPIUM_PATH=/wd/hub`.

### `docker/start-emulator.sh`

Source: [`docker/start-emulator.sh`](../../docker/start-emulator.sh)

Starts `Xvfb :99`, then launches `$ANDROID_SDK_ROOT/emulator/emulator -avd
test_emulator` with `-no-audio -no-window -gpu swiftshader_indirect
-no-snapshot`. Waits for `adb wait-for-device` + boot completed check. This
script is referenced but commented out in `start-appium.sh` (the emulator launch
is optional / manual).

---

## 3. CI

### Provider

**GitHub Actions** (`.github/workflows/`). The Azure Pipelines file
([`azure-pipelines.yml`](../../azure-pipelines.yml)) is entirely commented out —
it describes historical job shapes but is not active.

### Active workflows

#### `test.yml` — CI (push to `main`)

Source: [`.github/workflows/test.yml`](../../.github/workflows/test.yml)

Triggers on push to `main`. Node 20 on all jobs.

| Job | Runner | What it does |
|---|---|---|
| `buildWithSubmodule` | `macos-latest` | `npm install + bundle`, then `npm test` (unit tests) |
| `HubWithNoPlatform` | `ubuntu-latest` | `npm install + bundle`, then `npm run test-e2e` |
| `buildWithOutSubmodule` | `macos-latest` | Build only, no tests (verifies install without submodules) |
| `AndroidIntegrationTest` | `ubuntu-latest` | Android API 29 emulator via `reactivecircus/android-emulator-runner@v2`, runs `integration-android` |
| `E2EHubAndNodeTest` | `ubuntu-latest` | Android API 29 emulator, runs `test-e2e-hubnode` |
| `IOSIntegrationTest` | `macos-latest` | `npm install + bundle`, runs `integration-ios` |
| `E2EPluginTest` | `macos-latest` | `npm install + bundle`, runs `test-e2e` |

BrowserStack, LambdaTest, and cloud provider jobs are commented out.

#### `prtest.yml` — PR-CI (on pull_request)

Source: [`.github/workflows/prtest.yml`](../../.github/workflows/prtest.yml)

| Job | Runner | What it does |
|---|---|---|
| `buildWithSubmodule` | `macos-latest` | Build + unit test + `prettier-check` |
| `buildWithOutSubmodule` | `macos-latest` | Build only |
| `AndroidIntegrationTest` | `ubuntu-latest` | Android emulator integration test |
| `IOSIntegrationTest` | `macos-latest` | iOS integration test |

E2E hub/node and cloud tests commented out on PRs.

#### `publish.yml` — Release (push to `main` or manual dispatch)

Source: [`.github/workflows/publish.yml`](../../.github/workflows/publish.yml)

Runs on `macos-latest`. Steps: checkout (with submodules), node LTS, `npm
install + bundle`, then `npx semantic-release`. Requires secrets
`GITHUB_TOKEN` and `npm_token`.

#### `pr-title.yml` — Conventional Commits lint

Source: [`.github/workflows/pr-title.yml`](../../.github/workflows/pr-title.yml)

Uses `beemojs/conventional-pr-action@v3` (angular preset) to enforce
conventional commit format on PR titles.

---

## 4. Release Flow

### `semantic-release` + Conventional Commits

Source: [`.releaserc`](../../.releaserc)

- **Commit analyzer:** Angular preset. `chore` commits trigger a patch release.
- **Release notes generator:** `conventionalcommits` preset — Features, Bug
  Fixes, Performance, Reverts, Chores are visible; Docs, Style, Test, Build, CI
  are hidden.
- **Artifacts:** Updates `CHANGELOG.md` and `package.json`, commits them with
  `chore(release): <version> [skip ci]`, creates a GitHub release and npm
  publish.
- **`CHANGELOG.md`** format: standard Keep-a-Changelog markdown, auto-generated
  by semantic-release. Currently at upstream `v12.0.0` in `package.json` (with
  changelog reflecting upstream's `v11.x` history).

**Gap for Falx:** The `publish.yml` workflow publishes to npm as
`appium-device-farm`. Falx does not currently have a separate publish step or
registry.

---

## 5. Ports and Env Vars

### Default ports

| Port | Purpose |
|---|---|
| `4723` | Appium default (`APPIUM_PORT`) |
| `31337` | Hub (sample-config, server-config) |
| `31338` | Node (node-config) |
| `5554 / 5555` | Android emulator ADB console / data (socat-forwarded) |
| `7000` | Exposed in Dockerfile.local — **Unknown:** not referenced in start scripts |

### Config file precedence

Appium's `--config` flag accepts a JSON file. The plugin reads its args from the
`server.plugin.device-farm` key (see schema in `package.json` lines 215-330).
CLI flags and env vars in the container override the config file on a per-arg
basis. There is no documented layering order beyond: explicit CLI arg wins.

### Sample config files

| File | Purpose |
|---|---|
| [`sample-config.json`](../../sample-config.json) | Full example: port 31337, Android+iOS, adbRemote, emulators, hub |
| [`server-config.json`](../../server-config.json) | Hub example: port 31337, both platforms, live streaming |
| [`node-config.json`](../../node-config.json) | Node example: port 31338, hub at 192.168.1.16:31337 |
| [`remote-config.json`](../../remote-config.json) | Remote node: port 4723, hub at 127.0.0.1:31337 |

### `log-filter.json`

Source: [`log-filter.json`](../../log-filter.json)

Seven regex patterns that redact sensitive values from log output: JWT tokens
(`df:jwt`), access keys (`df:accesskey`), passwords (`df:token`, `password`),
usernames (`username`), tokens (`token`, `accesskey`). Applied by the upstream
logging layer (referenced as `SECURE_VALUES_PREPROCESSOR` in
`@appium/support/lib/logging.js`).

---

## 6. Docs Site

### `mkdocs.yml`

Source: [`mkdocs.yml`](../../mkdocs.yml)

Inherits from `@appium/docutils/base-mkdocs.yml`. Site name: "Appium Device
Farm". Deployed to `https://appium-device-farm-eight.vercel.app/`. Theme: MkDocs
Material with `navigation.tabs`. Versioning via `mike`. Pages: index, setup,
troubleshooting, cloud, remote-execution, server-args, capabilities, command
references.

**Note for Falx:** This docs site is upstream's. Falx has no separate docs site
configured.

---

## 7. Dependency Updates

### `renovate.json`

Source: [`renovate.json`](../../renovate.json)

Extends `config:base` and `:semanticCommitTypeAll(ci)`. Package rule:
`patch`, `pin`, `digest`, and `minor` updates are **automerged**. Major
updates are not automerged. Semantic commit type for Renovate PRs is `ci`.

**Unknown:** Whether a Renovate app is actually installed on the fork; config
is present but may not be active.

---

## 8. On-Prem Deployment Story — Gaps

The following infrastructure components are **absent** from the repo:

- **Docker Compose file:** No `docker-compose.yml` at any level. Running a
  multi-node farm requires manual orchestration.
- **Helm chart:** None.
- **Ansible playbooks:** None.
- **Terraform:** None.
- **Systemd unit file or supervisor config:** None.
- **Nginx / reverse-proxy config:** None.
- **Environment variable reference doc:** The `docker/README.md` lists
  `PLUGIN_DEVICE_FARM_*` vars, but there is no consolidated `.env.example` or
  secrets management guidance.
- **Multi-node networking guide:** Hub/node topology is described in sample
  configs only. No documented procedure for connecting physical iOS hosts to an
  Android hub.
- **Health check in Dockerfile:** Neither Dockerfile has a `HEALTHCHECK`
  directive.
- **Image registry / tagging:** No image is pushed to any registry in CI. Images
  exist only as locally built artifacts.

**Unknown:** Whether `infra/` (referenced in `CLAUDE.md`) exists or is planned.
It does not exist on disk at time of this discovery.
