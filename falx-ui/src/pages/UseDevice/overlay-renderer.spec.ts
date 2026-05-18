import { describe, it, expect } from 'vitest';
import { drawRing, drawTrail, ringIsExpired, trimTrail } from './overlay-renderer';

interface CallRecord { method: string; args: unknown[]; }

function fakeCtx(): { ctx: CanvasRenderingContext2D; calls: CallRecord[] } {
  const calls: CallRecord[] = [];
  const proxy = new Proxy({} as Record<string, unknown>, {
    get(target, prop) {
      if (prop in target) return target[prop as string];
      const value = (...args: unknown[]) => {
        calls.push({ method: String(prop), args });
        return undefined;
      };
      target[prop as string] = value;
      return value;
    },
    set(target, prop, value) {
      target[prop as string] = value;
      calls.push({ method: `set:${String(prop)}`, args: [value] });
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
  return { ctx: proxy, calls };
}

describe('overlay-renderer', () => {
  describe('drawRing', () => {
    it('draws an arc at the touch point', () => {
      const { ctx, calls } = fakeCtx();
      drawRing(ctx, { x: 100, y: 200, ageMs: 0, lifetimeMs: 200 });
      const arc = calls.find((c) => c.method === 'arc');
      expect(arc).toBeTruthy();
      expect(arc!.args[0]).toBe(100);
      expect(arc!.args[1]).toBe(200);
      const alphaSet = calls.find((c) => c.method === 'set:globalAlpha');
      expect(alphaSet).toBeTruthy();
      expect(Number(alphaSet!.args[0])).toBeGreaterThan(0.5);
    });

    it('fades to lower alpha as age approaches lifetime', () => {
      const { ctx, calls } = fakeCtx();
      drawRing(ctx, { x: 100, y: 200, ageMs: 180, lifetimeMs: 200 });
      const alphaSet = calls.find((c) => c.method === 'set:globalAlpha');
      expect(Number(alphaSet!.args[0])).toBeLessThan(0.3);
    });
  });

  describe('ringIsExpired', () => {
    it('returns true when ageMs >= lifetimeMs', () => {
      expect(ringIsExpired(200, 200)).toBe(true);
      expect(ringIsExpired(250, 200)).toBe(true);
    });
    it('returns false when ageMs < lifetimeMs', () => {
      expect(ringIsExpired(199, 200)).toBe(false);
      expect(ringIsExpired(0, 200)).toBe(false);
    });
  });

  describe('drawTrail', () => {
    it('draws a polyline through provided points', () => {
      const { ctx, calls } = fakeCtx();
      drawTrail(ctx, [
        { x: 10, y: 10, ageMs: 0 },
        { x: 20, y: 30, ageMs: 16 },
        { x: 40, y: 60, ageMs: 32 },
      ], 200);
      expect(calls.find((c) => c.method === 'beginPath')).toBeTruthy();
      const moveTo = calls.find((c) => c.method === 'moveTo');
      expect(moveTo!.args).toEqual([10, 10]);
      const lineTos = calls.filter((c) => c.method === 'lineTo');
      expect(lineTos.length).toBe(2);
      expect(lineTos[0].args).toEqual([20, 30]);
      expect(lineTos[1].args).toEqual([40, 60]);
      expect(calls.find((c) => c.method === 'stroke')).toBeTruthy();
    });

    it('renders nothing for fewer than 2 points', () => {
      const { ctx, calls } = fakeCtx();
      drawTrail(ctx, [{ x: 10, y: 10, ageMs: 0 }], 200);
      expect(calls.find((c) => c.method === 'stroke')).toBeUndefined();
    });
  });

  describe('trimTrail', () => {
    it('removes points older than maxAgeMs', () => {
      const points = [
        { x: 1, y: 1, ageMs: 250 },
        { x: 2, y: 2, ageMs: 100 },
        { x: 3, y: 3, ageMs: 0 },
      ];
      expect(trimTrail(points, 200)).toEqual([
        { x: 2, y: 2, ageMs: 100 },
        { x: 3, y: 3, ageMs: 0 },
      ]);
    });
  });
});
