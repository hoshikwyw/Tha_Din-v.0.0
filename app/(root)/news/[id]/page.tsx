import type { Metadata } from "next";
import { formatDate } from "@/lib/utils";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { client, contentCache } from "@/sanity/lib/client";
import { getNewsById } from "@/sanity/lib/fetchers";
import { PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import {
  resolveCategorySlug,
  resolveCategoryTitle,
  resolveImageUrl,
} from "@/sanity/lib/image";
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
  // 16:9 to match how it renders — the old 600x600 square was being letterboxed.
  const thumbnail = resolveImageUrl(post.image, { width: 1200, height: 675 });

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
      <section className="pink_container">
        {resolveCategoryTitle(post.category) &&
          (resolveCategorySlug(post.category) ? (
            <Link
              href={`/?category=${encodeURIComponent(resolveCategorySlug(post.category)!)}`}
              className="tag hover:opacity-75 transition-opacity"
            >
              {resolveCategoryTitle(post.category)}
            </Link>
          ) : (
            <p className="tag">{resolveCategoryTitle(post.category)}</p>
          ))}
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading">{post.description}</p>

        {/* Byline moved into the header, where a reader looks for it. */}
        <div className="mt-8 flex items-center gap-3">
          <Link
            href={`/user/${post.author?._id}`}
            className="flex gap-2.5 items-center min-w-0 transition-opacity hover:opacity-75"
          >
            <ImageWithFallback
              src={post.author?.image}
              alt=""
              width={36}
              height={36}
              className="rounded-full border border-border shrink-0"
            />
            <span className="text-[15px] font-semibold text-black truncate">
              {post.author?.name}
            </span>
          </Link>
          <span className="text-black-100" aria-hidden="true">
            &middot;
          </span>
          <time dateTime={post._createdAt} className="text-[15px] text-black-100">
            {formatDate(post?._createdAt)}
          </time>
        </div>
      </section>

      <section className="section_container">
        {thumbnail && (
          <div className="max-w-4xl mx-auto overflow-hidden rounded-xl border border-border bg-muted">
            <ImageWithFallback
              src={thumbnail}
              alt={post.title ?? "News thumbnail"}
              width={1200}
              height={675}
              className="w-full aspect-[16/9] object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="mt-10 max-w-2xl mx-auto">
          {parsedContent ? (
            <article
              className="prose prose-lg dark:prose-invert font-work-sans break-words
                         prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black
                         prose-a:text-secondary prose-a:font-medium
                         prose-img:rounded-lg prose-img:border prose-img:border-border
                         !text-black-100 prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>

        <hr className="divider" />

        {suggestPosts.length > 0 && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-26-semibold">More stories</h2>
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
