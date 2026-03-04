// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://greenline-architects.vercel.app',
  output: 'server',
  adapter: vercel(),
  env: {
    schema: {
      STORYBLOK_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  integrations: [
    sitemap(),
    storyblok({
      accessToken: (process.env.STORYBLOK_TOKEN || '').trim(),
      components: {
        'project': 'storyblok/Project',
        'page': 'storyblok/Page',
        'homepage': 'storyblok/Homepage',
        'about_page': 'storyblok/AboutPage',
        'services_page': 'storyblok/ServicesPage',
        'contact_page': 'storyblok/ContactPage',
        'service_card': 'storyblok/ServiceCard',
        'testimonial': 'storyblok/Testimonial',
        'value_card': 'storyblok/ValueCard',
        'team_member': 'storyblok/TeamMemberBlok',
      },
      apiOptions: {
        region: 'eu',
      },
      livePreview: true,
    }),
  ],
});
