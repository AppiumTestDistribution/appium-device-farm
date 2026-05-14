# 07 — Device management

**Lens:** engineer.

This doc describes how the upstream `appium-device-farm` plugin discovers,
tracks, and manages devices across platforms. It is purely descriptive of the
fork's current code (matches upstream behaviour). Behaviour notes use
`[architect]` only where the lens shifts.

Top-level entry point is [`DeviceFarmManager`](../../src/device-managers/index.ts)
in `src/device-managers/index.ts`. It instantiates one or more
`IDeviceManager` per platform and exposes
`getDevices(existingDeviceDetails?)`. Platform selection is driven by the
plugin arg `platform` ∈ `{android, ios, both, none}`
([`src/device-managers/index.ts:26-33`](../../src/device-managers/index.ts#L26-L33)).
Each manager returns `IDevice[]`
([`src/interfaces/IDevice.ts`](../../src/interfaces/IDevice.ts)) and the
manager stamps `nodeId` on every non-cloud device
([`src/device-managers/index.ts:41-47`](../../src/device-managers/index.ts#L41-L47)).

A `cloud` field in plugin args short-circuits the per-platform manager and
delegates entirely to [`cloud/Devices`](../../src/device-managers/cloud/Devices.ts)
([`AndroidDeviceManager.ts:61-64`](../../src/device-managers/AndroidDeviceManager.ts#L61-L64),
[`IOSDeviceManager.ts:44-48`](../../src/device-managers/IOSDeviceManager.ts#L44-L48)).

## 1. Android

Files:
- [`AndroidDeviceManager.ts`](../../src/device-managers/AndroidDeviceManager.ts)
- [`AdbServer.ts`](../../src/device-managers/AdbServer.ts)
- [`ChromeDriverManager.ts`](../../src/device-managers/ChromeDriverManager.ts)
- [`chromeUtils.ts`](../../src/chromeUtils.ts)

### Discovery / ADB

The manager lazily builds a singleton ADB instance via
`enhancedADBManager.getLocalADB()` and starts a `Tracker` from
`@devicefarmer/adbkit`'s `Client.trackDevices()`
([`AndroidDeviceManager.ts:254-268`](../../src/device-managers/AndroidDeviceManager.ts#L254-L268)).
On first call to `getAdb()`, the tracker is wired with `add`, `remove`,
`change`, `end`, and `error` listeners
([`AndroidDeviceManager.ts:461-493`](../../src/device-managers/AndroidDeviceManager.ts#L461-L493)).
The `end` handler re-creates `client.trackDevices()` and re-attaches the
listeners, so a dropped tracker auto-reconnects.

Remote ADB hosts are configured via the `adbRemote: ["host:port", ...]`
plugin arg. For each entry, `enhancedADBManager.getRemoteADB(host, port)` is
called and a separate `Tracker` per remote is cached in
`this.remoteTrackers` keyed by id
([`AndroidDeviceManager.ts:381-406`](../../src/device-managers/AndroidDeviceManager.ts#L381-L406),
[`AndroidDeviceManager.ts:521-556`](../../src/device-managers/AndroidDeviceManager.ts#L521-L556)).

`getConnectedDevices(pluginArgs)` returns a `Map<adbInstance, DeviceWithPath[]>`
that includes the local ADB plus every remote
([`AndroidDeviceManager.ts:381-406`](../../src/device-managers/AndroidDeviceManager.ts#L381-L406)).
`fetchAndroidDevices` then iterates each `(adbInstance, devices[])` pair and
hydrates a full `IDevice` for any UDID that isn't already in the existing
list. Devices in any state other than `device` (e.g. `offline`,
`unauthorized`) are skipped
([`AndroidDeviceManager.ts:125-139`](../../src/device-managers/AndroidDeviceManager.ts#L125-L139)).

[`AdbServer.ts`](../../src/device-managers/AdbServer.ts) is a small standalone
helper that spawns `adb -a nodaemon server start` and then kills it after
5 s. It is not imported by `AndroidDeviceManager`; the live tracking goes
through `adbkit`'s socket connection to whatever ADB server `ANDROID_HOME`
exposes. **Unknown:** whether `AdbServer.ts` is invoked from anywhere
outside this file — search of `src/` shows no importers, but a startup
script outside `src/` may use it.

### Captured device properties

`deviceInfo()` populates an `IDevice`
([`AndroidDeviceManager.ts:151-252`](../../src/device-managers/AndroidDeviceManager.ts#L151-L252)).
Properties and how they're obtained:

| Field | Source |
| --- | --- |
| `sdk` (OS version) | `getprop ro.build.version.release` ([line 587-589](../../src/device-managers/AndroidDeviceManager.ts#L587-L589)) |
| `realDevice` | `getprop ro.build.characteristics !== 'emulator'` ([632-635](../../src/device-managers/AndroidDeviceManager.ts#L632-L635)) |
| `name` | First non-empty of: `dumpsys bluetooth_manager \| grep name:` then `ro.vendor.oplus.market.name`, `ro.display.series`, `ro.product.name` (real) or `ro.kernel.qemu.avd_name`, `ro.boot.qemu.avd_name` (emu) ([659-701](../../src/device-managers/AndroidDeviceManager.ts#L659-L701)) |
| `width`, `height` | `wm size`, prefers `Override size:` over `Physical size:` ([595-618](../../src/device-managers/AndroidDeviceManager.ts#L595-L618)) |
| `chromeDriverPath` | `dumpsys package com.android.chrome` → `versionName` → `ChromeDriverManager.downloadChromeDriver(major)` ([558-585](../../src/device-managers/AndroidDeviceManager.ts#L558-L585)) |
| `deviceType` | `real` if `realDevice`, else `emulator` ([241](../../src/device-managers/AndroidDeviceManager.ts#L241)) |
| `systemPort` | `getFreePort(pluginArgs.portRange)` ([157](../../src/device-managers/AndroidDeviceManager.ts#L157)) |
| `adbRemoteHost`, `adbPort` | From the `adbInstance` that found the device ([104-107, 231-232](../../src/device-managers/AndroidDeviceManager.ts#L104-L107)) |
| `host` | `http://<bindHostOrIp>:<hostPort>` (or `remoteMachineProxyIP` override) ([216-223](../../src/device-managers/AndroidDeviceManager.ts#L216-L223)) |
| `id` | `generateDeviceId({udid, realDevice, nodeId, platform})` — UUID by UDID for real, UUID by `${nodeId}-${udid}` for emulators ([`device-service.ts:12-24`](../../src/data-service/device-service.ts#L12-L24)) |

If `sdk` or `realDevice` cannot be read, the device is skipped
([`AndroidDeviceManager.ts:192-194`](../../src/device-managers/AndroidDeviceManager.ts#L192-L194)).
If `pluginArgs.skipChromeDownload` is false and chromedriver cannot be
resolved, the device is also skipped
([`AndroidDeviceManager.ts:205-208`](../../src/device-managers/AndroidDeviceManager.ts#L205-L208)).

### Emulator vs real device

The only divergence is in startup: when a new device is added the manager
calls `waitBootEmulator` for emulators (`!realDevice`), which on API ≥ 31
polls `cmd reboot_readiness check-subsystems-state --list-blocking` and
falls back to checking `service list` for `activity`, `package`, `mount`
within 30 s
([`AndroidDeviceManager.ts:270-355`](../../src/device-managers/AndroidDeviceManager.ts#L270-L355)).
Real devices skip this wait
([`AndroidDeviceManager.ts:416-419`](../../src/device-managers/AndroidDeviceManager.ts#L416-L419)).
`waitBootComplete` (init.svc.bootanim==stopped) exists but is not called
from `onDeviceAdded`
([`AndroidDeviceManager.ts:357-379`](../../src/device-managers/AndroidDeviceManager.ts#L357-L379)).

Emulators can also be auto-launched at plugin init: `pluginArgs.emulators`
(array of `{avdName, launchTimeout}`) triggers `adb.launchAVD(arr.avdName, arr)`
during `DevicePlugin.updateServer`
([`plugin.ts:214-226`](../../src/plugin.ts#L214-L226)).

### App lifecycle

Uninstall: `adb -s <udid> uninstall <packageId>` via `uninstallApp`
([`AndroidDeviceManager.ts:703-713`](../../src/device-managers/AndroidDeviceManager.ts#L703-L713)).
There is no `installApp` on the manager itself; install is handled by Appium
during session creation. App path resolution for the session is done in
[`chromeUtils.ts`/`CapabilityManager.ts`](../../src/CapabilityManager.ts#L40-L57)
via `findAppPath` which looks up `AppInformation` rows by filename and
rewrites to `${DevicePlugin.serverUrl}${appInfo.path}`.

### Log capture / screen mirroring

**Unknown:** Log capture and screen-mirroring code is not in
`AndroidDeviceManager`. The MJPEG port is set via
`appium:mjpegServerPort = await getFreePort(...)` in `androidCapabilities`
([`CapabilityManager.ts:73-77`](../../src/CapabilityManager.ts#L73-L77)) so
live video relies on Appium's UiAutomator2 driver running its own MJPEG
server, not anything this manager owns. Recording and log streaming live
elsewhere — out of scope for this doc.

### Chromedriver

[`ChromeDriverManager`](../../src/device-managers/ChromeDriverManager.ts)
is a typedi singleton wrapping `appium-chromedriver`'s
`ChromedriverStorageClient`. On first device discovery it downloads
the chromedriver binary matching the major version of `com.android.chrome`
on the device and stores it under `${moduleRoot}/chromedriver_<os><arch>_v<ver>`
([`ChromeDriverManager.ts:39-60`](../../src/device-managers/ChromeDriverManager.ts#L39-L60)).
Skipped entirely if `pluginArgs.skipChromeDownload` is true.

### Tracker lifecycle

`onDeviceAdded`
([`AndroidDeviceManager.ts:408-459`](../../src/device-managers/AndroidDeviceManager.ts#L408-L459)):

1. Skip if `state === 'offline'`.
2. Initiate an `AbortController` for the UDID.
3. For emulators, `waitBootEmulator`; for real devices, skip that wait.
4. Hard-coded `sleep(6000)` post-boot.
5. Build `IDevice`, attach `nodeId`.
6. If running as node (`pluginArgs.hub !== undefined`), POST the device to
   the hub via `NodeDevices.postDevicesToHub([device], 'add')`
   ([`NodeDevices.ts:33-64`](../../src/device-managers/NodeDevices.ts#L33-L64)).
7. Always also call `addNewDevice` so the local store has a copy
   ([`AndroidDeviceManager.ts:456-457`](../../src/device-managers/AndroidDeviceManager.ts#L456-L457)).

`onDeviceRemoved` builds a `DeviceUpdate`, calls
`postDevicesToHub([...], 'remove')` (if hub), then `removeDevice` locally
([`AndroidDeviceManager.ts:495-512`](../../src/device-managers/AndroidDeviceManager.ts#L495-L512)).

## 2. iOS

Files:
- [`IOSDeviceManager.ts`](../../src/device-managers/IOSDeviceManager.ts)
- [`iOSTracker.ts`](../../src/device-managers/iOSTracker.ts)
- [`IOSDeviceType.ts`](../../src/device-managers/IOSDeviceType.ts)
- [`goIOSTracker.ts`](../../src/goIOSTracker.ts)
- [`iProxy.ts`](../../src/iProxy.ts)
- [`usbmux.ts`](../../src/usbmux.ts)

### Real-device discovery

`getRealDevices` → `fetchLocalIOSDevices`
([`IOSDeviceManager.ts:186-266`](../../src/device-managers/IOSDeviceManager.ts#L186-L266)):

1. `IOSUtils.getConnectedDevices()` from `appium-ios-device` returns UDID
   list ([`IOSDeviceManager.ts:72-80`](../../src/device-managers/IOSDeviceManager.ts#L72-L80)).
2. `trackIOSDevices(pluginArgs)` is wired to the tracker singleton (see
   below).
3. If `process.env.GO_IOS` is set, `startTunnel()` runs
   `${GO_IOS} tunnel start --userspace --tunnel-info-port=<port>` via
   `child_process.exec` ([`goIOSTracker.ts:98-124`](../../src/goIOSTracker.ts#L98-L124)).
4. For each UDID, either reuse the existing device record or call
   `getDeviceInfo(udid, pluginArgs, hostPort)`.

`getDeviceInfo` ([`IOSDeviceManager.ts:300-359`](../../src/device-managers/IOSDeviceManager.ts#L300-L359))
captures:

| Field | Source |
| --- | --- |
| `sdk` | `IOSUtils.getOSVersion(udid)` |
| `name` | `IOSUtils.getDeviceName(udid)` |
| `productModel` | `ProductType` from `getDeviceInfo(udid)` (`appium-ios-device/utilities`) |
| `width`, `height` | `IOSDeviceInfoMap[ProductType]` lookup, hard-coded model→resolution map ([`IOSDeviceType.ts`](../../src/device-managers/IOSDeviceType.ts)) |
| `platform` | `getDevicePlatformName(...)` — see tvOS section |
| `wdaLocalPort`, `mjpegServerPort` | `getFreePort(pluginArgs.portRange)` |
| `goIOSAgentPort` | `getFreePort(...)` only when `GO_IOS` env set |
| `webDriverAgentHost`, `webDriverAgentUrl` | `http://<bindHostOrIp>` and `http://<bindHostOrIp>:<wdaLocalPort>` |
| `deviceType` | always `'real'` for real-device path |
| `host` | `remoteMachineProxyIP` if set, else `http://<bindHostOrIp>:<hostPort>` |

### Trackers — usbmux vs go-ios

The tracker is a runtime choice via `IosTracker.getInstance()`
([`iOSTracker.ts`](../../src/device-managers/iOSTracker.ts)). If
`process.env.GO_IOS` is set, it returns `GoIosTracker.getInstance()`;
otherwise it returns `usbmux.createListener()`.

#### macOS / `usbmux` (default on Mac)
[`usbmux.ts`](../../src/usbmux.ts) is an inlined node-usbmux implementation.
It opens a socket to `/var/run/usbmuxd` (or `127.0.0.1:27015` on Windows),
sends a plist `Listen` request, parses the binary header + plist responses,
and emits `attached(udid)` / `detached(udid)` per `MessageType: Attached/Detached`
([`usbmux.ts:246-285`](../../src/usbmux.ts#L246-L285)). A device map
`{ [udid]: {DeviceID, LocationID, ConnectionType, ...} }` is maintained for
later port-tunnel requests ([`usbmux.ts:24, 263-275`](../../src/usbmux.ts#L24)).
The same module exposes `Relay` and `getTunnel(devicePort, opts)` for tcp
tunnels over usbmuxd, used internally by `iProxy`.

#### Linux / `go-ios` (`GO_IOS` set)
[`goIOSTracker.ts`](../../src/goIOSTracker.ts) wraps the `go-ios` binary in
`teen_process`'s `SubProcess`. It runs `<goIOSPath> listen` and parses
JSON lines on stdout, mapping `message.DeviceID → SerialNumber` and emitting
`attached` / `detached` accordingly
([`goIOSTracker.ts:27-90`](../../src/goIOSTracker.ts#L27-L90)).
`goIOSPath` defaults to `${cachePath('goIOS')}/ios` if `GO_IOS` env is not
set ([`goIOSTracker.ts:31-37`](../../src/goIOSTracker.ts#L31-L37)).

Beyond detection, `GO_IOS` also triggers `startTunnel()`
([`goIOSTracker.ts:98-124`](../../src/goIOSTracker.ts#L98-L124)) which keeps
a userspace tunnel open via `go-ios tunnel start --userspace
--tunnel-info-port=<config.goIOSTunnelInfoPort>` and assigns each device a
`goIOSAgentPort` free port for the WDA agent.

When go-ios is in use, the WDA capability flow also changes: the manager
sets `webDriverAgentUrl` and clears `wdaLocalPort` so Appium connects
directly to an externally-hosted WDA agent
([`CapabilityManager.ts:121-126`](../../src/CapabilityManager.ts#L121-L126)).
With usbmux it sets `usePreinstalledWDA = true` and `updatedWDABundleId =
<wdaInfo.appBundleId>` from the `wda-resign.ipa` `AppInformation` row
([`CapabilityManager.ts:113-120`](../../src/CapabilityManager.ts#L113-L120)).

#### Differences between trackers

| Aspect | `usbmux` | `goIOSTracker` |
| --- | --- | --- |
| Transport | usbmuxd unix socket / TCP | spawns `go-ios listen` subprocess, parses stdout JSON |
| Required tooling | usbmuxd (libimobiledevice) running | go-ios binary on PATH or `GO_IOS` env |
| Tunneling | uses own `Relay` / `getTunnel` (this file's `connectToDevice`) | external `go-ios tunnel start --userspace` |
| Re-entry / restart | none — single connection | sub-process `exit` re-emits `stop`; no auto-restart loop |
| Selected when | `process.env.GO_IOS` is unset (default macOS path) | `process.env.GO_IOS` is set (Linux / non-Xcode hosts) |

### iProxy / port forwarding (real device)

[`iProxy.ts`](../../src/iProxy.ts) provides a TCP proxy from a local port to
a port on a USB-connected iOS device. Each `iProxy` instance listens on a
local TCP socket and on every incoming connection calls
`utilities.connectPort(udid, devicePort)` from `appium-ios-device` to bridge
to the device ([`iProxy.ts:27-86`](../../src/iProxy.ts#L27-L86)).

`DeviceConnectionsFactory` is a singleton exposed as
`DEVICE_CONNECTIONS_FACTORY` ([`iProxy.ts:108-286`](../../src/iProxy.ts#L108-L286)).
Public surface: `requestConnection(udid, port, {usePortForwarding, devicePort})`
and `releaseConnection(udid, port?)`. Keys in the connections map use a
`udid:port` format. When `usePortForwarding === false`, no `iProxy` is
created — only an empty mapping entry — to track that the port is in use.
The factory has port-busy detection via `portscanner.checkPortStatus` and a
15 s wait-for-release loop
([`iProxy.ts:109, 224-255`](../../src/iProxy.ts#L109)).

### Simulator discovery

`getSimulators()` → `fetchLocalSimulators()` → `getLocalSims()`
([`IOSDeviceManager.ts:366-504`](../../src/device-managers/IOSDeviceManager.ts#L366-L504)):

1. Build a `Simctl` instance from `node-simctl` and call `simctl.list()` to
   get runtimes. Log unavailable runtimes.
2. `simctl.getDevices(null, 'iOS')` → iOS sims.
3. `simctl.getDevicesByParsing('tvOS')` → tvOS sims (separate call).
4. Filter:
   - If `pluginArgs.simulators` is set, keep only entries whose
     `(name, sdk)` matches one of the configured entries
     ([`IOSDeviceManager.ts:379-385`](../../src/device-managers/IOSDeviceManager.ts#L379-L385)).
   - If `pluginArgs.bootedSimulators` is set, keep only `state === 'Booted'`
     ([`IOSDeviceManager.ts:386-390`](../../src/device-managers/IOSDeviceManager.ts#L386-L390)).
5. For each, resolve `productModel` via
   `IOSDeviceManager.getProductModel(deviceTypes, device)`, look up
   `Width`/`Height` in `IOSDeviceInfoMap`, allocate `wdaLocalPort` and
   `mjpegServerPort`, and compute `derivedDataPath` via
   `prepareDerivedDataPath(pluginArgs.derivedDataPath, udid, realDevice=false)`
   ([`IOSDeviceManager.ts:202-237`](../../src/device-managers/IOSDeviceManager.ts#L202-L237)).
6. Sort by state.

`prepareDerivedDataPath` copies the configured path (per
`{simulator, device}`) into
`~/Library/Developer/Xcode/DerivedData/WebDriverAgent-<udid>` to allow WDA
build re-use across runs.

### Simulator state refresh

`refreshSimulatorState(pluginArgs, hostPort)` in
[`device-utils.ts:428-436`](../../src/device-utils.ts#L428-L436) sets an
interval that re-runs `IOSDeviceManager.getSimulators()` and pushes state
changes (Booted/Shutdown/...) through `setSimulatorState` every
`sendNodeDevicesToHubIntervalMs`.

### Simulator vs real device — summary

| Aspect | Simulator | Real device |
| --- | --- | --- |
| Source | `node-simctl` (`simctl list`) | `appium-ios-device` + usbmux/go-ios |
| `realDevice` field | `false` | `true` |
| `deviceType` field | `simulator` | `real` |
| `host` | `http://<bindHost>:<hostPort>` | `remoteMachineProxyIP` or `http://<bindHost>:<hostPort>` |
| `wdaLocalPort`, `mjpegServerPort` | yes | yes |
| `derivedDataPath` | yes, prebuilt | only used for build re-use |
| `webDriverAgentUrl` | (none) | yes |
| Uninstall path | `xcrun simctl uninstall <udid> <bundleId>` ([`IOSDeviceManager.ts:525-531`](../../src/device-managers/IOSDeviceManager.ts#L525-L531)) | `services.startInstallationProxyService(udid).uninstallApplication(bundleId)` ([`IOSDeviceManager.ts:513-524`](../../src/device-managers/IOSDeviceManager.ts#L513-L524)) |

## 3. tvOS

tvOS is **folded into the iOS path**, not a distinct manager. The plugin
arg `platform` accepts only `ios | android | both | none`
([`IPluginArgs.ts:34`](../../src/interfaces/IPluginArgs.ts#L34)). The
`Platform` type, however, includes `tvos`
([`types/Platform.ts:1`](../../src/types/Platform.ts#L1)) — that label is
assigned at discovery time by `getDevicePlatformName`
([`IOSDeviceManager.ts:89-179`](../../src/device-managers/IOSDeviceManager.ts#L89-L179)),
which inspects:

1. `ProductType` (e.g. `AppleTV...`) — definitive.
2. Device-name patterns (`apple tv`, `tv...`).
3. `ideviceinfo` fields `ProductName`, `DeviceClass`, `DeviceName`.
4. Aspect ratio (16:9 → tvOS) as a last-resort fallback.
5. Defaults to `ios` if nothing matches.

For simulators, `getLocalSims()` makes a separate
`simctl.getDevicesByParsing('tvOS')` call and merges the result with iOS
sims ([`IOSDeviceManager.ts:477-499`](../../src/device-managers/IOSDeviceManager.ts#L477-L499)).
`getProductModel` short-circuits to `undefined` when
`device.platform === 'tvOS'` (note the casing mismatch — the comparison is
against `'tvOS'` but `getDevicePlatformName` returns `'tvos'`; see
**Surprise** below)
([`IOSDeviceManager.ts:444-454`](../../src/device-managers/IOSDeviceManager.ts#L444-L454)).

tvOS-specific behaviour in capability injection: WDA file selection uses
`wda-resign_tvos.ipa` instead of `wda-resign.ipa` when
`freeDevice.platform === 'tvos'`
([`CapabilityManager.ts:113`](../../src/CapabilityManager.ts#L113),
[`scripts/ios-sign.ts:275-301`](../../src/scripts/ios-sign.ts#L275-L301)).

**Surprise:** the casing inconsistency. `getDevicePlatformName` returns
lowercase `tvos`, but `IOSDeviceManager.getProductModel` checks
`device.platform === 'tvOS'`. The latter check will never be truthy under
the current discovery path. **Unknown:** whether this is dead code or
matches some other call site.

## 4. Cloud devices

Files:
- [`src/device-managers/cloud/Devices.ts`](../../src/device-managers/cloud/Devices.ts)
- [`src/device-managers/cloud/CapabilityManager.ts`](../../src/device-managers/cloud/CapabilityManager.ts)
- [`src/enums/Cloud.ts`](../../src/enums/Cloud.ts)
- [`src/types/CloudSchema.ts`](../../src/types/CloudSchema.ts)

### Providers

Defined in `Cloud` enum ([`src/enums/Cloud.ts`](../../src/enums/Cloud.ts)):

- `browserstack`
- `pcloudy`
- `sauce` (Sauce Labs)
- `lambdatest`
- `headspin`

The provider is chosen by `cloud.cloudName` (case-insensitive) in plugin
args. Schemas live in [`CloudSchema.ts`](../../src/types/CloudSchema.ts):
`browserStackSchema`, `sauceOrLambdaSchema`, `pCloudySchema`, and a
permissive `defaultSchema`. Provider detection in `Devices`
([`cloud/Devices.ts:77-95`](../../src/device-managers/cloud/Devices.ts#L77-L95))
chooses which schema to validate against; the default schema is always
applied first ([line 26](../../src/device-managers/cloud/Devices.ts#L26)).

### How cloud devices surface in the UI

`Devices.getDevices()`
([`cloud/Devices.ts:28-67`](../../src/device-managers/cloud/Devices.ts#L28-L67))
flat-maps the configured `devices: CloudDevice[]` into `IDevice`-shaped
objects:

- `udid = uuidv4()` — synthetic, regenerated every refresh (**surprise**:
  cloud devices do not have stable UDIDs across refreshes).
- `host = cloud.url`, `deviceType = 'real'`, `busy = false`,
  `offline = false`, `userBlocked = false`.
- `capability = d` — original cloud-config entry preserved verbatim for
  later use.
- `cloud = cloudName`.
- Provider-specific `name`/`sdk` mapping:
  - BrowserStack → `name = d.deviceName`, `sdk = d.os_version`.
  - Sauce / LambdaTest / HeadSpin → `name = d.deviceName`, `sdk = d.platformVersion`.
  - pCloudy → `name = d.pCloudy_DeviceFullName || d.pCloudy_DeviceManufacturer`,
    `sdk = d.pCloudy_DeviceVersion || d.platformVersion`.

`nodeId` is intentionally **not** stamped on cloud devices
([`device-managers/index.ts:42-44`](../../src/device-managers/index.ts#L42-L44)).
The dashboard therefore sees cloud devices listed alongside local ones with
the same `IDevice` shape but distinguished by the presence of a `cloud`
property (e.g. checked in `device-utils.ts` stale-device pruning, [line 460-461,
473](../../src/device-utils.ts#L460-L461)) and by `host` pointing to the
cloud URL.

[architect] Routing of session create to a cloud device — when a request
matches a cloud device — bypasses local device locking and forwards
capabilities through
[`cloud/CapabilityManager`](../../src/device-managers/cloud/CapabilityManager.ts)
which merges the cloud-config's `capability` into `firstMatch[0]` /
`alwaysMatch` and (for pCloudy) injects `CLOUD_KEY` / `CLOUD_USERNAME` env
vars. Wider session routing is out of scope here — see doc 06.

### Cloud + Android suppression

When `pluginArgs.cloud` is set, the Android manager doesn't even try to
talk to ADB ([`AndroidDeviceManager.ts:61-64`](../../src/device-managers/AndroidDeviceManager.ts#L61-L64)).
Same for the iOS path
([`IOSDeviceManager.ts:44-48`](../../src/device-managers/IOSDeviceManager.ts#L44-L48)).
The `DevicePlugin.setIncludeSimulatorState` helper forces
`iosDeviceType = 'real'` when cloud is enabled
([`plugin.ts:323-329`](../../src/plugin.ts#L323-L329)). Stale-device cron
checks also stop in cloud mode
([`plugin.ts:290-317`](../../src/plugin.ts#L290-L317)).

## 5. Device state machine

Device state lives in **two places**:

1. **In-memory LokiJS collection** `devices` per
   [`ATDRepository.DeviceModel`](../../src/data-service/db.ts#L9-L11). All
   "free / busy / offline / blocked" mutations happen here.
2. **Prisma `Device` model** ([`prisma/schema.prisma:146-165`](../../prisma/schema.prisma#L146-L165))
   — the persistent registry, used for `isActive`, `isFlagged`, `usage`,
   tags, and team mapping.

### Boolean status fields on `IDevice`

[`IDevice`](../../src/interfaces/IDevice.ts#L3-L52):

- `busy: boolean` — device is allocated to a session.
- `userBlocked: boolean` — manual block via dashboard.
- `offline?: boolean` — device gone from the tracker.
- `state: string` — Android raw ADB state (`device`, `offline`,
  `unauthorized`) or iOS sim state (`Booted`, `Shutdown`).
- `session_id?: string` — currently allocated session id.
- `lastCmdExecutedAt?: number` — epoch ms of last proxied WD command.
- `newCommandTimeout?: number` — per-allocation timeout, overrides
  `pluginArgs.newCommandTimeoutSec`.
- `sessionStartTime` / `totalUtilizationTimeMilliSec` — usage accounting.

### Mutators in
[`src/data-service/device-service.ts`](../../src/data-service/device-service.ts)

| Function | Effect |
| --- | --- |
| `addNewDevice` | Persists to Prisma, inserts into Loki ([76-181](../../src/data-service/device-service.ts#L76-L181)) |
| `removeDevice` | Marks Prisma `isActive = false`; removes from Loki ([53-74](../../src/data-service/device-service.ts#L53-L74)) |
| `blockDevice(udid, host)` | `busy = true`, clears `lastCmdExecutedAt` ([490-499](../../src/data-service/device-service.ts#L490-L499)) |
| `unblockDevice(udid, host)` | Frees `busy`, `userBlocked`, `session_id`, `sessionResponse`, `sessionStartTime`; on hub also persists `usage` via Prisma `setUtilizationTime` ([501-556](../../src/data-service/device-service.ts#L501-L556)) |
| `userBlockDevice` | Sets `userBlocked = true` without touching `busy` ([462-470](../../src/data-service/device-service.ts#L462-L470)) |
| `userUnblockDevice` | Clears `userBlocked`, `busy`, `session_id`, `sessionResponse` ([472-483](../../src/data-service/device-service.ts#L472-L483)) |
| `setSimulatorState` | Reflects Booted/Shutdown changes from `IOSDeviceManager.getSimulators()` ([183-204](../../src/data-service/device-service.ts#L183-L204)) |
| `updateCmdExecutedTime` | Updates `lastCmdExecutedAt` for a session id ([447-455](../../src/data-service/device-service.ts#L447-L455)) |
| `updatedAllocatedDevice` | Merges arbitrary fields into the matching record ([430-445](../../src/data-service/device-service.ts#L430-L445)) |

### Background reconciliation
Run from `DevicePlugin.updateServer`
([`plugin.ts:290-314`](../../src/plugin.ts#L290-L314)):

- `setupCronCheckStaleDevices(checkStaleDevicesIntervalMs)` —
  [`device-utils.ts:438-506`](../../src/device-utils.ts#L438-L506) prunes
  devices whose host isn't reachable via `isDeviceFarmRunning(host)` for
  local nodes or `isAppiumRunningAt(host)` for cloud hosts.
- `setupCronReleaseBlockedDevices(checkBlockedDevicesIntervalMs,
  newCommandTimeoutSec)` —
  [`device-utils.ts:508-552`](../../src/device-utils.ts#L508-L552) iterates
  busy devices and unblocks any whose `lastCmdExecutedAt` is older than the
  per-device or global newCommandTimeout.
- `setupCronCleanPendingSessions(...)` — clears `PendingSessionsModel`
  entries older than `deviceAvailabilityTimeoutMs + 10000`
  ([`device-utils.ts:584-617`](../../src/device-utils.ts#L584-L617)).
- `unblockDeviceMatchingFilter({})` is run once at startup to recover from
  process restart with stuck busy devices
  ([`plugin.ts:311`](../../src/plugin.ts#L311)).

Implicit "error" state is not a distinct enum value — it's modelled as
`offline === true` plus a possible `failureReason` on the linked `Session`
row ([Prisma `Session.failureReason`](../../prisma/schema.prisma#L33)).

## 6. Capabilities matching

Files:
- [`src/CapabilityManager.ts`](../../src/CapabilityManager.ts)
- [`src/device-utils.ts`](../../src/device-utils.ts)

[`CapabilityManager.ts`](../../src/CapabilityManager.ts) defines
`DEVICE_FARM_CAPABILITIES`, the set of `df:*` capabilities a client can use
to influence allocation ([lines 10-30](../../src/CapabilityManager.ts#L10-L30)):

- `build`, `name` — session metadata.
- `recordVideo`, `videoResolution`, `videoTimeLimit`, `liveVideo`,
  `screenshotOnFailure`, `screenshotOnAll`.
- `deviceAvailabilityTimeout`, `deviceRetryInterval`.
- `iPhoneOnly`, `iPadOnly`, `udids`, `minSDK`, `maxSDK`, `filterByHost`,
  `saveDeviceLogs`, `tags`.
- `df:options` — bag of the same keys for clients that prefer a nested
  object.

`getDeviceFarmCapabilities(caps)` merges `firstMatch[0]` + `alwaysMatch`,
takes `df:options` as the base, then overlays every key that starts with
`df:` (strip prefix) ([CapabilityManager.ts:153-169](../../src/CapabilityManager.ts#L153-L169)).

### Allocation flow

`allocateDeviceForSession`
([`device-utils.ts:101-215`](../../src/device-utils.ts#L101-L215)):

1. Merge `firstMatch[0]` + `alwaysMatch` into one object.
2. Build filters via `getDeviceFiltersFromCapability(...)`
   ([`device-utils.ts:304-375`](../../src/device-utils.ts#L304-L375)):
   - `platform` from `platformName`.
   - `platformVersion` from `appium:platformVersion`.
   - `deviceType` — for iOS, derived from the app file extension via
     `getDeviceTypeFromApp(app)`: `.app` or `.zip` → `simulator`, else
     `real` ([56-64](../../src/device-utils.ts#L56-L64)). Conflicts with
     `pluginArgs.iosDeviceType` throw early.
   - `name`: `'iPad'` if `df:iPadOnly` set, `'iPhone'` if `df:iPhoneOnly`.
   - `udid`: array from `df:udids` (comma-separated) or env `UDIDS` or
     `appium:udid`.
   - `busy: false`, `userBlocked: false` — only match free, unblocked
     devices.
   - `filterByHost`, `minSDK`, `maxSDK`, `tags` pass through.
3. If `pluginArgs.enableAuthentication`, on a node verify the JWT
   (`df:jwt`); on the hub fetch the user and (for non-admins) inject
   `userId` to scope by team device access
   ([`device-utils.ts:113-131`](../../src/device-utils.ts#L113-L131)).
4. `waitUntil` polls `getDevice(filters)` every
   `deviceFarmCapabilities.deviceRetryInterval || pluginArgs.deviceAvailabilityQueryIntervalMs`
   until success or `deviceFarmCapabilities.deviceAvailabilityTimeout ||
   pluginArgs.deviceAvailabilityTimeoutMs` elapses. Aborts early if the
   client request has been removed from `sessionRequestMap`.
5. If `getMaxSessionCount()` is hit, polling pauses.
6. On match: `blockDevice(udid, host)`, write
   `newCommandTimeout` via `updatedAllocatedDevice`, then run
   `updateCapabilityForDevice` which dispatches to
   [`androidCapabilities`](../../src/CapabilityManager.ts#L59-L87) or
   [`iOSCapabilities`](../../src/CapabilityManager.ts#L89-L151) (or
   `cloud/CapabilityManager` if `device.cloud` is set).
7. On timeout: distinguish "no matching device" from "matching device but
   busy/blocked" by re-running the filter with `busy`/`userBlocked`
   stripped ([`device-utils.ts:167-188`](../../src/device-utils.ts#L167-L188)).

### Loki filter translation

`getDevices(filterOptions)`
([`device-service.ts:275-413`](../../src/data-service/device-service.ts#L275-L413))
turns `IDeviceFilterOptions` into a LokiJS chain query. Notables:

- `platformVersion`, `minSDK`, `maxSDK` go through `semver.coerce` and
  comparator predicates rather than equality.
- `name` becomes `{ $contains: <trim> }` (substring).
- `udid` becomes `{ $in: <array> }`.
- `tags` becomes `{ $containsAny: <array> }`.
- `filterByHost` overrides `host`.
- A subtle special case: if the requested UDID exists but is
  `userBlocked`, the `busy` / `userBlocked` filters are dropped so the
  caller can still see the device record
  ([lines 382-388](../../src/data-service/device-service.ts#L382-L388)).
- Final sort is ascending by `totalUtilizationTimeMilliSec` — least-used
  device wins ties.

## 7. Device farm plugin args

The plugin reads `cliArgs.plugin['device-farm']` from Appium and merges
with [`DefaultPluginArgs`](../../src/interfaces/IPluginArgs.ts#L94-L122)
([`plugin.ts:150-159`](../../src/plugin.ts#L150-L159)). The
`sample-config.json` at the repo root shows a typical configuration:

[`sample-config.json`](../../sample-config.json)

### Platform selection / filtering

| Key | Type | Default | Purpose |
| --- | --- | --- | --- |
| `platform` | `'ios' \| 'android' \| 'both' \| 'none'` | `'none'` | Which managers run ([`device-managers/index.ts:26`](../../src/device-managers/index.ts#L26)) |
| `androidDeviceType` | `'real' \| 'simulated' \| 'both'` | `'both'` | Filter android list ([`AndroidDeviceManager.ts:69-80`](../../src/device-managers/AndroidDeviceManager.ts#L69-L80)) |
| `iosDeviceType` | `'real' \| 'simulated' \| 'both'` | `'both'` | Filter iOS list. Forced to `'real'` in cloud mode ([`plugin.ts:323-329`](../../src/plugin.ts#L323-L329)) |
| `simulators` | `IDevice[]` | `[]` | Whitelist of `(name, sdk)` simulators ([`IOSDeviceManager.ts:379-385`](../../src/device-managers/IOSDeviceManager.ts#L379-L385)) |
| `emulators` | `Array<{avdName, launchTimeout}>` | `[]` | AVDs to auto-launch at startup ([`plugin.ts:214-226`](../../src/plugin.ts#L214-L226)) |
| `bootedSimulators` | `boolean?` | `undefined` | When true, only `state === 'Booted'` sims appear |
| `cloud` | `CloudConfig?` | `undefined` | Replaces local discovery with cloud device list |

### ADB / iOS plumbing

| Key | Purpose |
| --- | --- |
| `adbRemote: string[]` | Remote ADB targets `"host:port"` ([`AndroidDeviceManager.ts:385-405`](../../src/device-managers/AndroidDeviceManager.ts#L385-L405)) |
| `skipChromeDownload` | Skip chromedriver download per device ([`AndroidDeviceManager.ts:558-563`](../../src/device-managers/AndroidDeviceManager.ts#L558-L563)) |
| `derivedDataPath: {simulator?, device?}` | Pre-built WDA paths ([`IOSDeviceManager.ts:202-237`](../../src/device-managers/IOSDeviceManager.ts#L202-L237)) |
| `preBuildWDAPath` | Prebuilt WDA runner copied to each sim's DerivedData |
| `wdaBundleId` | Bundle id for pre-installed WDA |

### Refresh intervals / timeouts

| Key | Default | Purpose |
| --- | --- | --- |
| `sendNodeDevicesToHubIntervalMs` | 30000 | How often a node POSTs device list to hub ([`plugin.ts:270-276`](../../src/plugin.ts#L270-L276), also drives `refreshSimulatorState`) |
| `checkStaleDevicesIntervalMs` | 30000 | How often stale-device cron runs |
| `checkBlockedDevicesIntervalMs` | 30000 | How often busy-device timeout cron runs |
| `deviceAvailabilityTimeoutMs` | 300000 | Total wait for a free device on allocate |
| `deviceAvailabilityQueryIntervalMs` | 10000 | Poll interval inside the wait |
| `newCommandTimeoutSec` | 60 | Default `appium:newCommandTimeout` if client doesn't specify |
| `remoteConnectionTimeout` | 60000 | (set in defaults; **Unknown:** primary use site — not referenced from the device-management files inspected) |
| `maxSessions` | 8 | Hard cap on concurrent sessions ([`device-utils.ts:153-160`](../../src/device-utils.ts#L153-L160)) |

### Networking / identity

| Key | Purpose |
| --- | --- |
| `bindHostOrIp` | Where Appium plugin advertises itself; defaults to `ip.address()` |
| `hub` | If set, this is a node; otherwise this is the hub |
| `nodeName` | Display name when registering with hub |
| `remoteMachineProxyIP` | Override outward-facing `host` on devices for behind-proxy nodes |
| `portRange` | Range string consumed by `getFreePort()` for system, WDA, mjpeg, chromedriver ports |
| `proxy` | Axios proxy used for hub calls |

### Auth / dashboard

| Key | Purpose |
| --- | --- |
| `enableAuthentication` | Triggers JWT verify on node, team-device filtering on hub ([`device-utils.ts:113-131`](../../src/device-utils.ts#L113-L131)) |
| `accessKey`, `token` | Credentials used by `DeviceFarmApiClient.authenticate()` ([`plugin.ts:246-268`](../../src/plugin.ts#L246-L268)) |
| `enableDashboard` | Surface the dashboard (out of scope here) |

### Cleanup

| Key | Purpose |
| --- | --- |
| `androidCleanUpApps: string[]` | Bundle ids to uninstall between sessions on Android |
| `iosCleanUpApps: string[]` | Same for iOS — call sites not inspected here |

### Dev-only

| Key | Purpose |
| --- | --- |
| `removeDevicesFromDatabaseBeforeRunningThePlugin` | Wipe Loki collection on startup |

## Surprises and gotchas

1. **Cloud UDIDs are not stable.** Every `getDevices()` refresh on a cloud
   mode plugin allocates fresh `uuidv4()` UDIDs
   ([`cloud/Devices.ts:53-57`](../../src/device-managers/cloud/Devices.ts#L53-L57)).
   Device identity in the database can't be relied on across restarts.
2. **tvOS casing inconsistency.** `getDevicePlatformName` returns lowercase
   `'tvos'` but `IOSDeviceManager.getProductModel` checks
   `'tvOS'` ([line 447](../../src/device-managers/IOSDeviceManager.ts#L447)).
   The branch never fires under current discovery.
3. **`AdbServer.ts` is orphan-ish.** It spawns ADB in foreground and kills
   it after 5 s. Not imported from `src/`. Likely vestigial; **Unknown:** if
   used in tests or scripts outside `src/`.
4. **Two trackers, picked by env var.** `GO_IOS` switches both iOS device
   detection and WDA wiring. The choice cascades through `iOSCapabilities`
   and changes how Appium connects to WDA
   ([`CapabilityManager.ts:113-126`](../../src/CapabilityManager.ts#L113-L126)).
5. **Synthetic IDs for emulators.** `generateDeviceId` hashes
   `${nodeId}-${udid}` for emulators but only `udid` for real devices
   ([`device-service.ts:12-24`](../../src/data-service/device-service.ts#L12-L24)).
   This means the same emulator UDID on two nodes maps to two distinct
   device rows, but the same real-device UDID would collide if a real
   device were ever moved to a different node (rare but possible).
6. **Hardcoded `IOSDeviceInfoMap`.** Screen dimensions for iOS real devices
   come from a baked-in table keyed by `ProductType`. New iPhone/iPad
   models need a map update.
7. **`waitBootEmulator` post-sleep is 6 s flat.** After boot detection
   succeeds, an unconditional `sleep(6000)` runs
   ([`AndroidDeviceManager.ts:422`](../../src/device-managers/AndroidDeviceManager.ts#L422)) —
   adds visible startup latency.
8. **Stale-device cron is disabled in cloud mode.** Cron checks are gated
   behind `pluginArgs.cloud == undefined`
   ([`plugin.ts:290-317`](../../src/plugin.ts#L290-L317)).
