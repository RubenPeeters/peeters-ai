import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const themes = ['cultural-heritage', 'knowledge-graphs', 'biomonitoring', 'network-security'] as const;

const papers = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    venue: z.string(),
    year: z.number().int(),
    themes: z.array(z.enum(themes)).min(1),
    status: z.enum(['published', 'accepted', 'preprint']).default('published'),
    links: z
      .object({
        doi: z.string().url().optional(),
        pdf: z.string().url().optional(),
        scholar: z.string().url().optional(),
        url: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    citation: z
      .object({
        bibtex: z.string(),
      })
      .optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.object({
      en: z.string(),
      nl: z.string(),
    }),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    year: z.union([z.number().int(), z.string()]),
    sortKey: z.number().int(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { papers, projects };
export const THEMES = themes;
export type Theme = (typeof themes)[number];
