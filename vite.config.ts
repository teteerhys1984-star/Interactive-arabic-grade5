/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages repository deployment base path
  base: '/Interactive-arabic-grade5/',
  server: {
    host: '0.0.0.0',
    // Arena's live preview is proxied from a per-session *.e2b.app host.
    allowedHosts: ['.e2b.app'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // CSS is processed so tests can assert the design-system contract of the
    // stylesheet they render against (e.g. the 44px minimum check button).
    css: true,
  },
});
