import axios, { AxiosInstance } from 'axios';

export class DeviceLockedError extends Error {
  constructor() {
    super('device is locked');
    this.name = 'DeviceLockedError';
  }
}

export class WDANotRunningError extends Error {
  public readonly cause?: unknown;
  constructor(public readonly baseUrl: string, cause?: unknown) {
    super(`WDA not reachable at ${baseUrl}`);
    this.name = 'WDANotRunningError';
    this.cause = cause;
  }
}

export interface ScreenInfo {
  width: number;
  height: number;
  scale: number;
}

export interface MjpegSettings {
  mjpegServerFramerate: number;
  mjpegServerScreenshotQuality: number;
  mjpegScalingFactor: number;
}

export class WDAClient {
  private http: AxiosInstance;
  constructor(public readonly baseUrl: string) {
    this.http = axios.create({ baseURL: baseUrl, timeout: 30_000 });
  }

  async getStatus(): Promise<{ ready: boolean }> {
    try {
      const r = await this.http.get('/status');
      return { ready: Boolean(r.data?.value?.ready ?? true) };
    } catch (err) {
      throw new WDANotRunningError(this.baseUrl, err);
    }
  }

  async createSession(): Promise<string> {
    // Bare-minimum body per spike 03 — no appium:bundleId on iOS 26.
    const body = { capabilities: { alwaysMatch: { platformName: 'iOS' } } };
    const r = await this.http.post('/session', body);
    const sid = r.data?.value?.sessionId;
    if (typeof sid !== 'string') throw new Error('WDA createSession returned no sessionId');
    return sid;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.http.delete(`/session/${sessionId}`);
  }

  async getLocked(sessionId: string): Promise<boolean> {
    const r = await this.http.get(`/session/${sessionId}/wda/locked`);
    return Boolean(r.data?.value);
  }

  async getScreen(sessionId: string): Promise<ScreenInfo> {
    const r = await this.http.get(`/session/${sessionId}/wda/screen`);
    const v = r.data?.value;
    return {
      width: v.screenSize.width,
      height: v.screenSize.height,
      scale: v.scale,
    };
  }

  async tap(sessionId: string, x: number, y: number): Promise<void> {
    await this.http.post(`/session/${sessionId}/wda/tap`, { x, y });
  }

  async drag(
    sessionId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    durationMs: number,
  ): Promise<void> {
    await this.http.post(`/session/${sessionId}/wda/dragfromtoforduration`, {
      fromX: x1,
      fromY: y1,
      toX: x2,
      toY: y2,
      duration: durationMs / 1000,
    });
  }

  async getActiveAppBundleId(sessionId: string): Promise<string | undefined> {
    const r = await this.http.get(`/session/${sessionId}/wda/activeAppInfo`);
    const id = r.data?.value?.bundleId;
    return typeof id === 'string' ? id : undefined;
  }

  async terminateApp(sessionId: string, bundleId: string): Promise<void> {
    await this.http.post(`/session/${sessionId}/wda/apps/terminate`, { bundleId });
  }

  async setMjpegSettings(sessionId: string, settings: MjpegSettings): Promise<void> {
    await this.http.post(`/session/${sessionId}/appium/settings`, { settings });
  }

  async setDispatchTunables(sessionId: string): Promise<void> {
    // Only two settings stick on WDA 12.2.2 (iOS 26.4.2); the rest are
    // unrecognized. See docs/spikes/04-ios-input-latency-spike.md.
    await this.http.post(`/session/${sessionId}/appium/settings`, {
      settings: {
        waitForIdleTimeout: 0,
        animationCoolOffTimeout: 0,
      },
    });
  }

  async actions(sessionId: string, sequence: unknown[]): Promise<void> {
    await this.http.post(`/session/${sessionId}/actions`, {
      actions: [{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: sequence,
      }],
    });
  }

  async tapViaActions(sessionId: string, x: number, y: number): Promise<void> {
    await this.actions(sessionId, [
      { type: 'pointerMove', duration: 0, x, y },
      { type: 'pointerDown', button: 0 },
      { type: 'pause', duration: 30 },
      { type: 'pointerUp', button: 0 },
    ]);
  }
}
