// Quick test to verify FFmpeg can output H.264 from JPEG frames
const { spawn } = require('child_process');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

console.log('Testing FFmpeg H.264 output...');

// Create a test JPEG (you can use any JPEG file)
// For now, let's just test if FFmpeg can run
const args = [
  '-f', 'image2pipe',
  '-vcodec', 'mjpeg',
  '-framerate', '10',
  '-i', 'pipe:0',
  '-c:v', 'libx264',
  '-preset', 'ultrafast',
  '-tune', 'zerolatency',
  '-profile:v', 'baseline',
  '-level', '3.1',
  '-pix_fmt', 'yuv420p',
  '-r', '10',
  '-s', '1280x720',
  '-b:v', '500k',
  '-g', '10',
  '-keyint_min', '10',
  '-sc_threshold', '0',
  '-x264-params', 'keyint=10:min-keyint=10:scenecut=0',
  '-f', 'h264',
  '-bsf:v', 'h264_mp4toannexb',
  '-an',
  '-flush_packets', '1',
  '-fflags', '+genpts+flush_packets+discardcorrupt',
  '-avoid_negative_ts', 'make_zero',
  'pipe:1',
];

const ffmpeg = spawn(ffmpegPath, args, {
  stdio: ['pipe', 'pipe', 'pipe'],
});

let outputBytes = 0;
let frameCount = 0;

ffmpeg.stdout.on('data', (data) => {
  outputBytes += data.length;
  frameCount++;
  console.log(`✓ Received ${data.length} bytes from FFmpeg (total: ${outputBytes} bytes, chunks: ${frameCount})`);
});

ffmpeg.stderr.on('data', (data) => {
  const msg = data.toString();
  if (msg.includes('frame=') || msg.includes('fps=') || msg.includes('bitrate=')) {
    console.log(`FFmpeg: ${msg.trim()}`);
  }
});

ffmpeg.on('close', (code) => {
  console.log(`\nFFmpeg process exited with code ${code}`);
  console.log(`Total output: ${outputBytes} bytes in ${frameCount} chunks`);
  if (outputBytes === 0) {
    console.error('❌ FFmpeg produced NO output! This is the problem.');
  } else {
    console.log('✓ FFmpeg is producing output correctly');
  }
});

// Simulate sending a few JPEG frames (you'd need actual JPEG data)
// For now, just close stdin after a delay
setTimeout(() => {
  console.log('\nClosing FFmpeg stdin...');
  if (ffmpeg.stdin) {
    ffmpeg.stdin.end();
  }
}, 2000);

console.log('Note: This test needs actual JPEG frame data to work properly.');
console.log('If you see "Received X bytes", FFmpeg is working.');

