/**
 * Unified project data layer
 *
 * This module demonstrates the CMS integration pattern:
 * - Fetches projects from Storyblok (CMS source)
 * - Falls back to local content collections (file source)
 * - Returns a normalized shape regardless of source
 *
 * When pitching this to the team, the key insight is:
 * components never change — only this data layer swaps out.
 */

import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';

export interface NormalizedProject {
  title: string;
  slug: string;
  category: string;
  location: string;
  year: number;
  sqft: string;
  description: string;
  heroImage: ImageMetadata | string;
  galleryImages: (ImageMetadata | string)[];
  featured: boolean;
  source: 'storyblok' | 'local';
  /** Raw Storyblok blok data (only present for CMS-sourced projects) */
  storyblokContent?: any;
}

/**
 * Fetch projects from Storyblok CDN API
 */
async function fetchStoryblokProjects(token: string): Promise<NormalizedProject[]> {
  try {
    const res = await fetch(
      `https://api.storyblok.com/v2/cdn/stories?token=${token}&version=draft&starts_with=projects/&content_type=project&per_page=100`
    );

    if (!res.ok) return [];

    const data = await res.json();
    const stories = data.stories || [];

    return stories.map((story: any) => ({
      title: story.content.title || story.name,
      slug: story.slug,
      category: story.content.category || 'Commercial',
      location: story.content.location || '',
      year: Number(story.content.year) || new Date().getFullYear(),
      sqft: story.content.sqft || '',
      description: story.content.description || '',
      heroImage: story.content.hero_image?.filename
        ? `${story.content.hero_image.filename}/m/800x600/filters:quality(75):format(webp)`
        : '',
      galleryImages: (story.content.gallery || []).map((img: any) =>
        `${img.filename}/m/800x600/filters:quality(75):format(webp)`
      ),
      featured: story.content.featured ?? true,
      source: 'storyblok' as const,
      storyblokContent: story.content,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch projects from local content collections
 */
async function fetchLocalProjects(): Promise<NormalizedProject[]> {
  const entries = await getCollection('projects');
  return entries.map(entry => ({
    title: entry.data.title,
    slug: entry.data.slug,
    category: entry.data.category,
    location: entry.data.location,
    year: entry.data.year,
    sqft: entry.data.sqft,
    description: entry.data.description,
    heroImage: entry.data.heroImage,
    galleryImages: entry.data.galleryImages,
    featured: entry.data.featured,
    source: 'local' as const,
  }));
}

/**
 * Get all projects — CMS first, local fallback
 *
 * If Storyblok has projects, those are used.
 * Local content collections fill in the rest (or serve as the
 * complete source when no CMS content exists yet).
 */
export async function getAllProjects(): Promise<NormalizedProject[]> {
  const token = import.meta.env.STORYBLOK_TOKEN;

  // Try Storyblok first
  const cmsProjects = token ? await fetchStoryblokProjects(token) : [];

  if (cmsProjects.length > 0) {
    console.log(`[CMS] Loaded ${cmsProjects.length} projects from Storyblok`);
    // Merge: CMS projects take priority, local fills gaps
    const localProjects = await fetchLocalProjects();
    const cmsSlugs = new Set(cmsProjects.map(p => p.slug));
    const localOnly = localProjects.filter(p => !cmsSlugs.has(p.slug));

    return [...cmsProjects, ...localOnly];
  }

  // Fallback to local content collections
  return fetchLocalProjects();
}

/**
 * Get a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<NormalizedProject | undefined> {
  const all = await getAllProjects();
  return all.find(p => p.slug === slug);
}

/**
 * Get featured projects only
 */
export async function getFeaturedProjects(): Promise<NormalizedProject[]> {
  const all = await getAllProjects();
  return all.filter(p => p.featured);
}
