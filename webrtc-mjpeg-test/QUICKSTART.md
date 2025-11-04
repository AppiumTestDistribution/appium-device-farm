# Quick Start Guide

## Installation

```bash
cd webrtc-mjpeg-test
npm install
```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## Testing

1. **Start the server**: `npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`
3. **Enter MJPEG URL**: 
   - For Appium Device Farm: `http://127.0.0.1:PORT/screenshot`
   - Replace `PORT` with your device's `mjpegServerPort`
4. **Click "Start Stream"**: The video should appear in the browser

## Example MJPEG URLs

- Local Appium Device Farm: `http://127.0.0.1:63340/screenshot`
- Remote MJPEG stream: `http://your-server:8080/screenshot`
- Test MJPEG stream: Use any MJPEG stream URL

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` again
- Make sure you're in the `webrtc-mjpeg-test` directory

### FFmpeg errors
- Ensure FFmpeg is installed: `ffmpeg -version`
- The project includes `@ffmpeg-installer` which should work automatically

### Stream not connecting
- Verify MJPEG URL is accessible
- Check browser console for WebRTC errors
- Check server logs for errors

### Port already in use
- Change port: `PORT=3001 npm run dev`

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check server logs for debugging information
- Modify `src/webrtc-controller.ts` to adjust video quality settings

