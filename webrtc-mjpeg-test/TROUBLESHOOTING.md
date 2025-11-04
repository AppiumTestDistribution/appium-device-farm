# Troubleshooting: FFmpeg Not Producing H.264 Output

## Current Issue

**Symptoms:**
- ✅ MJPEG frames are being received
- ✅ Frames are being written to FFmpeg stdin
- ❌ **NO H.264 output from FFmpeg stdout** (critical issue)
- ❌ No video displayed in browser

**Logs show:**
```
[H264Encoder] Writing 73772 bytes to FFmpeg stdin
[H264Encoder] FFmpeg stdin buffer full, waiting for drain...
[H264Encoder] FFmpeg stdin drained, ready for more data
```

But **NEVER** see:
```
[H264Encoder] ✓✓✓ Received X bytes from FFmpeg stdout
```

## Root Cause

FFmpeg with `image2pipe` format may be:
1. Waiting for the input stream to end before outputting
2. Buffering until it has enough frames for a keyframe
3. Not configured correctly for immediate output

## Potential Solutions

### Solution 1: Force FFmpeg to Output Immediately

Add `-frames:v` to limit output, or use `-vsync 0` to output frames as soon as they're encoded.

### Solution 2: Use Different FFmpeg Approach

Instead of `image2pipe`, try:
- Using `-loop 1` with a single frame
- Using `-re` to read input at native frame rate
- Using `-stream_loop -1` for continuous loop

### Solution 3: Alternative - Use Canvas/Sharp to Convert JPEG to Raw Video

Instead of FFmpeg, use Node.js libraries to:
1. Convert JPEG frames to raw YUV frames
2. Use a Node.js H.264 encoder (like `node-ffmpeg-stream` or `@ffmpeg/ffmpeg`)

### Solution 4: Use FFmpeg RTP Output

Instead of raw H.264, use FFmpeg's RTP output:
```bash
ffmpeg ... -f rtp rtp://127.0.0.1:5004
```
Then capture the RTP stream and forward to WebRTC.

### Solution 5: Wait for Keyframe

FFmpeg might need to send the first keyframe (SPS/PPS) before outputting. Try:
- Sending multiple frames and waiting
- Checking if FFmpeg outputs after a few seconds

## Next Steps

1. **Check FFmpeg stderr logs** - Look for encoding messages like `frame=`, `fps=`, `bitrate=`
2. **Test FFmpeg manually** - Run FFmpeg command directly with test JPEG frames
3. **Check if FFmpeg outputs after stream ends** - Close stdin and see if output appears
4. **Try alternative FFmpeg parameters** - Use `-vsync 0` or `-frames:v 100`

## Testing FFmpeg Manually

You can test FFmpeg output manually:

```bash
# Create a test script that sends JPEG frames to FFmpeg
cat test.jpeg | ffmpeg -f image2pipe -vcodec mjpeg -framerate 10 -i pipe:0 \
  -c:v libx264 -preset ultrafast -tune zerolatency \
  -profile:v baseline -level 3.1 -f h264 \
  -bsf:v h264_mp4toannexb -an pipe:1 > output.h264

# Check if output.h264 has data
ls -lh output.h264
```

If this works, FFmpeg is capable of outputting. The issue is in how we're handling the stream.

## Current Status

**Blocking Issue:** FFmpeg not producing H.264 output
**Next Action:** Debug FFmpeg output or try alternative approach

