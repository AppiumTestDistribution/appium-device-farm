import { readFile } from 'node:fs/promises';
import type { Adb } from '@yume-chan/adb';
import {
  AdbScrcpyClient,
  AdbScrcpyOptionsLatest,
} from '@yume-chan/adb-scrcpy';
import {
  DefaultServerPath,
  ScrcpyVideoCodecId,
} from '@yume-chan/scrcpy';
import { ReadableStream, WritableStream } from '@yume-chan/stream-extra';
import {
  ACTION_DOWN,
  ACTION_UP,
  ACTION_MOVE,
} from '../types';
import log from '../../logger';

const MAX_SIZE = 1080;

type ScrcpyHandle = AdbScrcpyClient<AdbScrcpyOptionsLatest<true>>;

export interface AndroidScrcpyBridgeOptions {
  jarPath: string;
  /** Injection seam for tests. Defaults to real AdbScrcpyClient.start. */
  scrcpyFactory?: (
    adb: Adb,
    serverPath: string,
    options: AdbScrcpyOptionsLatest<true>,
  ) => Promise<ScrcpyHandle>;
  /**
   * Injection seam for tests. Receives the jar path and is responsible for
   * reading and pushing it. Defaults to reading the file and calling
   * AdbScrcpyClient.pushServer. Test stubs can resolve immediately without
   * touching the filesystem.
   */
  pushJar?: (adb: Adb, jarPath: string) => Promise<void>;
}

export interface VideoPacket {
  kind: 'configuration' | 'data';
  data: Uint8Array;
  pts?: bigint;
}

export interface SessionHandle {
  /** Called once dimensions arrive from scrcpy's sizeChanged. */
  onDimensions(cb: (d: { width: number; height: number }) => void): void;
  getDimensions(): { width: number; height: number } | undefined;
  /** Frames piped to this writer. */
  pipeVideoTo(writer: WritableStream<VideoPacket>): Promise<void>;
  injectTouch(msg: {
    action: number;
    normX: number;
    normY: number;
  }): Promise<void>;
  injectKeycode(keycode: number): Promise<void>;
  /** Idempotent. */
  stop(): Promise<void>;
}

export function codecName(id: number): string {
  if (id === ScrcpyVideoCodecId.H264) return 'h264';
  if (id === ScrcpyVideoCodecId.H265) return 'h265';
  if (id === ScrcpyVideoCodecId.AV1) return 'av1';
  return `unknown(0x${id.toString(16)})`;
}

export class AndroidScrcpyBridge {
  constructor(
    private adb: Adb,
    private options: AndroidScrcpyBridgeOptions,
  ) {}

  async start(): Promise<SessionHandle> {
    await this.killLeftoverScrcpy();
    // pushJar is responsible for reading + pushing; the test seam can skip
    // filesystem access entirely by providing a stub.
    const pushJar = this.options.pushJar ?? defaultPushJar;
    await pushJar(this.adb, this.options.jarPath);

    const scrcpyOptions = new AdbScrcpyOptionsLatest<true>({
      video: true,
      audio: false,
      control: true,
      videoCodec: 'h264',
      maxSize: MAX_SIZE,
      cleanup: true,
      clipboardAutosync: false,
    });

    const factory = this.options.scrcpyFactory ?? defaultScrcpyFactory;
    const scrcpy = await factory(this.adb, DefaultServerPath, scrcpyOptions);

    return await this.makeHandle(scrcpy);
  }

  private async killLeftoverScrcpy(): Promise<void> {
    try {
      // shellProtocol may be undefined on older ADB implementations.
      const shellProtocol = this.adb.subprocess.shellProtocol;
      if (!shellProtocol) return;
      const proc = await shellProtocol.spawn(
        'pkill -f com.genymobile.scrcpy.Server || true',
      );
      // The process exposes `.exited` (Promise<number>), not `.exit`.
      await proc.exited;
    } catch (err) {
      log.warn(
        `[device-stream] pre-flight pkill failed: ${(err as Error)?.message ?? err}`,
      );
    }
  }

  private async makeHandle(scrcpy: ScrcpyHandle): Promise<SessionHandle> {
    let dimensions: { width: number; height: number } | undefined;
    const dimListeners: ((d: { width: number; height: number }) => void)[] = [];
    let stopped = false;
    let stopPromise: Promise<void> | undefined;

    // Await the video stream and register sizeChanged BEFORE returning the
    // handle so test code (and the router) can rely on the handler being
    // registered the moment start() resolves.
    // Fix #2 (test timing): await video here, register sizeChanged synchronously
    // before constructing + returning the handle.
    const video = await (scrcpy.videoStream as Promise<any>);
    video.sizeChanged((d: { width: number; height: number }) => {
      dimensions = d;
      for (const cb of dimListeners) cb(d);
    });

    return {
      onDimensions: (cb) => {
        dimListeners.push(cb);
        if (dimensions) cb(dimensions);
      },
      getDimensions: () => dimensions,
      pipeVideoTo: async (writer) => {
        if (!video) throw new Error('no video stream');
        // Fix #1 (correctness): acquire the writer ONCE outside the write
        // callback. getWriter() locks the stream; calling it per-packet would
        // throw on the second invocation.
        const w = writer.getWriter();
        try {
          await video.stream.pipeTo(
            new WritableStream<any>({
              write(packet: any) {
                if (stopped) return;
                if (packet.type === 'configuration') {
                  return w.write({ kind: 'configuration', data: packet.data });
                }
                return w.write({
                  kind: 'data',
                  data: packet.data,
                  pts: packet.pts,
                });
              },
            }),
          );
        } finally {
          try { w.releaseLock(); } catch {}
        }
      },
      injectTouch: async ({ action, normX, normY }) => {
        if (!scrcpy.controller || !dimensions) return;
        const px = clamp(Math.round(normX * dimensions.width), 0, dimensions.width - 1);
        const py = clamp(Math.round(normY * dimensions.height), 0, dimensions.height - 1);
        const motionAction =
          action === 0 ? ACTION_DOWN : action === 1 ? ACTION_UP : ACTION_MOVE;
        // Cast via `as any` to bridge our plain-number constants to the
        // @yume-chan branded enum types (AndroidMotionEventAction, etc.).
        await scrcpy.controller.injectTouch({
          action: motionAction,
          pointerId: 0n,
          pointerX: px,
          pointerY: py,
          videoWidth: dimensions.width,
          videoHeight: dimensions.height,
          pressure: action === 1 ? 0 : 1,
          actionButton: 0,
          buttons: 0,
        } as any);
      },
      injectKeycode: async (keycode) => {
        if (!scrcpy.controller) return;
        // Cast via `as any` to bridge plain-number constants to the
        // @yume-chan branded enum types (AndroidKeyCode, AndroidKeyEventAction).
        await scrcpy.controller.injectKeyCode({
          action: ACTION_DOWN,
          keyCode: keycode,
          repeat: 0,
          metaState: 0,
        } as any);
        await scrcpy.controller.injectKeyCode({
          action: ACTION_UP,
          keyCode: keycode,
          repeat: 0,
          metaState: 0,
        } as any);
      },
      stop: async () => {
        if (stopped) return stopPromise ?? Promise.resolve();
        stopped = true;
        stopPromise = scrcpy.close().catch((err) => {
          log.warn(
            `[device-stream] scrcpy.close threw: ${(err as Error)?.message ?? err}`,
          );
        });
        return stopPromise;
      },
    };
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

async function defaultScrcpyFactory(
  adb: Adb,
  serverPath: string,
  options: AdbScrcpyOptionsLatest<true>,
): Promise<ScrcpyHandle> {
  return AdbScrcpyClient.start(adb, serverPath, options);
}

async function defaultPushJar(adb: Adb, jarPath: string): Promise<void> {
  // readFile returns Buffer; cast to Uint8Array to satisfy strict lib types.
  const jarBytes = await readFile(jarPath) as unknown as Uint8Array;
  await AdbScrcpyClient.pushServer(
    adb,
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(jarBytes);
        controller.close();
      },
    }),
  );
}
