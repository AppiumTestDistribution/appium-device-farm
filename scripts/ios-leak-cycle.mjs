#!/usr/bin/env node
// Sequential /start → /stop cycles against a live Falx plugin.
// Records timing and lets you visually confirm no `ios runwda` leaks.
import { setTimeout as wait } from 'node:timers/promises';

const BASE = process.env.FALX_URL ?? 'http://localhost:4723';
const UDID = process.env.IOS_UDID ?? '00008101-001A408E2EB9001E';
const N = Number(process.env.CYCLES ?? 50);

const startTimes = [];
const stopTimes = [];

for (let i = 1; i <= N; i++) {
  const t0 = Date.now();
  const startRes = await fetch(`${BASE}/device-farm/api/dashboard/use-device/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ udid: UDID }),
  });
  if (!startRes.ok) {
    console.error(`cycle ${i}: /start failed ${startRes.status}`, await startRes.text());
    process.exit(1);
  }
  const { sessionId } = await startRes.json();
  const t1 = Date.now();
  startTimes.push(t1 - t0);

  await wait(500); // brief idle while "session is live"

  const t2 = Date.now();
  const stopRes = await fetch(`${BASE}/device-farm/api/dashboard/use-device/stop/${sessionId}`, {
    method: 'POST',
  });
  if (!stopRes.ok) {
    console.error(`cycle ${i}: /stop failed ${stopRes.status}`);
    process.exit(1);
  }
  const t3 = Date.now();
  stopTimes.push(t3 - t2);

  console.log(`cycle ${i}/${N}: start ${t1 - t0}ms  stop ${t3 - t2}ms`);
  await wait(500); // settle before next cycle
}

const sorted = (arr) => [...arr].sort((a, b) => a - b);
const p = (arr, q) => sorted(arr)[Math.floor(arr.length * q)];

console.log('\n=== summary ===');
console.log(`start: p50=${p(startTimes, 0.5)}ms p95=${p(startTimes, 0.95)}ms max=${Math.max(...startTimes)}ms`);
console.log(`stop:  p50=${p(stopTimes, 0.5)}ms p95=${p(stopTimes, 0.95)}ms max=${Math.max(...stopTimes)}ms`);
