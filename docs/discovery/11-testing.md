**Lens:** Tester

# Testing Discovery

## 1. Test Runner Setup

### Primary runner: Mocha + ts-node

Source: [`package.json`](../../package.json) lines 11-27.

All test suites except one use **Mocha 9.2.2** with `--require ts-node/register`
(ts-node 10.9.2) to run TypeScript specs directly. The test pattern glob varies
per script.

Assertion library: **Chai 4.5.0** (`expect` style and `should` style both used).
Sinon 17.0.1 for stubs/spies/mocks. `sinon-chai` for Chai-Sinon assertions.
`chai-as-promised` for async assertions. `chai-exclude` in one e2e spec.
WebdriverIO 8.x (`webdriverio` + `@wdio/types`) for browser-side session
creation in e2e tests.

### Secondary runner: Jest (one file)

```
"test-jest": "NODE_OPTIONS=--experimental-vm-modules npx jest ./test/unit/AndroidDeviceManager.spec.js"
```

This is a standalone npm script; Jest is not in `devDependencies` so it relies
on a globally installed or npx-resolved version. The `--experimental-vm-modules`
flag is required because the source uses ESM. This script is not invoked by any
CI job.

### Default unit test command

```sh
mocha -r ts-node/register ./test/unit/*.spec.{j,t}s \
  --plugin-device-farm-platform=both --exit --timeout=20000
```

`--exit` forces Mocha to quit after tests complete (works around async handle
leaks). `--timeout=20000` (20 s per test).

---

## 2. Test Layout

```
test/
├── unit/           # Fast, in-process, mostly sinon-stubbed
├── integration/    # Require a live process or real hardware
└── e2e/            # Full Appium server + driver sessions
```

---

## 3. Unit Tests (`test/unit/`)

Source directory: [`test/unit/`](../../test/unit/)

| Spec file | What it covers |
|---|---|
| [`plugin.spec.ts`](../../test/unit/plugin.spec.ts) | Device filter logic, capability matching, session allocation via `CapabilityManager` and `device-utils`; uses `ATDRepository` in-memory |
| [`AndroidDeviceManager.spec.ts`](../../test/unit/AndroidDeviceManager.spec.ts) | `AndroidDeviceManager`: ADB clone, remote ADB host registration; sinon stubs on ADB |
| [`adb-manager.spec.ts`](../../test/unit/adb-manager.spec.ts) | `ADBManager` singleton: lazy init, `createADB` stubbing, basic ADB method delegation |
| [`enhanced-adb-manager.spec.ts`](../../test/unit/enhanced-adb-manager.spec.ts) | `EnhancedADBManager`: context management (`ADBContext`), same pattern as `adb-manager.spec.ts` |
| [`IOSDeviceManager.spec.js`](../../test/unit/IOSDeviceManager.spec.js) | `IOSDeviceManager`: device list building, platform detection, remote iOS stubbing; uses `deviceMock` fixture |
| [`RemoteIOs.spec.js`](../../test/unit/RemoteIOs.spec.js) | Remote iOS aggregation across hub/nodes — **entirely skipped** (`describe.skip`) |
| [`DeviceModel.spec.ts`](../../test/unit/DeviceModel.spec.ts) | `device-service` CRUD (`addNewDevice`, `getAllDevices`, `removeDevice`, `setSimulatorState`); exercises both LokiJS and Prisma paths with `deviceMock` fixture |
| [`device-service.spec.ts`](../../test/unit/device-service.spec.ts) | `getDevice` filtering by SDK, platform, deviceType, udid; in-memory `ATDRepository` setup |
| [`device-utils.spec.ts`](../../test/unit/device-utils.spec.ts) | `allocateDeviceForSession`, device util helpers, `DeviceFarmManager`, `sessionRequestMap`; broad coverage of allocation logic |
| [`cleanup-builds.spec.ts`](../../test/unit/cleanup-builds.spec.ts) | `cleanup-builds` sequential delete with Prisma client; uses real `prisma` instance and actual DB path |
| [`helpers.spec.ts`](../../test/unit/helpers.spec.ts) | `getFreePort` with and without port-range string; `getPort.makeRange` stubbed |
| [`ChromeDriverManager.spec.js`](../../test/unit/ChromeDriverManager.spec.js) | `ChromeDriverManager.downloadChromeDriver` — **entirely skipped** (`it.skip`) |
| [`commands.spec.js`](../../test/unit/commands.spec.js) | Plugin command registration — **entirely skipped** (`describe.skip`) |
| [`config.spec.js`](../../test/unit/config.spec.js) | `isDeviceConfigPathAbsolute`: absolute path check, throws on relative path |

### Fixtures

| File | Contents |
|---|---|
| [`test/unit/fixtures/device.config.js`](../../test/unit/fixtures/device.config.js) | `{ platform: 'android' }` — minimal config object |
| [`test/unit/fixtures/devices.js`](../../test/unit/fixtures/devices.js) | `deviceMock` array: 9 devices — 3 Android emulators, 4 iOS simulators, 2 iOS real-device shapes |
| [`test/unit/GetAdbOriginal.js`](../../test/unit/GetAdbOriginal.js) | Helper to retrieve a real (non-stubbed) ADB instance for tests that need it |

---

## 4. Integration Tests (`test/integration/`)

Source directory: [`test/integration/`](../../test/integration/)

Require a real environment (Android emulator or iOS simulator). Invoked via
`npm run integration-android` / `integration-ios`.

| Spec file | Platform | What it covers |
|---|---|---|
| [`androidDevices.spec.ts`](../../test/integration/androidDevices.spec.ts) | Android | Device allocation and session lifecycle against a live emulator; uses `ATDRepository`, `DeviceFarmManager`, `allocateDeviceForSession`, `updateDeviceList` |
| [`cleanup-builds.spec.ts`](../../test/integration/cleanup-builds.spec.ts) | Any (Prisma) | Build and session cleanup with real Prisma client; verifies `sessionLog.deleteMany` and asset path removal |
| [`ios/01iOSSimulator.spec.ts`](../../test/integration/ios/01iOSSimulator.spec.ts) | iOS | Simulator device list, allocation, session clean-up against `node-simctl` |
| [`ios/02iOSDevices.spec.ts`](../../test/integration/ios/02iOSDevices.spec.ts) | iOS | Real iOS device connectivity (requires a physically attached device or remote connection) |

Helper files:

| File | Purpose |
|---|---|
| [`test/integration/cliArgs.js`](../../test/integration/cliArgs.js) | Exports `serverCliArgs` object used by unit and integration specs to bootstrap `ATDRepository` |
| [`test/integration/testHelpers.js`](../../test/integration/testHelpers.js) | Shared setup utilities for integration specs |

---

## 5. E2E Tests (`test/e2e/`)

Source directory: [`test/e2e/`](../../test/e2e/)

Spin up full Appium server instances with the plugin loaded. Timeouts are
typically `999999` ms (unbounded). Use `webdriverio` for WD session creation.

### Core e2e specs

| Spec file | What it covers |
|---|---|
| [`plugin.spec.ts`](../../test/e2e/plugin.spec.ts) | Hub + node pair; verifies device routing, session creation without a declared platform, basic device-farm flow using `pluginE2EHarness` |
| [`e2ehelper.ts`](../../test/e2e/e2ehelper.ts) | Shared helpers: `ensureAppiumHome`, `ensureHubConfig`, `ensureNodeConfig`, port constants (`HUB_APPIUM_PORT`, `NODE_APPIUM_PORT`), `PLUGIN_PATH` |
| [`plugin-harness.ts`](../../test/e2e/plugin-harness.ts) | Custom plugin harness that launches two Appium servers (hub + node) simultaneously; based on `@appium/plugin-test-support` |
| [`browserstack.spec.ts`](../../test/e2e/browserstack.spec.ts) | BrowserStack cloud integration; verifies device listing and session creation against BrowserStack API |
| [`pcloudy.spec.ts`](../../test/e2e/pcloudy.spec.ts) | pCloudy cloud integration; device listing and session creation |

### Hub/node e2e

| Spec file | What it covers |
|---|---|
| [`hubnode/hubnode.spec.ts`](../../test/e2e/hubnode/hubnode.spec.ts) | Two-server hub-node topology: hub registers node, verifies forwarded sessions and device availability |
| [`hubnode/forward-request.spec.ts`](../../test/e2e/hubnode/forward-request.spec.ts) | Request forwarding from hub to node under load/concurrency conditions |

### Android platform e2e

| Spec file | What it covers |
|---|---|
| [`android/conf.spec.js`](../../test/e2e/android/conf.spec.js) | Android local device, WebdriverIO session at port 4723 |
| [`android/conf2.spec.js`](../../test/e2e/android/conf2.spec.js) | Android variant session config |
| [`android/conf3.spec.js`](../../test/e2e/android/conf3.spec.js) | Android variant session config |

### iOS platform e2e

| Spec file | What it covers |
|---|---|
| [`ios/conf1.spec.js`](../../test/e2e/ios/conf1.spec.js) | iOS simulator session creation |
| [`ios/conf2.spec.js`](../../test/e2e/ios/conf2.spec.js) | iOS variant session config |

### Cloud provider e2e

| Spec file | Cloud | What it covers |
|---|---|---|
| [`android/cloud/bs.spec.ts`](../../test/e2e/android/cloud/bs.spec.ts) | BrowserStack | Android session via BS; requires `CLOUD_USERNAME`, `CLOUD_KEY`, `BS_ANDROID_CLOUD_APP` env vars |
| [`android/cloud/pcloudy.spec.ts`](../../test/e2e/android/cloud/pcloudy.spec.ts) | pCloudy | Android session via pCloudy; env vars from `dotenv` |
| [`android/cloud/sauce.spec.js`](../../test/e2e/android/cloud/sauce.spec.js) | Sauce Labs | Android session; requires server running at `localhost:31337` (gated by `wait-on`) |
| [`android/cloud/lambdaTest.spec.ts`](../../test/e2e/android/cloud/lambdaTest.spec.ts) | LambdaTest | Android session via LT; requires `CLOUD_USERNAME`, `CLOUD_KEY`, `LT_CLOUD_APP` |
| [`android/cloud/confIOS.ts`](../../test/e2e/android/cloud/confIOS.ts) | BrowserStack | iOS session via BS |

---

## 6. CI Invocation

| CI job | npm script | Runner |
|---|---|---|
| Unit tests | `npm test` | `macos-latest` (Node 20) |
| Android integration | `npm run integration-android` | `ubuntu-latest` (API 29, `google_apis`, `x86_64`) |
| iOS integration | `npm run integration-ios` | `macos-latest` |
| E2E plugin (hub/no platform) | `npm run test-e2e` | `ubuntu-latest` |
| E2E hub/node | `npm run test-e2e-hubnode` | `ubuntu-latest` (API 29 emulator) |
| E2E plugin (PR job) | `npm run test-e2e` | `macos-latest` |

Cloud provider CI jobs (BrowserStack, LambdaTest, Sauce, pCloudy) are defined
in both `test.yml` and `azure-pipelines.yml` but are **entirely commented out**
in both files.

---

## 7. Coverage Tooling

**nyc 15.1.0** is listed as a production dependency (unusual placement — it is
typically a dev dependency). Invoked via:

```sh
npm run coverage   # nyc npm run test
```

There is **no `.nycrc` or nyc configuration** in `package.json`. This means nyc
runs with its defaults: no reporters specified explicitly, no include/exclude
overrides, no coverage threshold. Coverage reports are not uploaded to any
service (Codecov, Coveralls, etc.) in CI.

---

## 8. Test Data Setup

- **In-memory fixtures:** `test/unit/fixtures/devices.js` — a 9-device array
  exported as `deviceMock`. Used directly in `DeviceModel.spec.ts`,
  `IOSDeviceManager.spec.js`, `RemoteIOs.spec.js`.
- **Minimal config fixture:** `test/unit/fixtures/device.config.js` — single
  `{ platform: 'android' }`.
- **`cliArgs.js`:** Exports `serverCliArgs` used to initialize `ATDRepository`
  (LokiJS in-memory DB) in unit and integration tests.
- **Prisma + real DB:** `cleanup-builds.spec.ts` (both unit and integration
  variants) use the real `prisma` singleton. Database path comes from
  `config.databasePath`. No seeding script is invoked before tests; the schema
  must already exist (populated by `postinstall` → `run-db-migration`).
- **No factory library:** No Faker, FactoryBot-style library, or database
  seeder. Test data is hand-crafted inline or pulled from the `devices.js`
  fixture.
- **dotenv:** `dotenv` is imported in cloud provider specs (`bs.spec.ts`,
  `lambdaTest.spec.ts`) to read credentials from a `.env` file. No `.env.example`
  is committed.

---

## 9. Coverage Assessment

### Well-tested areas

- Device allocation logic (`device-utils.spec.ts`, `plugin.spec.ts`,
  `androidDevices.spec.ts`) — exercised thoroughly with multiple platform
  combinations and edge cases.
- Android device manager (`AndroidDeviceManager.spec.ts`,
  `adb-manager.spec.ts`, `enhanced-adb-manager.spec.ts`).
- iOS simulator allocation (`01iOSSimulator.spec.ts`).
- Hub/node topology (`hubnode.spec.ts`, `forward-request.spec.ts`).
- Port-range and config loading helpers.

### Notable gaps

- **`RemoteIOs.spec.js`** is entirely `describe.skip` — remote iOS path is
  untested.
- **`ChromeDriverManager.spec.js`** and **`commands.spec.js`** are entirely
  skipped.
- **Auth/RBAC** (`src/auth/`) has no dedicated unit tests. Auth middleware, JWT
  logic, team/user services are not exercised in the test suite.
- **Dashboard routes** (`src/dashboard/router.ts`) have no unit or integration
  test coverage.
- **WebSocket / live-streaming** code paths have no tests.
- **Cloud provider integrations** (BrowserStack, LambdaTest, etc.) are tested
  only in CI-disabled jobs; they cannot run without live credentials and are
  excluded from every active CI gate.
- **nyc coverage thresholds:** None set — the build does not fail on low
  coverage.
- **`cleanup-builds.spec.ts` (unit):** Accesses real Prisma/DB; despite living
  in `test/unit/` it behaves as an integration test.
- **iOS real devices** (`02iOSDevices.spec.ts`): Requires physical hardware;
  not exercisable in CI.
