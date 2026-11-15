// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { site, missingContent } from './src/config/site.ts';

/** Prints a reminder of the Dipikaa details still to be filled in (see src/config/site.ts). */
/** @type {import('astro').AstroIntegration} */
const contentChecklist = {
  name: 'content-checklist',
  hooks: {
    'astro:build:done': ({ logger }) => {
      const missing = missingContent();
      if (!missing.length) return logger.info('All site content is filled in.');
      logger.warn(
        `Content still to add in src/config/site.ts (${missing.length}):\n` + missing.map((m) => `  • ${m}`).join('\n'),
      );
    },
  },
};

// https://astro.build/config
export default defineConfig({
  // The public URL of the site. Used for canonical URLs, Open Graph tags and the sitemap.
  // Change it in src/config/site.ts once the domain is known.
  site: site.url,
  trailingSlash: 'ignore',
  integrations: [preact(), sitemap({ filter: (page) => !page.includes('/404') }), contentChecklist],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
