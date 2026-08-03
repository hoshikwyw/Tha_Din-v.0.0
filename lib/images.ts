/**
 * Hosts the Next.js image optimiser accepts. This is the single source of truth:
 * `next.config.ts` builds its `remotePatterns` from this list.
 *
 * It has to be enforced in app code too. Rendering `next/image` with a src whose
 * host is missing from `remotePatterns` throws during render and takes the whole
 * page down — so unknown hosts are filtered to a fallback rather than trusted.
 * This matters because news documents predating the image-asset schema still
 * hold arbitrary external URLs.
 */
export const ALLOWED_IMAGE_HOSTS = [
  "cdn.sanity.io", // Sanity asset CDN — every uploaded image
  "avatars.githubusercontent.com", // GitHub profile pictures from the auth provider
] as const;

export const isAllowedImageSrc = (src: string | null | undefined): boolean => {
  if (!src) return false;

  // Inline data URIs (our fallback placeholder) and same-origin paths are fine.
  if (src.startsWith("data:") || src.startsWith("/")) return true;

  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== "https:") return false;
    return (ALLOWED_IMAGE_HOSTS as readonly string[]).includes(hostname);
  } catch {
    return false;
  }
};
