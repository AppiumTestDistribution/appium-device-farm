import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { WebRTCController } from './webrtc-controller';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store active controllers by stream ID
const controllers = new Map<string, WebRTCController>();
// Store server ICE candidates by stream ID
const serverIceCandidatesMap = new Map<string, any[]>();

export function createServer(port = 3000): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // WebRTC signaling endpoint - handle offer
  app.post('/api/webrtc/offer', async (req: Request, res: Response) => {
    try {
      const { streamId, mjpegUrl, offer, width, height, fps, bitrate } = req.body;

      if (!streamId || !mjpegUrl || !offer) {
        return res
          .status(400)
          .json({ error: 'Missing required fields: streamId, mjpegUrl, offer' });
      }

      console.log(`[Server] Received WebRTC offer for stream: ${streamId}`);

      // Get or create controller
      let controller = controllers.get(streamId);
      if (!controller) {
        console.log(`[Server] Creating new WebRTC controller for: ${mjpegUrl}`);
        // Calculate bitrate based on resolution for better quality
        const defaultWidth = typeof width === 'number' ? width : 1280;
        const defaultHeight = typeof height === 'number' ? height : 720;
        const defaultFps = typeof fps === 'number' ? fps : 10;
        const pixels = defaultWidth * defaultHeight;
        // Higher bitrate for higher resolutions (roughly 0.5-1.5 bits per pixel)
        let defaultBitrate = '500k';
        if (pixels > 1920 * 1080) {
          defaultBitrate = '2500k'; // 4K or higher
        } else if (pixels > 1280 * 720) {
          defaultBitrate = '1200k'; // 1080p
        } else if (pixels > 640 * 480) {
          defaultBitrate = '800k'; // 720p
        } else {
          defaultBitrate = '500k'; // Lower resolutions
        }

        controller = new WebRTCController({
          mjpegUrl,
          width: defaultWidth,
          height: defaultHeight,
          fps: defaultFps,
          bitrate: typeof bitrate === 'string' ? bitrate : defaultBitrate,
        });

        // Initialize server ICE candidates array for this stream
        serverIceCandidatesMap.set(streamId, []);

        // Handle ICE candidates from server
        controller.on('iceCandidate', (candidate) => {
          console.log(`[Server] ICE candidate for ${streamId}:`, candidate);
          const candidates = serverIceCandidatesMap.get(streamId) || [];
          // Format candidate for RTCIceCandidateInit
          candidates.push({
            candidate: candidate.candidate,
            sdpMLineIndex: candidate.sdpMLineIndex,
            sdpMid: candidate.sdpMid,
          });
          serverIceCandidatesMap.set(streamId, candidates);
        });

        controller.on('error', (error) => {
          console.error(`[Server] Controller error for ${streamId}:`, error);
          controllers.delete(streamId);
        });

        controllers.set(streamId, controller);
      }

      // Start controller if not already started
      if (!controller.active) {
        await controller.start();
      }

      // Handle offer and create answer
      let answer;
      try {
        answer = await controller.handleOffer(offer);
      } catch (error: any) {
        console.error('[Server] Error in handleOffer:', error);
        console.error('[Server] Error stack:', error?.stack);
        throw error;
      }

      // Wait a moment for ICE candidates to be generated
      await new Promise((resolve) => setTimeout(resolve, 200));

      const serverIceCandidates = serverIceCandidatesMap.get(streamId) || [];
      console.log(`[Server] Created WebRTC answer for stream: ${streamId} (${serverIceCandidates.length} server ICE candidates)`);
      res.json({
        answer,
        serverIceCandidates, // Include any server ICE candidates generated so far
      });
    } catch (error: any) {
      console.error('[Server] Error handling offer:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Get server ICE candidates for a stream (polling endpoint for clients)
  app.get('/api/webrtc/ice/:streamId', async (req: Request, res: Response) => {
    try {
      const { streamId } = req.params;
      const candidates = serverIceCandidatesMap.get(streamId) || [];
      res.json({ serverIceCandidates: candidates });
    } catch (error: any) {
      console.error('[Server] Error getting ICE candidates:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Handle ICE candidates from client
  app.post('/api/webrtc/ice', async (req: Request, res: Response) => {
    try {
      const { streamId, candidate } = req.body;

      if (!streamId || !candidate) {
        return res.status(400).json({ error: 'Missing required fields: streamId, candidate' });
      }

      console.log(`[Server] Received ICE candidate from client for stream ${streamId}:`, {
        candidate: candidate.candidate?.substring(0, 80),
        sdpMLineIndex: candidate.sdpMLineIndex,
        sdpMid: candidate.sdpMid,
      });

      const controller = controllers.get(streamId);
      if (!controller) {
        console.error(`[Server] Stream not found: ${streamId}`);
        return res.status(404).json({ error: 'Stream not found' });
      }

      await controller.addIceCandidate(candidate);
      console.log(`[Server] ✓ Added ICE candidate for stream ${streamId}`);
      res.json({ success: true });
    } catch (error: any) {
      console.error('[Server] Error handling ICE candidate:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Stop stream
  app.post('/api/webrtc/stop/:streamId', async (req: Request, res: Response) => {
    try {
      const { streamId } = req.params;
      const controller = controllers.get(streamId);

      if (controller) {
        await controller.stop();
        controllers.delete(streamId);
        serverIceCandidatesMap.delete(streamId);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Stream not found' });
      }
    } catch (error: any) {
      console.error('[Server] Error stopping stream:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', activeStreams: controllers.size });
  });

  // Serve test page
  app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  return app;
}
