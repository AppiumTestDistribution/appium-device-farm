import {
  RTCPeerConnection,
  MediaStreamTrack,
  RTCRtpCodecParameters,
  useSdesMid,
  RtpPacket,
  randomPort,
} from 'werift';
import { EventEmitter } from 'events';
import { createSocket, Socket } from 'dgram';
import { H264Encoder } from './h264-encoder';

export interface WebRTCControllerOptions {
  mjpegUrl: string;
  width?: number;
  height?: number;
  fps?: number;
  bitrate?: string;
}

export interface RTCSessionDescriptionInit {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
}

export interface RTCIceCandidateInit {
  candidate?: string;
  sdpMLineIndex?: number | null;
  sdpMid?: string | null;
}

export class WebRTCController extends EventEmitter {
  private pc: RTCPeerConnection | null = null;
  private videoTrack: MediaStreamTrack | null = null;
  private transceiver: any = null;
  private h264Encoder: H264Encoder | null = null;
  private udpSocket: Socket | null = null;
  private rtpPort = 0;
  private isActive = false;
  private options: Required<Omit<WebRTCControllerOptions, 'mjpegUrl'>> & { mjpegUrl: string };
  private payloadType = 96; // Dynamic payload type for H.264
  private packetCount = 0;

  constructor(options: WebRTCControllerOptions) {
    super();
    this.options = {
      mjpegUrl: options.mjpegUrl,
      width: options.width || 1280,
      height: options.height || 720,
      fps: options.fps || 10,
      bitrate: options.bitrate || '500k',
    };
  }

  async createPeerConnection(): Promise<RTCPeerConnection> {
    if (this.pc) {
      return this.pc;
    }

    console.log('[WebRTCController] Creating peer connection...');

    // Create peer connection with H.264 codec
    this.pc = new RTCPeerConnection({
      codecs: {
        audio: [],
        video: [
          new RTCRtpCodecParameters({
            mimeType: 'video/H264',
            clockRate: 90000,
            payloadType: this.payloadType,
          }),
        ],
      },
      headerExtensions: {
        video: [useSdesMid()],
      },
    });

    // Create video track
    this.videoTrack = new MediaStreamTrack({ kind: 'video' });

    // Add transceiver for sending video
    this.transceiver = this.pc.addTransceiver(this.videoTrack, {
      direction: 'sendonly',
    });

    console.log('[WebRTCController] Track created:', {
      id: this.videoTrack.id,
      kind: this.videoTrack.kind,
      payloadType: this.payloadType,
      transceiver: !!this.transceiver,
      sender: !!this.transceiver?.sender,
    });

    // Handle ICE candidates using event emitter
    this.pc.addEventListener('icecandidate', (event: any) => {
      if (event.candidate) {
        this.emit('iceCandidate', {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
        });
      }
    });

    // Handle connection state changes
    this.pc.connectionStateChange.subscribe((state) => {
      console.log(`[WebRTCController] Connection state: ${state}`);
      this.emit('connectionStateChange', state);

      if (state === 'connected') {
        console.log('[WebRTCController] ✓✓✓ WebRTC connection established successfully!');
      } else if (state === 'closed' || state === 'failed') {
        console.error(`[WebRTCController] Connection ${state}, cleaning up...`);
        this.cleanup();
      }
    });

    // Handle ICE connection state changes for better debugging
    this.pc.iceConnectionStateChange.subscribe((state) => {
      console.log(`[WebRTCController] ICE Connection state: ${state}`);
    });

    console.log('[WebRTCController] Peer connection created');
    return this.pc;
  }

  async start(): Promise<void> {
    if (this.isActive) {
      console.log('[WebRTCController] Already started');
      return;
    }

    console.log('[WebRTCController] Starting...');

    try {
      // Get a random port for RTP
      this.rtpPort = await randomPort();
      console.log(`[WebRTCController] Using RTP port: ${this.rtpPort}`);

      // Create UDP socket to receive RTP packets from FFmpeg
      this.udpSocket = createSocket('udp4');

      this.udpSocket.on('message', (data: Buffer) => {
        if (this.videoTrack) {
          // Deserialize RTP packet and update payload type
          const rtp = RtpPacket.deSerialize(data);
          rtp.header.payloadType = this.payloadType;

          // Write RTP packet directly to video track
          this.videoTrack.writeRtp(rtp);

          this.packetCount++;
          if (this.packetCount <= 5 || this.packetCount % 100 === 0) {
            console.log(
              `[WebRTCController] ✓ Forwarded RTP packet #${this.packetCount} to track (${data.length} bytes)`,
            );
          }
        }
      });

      this.udpSocket.on('error', (err) => {
        console.error('[WebRTCController] UDP socket error:', err);
        this.emit('error', err);
      });

      // Bind UDP socket
      await new Promise<void>((resolve, reject) => {
        if (!this.udpSocket) {
          reject(new Error('UDP socket not created'));
          return;
        }
        this.udpSocket.bind(this.rtpPort, '127.0.0.1', () => {
          // Increase receive buffer to reduce packet drops under load (Node 18+)
          try {
            const sockAny = this.udpSocket as any;
            if (typeof sockAny.setRecvBufferSize === 'function') {
              sockAny.setRecvBufferSize(8 * 1024 * 1024);
            }
          } catch (e) {
            console.warn('[WebRTCController] Could not set UDP recv buffer size:', e);
          }
          console.log(`[WebRTCController] UDP socket bound to 127.0.0.1:${this.rtpPort}`);
          resolve();
        });
        this.udpSocket.on('error', reject);
      });

      // Start FFmpeg H.264 encoder with RTP output
      this.h264Encoder = new H264Encoder({
        mjpegUrl: this.options.mjpegUrl,
        rtpPort: this.rtpPort,
        width: this.options.width,
        height: this.options.height,
        fps: this.options.fps,
        bitrate: this.options.bitrate,
      });

      this.h264Encoder.on('error', (error: Error) => {
        console.error('[WebRTCController] H.264 encoder error:', error);
        this.emit('error', error);
      });

      this.h264Encoder.on('close', () => {
        console.log('[WebRTCController] H.264 encoder closed');
      });

      this.h264Encoder.start();
      console.log('[WebRTCController] H.264 encoder started, streaming to RTP port');

      this.isActive = true;
      this.emit('started');
    } catch (error) {
      console.error('[WebRTCController] Error starting:', error);
      this.emit('error', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    console.log('[WebRTCController] Stopping...');
    this.isActive = false;

    if (this.h264Encoder) {
      this.h264Encoder.stop();
      this.h264Encoder = null;
    }

    if (this.udpSocket) {
      this.udpSocket.close();
      this.udpSocket = null;
    }

    this.cleanup();

    this.emit('stopped');
  }

  async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    try {
      const pc = await this.createPeerConnection();

      console.log('[WebRTCController] Setting remote description...');
      console.log('[WebRTCController] Offer SDP:', offer.sdp?.substring(0, 200) + '...');
      await pc.setRemoteDescription(offer as any);

      console.log('[WebRTCController] Creating answer...');
      const answer = await pc.createAnswer();

      console.log('[WebRTCController] Answer SDP:', answer.sdp?.substring(0, 200) + '...');
      console.log('[WebRTCController] Setting local description...');
      await pc.setLocalDescription(answer);

      // Start sending video data right away
      console.log('[WebRTCController] ✓ Answer created, video track ready to send data');

      return {
        type: 'answer',
        sdp: answer.sdp,
      };
    } catch (error: any) {
      console.error('[WebRTCController] Error in handleOffer:', error);
      console.error('[WebRTCController] Error details:', {
        message: error?.message,
        stack: error?.stack,
        offer: offer?.type,
      });
      throw error;
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (this.pc && candidate.candidate) {
      console.log('[WebRTCController] Adding remote ICE candidate:', {
        candidate: candidate.candidate.substring(0, 80),
        sdpMLineIndex: candidate.sdpMLineIndex,
      });
      await this.pc.addIceCandidate(candidate as any);
      console.log('[WebRTCController] ✓ Remote ICE candidate added');
    } else {
      console.warn('[WebRTCController] Cannot add ICE candidate:', {
        hasPc: !!this.pc,
        hasCandidate: !!candidate.candidate,
      });
    }
  }

  private cleanup(): void {
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.videoTrack = null;
    this.transceiver = null;
  }

  get active(): boolean {
    return this.isActive;
  }
}
