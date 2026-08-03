import type { Metadata } from "next";
import NewsCard, { NewsCardType } from "@/components/NewsCard";
import SearchForm from "@/components/SearchForm";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/live";
import { newsQuery } from "@/sanity/lib/queries";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}): Promise<Metadata> {
  const query = (await searchParams).query;

  // Search result pages are excluded from the index: they are effectively
  // infinite, thin, and duplicate the content of the pages they link to.
  if (query) {
    return {
      title: `Search results for "${query}"`,
      robots: { index: false, follow: true },
      alternates: { canonical: absoluteUrl("/") },
    };
  }

  return {
    // `absolute` bypasses the root layout's `%s | Tha Din` template, which
    // would otherwise render "Tha Din — Curated News Highlights | Tha Din".
    title: { absolute: siteConfig.title },
    description: siteConfig.description,
    alternates: { canonical: absoluteUrl("/") },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const { data: posts } = await sanityFetch({
    query: newsQuery,
    params: { search: query || null },
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Curated News Highlights: Stories that Spark Curiosity and Innovation
        </h1>
        <p className="sub-heading !max-w-3xl">
          Discover a curated selection of engaging and insightful news stories
          spanning the latest in technology, healthcare, and industry trends.
          This collection highlights breakthrough innovations, transformative
          advancements, and impactful developments shaping the future across
          various sectors. Dive in to stay informed and inspired by news that
          matters.
        </p>
        <SearchForm query={query ?? ""} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search result for "${query}"` : "All news"}
        </p>
        {/* The empty state lives outside the <ul>: a bare <p> is not valid as a
            direct child of a list, and an empty <ul> is meaningless to a
            screen reader. */}
        {posts?.length > 0 ? (
          <ul className="mt-7 card_grid">
            {posts.map((post: NewsCardType) => (
              <NewsCard key={post?._id} post={post} />
            ))}
          </ul>
        ) : (
          <p className="no-result mt-7">No news found</p>
        )}
      </section>
    </>
  );
}
