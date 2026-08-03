import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { client, contentCache } from "@/sanity/lib/client";
import { getNewsById } from "@/sanity/lib/fetchers";
import { PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { resolveCategoryTitle, resolveImageUrl } from "@/sanity/lib/image";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import NewsCard, { NewsCardType } from "@/components/NewsCard";

const md = markdownit();

/** 1200x630 is the aspect ratio Facebook, X and LinkedIn all crop to. */
const ogImageFor = (image: unknown) =>
  resolveImageUrl(image, { width: 1200, height: 630 });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  // Memoised, so this does not cost a second Sanity round trip — the page
  // component below calls the same fetcher.
  const post = await getNewsById(id);

  if (!post) {
    return { title: "Story not found", robots: { index: false, follow: false } };
  }

  const url = absoluteUrl(`/news/${id}`);
  const image = ogImageFor(post.image);
  const description = post.description ?? siteConfig.description;

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title ?? siteConfig.name,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: post._createdAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: image ? [{ url: image, width: 1200, height: 630, alt: post.title ?? "" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title ?? siteConfig.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

const NewsDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const id = (await params).id;

  const [post, playlist] = await Promise.all([
    getNewsById(id),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: "hot-feed" }, contentCache),
  ]);

  if (!post) return notFound();

  const suggestPosts = playlist?.select ?? [];
  const parsedContent = sanitizeHtml(md.render(post?.pitch || ""));
  const thumbnail = resolveImageUrl(post.image, { width: 600, height: 600 });

  // NewsArticle structured data — what makes an article eligible for Google
  // News and rich results. `dateModified` reuses `_createdAt` because the
  // GROQ query does not select `_updatedAt`; adding a field there would
  // invalidate the generated query types until `npm run typegen` reruns.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    datePublished: post._createdAt,
    dateModified: post._createdAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/news/${id}`) },
    ...(ogImageFor(post.image) ? { image: [ogImageFor(post.image)] } : {}),
    ...(post.author?.name
      ? {
          author: {
            "@type": "Person",
            name: post.author.name,
            url: absoluteUrl(`/user/${post.author._id}`),
          },
        }
      : {}),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    ...(resolveCategoryTitle(post.category)
      ? { articleSection: resolveCategoryTitle(post.category) }
      : {}),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        // Serialised from trusted CMS fields only; JSON.stringify escapes the
        // values, and `<` is escaped to close off `</script>` injection.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>

      <section className="section_container">
        {thumbnail && (
          <div className="w-full flex justify-center">
            <ImageWithFallback
              src={thumbnail}
              alt={post.title ?? "News thumbnail"}
              width={300}
              height={300}
              className="rounded-xl"
            />
          </div>
        )}

        <div className="space-y-5 mt-8 sm:mt-10 max-w-4xl mx-auto">
          {/* Stacks on phones: side-by-side, the author block and the category
              pill were crushing each other at narrow widths. */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <Link
              href={`/user/${post.author?._id}`}
              className="flex gap-2 items-center min-w-0"
            >
              <ImageWithFallback
                src={post.author?.image}
                alt={post.author?.name ?? "profile"}
                width={64}
                height={64}
                className="border border-black rounded-full drop-shadow-lg shrink-0"
              />
              <div className="min-w-0">
                <p className="text-20-medium truncate">{post.author?.name}</p>
                <p className="text-16-medium !text-secondary truncate">
                  @{post.author?.username}
                </p>
              </div>
            </Link>

            {resolveCategoryTitle(post.category) && (
              <div className="flex gap-1.5 shrink-0">
                <p className="category-tag">
                  {resolveCategoryTitle(post.category)}
                </p>
              </div>
            )}
          </div>

          {parsedContent ? (
            <article
              className="prose max-w-4xl font-work-sans break-words !text-black"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {suggestPosts.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <p className="text-30-semibold">Suggest Posts for you</p>
            <ul className="mt-7 card_grid-sm">
              {suggestPosts.map((suggested: NewsCardType) => (
                <NewsCard key={suggested._id} post={suggested} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
      </section>
    </div>
  );
};

export default NewsDetailPage;
