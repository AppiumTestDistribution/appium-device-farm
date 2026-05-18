import http from 'node:http';
import { URL } from 'node:url';
import log from '../../logger';

export type JpegHandler = (jpeg: Buffer) => void;

export class MjpegFanout {
  private subscribers = new Set<JpegHandler>();
  private req: http.ClientRequest | null = null;
  private res: http.IncomingMessage | null = null;
  private stopped = false;

  constructor(private readonly upstreamUrl: string) {}

  start(): Promise<void> {
    if (this.stopped) throw new Error('MjpegFanout: cannot start after stop');
    return new Promise<void>((resolve, reject) => {
      let settled = false;
      const settle = (fn: () => void) => {
        if (settled) return;
        settled = true;
        fn();
      };

      const url = new URL(this.upstreamUrl);
      this.req = http.get(
        {
          host: url.hostname,
          port: url.port ? Number(url.port) : 80,
          path: url.pathname + url.search,
          // No keep-alive; this is a long-lived stream.
        },
        (res) => {
          this.res = res;
          if (res.statusCode !== 200) {
            settle(() => reject(new Error(`MJPEG upstream status ${res.statusCode}`)));
            return;
          }
          // WDA uses the header value verbatim as the body delimiter — do NOT prepend `--`.
          const ct = res.headers['content-type'] ?? '';
          const m = /boundary=(.+)$/i.exec(ct);
          if (!m) {
            settle(() => reject(new Error('MJPEG response missing boundary')));
            return;
          }
          const boundary = m[1]!.trim();
          this.parseStream(res, boundary);
          settle(() => resolve());
        },
      );

      this.req.on('error', (err) => {
        if (this.stopped) return;
        if (!settled) {
          settle(() => reject(err));
        } else {
          log.warn(`[ios-mjpeg] upstream request error after start: ${err.message}`);
        }
      });
    });
  }

  async stop(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    this.subscribers.clear();
    if (this.res) this.res.destroy();
    if (this.req) this.req.destroy();
  }

  subscribe(handler: JpegHandler): () => void {
    this.subscribers.add(handler);
    return () => this.subscribers.delete(handler);
  }

  private parseStream(res: http.IncomingMessage, boundary: string): void {
    let buf = Buffer.alloc(0);
    res.on('data', (chunk: Buffer) => {
      buf = Buffer.concat([buf, chunk] as Uint8Array[]);

      // Loop: find boundary, find headers/body separator (\r\n\r\n), read Content-Length
      // bytes of JPEG, emit, advance past JPEG + trailing \r\n.
      while (true) {
        const bIdx = buf.indexOf(boundary);
        if (bIdx < 0) break;
        const headerStart = bIdx + boundary.length;
        const headerEnd = buf.indexOf('\r\n\r\n', headerStart);
        if (headerEnd < 0) break;
        const headerText = buf.slice(headerStart, headerEnd).toString('utf-8');
        const lenMatch = /Content-Length:\s*(\d+)/i.exec(headerText);
        if (!lenMatch) {
          // Skip past this malformed part.
          buf = buf.slice(headerEnd + 4);
          continue;
        }
        const len = Number(lenMatch[1]);
        const bodyStart = headerEnd + 4;
        const bodyEnd = bodyStart + len;
        if (buf.length < bodyEnd) break;
        const jpeg = buf.slice(bodyStart, bodyEnd);
        this.dispatch(jpeg);
        buf = buf.slice(bodyEnd);
      }
    });
    res.on('error', (err: Error) => {
      if (!this.stopped) log.warn(`[ios-mjpeg] upstream response error: ${err.message}`);
    });
    res.on('end', () => {
      if (!this.stopped) log.info('[ios-mjpeg] upstream closed (end)');
    });
  }

  private dispatch(jpeg: Buffer): void {
    for (const h of this.subscribers) {
      try { h(jpeg); } catch { /* subscriber bug — don't take down dispatch */ }
    }
  }
}
