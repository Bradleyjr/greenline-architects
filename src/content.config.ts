import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(['Residential', 'Commercial', 'Civic']),
    location: z.string(),
    year: z.number(),
    sqft: z.string(),
    description: z.string(),
    heroImage: image(),
    galleryImages: z.array(image()),
    featured: z.boolean(),
  }),
});

export const collections = { projects };
