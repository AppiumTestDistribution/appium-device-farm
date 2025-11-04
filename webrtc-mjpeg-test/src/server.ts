import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { WebRTCController } from './webrtc-controller';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store active controllers by stream ID
const controllers = new Map<string, WebRTCController>();

export function createServer(port: number = 3000): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '../public')));

  // WebRTC signaling endpoint - handle offer
  app.post('/api/webrtc/offer', async (req: Request, res: Response) => {
    try {
      const { streamId, mjpegUrl, offer } = req.body;

      if (!streamId || !mjpegUrl || !offer) {
        return res.status(400).json({ error: 'Missing required fields: streamId, mjpegUrl, offer' });
      }

      console.log(`[Server] Received WebRTC offer for stream: ${streamId}`);

      // Get or create controller
      let controller = controllers.get(streamId);
      if (!controller) {
        console.log(`[Server] Creating new WebRTC controller for: ${mjpegUrl}`);
        controller = new WebRTCController({
          mjpegUrl,
          width: 1280,
          height: 720,
          fps: 10,
          bitrate: '500k',
        });

        // Handle ICE candidates
        controller.on('iceCandidate', (candidate) => {
          // Store candidate for later (in production, you'd send this via WebSocket or another endpoint)
          console.log(`[Server] ICE candidate for ${streamId}:`, candidate);
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

      console.log(`[Server] Created WebRTC answer for stream: ${streamId}`);
      res.json({ answer });
    } catch (error: any) {
      console.error('[Server] Error handling offer:', error);
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
        sdpMid: candidate.sdpMid
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

