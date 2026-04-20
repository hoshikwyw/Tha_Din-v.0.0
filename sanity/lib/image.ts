import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

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
  if (typeof source === "string") return source;
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
