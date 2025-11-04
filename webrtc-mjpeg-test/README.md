# WebRTC MJPEG Stream Test

A standalone test project for streaming MJPEG video feeds through WebRTC using Werift library.

## Overview

This project demonstrates how to:
- Decode MJPEG streams from a URL
- Convert JPEG frames to H.264 video using FFmpeg
- Stream video through WebRTC using Werift
- Serve a web interface for testing

## Prerequisites

- Node.js 18+ (ES modules support)
- FFmpeg installed (or use bundled @ffmpeg-installer)
- An MJPEG stream source (e.g., from Appium device farm)

## Installation

```bash
cd webrtc-mjpeg-test
npm install
```

## Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Environment Variables

- `PORT` - Server port (default: 3000)
- `MJPEG_URL` - Default MJPEG stream URL (optional)

Example:
```bash
PORT=3000 MJPEG_URL=http://127.0.0.1:8080/screenshot npm run dev
```

## Accessing the Test Interface

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Enter your MJPEG stream URL
4. Click "Start Stream"

## Project Structure

```
webrtc-mjpeg-test/
├── src/
│   ├── mjpeg-decoder.ts      # MJPEG stream decoder
│   ├── h264-encoder.ts       # FFmpeg H.264 encoder wrapper
│   ├── webrtc-controller.ts  # WebRTC streaming controller
│   ├── server.ts             # Express HTTP server
│   └── index.ts              # Application entry point
├── public/
│   └── index.html            # Test web interface
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### POST `/api/webrtc/offer`
Handle WebRTC offer from client.

**Request Body:**
```json
{
  "streamId": "unique-stream-id",
  "mjpegUrl": "http://127.0.0.1:8080/screenshot",
  "offer": {
    "type": "offer",
    "sdp": "..."
  }
}
```

**Response:**
```json
{
  "answer": {
    "type": "answer",
    "sdp": "..."
  }
}
```

### POST `/api/webrtc/ice`
Handle ICE candidate from client.

**Request Body:**
```json
{
  "streamId": "unique-stream-id",
  "candidate": {
    "candidate": "...",
    "sdpMLineIndex": 0,
    "sdpMid": "0"
  }
}
```

### POST `/api/webrtc/stop/:streamId`
Stop a WebRTC stream.

### GET `/api/health`
Health check endpoint.

## How It Works

1. **MJPEG Decoding**: The `MjpegDecoder` connects to an MJPEG stream URL and parses incoming JPEG frames.

2. **H.264 Encoding**: JPEG frames are fed to FFmpeg via stdin, which encodes them to H.264 video.

3. **WebRTC Streaming**: The H.264 stream is packetized into RTP packets and sent through WebRTC using Werift.

4. **Client Connection**: The browser connects via WebRTC, receives the video stream, and displays it.

## Technical Details

### Codecs Used
- Input: MJPEG (JPEG frames)
- Output: H.264 (via libx264)
- WebRTC: H.264 video codec

### FFmpeg Settings
- Preset: `ultrafast` (low latency)
- Tune: `zerolatency` (optimized for streaming)
- Frame rate: 10 fps (configurable)
- Bitrate: 500k (configurable)

### WebRTC Configuration
- STUN servers: Google's public STUN server
- Codec: H.264
- Direction: Send-only (server to client)

## Troubleshooting

### FFmpeg Not Found
If you get FFmpeg errors, ensure FFmpeg is installed:
```bash
# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg

# Windows
# Use bundled @ffmpeg-installer or install manually
```

### Stream Not Starting
1. Verify MJPEG URL is accessible
2. Check server logs for errors
3. Ensure MJPEG stream is valid (multipart/x-mixed-replace)
4. Check browser console for WebRTC errors

### High Latency
- Adjust FFmpeg preset (ultrafast → veryfast)
- Reduce frame rate
- Lower bitrate
- Check network conditions

## Limitations

- Currently supports one stream per streamId
- No TURN server configured (may not work behind strict NATs)
- H.264 encoding is CPU-intensive
- No audio support

## Future Improvements

- [ ] Support multiple concurrent streams
- [ ] Add TURN server configuration
- [ ] Hardware acceleration (GPU encoding)
- [ ] Adaptive bitrate streaming
- [ ] Audio support
- [ ] WebSocket signaling for better ICE candidate handling

## Testing with Appium Device Farm

If you're testing with Appium Device Farm:

1. Start a device session with MJPEG streaming enabled
2. Get the MJPEG URL (usually `http://127.0.0.1:PORT/screenshot`)
3. Use that URL in the test interface

Example:
```
http://127.0.0.1:63340/screenshot
```

## License

ISC

