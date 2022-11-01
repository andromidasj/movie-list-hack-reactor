import importMetaEnv from '@import-meta-env/unplugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), importMetaEnv.vite({ example: '.env.example.public' })],
  server: {
    host: true,
  },
  envPrefix: [],
});
