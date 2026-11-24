import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
// BASE_PATH is set by the Pages workflow (/web-development); locally the site is served from the root.
export default defineConfig({
  integrations: [preact()],
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  devToolbar: { enabled: false },
});
