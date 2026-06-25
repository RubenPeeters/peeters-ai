import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://peeters.ai',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'nl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          nl: 'nl-BE',
        },
      },
    }),
  ],
});
