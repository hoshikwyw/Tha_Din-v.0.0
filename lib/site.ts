/**
 * Canonical site identity, used for metadata, Open Graph, sitemap and robots.
 *
 * `metadataBase` needs an absolute origin to turn the relative image paths in
 * each page's metadata into absolute URLs — social crawlers reject relative
 * ones, so without this every shared link loses its preview image.
 */
const resolveSiteUrl = (): string => {
  // Explicit configuration always wins.
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  // Vercel exposes the stable production domain here, which is what should end
  // up in canonical URLs — not the per-deployment VERCEL_URL.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3004";
};

export const siteConfig = {
  name: "Tha Din",
  title: "Tha Din — Curated News Highlights",
  description:
    "Curated news covering the conflict in Myanmar, alongside technology, healthcare and industry developments.",
  url: resolveSiteUrl(),
  locale: "en_US",
} as const;

/** Build an absolute URL for metadata and structured data. */
export const absoluteUrl = (path: string): string =>
  new URL(path, siteConfig.url).toString();
