// vite.config.js
import { defineConfig } from 'vite';
import netlifyEdge from '@netlify/vite-plugin-netlify-edge';

export default defineConfig({
  manifest: true,
  build: {
    rollupOptions: {
      // overwrite default .html entry
      input: 'handler.js',
    },
  },
  plugins: [netlifyEdge()],
});
