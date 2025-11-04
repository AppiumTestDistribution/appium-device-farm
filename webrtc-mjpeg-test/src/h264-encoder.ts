import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

export interface H264EncoderOptions {
  mjpegUrl: string;
  rtpPort: number;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: string;
  preset?: string;
}

export class H264Encoder extends EventEmitter {
  private ffmpegProcess: ChildProcess | null = null;
  private isRunning = false;
  private options: Required<H264EncoderOptions>;

  constructor(options: H264EncoderOptions) {
    super();
    this.options = {
      mjpegUrl: options.mjpegUrl,
      rtpPort: options.rtpPort,
      width: options.width || 1280,
      height: options.height || 720,
      fps: options.fps || 10,
      bitrate: options.bitrate || '500k',
      preset: options.preset || 'ultrafast',
    };
  }

  start(): void {
    if (this.isRunning) {
      console.log('[H264Encoder] Already running');
      return;
    }

    const ffmpeg = ffmpegPath.path;
    console.log(`[H264Encoder] Starting FFmpeg from: ${ffmpeg}`);
    console.log(`[H264Encoder] MJPEG URL: ${this.options.mjpegUrl}`);
    console.log(`[H264Encoder] RTP Port: ${this.options.rtpPort}`);

    // FFmpeg command to read MJPEG stream and output RTP packets
    // FFmpeg will handle MJPEG decoding, H.264 encoding, and RTP packetization
    const gop = Math.max(1, this.options.fps);
    const bufK = parseInt(this.options.bitrate) * 2;
    const targetW = this.options.width;
    const targetH = this.options.height;
    // Use lanczos for better quality scaling, add format conversion for better color handling
    const scalePad = `scale=${targetW}:${targetH}:flags=lanczos:force_original_aspect_ratio=decrease,format=yuv420p,pad=${targetW}:${targetH}:(ow-iw)/2:(oh-ih)/2:black`;

    // Determine H.264 level based on resolution for better quality
    // Level 4.0 supports up to 2048x1024, 4.1 up to 2048x1152, 4.2 up to 4096x2176
    let h264Level = '3.1';
    const pixels = targetW * targetH;
    if (pixels > 1920 * 1080) {
      h264Level = '4.2';
    } else if (pixels > 1280 * 720) {
      h264Level = '4.1';
    } else if (pixels > 720 * 480) {
      h264Level = '4.0';
    }
    const args = [
      '-fflags',
      'nobuffer',
      '-flags',
      'low_delay',
      '-analyzeduration',
      '0',
      '-probesize',
      '32k',
      '-use_wallclock_as_timestamps',
      '1',
      '-i',
      this.options.mjpegUrl,
      '-c:v',
      'libx264',
      '-preset',
      this.options.preset,
      '-tune',
      'zerolatency',
      '-profile:v',
      'high', // Use high profile for better compression efficiency
      '-level',
      h264Level,
      '-x264-params',
      `scenecut=0:open_gop=0:keyint=${gop}:min-keyint=1:rc-lookahead=0:me=umh:subme=7:merange=16:trellis=1:ref=3:bframes=0:weightb=0:8x8dct=1:fast-pskip=0`,
      '-pix_fmt',
      'yuv420p',
      '-r',
      `${this.options.fps}`,
      '-vf',
      scalePad,
      '-b:v',
      this.options.bitrate,
      '-maxrate',
      this.options.bitrate,
      '-bufsize',
      `${bufK}k`,
      '-g',
      `${gop}`,
      '-f',
      'rtp',
      `rtp://127.0.0.1:${this.options.rtpPort}`,
    ];

    console.log(`[H264Encoder] FFmpeg args: ${args.join(' ')}`);

    this.ffmpegProcess = spawn(ffmpeg, args);

    if (this.ffmpegProcess.stderr) {
      this.ffmpegProcess.stderr.on('data', (data: Buffer) => {
        const message = data.toString();
        // Log periodically to show progress
        if (message.includes('frame=') || message.includes('fps=')) {
          console.log(`[H264Encoder] FFmpeg: ${message.trim().substring(0, 150)}`);
        }
        if (message.includes('error') || message.includes('Error')) {
          console.error(`[H264Encoder] FFmpeg error: ${message}`);
          this.emit('error', new Error(message));
        }
      });
    }

    if (this.ffmpegProcess.stdout) {
      this.ffmpegProcess.stdout.on('data', (data: Buffer) => {
        console.log(`[H264Encoder] FFmpeg stdout: ${data.toString()}`);
      });
    }

    this.ffmpegProcess.on('close', (code) => {
      console.log(`[H264Encoder] FFmpeg process exited with code ${code}`);
      this.isRunning = false;
      this.emit('close', code);
    });

    this.ffmpegProcess.on('error', (err) => {
      console.error('[H264Encoder] FFmpeg spawn error:', err);
      this.isRunning = false;
      this.emit('error', err);
    });

    this.isRunning = true;
    console.log('[H264Encoder] Started successfully - FFmpeg is streaming RTP');
  }

  stop(): void {
    if (!this.ffmpegProcess) {
      return;
    }

    console.log('[H264Encoder] Stopping...');
    this.isRunning = false;

    this.ffmpegProcess.kill('SIGTERM');

    // Force kill if not stopped after 2 seconds
    setTimeout(() => {
      if (this.ffmpegProcess && !this.ffmpegProcess.killed) {
        console.log('[H264Encoder] Force killing FFmpeg process');
        this.ffmpegProcess.kill('SIGKILL');
      }
    }, 2000);
  }

  get isActive(): boolean {
    return this.isRunning;
  }
}
