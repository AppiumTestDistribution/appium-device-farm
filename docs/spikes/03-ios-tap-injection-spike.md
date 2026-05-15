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
