export interface RingState {
  x: number;          // canvas pixel coords
  y: number;
  ageMs: number;      // ms since pointerdown
  lifetimeMs: number; // total fade duration
}

export interface TrailPoint {
  x: number;          // canvas pixel coords
  y: number;
  ageMs: number;      // ms since the move event
}

const RING_RADIUS_PX = 36;
const RING_LINE_WIDTH = 3;
const RING_COLOR = '#ffffff';
const TRAIL_LINE_WIDTH = 4;
const TRAIL_COLOR = '#ffffff';

export function drawRing(ctx: CanvasRenderingContext2D, state: RingState): void {
  const t = Math.min(1, state.ageMs / state.lifetimeMs);
  // Ease-out alpha from 0.85 -> 0.0.
  const alpha = 0.85 * (1 - t * t);
  const radius = RING_RADIUS_PX * (1 + t * 0.4);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = RING_COLOR;
  ctx.lineWidth = RING_LINE_WIDTH;
  ctx.beginPath();
  ctx.arc(state.x, state.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function ringIsExpired(ageMs: number, lifetimeMs: number): boolean {
  return ageMs >= lifetimeMs;
}

export function drawTrail(
  ctx: CanvasRenderingContext2D,
  points: TrailPoint[],
  maxAgeMs: number,
): void {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = TRAIL_COLOR;
  ctx.lineWidth = TRAIL_LINE_WIDTH;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  // Use the most recent point's age for the polyline alpha (cheap; per-segment
  // alpha would add complexity for marginal visual gain).
  const newest = Math.min(...points.map((p) => p.ageMs));
  const t = Math.min(1, newest / maxAgeMs);
  ctx.globalAlpha = 0.7 * (1 - t);
  ctx.stroke();
  ctx.restore();
}

export function trimTrail(points: TrailPoint[], maxAgeMs: number): TrailPoint[] {
  return points.filter((p) => p.ageMs <= maxAgeMs);
}
