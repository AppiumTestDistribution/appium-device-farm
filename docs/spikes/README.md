# Spikes

A spike is a time-boxed, disposable experiment to validate a technical approach
before committing to a slice.

**Convention:**
- Spike code lives **outside** the Falx tree (in `/tmp/falx-spike-*`).
- Only the plan and the findings come back here, into `docs/spikes/`.
- Each spike has hard pass/fail criteria, a time box, and an end-state writeup
  appended to the plan.

**Lifecycle:**
1. Plan written (this folder).
2. Spike executed in a throwaway directory.
3. Findings appended to the bottom of the plan.
4. Decision: turn into a slice in `docs/slices/`, or kill the approach.

## Active spikes

| # | Plan | Status |
|---|------|--------|
| 01 | [Android streaming via Tango](01-android-streaming-spike.md) | done 2026-05-15 — **GREEN**, proceed to slice |
| 02 | [iOS streaming via WDA + go-ios](02-ios-streaming-spike.md) | Phase 1 done 2026-05-15 — streaming PASS, tap injection FAIL → spike 03 needed |
| 03 | [iOS tap injection on iOS 26+](03-ios-tap-injection-spike.md) | not started — prerequisite for iOS device-use slice |
