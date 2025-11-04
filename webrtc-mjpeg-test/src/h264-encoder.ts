import { exec, ChildProcess } from 'child_process';
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
    const command = `${ffmpeg} -i "${this.options.mjpegUrl}" \
      -c:v libx264 \
      -preset ${this.options.preset} \
      -tune zerolatency \
      -profile:v baseline \
      -level 3.1 \
      -pix_fmt yuv420p \
      -r ${this.options.fps} \
      -s ${this.options.width}x${this.options.height} \
      -b:v ${this.options.bitrate} \
      -maxrate ${this.options.bitrate} \
      -bufsize ${parseInt(this.options.bitrate) * 2}k \
      -g 10 \
      -keyint_min 1 \
      -f rtp rtp://127.0.0.1:${this.options.rtpPort}`;

    console.log(`[H264Encoder] FFmpeg command: ${command}`);

    this.ffmpegProcess = exec(command);

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
      console.error('[H264Encoder] FFmpeg exec error:', err);
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
