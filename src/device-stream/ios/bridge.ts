import { spawn, ChildProcess, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { setTimeout as wait } from 'node:timers/promises';
import {
  WDAClient,
  MjpegSettings,
  ScreenInfo,
  DeviceLockedError,
  WDANotRunningError,
} from './wda-client';
import { MjpegFanout } from './mjpeg';
import { PortPair } from './port-allocator';
import log from '../../logger';

const DEFAULT_MJPEG_SETTINGS: MjpegSettings = {
  mjpegServerFramerate: 20,
  mjpegServerScreenshotQuality: 70,
  mjpegScalingFactor: 100,
};

export class TunnelNotRunningError extends Error {
  constructor() {
    super('go-ios tunnel daemon is not running (sudo ios tunnel start)');
    this.name = 'TunnelNotRunningError';
  }
}

export class WDANotInstalledError extends Error {
  constructor(public readonly runnerBundleId: string) {
    super(`WebDriverAgent runner ${runnerBundleId} is not installed on device`);
    this.name = 'WDANotInstalledError';
  }
}

export interface IOSBridgeHandle {
  sessionId: string; // WDA session id (used for all WDA REST calls)
  deviceWidthPoints: number;
  deviceHeightPoints: number;
  deviceWidthPixels: number;
  deviceHeightPixels: number;
  scale: number;
  wdaClient: WDAClient;
  mjpegFanout: MjpegFanout;
  stop: () => Promise<void>; // idempotent
}

export interface IOSBridgeOptions {
  /** Test seam: defaults to real spawn. */
  spawnFn?: typeof spawn;
  /** Test seam: defaults to real execFile. */
  execFileFn?: typeof execFile;
}

export class IOSWdaBridge {
  constructor(private readonly options: IOSBridgeOptions = {}) {}

  async start(
    udid: string,
    ports: PortPair,
    runnerBundleId: string,
  ): Promise<IOSBridgeHandle> {
    const spawnFn = this.options.spawnFn ?? spawn;

    log.info(
      `[ios-bridge] start udid=${udid} ports=${ports.wdaRestPort}/${ports.wdaMjpegPort} runner=${runnerBundleId}`,
    );

    // Step 1 — mount developer disk image (idempotent).
    await this.runIos(['image', 'auto', '--udid', udid], 30_000);

    // Step 2 — spawn `ios runwda` in the background.
    // go-ios v1.0.188+ enforces "all-or-none" for bundleid/testrunnerbundleid/
    // xctestconfig. Spike 02 worked on an older version that accepted partial
    // flags; passing none lets go-ios auto-discover the installed xctest
    // runner, which is robust to varying signed names and xctest target names.
    const runwda = spawnFn(
      'ios',
      ['runwda', `--udid=${udid}`],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.pipeLogs('runwda', runwda);

    // Step 3 — wait 3 s for WDA XCTest handshake (per spike 02).
    await wait(3000);

    // Step 4 — `ios forward $wdaRestPort 8100` (background).
    const forwardRest = spawnFn(
      'ios',
      ['forward', String(ports.wdaRestPort), '8100', `--udid=${udid}`],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.pipeLogs('forward-rest', forwardRest);

    // Step 5 — wait 500 ms.
    await wait(500);

    // Step 6 — `ios forward $wdaMjpegPort 9100` (background).
    const forwardMjpeg = spawnFn(
      'ios',
      ['forward', String(ports.wdaMjpegPort), '9100', `--udid=${udid}`],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    this.pipeLogs('forward-mjpeg', forwardMjpeg);

    const baseUrl = `http://localhost:${ports.wdaRestPort}`;
    const wdaClient = new WDAClient(baseUrl);

    // Step 7 — poll /status until ready or 60 s timeout.
    const readyDeadline = Date.now() + 60_000;
    let ready = false;
    while (Date.now() < readyDeadline) {
      try {
        const s = await wdaClient.getStatus();
        if (s.ready) {
          ready = true;
          break;
        }
      } catch {
        /* WDA not up yet */
      }
      await wait(250);
    }
    if (!ready) {
      const err = new WDANotRunningError(baseUrl);
      await this.killAll(runwda, forwardRest, forwardMjpeg);
      throw err;
    }

    // Step 8 — create WDA session (bare-minimum caps per spike 03).
    const sessionId = await wdaClient.createSession();

    let mjpegFanout: MjpegFanout | undefined;
    try {
      // Step 9 — lock probe.
      if (await wdaClient.getLocked(sessionId)) {
        throw new DeviceLockedError();
      }

      // Step 10 — read screen dimensions.
      const screen: ScreenInfo = await wdaClient.getScreen(sessionId);
      const deviceWidthPoints = screen.width;
      const deviceHeightPoints = screen.height;
      const deviceWidthPixels = Math.round(screen.width * screen.scale);
      const deviceHeightPixels = Math.round(screen.height * screen.scale);

      // Step 11 — push tuned MJPEG settings.
      await wdaClient.setMjpegSettings(sessionId, DEFAULT_MJPEG_SETTINGS);

      // Step 12 — start MJPEG fan-out.
      mjpegFanout = new MjpegFanout(
        `http://localhost:${ports.wdaMjpegPort}/mjpeg`,
      );
      await mjpegFanout.start();

      let stopped = false;
      const stop = async (): Promise<void> => {
        if (stopped) return;
        stopped = true;
        try {
          await mjpegFanout!.stop();
        } catch (e) {
          log.warn(`[ios-bridge] mjpeg.stop: ${e}`);
        }
        try {
          await wdaClient.deleteSession(sessionId);
        } catch (e) {
          log.warn(`[ios-bridge] deleteSession: ${e}`);
        }
        await this.killAll(runwda, forwardRest, forwardMjpeg);
        log.info(`[ios-bridge] stopped udid=${udid}`);
      };

      log.info(
        `[ios-bridge] ready udid=${udid} sessionId=${sessionId} ${deviceWidthPoints}x${deviceHeightPoints} @${screen.scale}x`,
      );
      return {
        sessionId,
        deviceWidthPoints,
        deviceHeightPoints,
        deviceWidthPixels,
        deviceHeightPixels,
        scale: screen.scale,
        wdaClient,
        mjpegFanout,
        stop,
      };
    } catch (err) {
      if (mjpegFanout) await mjpegFanout.stop().catch(() => {});
      await wdaClient.deleteSession(sessionId).catch(() => {});
      await this.killAll(runwda, forwardRest, forwardMjpeg);
      throw err;
    }
  }

  /** Probe `ios info --udid` to confirm tunnel daemon + device pairing. */
  static async probeTunnel(
    udid: string,
    execFileFn: typeof execFile = execFile,
  ): Promise<void> {
    try {
      await promisify(execFileFn)('ios', ['info', '--udid', udid], {
        timeout: 5_000,
      });
    } catch {
      throw new TunnelNotRunningError();
    }
  }

  /** Probe `ios apps --list --udid` for the runner bundle id.
   *  `--list` returns bundle-id-only lines (~kB) instead of full plist metadata
   *  (~MB); the latter blows Node's default 1 MB execFile maxBuffer on devices
   *  with many apps and gets miscategorised as "not installed". */
  static async probeWdaInstalled(
    udid: string,
    runnerBundleId: string,
    execFileFn: typeof execFile = execFile,
  ): Promise<void> {
    let stdout = '';
    try {
      const r = await promisify(execFileFn)(
        'ios',
        ['apps', '--list', '--udid', udid],
        { timeout: 10_000 },
      );
      stdout = String((r as { stdout?: string }).stdout ?? '');
    } catch {
      throw new WDANotInstalledError(runnerBundleId);
    }
    if (!stdout.includes(runnerBundleId)) {
      throw new WDANotInstalledError(runnerBundleId);
    }
  }

  private async runIos(args: string[], timeoutMs: number): Promise<void> {
    const execFileFn = this.options.execFileFn ?? execFile;
    await promisify(execFileFn)('ios', args, { timeout: timeoutMs });
  }

  private pipeLogs(prefix: string, child: ChildProcess): void {
    child.stdout?.on('data', (b) =>
      log.info(`[ios-${prefix}] ${String(b).trim()}`),
    );
    child.stderr?.on('data', (b) =>
      log.warn(`[ios-${prefix}] ${String(b).trim()}`),
    );
    child.on('exit', (code, sig) =>
      log.info(`[ios-${prefix}] exited code=${code} sig=${sig}`),
    );
  }

  private async killAll(...children: ChildProcess[]): Promise<void> {
    for (const c of children) {
      try {
        c.kill('SIGKILL');
      } catch {
        /* already exited */
      }
    }
  }
}
