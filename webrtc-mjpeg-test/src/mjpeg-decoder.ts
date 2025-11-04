import EventEmitter from 'events';
import { URL } from 'url';
import http, { ClientRequest } from 'http';
import https from 'https';
import sharp from 'sharp';

const BOUNDARY_PATTERN = /multipart\/x-mixed-replace;\s*boundary=(.*)/;

const SOI = Buffer.from([0xff, 0xd8]);
const EOI = Buffer.from([0xff, 0xd9]);
const EOF = -1;
const MAX_BUFFER_SIZE = 16 * 4096 * 4096;
const DEFAULT_INTERVAL = 1000 / 10;
const DEFAULT_MAX_FRAMES = 0;
const DEFAULT_TIMEOUT = 10000;

const DEFAULT_OPTIONS = {
  interval: DEFAULT_INTERVAL,
  maxFrames: DEFAULT_MAX_FRAMES,
  timeout: DEFAULT_TIMEOUT,
};

interface optionsType {
  interval: number;
  maxFrames: number;
  timeout: number;
}

function checkUrlReachable(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, (res: any) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        const contentType = res.headers['content-type'];
        if (
          contentType &&
          typeof contentType === 'string' &&
          contentType.includes('multipart/x-mixed-replace')
        ) {
          resolve(true);
        } else {
          // Some MJPEG servers don't send the correct content-type header
          // Accept any 200 response as valid for now
          resolve(true);
        }
      } else {
        resolve(false);
      }
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function waitForUrl(url: string, timeout = 30000, interval = 1000): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const reachable = await checkUrlReachable(url);
    if (reachable) {
      console.log('URL is now reachable!');
      return true;
    }

    console.log('URL not reachable, retrying...');
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.log('Timed out waiting for URL to become reachable.');
  return false;
}

function isBufferEqual(buf1: ArrayBuffer, buf2: ArrayBuffer): boolean {
  if (buf1.byteLength !== buf2.byteLength) return false;
  const view1 = new Uint8Array(buf1);
  const view2 = new Uint8Array(buf2);
  for (let i = 0; i < view1.length; i++) {
    if (view1[i] !== view2[i]) return false;
  }
  return true;
}

export class MjpegDecoder extends EventEmitter {
  private url: string;
  private frame: Buffer | null;
  private data: Buffer;
  private imageStart: number;
  private imageEnd: number;
  private seq: number;
  private options: optionsType;
  private lastFrameTime: number | null;
  private callbackQueue: Array<(err: any, frame?: Buffer) => void>;
  private mjpegRequest!: ClientRequest;
  private lastFrameBuffer!: Uint8Array;

  constructor(mjpegUrl: string, options?: Partial<optionsType>) {
    super();
    this.url = mjpegUrl;
    this.frame = null;
    this.data = Buffer.alloc(0);
    this.imageStart = -1;
    this.imageEnd = -1;
    this.seq = 0;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options || {});
    this.lastFrameTime = null;
    this.callbackQueue = [];
  }

  async start(): Promise<void> {
    // Validate URL format
    try {
      new URL(this.url);
    } catch (error) {
      throw new Error(`Invalid MJPEG URL format: ${this.url}`);
    }

    const urlOptions = new URL(this.url);

    const isUrlUp = await waitForUrl(this.url);

    if (!isUrlUp) {
      throw new Error(`MJPEG stream is not active at url ${this.url}`);
    }

    let timer: NodeJS.Timeout | null = setTimeout(() => {
      clearTimeout(timer!);
      timer = null;
      this.abort('timeout');
    }, this.options.timeout);

    this.mjpegRequest = (urlOptions.protocol === 'https:' ? https : http).get(urlOptions, (res) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      const contentType = res.headers['content-type'];
      const contentTypeStr =
        typeof contentType === 'string'
          ? contentType
          : Array.isArray(contentType)
            ? contentType[0]
            : '';

      if (contentTypeStr && !this.isValidMjpegStream(contentTypeStr)) {
        console.warn(
          `[MjpegDecoder] Unexpected content-type: ${contentTypeStr}, but continuing anyway`,
        );
        // Don't abort - some MJPEG servers don't send correct headers
      }

      res.on('data', this.onDataReceived.bind(this));

      res.on('error', (err) => {
        this.abort('http_error', err);
      });
    });

    this.mjpegRequest.on('error', (err) => {
      this.abort('http_error', err);
    });
  }

  stop(): void {
    if (!this.mjpegRequest) return;
    this.abort('end');
  }

  takeSnapshot(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.callbackQueue.push((err: any, frame?: Buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(frame!);
        }
      });
      if (!this.mjpegRequest) {
        this.start();
      }
    });
  }

  private onDataReceived(chunk: Buffer): void {
    this.data = Buffer.concat([this.data, chunk]);
    if (this.data.length >= MAX_BUFFER_SIZE) {
      this.drainCallbackQueue(
        new Error('max buffer size exceeded, which might be caused by an internal codec error'),
      );
      this.abort('max_buffer_size_exceeded');
      return;
    }
    if (this.imageStart === EOF) {
      this.imageStart = this.data.indexOf(SOI);
    }

    if (this.imageStart >= 0) {
      if (this.imageEnd === EOF) {
        this.imageEnd = this.data.indexOf(EOI, this.imageStart + SOI.length);
      }
      if (this.imageEnd >= this.imageStart) {
        const frame = this.data.slice(this.imageStart, this.imageEnd + EOI.length);
        try {
          this.onFrameReady(frame);
        } catch (e) {
          // ignore
        }
        this.data = this.data.slice(this.imageEnd + EOI.length);
        this.imageStart = EOF;
        this.imageEnd = EOF;
      }
    }
  }

  private drainCallbackQueue(err: any, frame?: Buffer): void {
    while (this.callbackQueue.length) {
      const callback = this.callbackQueue.shift();
      if (callback) {
        try {
          callback(err, frame);
        } catch (e) {
          // ignore
        }
      }
    }
  }

  private async onFrameReady(frame: Buffer): Promise<void> {
    const { interval, maxFrames } = this.options;
    if (this.lastFrameTime && Date.now() - this.lastFrameTime < interval) {
      this.drainCallbackQueue(null, frame);
      return;
    }

    this.lastFrameTime = Date.now();
    this.frame = frame;
    this.seq++;

    if (!this.lastFrameBuffer || this.isScreenUpdated(frame)) {
      this.lastFrameBuffer = new Uint8Array(frame); // Update buffer with the new frame
      try {
        const optimizedFrame = await sharp(frame)
          .jpeg({ quality: 60, progressive: true })
          .toBuffer();
        console.log(`[MjpegDecoder] Emitting optimized frame: ${optimizedFrame.length} bytes`);
        this.emit('frame', optimizedFrame);
      } catch (err) {
        // Emit original frame if optimization fails
        console.log(
          `[MjpegDecoder] Emitting original frame (optimization failed): ${frame.length} bytes`,
        );
        this.emit('frame', frame);
      }
    } else {
      // Do not emit a frame if it's a duplicate
      console.log('[MjpegDecoder] Skipping duplicate frame (no screen change)');
    }
    this.drainCallbackQueue(null, frame);

    if (maxFrames > 0 && this.seq >= maxFrames) {
      this.abort('end');
      return;
    }
  }

  private abort(reason: string, error?: any): void {
    if (!this.mjpegRequest || this.mjpegRequest.aborted) return;
    try {
      this.mjpegRequest.abort();
    } catch (e) {
      // ignore
    }
    console.log(`[MjpegDecoder] Abort: ${reason}`, error || '');
    this.emit('abort', reason, error);
  }

  private isValidMjpegStream(contentType: string): boolean {
    const match = BOUNDARY_PATTERN.exec(contentType);
    return Boolean(match);
  }

  private isScreenUpdated(frame: Buffer): boolean {
    return !isBufferEqual(
      this.lastFrameBuffer.buffer as ArrayBuffer,
      new Uint8Array(frame).buffer as ArrayBuffer,
    );
  }
}
