import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'
import { isAllowedImageSrc } from '@/lib/images'

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

/**
 * Safely resolve a news image to a URL string, regardless of whether it is a
 * Sanity image asset (new schema) or a plain URL string (legacy schema).
 * Returns null when nothing usable is present.
 */
export const resolveImageUrl = (
  source: unknown,
  opts?: { width?: number; height?: number },
): string | null => {
  if (!source) return null;
  // Legacy documents store a bare URL string pointing at an arbitrary host.
  // Anything outside the optimiser allowlist is dropped so the caller renders a
  // fallback instead of crashing the page.
  if (typeof source === "string") {
    return isAllowedImageSrc(source) ? source : null;
  }
  if (typeof source === "object") {
    try {
      let b = builder.image(source as SanityImageSource);
      if (opts?.width) b = b.width(opts.width);
      if (opts?.height) b = b.height(opts.height);
      return b.url();
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Category on a news doc may be either a dereferenced object (new schema:
 * { _id, title, slug }) or a plain string (legacy schema). Return the display
 * title in either case.
 */
export const resolveCategoryTitle = (source: unknown): string | null => {
  if (!source) return null;
  if (typeof source === "string") return source;
  if (typeof source === "object" && "title" in (source as Record<string, unknown>)) {
    return (source as { title?: string | null }).title ?? null;
  }
  return null;
};

/**
 * Category slug, used to build `/?category=<slug>` filter links. Legacy
 * documents store the category as a plain title string with no slug, so those
 * return null and the caller falls back to a plain (unlinked) label.
 */
export const resolveCategorySlug = (source: unknown): string | null => {
  if (!source || typeof source !== "object") return null;
  const slug = (source as { slug?: { current?: string | null } | null }).slug;
  return slug?.current ?? null;
};
