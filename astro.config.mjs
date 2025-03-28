// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/consts';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import { shield } from '@kindspells/astro-shield';
import expressiveCode from 'astro-expressive-code';
import { resolve } from 'node:path';

const rootDir = new URL('.', import.meta.url).pathname;
const modulePath = resolve(rootDir, 'src', 'generated', 'sriHashes.mjs');

export default defineConfig({
  site: SITE.CANONICAL_URL,
  output: 'static',
  integrations: [
    sitemap(),
    svelte(),
    shield({
      sri: { hashesModule: modulePath },
    }),
    expressiveCode(),
  ],
});
