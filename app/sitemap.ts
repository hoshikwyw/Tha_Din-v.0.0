import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import {
  AUTHORS_SITEMAP_QUERY,
  NEWS_SITEMAP_QUERY,
} from "@/sanity/lib/queries";

/**
 * The result types are declared locally rather than inferred: `sanity typegen`
 * only regenerates on `npm run typegen` (wired to predev/prebuild), so a newly
 * added query is untyped until that runs.
 */
type SitemapDoc = { _id: string; _updatedAt: string };

// Rebuild the sitemap at most hourly rather than on every crawler request.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let news: SitemapDoc[] = [];
  let authors: SitemapDoc[] = [];

  try {
    [news, authors] = await Promise.all([
      client.fetch<SitemapDoc[]>(NEWS_SITEMAP_QUERY),
      client.fetch<SitemapDoc[]>(AUTHORS_SITEMAP_QUERY),
    ]);
  } catch (error) {
    // A Sanity outage should still yield a valid sitemap of static routes
    // rather than a 500 that makes crawlers drop the file entirely.
    console.error("[sitemap] failed to load documents", error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${siteConfig.url}/news/${item._id}`,
    lastModified: new Date(item._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const authorRoutes: MetadataRoute.Sitemap = authors.map((item) => ({
    url: `${siteConfig.url}/user/${item._id}`,
    lastModified: new Date(item._updatedAt),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...newsRoutes, ...authorRoutes];
}
