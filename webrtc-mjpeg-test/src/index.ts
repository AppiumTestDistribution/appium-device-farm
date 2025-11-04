import { createServer } from './server';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MJPEG_URL = process.env.MJPEG_URL || 'http://127.0.0.1:8080/screenshot';

console.log('========================================');
console.log('WebRTC MJPEG Stream Test Server');
console.log('========================================');
console.log(`Port: ${PORT}`);
console.log(`Default MJPEG URL: ${MJPEG_URL}`);
console.log(`Set MJPEG_URL env var to use different stream`);
console.log('========================================\n');

const app = createServer(PORT);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📺 Test page: http://localhost:${PORT}`);
  console.log(`\nTo test with a different MJPEG stream, set MJPEG_URL env var:`);
  console.log(`   MJPEG_URL=http://your-stream-url npm run dev\n`);
});

process.on('SIGINT', () => {
  console.log('\n\nShutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\nShutting down server...');
  process.exit(0);
});

