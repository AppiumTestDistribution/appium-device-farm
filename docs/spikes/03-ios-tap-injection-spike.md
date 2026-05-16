# Spike 03 — iOS tap injection on iOS 26+ (find a working channel)

**Time box:** 2 days.
**Spike directory:** `/tmp/falx-spike-ios-tap` (NOT inside the Falx repo).
**Status:** not started. Hard prerequisite for the cross-platform Falx
device-use slice on iOS.

## Why this spike exists

Spike 02 ([02-ios-streaming-spike.md](02-ios-streaming-spike.md))
validated MJPEG streaming via WDA + go-ios end-to-end on iOS 26.4.2 —
streaming passes Phase 1 cleanly. Tap injection, however, **silently
no-ops on iOS 26.4.2 with WebDriverAgent 12.2.2 (May 2026 main-branch
build)**: every tap-equivalent endpoint returns `200` with `value:
null` but no UI action occurs on the device.

Endpoints confirmed broken in spike 02:

- `POST /session/<sid>/wda/tap` (with `{x, y}`)
- `POST /session/<sid>/actions` (W3C pointer sequence)
- `POST /session/<sid>/wda/dragfromtoforduration`
- `POST /session/<sid>/element/<id>/click`

Confirmed working in spike 02: every WDA read API (`/status`, `/screen`,
`/source`, element finders). Hardware-button writes (`/wda/pressButton`,
`/wda/homescreen`) returned 200 but evidence of effect is anecdotal.
`/orientation` write returns 500 "Unable To Rotate Device" — a hard
failure rather than a silent no-op.

This pattern (reads work, writes silently no-op) is consistent with an
Apple private-API regression that WDA hasn't caught up with — WDA has a
multi-year history of similar every-iOS-version breaks.

Without working tap injection, the Falx browser device-use feature
cannot be released for iOS. This spike enumerates candidate channels
and picks one.

## Out of scope (Phase 1)

- Falx integration. Findings only.
- Multi-device. One iPhone, one channel.
- Swipes from screen edges (Control Center, Notification Center,
  bottom home indicator). Hard on iOS even with working tap; a later
  concern.
- 3D Touch / force touch.
- Hardware button automation beyond enumerating which hardware buttons
  work (home, volume, side). Useful as a fallback but not the goal.
- Building a custom XCTest harness from scratch. Considered only if
  every off-the-shelf channel fails.
- iOS Simulator. Falx targets real devices; simulator HID injection
  is a different (easier) problem.

## Pass criteria

The spike **passes** if **at least one channel** reliably performs **all
three** of the following on iOS 26.4.2 against a USB-attached iPhone:

1. **Single tap at given (x, y) coordinate**, in iOS POINTS, within ±10
   points accuracy, repeatable 10 times consecutively without a miss.
   Verify by tapping a known UI element (e.g. the Settings → "Display
   & Brightness" cell) and observing the navigation in the MJPEG
   stream + via WDA's `/source` after-state.
2. **Swipe from (x1, y1) to (x2, y2) over a given duration** — e.g.
   a 300 ms swipe from the centre of the screen up by 200 points,
   producing a visible scroll in a Settings list.
3. **Tap-typing into a focused text field** — tap a Spotlight or
   Settings search field, then type "WiFi" via whatever input channel
   the candidate offers (keyboard simulation, paste, WDA's `/keys`
   endpoint, etc.). Stretch goal: skip if a candidate handles 1 + 2 but
   not 3 — note it as "tap+swipe yes, typing no" and continue.

Plus a **subjective stability judgement**: did the channel work
reliably across 10 trials, or did it flake/lock up WDA/the device?

## Hard prerequisites

Same as [spike 02](02-ios-streaming-spike.md#hard-prerequisites-human-does-these-once-before-the-spike-starts):

- macOS host with Xcode (only needed for channels that require
  rebuilding WDA).
- Paired iPhone, iOS 16+ (this spike targets iOS 26+).
- `brew install go-ios`.
- WDA installed on the device per spike 02 (the existing install is
  fine).
- `sudo ios tunnel start` running.

Plus, only for channels that need them:

- Python 3.10+ + `pip` (for tidevice — channel F).
- A fresh clone of https://github.com/appium/WebDriverAgent (for
  channel C, "latest WDA").
- A fresh clone of https://github.com/saucelabs-incubator/WebDriverAgent
  or a similar fork (for channel D).

## Execution plan

Run channels in this order — cheapest first. **Stop the moment any
channel passes all three pass criteria.** Record results for every
channel attempted, even the ones that failed, so future iOS major
versions can revisit the same matrix.

The spike reuses spike 02's `/tmp/falx-spike-ios/server/` infrastructure
for MJPEG visibility — boot it the same way and view the device in a
browser tab while testing taps. New code for this spike (Python harness,
fork-build helpers) lives in `/tmp/falx-spike-ios-tap/`.

### Channel A — extended WDA session capabilities (cheapest, no rebuild)

Spike 02 created sessions with the bare-minimum body:

```json
{ "capabilities": { "alwaysMatch": { "platformName": "iOS" } } }
```

Test variants of session creation against the same WDA build. For each
variant, create a fresh session, then attempt `/wda/tap` at known
coords and observe.

Variants to test (one POST per variant; tear down each session via
`DELETE /session/<sid>` before the next):

1. Add `"appium:automationName": "XCUITest"`.
2. Add `"appium:bundleId": "com.apple.springboard"` (so WDA attaches to
   the SpringBoard, not "no app").
3. Add `"appium:bundleId": "com.apple.Preferences"` (attach to
   Settings).
4. Add `"appium:waitForIdleTimeout": 0` and
   `"appium:waitForQuiescence": false` (some WDA versions block on
   "idle" before dispatching events).
5. Add `"appium:useNativeCachingStrategy": true`.
6. Add `"appium:eventloopIdleDelaySec": 0`.
7. Combinations of 1–6.

Spec: **A passes if any single variant or combination yields a working
`/wda/tap` against the criteria.** If A passes, skip B–F entirely and
go straight to findings.

### Channel B — runtime tunables via `/appium/settings`

After a session is up, push settings that may affect input dispatch:

```bash
POST /session/<sid>/appium/settings
{
  "settings": {
    "useTestManagerForVisibilityDetection": true,
    "actionAcksTimeout": 0,
    "dispatchedEventActionsTimeout": 0,
    "useEnhancedCoordinateMapping": true,
    "snapshotTimeout": 0
  }
}
```

(The exact setting names need to be cross-referenced against the
installed WDA version's `FBConfiguration.m`. List them all from
`GET /session/<sid>/appium/settings` and try toggling each one that
sounds input-related.)

Retest `/wda/tap` after each setting change. **B passes** if any setting
combination unsticks tap dispatch.

### Channel C — latest WDA main, rebuilt

`git clone https://github.com/appium/WebDriverAgent` into a fresh
directory, open in Xcode, re-sign with the same `com.falx.*` bundle
IDs, Cmd-U to install. Compare commit SHA against the original spike 02
build to confirm new commits landed.

If new commits did land, rerun channel A's bare-minimum variant against
the freshly built WDA. **C passes** if the rebuild resolves the
regression.

### Channel D — Sauce / HeadSpin / community WDA forks

If C fails, evaluate forks. Known forks to consider:

- https://github.com/saucelabs-incubator/WebDriverAgent
  (Sauce Labs maintained, sometimes has private patches for newer iOS
  before they land upstream)
- https://github.com/HeadSpinIO/WebDriverAgent (similar reasoning)
- Search GitHub for forks updated after Apple's iOS 26 release with
  commit messages mentioning "tap" or "26".

Pick one fork, clone, re-sign, install, retest. **D passes** if a fork
resolves the regression. Note: forks may carry license obligations
worth checking before adopting.

### Channel E — go-ios direct HID injection

Some go-ios builds expose HID-level event injection that bypasses WDA
entirely. Check:

```bash
ios --help 2>&1 | grep -iE 'touch|hid|tap|click|gesture'
ios hid --help 2>&1
```

If a relevant subcommand exists, try it directly:

```bash
ios hid tap --x=200 --y=200 --udid=$UDID
# or similar; flag names vary by go-ios version
```

If go-ios v1.0.188 (the spike 02 version) doesn't have it, try
upgrading: check the project's GitHub for any iOS 26 + HID-related PRs
and rebuild from source if needed.

**E passes** if go-ios can dispatch a tap that lands at the expected
coordinate.

### Channel F — tidevice (Python, HID over lockdown)

```bash
pip install tidevice
python -c "
import tidevice
d = tidevice.Device('$UDID')
d.tap(200, 200)   # tidevice's API; coords typically in points
"
```

tidevice uses a different transport (lockdown service rather than
RSD/XCTest), so it might survive Apple's RSD-side regression. **F
passes** if tidevice can dispatch a working tap.

### Channel G — custom XCTest harness (only if A–F all fail)

This is a real engineering effort, not a spike step. Document the
shape of what would need to be built (subclassing `XCUIApplication`
to use newer Apple APIs, packaging as a custom WDA fork or alongside
WDA) and **escalate to a planning conversation** rather than executing
in this spike.

## Common blockers & quick triage

| Symptom | Likely cause |
|---|---|
| Endpoint returns 200 null but no UI change | The known regression. Move to next channel. |
| 500 "Unable To …" | Capability missing or feature genuinely unavailable. Try with `appium:bundleId` set. |
| 404 "Unhandled endpoint" | Endpoint removed in modern WDA. Check WDA's `FBRoutes.m` for the current name. |
| Session creation hangs > 30 s | Tunnel daemon stale. `pkill sudo ios tunnel start && sudo ios tunnel start` and retry. |
| Tap "works" once then stops working | WDA dispatcher gets stuck on `waitForIdle`. Set `appium:waitForIdleTimeout: 0`. |
| Phone goes to lock screen mid-test | Auto-Lock crept back from "Never". Reset it. |
| tidevice errors on import | Likely Python version mismatch or missing libimobiledevice. `brew install libimobiledevice` then reinstall tidevice. |

## Deliverable — append to this file when done

Add a `## Findings` section at the bottom with:

1. **Channel matrix**: for each channel attempted, record:
   - Status: PASS / FAIL / SKIPPED / NOT-RUN
   - Notes: capability combination that worked (if PASS), or precise
     failure mode (if FAIL).
   - Trial count (e.g. "10/10 taps landed within ±10 pt" or "0/10").
2. **Recommended channel**: the one Falx should adopt. Include the
   exact session-creation body, settings payload, or command line that
   reproduces working taps.
3. **Subjective stability**: how flaky was the winning channel across
   10 trials? Any device reboots required? Any WDA restarts required?
4. **Coordinate-units note**: confirm the winning channel uses iOS
   POINTS (not pixels). If it uses pixels, document the scale factor
   needed.
5. **Swipe + text-input results**: did the winning channel handle all
   three pass criteria, or only some? If only some, note what's
   missing and what the fallback is (e.g. "tap + swipe yes, typing
   only via paste").
6. **Code size**: LOC of any harness code added.
7. **Open questions for the slice phase**: ergonomics in the Falx UI
   if the channel requires unusual setup, security of the channel
   (e.g. tidevice's lockdown channel has different attack surface than
   WDA's HTTP), upgrade story for next iOS major.
8. **Decision**: explicit recommendation — adopt channel X for iOS in
   the Falx device-use slice, with caveats Y/Z.

Stop when this file is updated. The next move after this spike is the
cross-platform iOS+Android browser device-use slice in `docs/slices/`.

## Findings

Run 2026-05-16 against the same iPhone 12 Pro Max (`iPhone13,4`,
`kry-phone`, UDID `00008101-001A408E2EB9001E`, iOS 26.4.2) used in
spike 02, via USB. WDA 12.2.2 from spike 02's Xcode build was still
installed and trusted (~6 days left on the free-cert). Tunnel daemon
needed a fresh `sudo ios tunnel start` (had died since yesterday).
Spike directory: `/tmp/falx-spike-ios-tap/`. Server infrastructure was
reused from `/tmp/falx-spike-ios/server/` per the spike plan.

### Headline: spike 02's "broken WDA tap" was a coord-units bug, not a regression

The premise of this whole spike — *"WDA tap injection silently no-ops
on iOS 26.4.2"* — is **false**. WDA tap dispatch works fine on this
device, today, against the unchanged WDA 12.2.2 build, with the
bare-minimum session capabilities `{"platformName": "iOS"}`.

What actually happened in spike 02: its client code sent the `<img>`'s
**physical pixel coordinates** (1284×2778 on this device) to WDA's
`/wda/tap`, while WDA expects **iOS points** (428×926 — the screen
divided by `screen.scale = 3`). Pixel-space coordinates land far
off-screen in point space; iOS clamps or drops them, and WDA returns
`200 / value: null` as it normally does when a tap is dispatched but
hits nothing actionable. Spike 02 even called out the units bug in
its Surprises section but didn't connect it to the "broken dispatch"
finding because it had hit other 500/404 errors on the *bundleId* path
that masked the diagnosis.

This was caught here by tapping the Photos icon on SpringBoard at
correct point coords (263.5, 859.5) — Photos launched instantly, every
trial. The earlier "200-null no-op" symptom is fully explained.

### Channel matrix

| Channel | Status | Notes |
|---|---|---|
| **A — extended session capabilities** | **PASS** | Passes all 3 pass criteria with the bare-minimum `{"platformName": "iOS"}` body. The richer variants from the spike plan (variants 2–6, with `appium:bundleId`) actually *fail* on iOS 26 because the SpringBoard refuses to open Settings via WDA's session-launch path — see "iOS 26 SpringBoard launch regression" below. The bare-minimum variant is the one Falx should use. |
| B — `/appium/settings` runtime tunables | SKIPPED | A passed; no need. |
| C — latest WDA `main` rebuild | SKIPPED | A passed; no need. |
| D — Sauce / HeadSpin fork | SKIPPED | A passed; no need. |
| E — go-ios direct HID | SKIPPED | A passed; no need. (Recorded as future fallback if WDA is ever unavailable.) |
| F — tidevice | SKIPPED | A passed; no need. |
| G — custom XCTest harness | SKIPPED | A passed; no need. |

### Recommended channel — A, bare-minimum WDA session

**Adopt:** Channel A. The exact session-creation body that works:

```http
POST http://localhost:8100/session
Content-Type: application/json

{
  "capabilities": {
    "alwaysMatch": {
      "platformName": "iOS"
    }
  }
}
```

Then dispatch taps with WDA's stock endpoints in iOS POINTS:

```http
POST /session/<sid>/wda/tap
{"x": 263.5, "y": 859.5}

POST /session/<sid>/wda/dragfromtoforduration
{"fromX": 380, "fromY": 463, "toX": 40, "toY": 463, "duration": 0.25}

POST /session/<sid>/wda/keys
{"value": ["W", "i", "F", "i"]}
```

No `appium:` capabilities are needed. No runtime `/appium/settings`
tweaks are needed. The default WDA dispatch pipeline works.

### Pass-criteria results

1. **Single tap — 10/10.** Tap at the fixed point (263.5, 859.5) — the
   Photos icon centre — launched `com.apple.mobileslideshow` on every
   one of 10 consecutive trials. Drift across trials: 0.0 points (the
   icon stays where it is; SpringBoard reflows nothing across
   launch/terminate cycles). Inter-trial cleanup was
   `POST /wda/apps/terminate {bundleId: com.apple.mobileslideshow}`,
   which works for system apps and returns the device to SpringBoard
   within ~400 ms.

2. **Swipe — PASS.** A `dragfromtoforduration` from (380, 463) to
   (40, 463) over 0.25 s flipped SpringBoard from home page 1 (18
   visible icons) to home page 2 (15 visible icons). 14 icons
   disappeared, 11 new icons appeared, 4 shared. The reverse-direction
   swipe restored page 1 cleanly. Coordinates are in iOS points and
   directly observable in the source tree (icon rects are reported in
   points too).

3. **Tap-then-type — PASS.** A vertical swipe down from (214, 200) to
   (214, 600) over 0.3 s opened Spotlight, which auto-focused its
   `SpotlightSearchField` (visible in the source tree as a TextField
   with `name: SpotlightSearchField, value: "Search"`).
   `POST /wda/keys {"value":["W","i","F","i"]}` updated the field's
   value to `"WiFi"` exactly. Search result cells matching "Wi-Fi"
   appeared in the tree, including the system Wi-Fi setting cell.
   Dismissed Spotlight with an upward swipe.

### Subjective stability

Excellent within the run. 10/10 taps, swipe and typing both first-try
on a clean Spotlight gesture. Zero WDA restarts, zero device reboots,
zero stalls. The bare-minimum session creates in <500 ms and survives
a multi-minute trial sequence without state drift. No flake observed
across the ~3 minutes of total trial activity.

The only off-happy-path drama belonged to the spike *plan*, not the
spike *channel* — see "iOS 26 SpringBoard launch regression" below.

### Coordinate-units note (the load-bearing detail)

**Use iOS points, not pixels.** On this device:

- Screen in points: **428 × 926** (reported by `GET /wda/screen` as
  `screenSize: {width: 428, height: 926}`).
- Screen in pixels: **1284 × 2778** (the MJPEG frame dimensions).
- Scale factor: **3** (reported as `screen.scale` from the same
  endpoint).

Conversion: `point = pixel / scale`. A pixel-space tap at
(791, 2579) — what a naïve `<img>` click would produce for the Photos
icon — is well off the screen's point-space (max 428, 926) and WDA
silently drops it.

Every WDA write endpoint (`/wda/tap`, `dragfromtoforduration`,
`/actions` with pointer events) takes iOS points. The source tree's
`rect` values are also in points. So as long as the client computes
coords in the same space the source tree reports them in (or scales
the `<img>` click by `screenSize / naturalWidth`), it just works.

### iOS 26 SpringBoard launch regression — real, separate from tap dispatch

Two things really *are* broken on iOS 26 against this WDA build, but
neither matters for tap injection:

1. **`appium:bundleId` in session caps → 500.** Including
   `appium:bundleId` (or non-prefixed `bundleId`) in
   `capabilities.alwaysMatch` returns
   `Error Domain=FBSOpenApplicationServiceErrorDomain Code=1
   "The request to open <bundle> failed."` — both for first-party
   targets like `com.apple.Preferences` and for SpringBoard itself.
   iOS 26 is refusing to let the WDA xctrunner app launch other apps
   via the SpringBoard open-application service. xctrunner doesn't
   have the entitlement.

2. **`POST /wda/apps/launch` and `/wda/apps/activate` → 400 with the
   same error.** Same root cause: WDA's session API tries to launch
   via the same private SpringBoard service, and iOS 26 refuses it for
   the xctrunner.

**Workaround:** don't try to launch apps via WDA on iOS 26. Use
SpringBoard taps instead — `find_icons()` over the source tree gives
the rect of every home-screen icon with a non-zero rect on the
*current* home page; a `/wda/tap` at that icon's centre launches the
app reliably (the OS treats it as a real user tap on the SpringBoard
icon, with full entitlements). Cleanup via `POST /wda/apps/terminate`
*does* work — it doesn't go through SpringBoard's open-app service.

There's also `/wda/homescreen` (gone — 404 "unknown command") to add
to the list of dead endpoints; spike 02 already documented `/wda/touch/perform`
and `/wda/tap/0` as removed.

For Falx, this means the iOS device-use slice should:

- Use bare WDA sessions (no `bundleId` capability).
- Reach app contexts by tapping SpringBoard icons, not by setting
  session bundleIds or calling `/wda/apps/launch`.
- Provide a "home" button in the Falx UI implemented as
  `terminate(activeBundleId)` rather than a `/wda/homescreen` call.

### Swipe + text-input results — all green

All three pass criteria pass with the same Channel A session. No
typing-via-paste fallback needed. `/wda/keys` works for character
strings without the iOS keyboard panel even needing to be on screen
(WDA's keys endpoint pipes directly into the focused first-responder
text field via XCTest).

### Code size

- `channel_a_full.py` — **315 LOC** (Python stdlib only — no
  third-party deps; runs against system Python 3.14). Contains the
  WDA HTTP client, session helpers, icon-finder, and the 3 pass-criteria
  trial drivers.
- `channel_a.py` — **434 LOC** (older variant that tested
  capability-set permutations; obviated by the bare-session result but
  kept in the spike dir for reference).
- Diagnostic probes — `probe.py` (54), `probe_source.py` (80),
  `probe_source2.py` (52), `probe_icons.py` (42),
  `probe_springboard.py` (84), `probe_tap_test.py` (78). These were
  throwaway investigation scripts that pinned down the
  bundleId-launch failure and the coord-units re-finding; not part of
  the Falx slice deliverable.

**Productive Channel A driver: ~315 LOC**, stdlib-only Python. The
"add tap injection to Falx" slice can do most of this with ~30–50
LOC in the existing TypeScript server (it already proxies `/wda/tap`).

### Open questions for the slice phase

- **`com.apple.Preferences` is unreachable from WDA on iOS 26.** If
  Falx ever needs to drive a user into the Settings app
  programmatically (e.g. "open the Wi-Fi panel" for a test scenario),
  the only path is tap-the-Settings-icon-on-SpringBoard. For arbitrary
  user-installed apps the same workaround applies: tap the icon, don't
  call `apps/launch`.
- **Finding icons that aren't on the current home page.** `find_icons`
  only sees the visible page's icons. The iOS App Library is a more
  reliable target ("swipe left until App Library, then tap a known
  cell") but is more brittle UI-wise. The Spotlight approach used in
  criterion 3 — open Spotlight, type the app name, tap the first
  result — is the cleanest universal "launch any app" pattern and
  should be the Falx primitive for app-launch.
- **`/wda/apps/terminate` on user apps.** Worked here for system
  apps (Photos, Camera, etc). Not tested against user-installed apps
  in this spike. Should be fine — terminate doesn't go through
  SpringBoard's open-app service — but worth a one-line sanity check
  in the slice.
- **Multi-touch / pinch / two-finger gestures.** Not in the spike's
  scope. WDA's `/actions` API in principle supports multi-touch via
  multiple pointer streams in the same actions array; that path is
  untested here.
- **Coordinate scaling in the Falx UI.** The existing spike 02 client
  is still broken (sends pixel coords). The slice must take MJPEG
  pixel coords, divide by `screen.scale`, and POST points. Could be a
  3-line fix once `/wda/screen` is fetched on session start.
- **iOS-26-only behaviour vs older iOS.** This spike validated against
  iOS 26.4.2 only. Older iOS likely behaves the same for tap dispatch
  but may *not* have the SpringBoard launch refusal, so older devices
  may permit `apps/launch`. Falx should treat the SpringBoard-tap
  workaround as the always-correct path and not try to detect iOS
  version.
- **Security note on the channel.** The Channel A channel runs over
  WDA's HTTP endpoint on `localhost:8100`. No auth, no encryption.
  Falx is on-prem so the trust boundary is the device-host machine;
  WDA must not be exposed beyond `127.0.0.1` (default behaviour, but
  worth gating in the slice).

### Decision

**Adopt Channel A** for iOS in the Falx device-use slice. No fork, no
rebuild, no extra dependency, no custom XCTest harness, no
`pip install tidevice`. Use the bare-minimum WDA session, the stock
`/wda/tap`, `/wda/dragfromtoforduration`, and `/wda/keys` endpoints,
with two caveats:

- Always convert client-side MJPEG pixel coordinates to iOS points
  using `screen.scale` from `/wda/screen` before posting.
- Never use `appium:bundleId` in session caps and never call
  `/wda/apps/launch` or `/wda/apps/activate` on iOS 26 — they will
  fail. App-launch is "tap the SpringBoard icon" (or "open Spotlight,
  type, tap").

This makes Falx's iOS dispatch stack identical to the iOS streaming
stack adopted in spike 02 — same WDA build, same go-ios tunnel
infrastructure, same session, same single port. The follow-on slice
can proceed without further iOS-engine spikes.
