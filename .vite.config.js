// vite.config.js
import { defineConfig } from 'vite';
import netlifyEdge from '@netlify/vite-plugin-netlify-edge';

export default defineConfig({
  plugins: [netlifyEdge()],
});
