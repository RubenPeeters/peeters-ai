import { defineConfig } from 'astro/config';

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
});
