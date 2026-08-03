import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

/**
 * Revalidation window for public content reads.
 *
 * These fetches previously had no caching directive at all, so every request
 * hit Sanity and each page render was fully dynamic. A short window keeps the
 * site feeling live while letting Next serve most requests from cache.
 *
 * Anything that must always be current (view counts, admin screens reading back
 * their own writes) opts out with `cache: "no-store"` instead.
 */
export const CONTENT_REVALIDATE_SECONDS = 60

export const contentCache = {
  next: { revalidate: CONTENT_REVALIDATE_SECONDS },
} as const
