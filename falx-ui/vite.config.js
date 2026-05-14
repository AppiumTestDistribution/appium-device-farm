import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: './device-farm/ui-assets',
  },
  server: {
    proxy: {
      '/device-farm': {
        target: 'http://localhost:4723',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
