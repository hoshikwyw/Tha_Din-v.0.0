import type { Metadata } from "next";
import NewsCard, { NewsCardType } from "@/components/NewsCard";
import NewsFilters, { type FilterCategory } from "@/components/NewsFilters";
import SearchForm from "@/components/SearchForm";
import { absoluteUrl, siteConfig } from "@/lib/site";
import {
  buildFilterHref,
  DEFAULT_SORT,
  parseSort,
  type ActiveFilters,
} from "@/lib/news-filters";
import { client, contentCache } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import {
  CATEGORIES_QUERY,
  NEWS_LATEST_QUERY,
  NEWS_POPULAR_QUERY,
} from "@/sanity/lib/queries";

type HomeSearchParams = {
  query?: string;
  category?: string;
  sort?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}): Promise<Metadata> {
  const { query, category, sort } = await searchParams;
  const activeSort = parseSort(sort);

  // Search results are effectively infinite, thin, and duplicate the pages they
  // link to, so they stay out of the index.
  if (query) {
    return {
      title: `Search results for "${query}"`,
      robots: { index: false, follow: true },
      alternates: { canonical: absoluteUrl("/") },
    };
  }

  // A category listing is a genuinely distinct, indexable page. A re-sort of
  // the same set is not — it points its canonical at the default ordering so
  // the two orderings don't compete as duplicates.
  const canonicalPath = buildFilterHref(
    { category, sort: DEFAULT_SORT },
    { sort: DEFAULT_SORT },
  );

  if (category) {
    return {
      title: `${category.replace(/-/g, " ")} news`,
      description: `The latest ${category.replace(/-/g, " ")} stories on ${siteConfig.name}.`,
      alternates: { canonical: absoluteUrl(canonicalPath) },
      robots: { index: activeSort === DEFAULT_SORT, follow: true },
    };
  }

  return {
    // `absolute` bypasses the root layout's `%s | Tha Din` template, which
    // would otherwise render "Tha Din — Curated News Highlights | Tha Din".
    title: { absolute: siteConfig.title },
    description: siteConfig.description,
    alternates: { canonical: absoluteUrl("/") },
    robots: { index: activeSort === DEFAULT_SORT, follow: true },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HomeSearchParams>;
}) {
  const { query, category, sort } = await searchParams;
  const activeSort = parseSort(sort);

  const active: ActiveFilters = { query, category, sort: activeSort };

  const [{ data: posts }, categories] = await Promise.all([
    sanityFetch({
      // Two literal queries instead of one parameterised `order()`, so
      // `sanity typegen` can still derive result types. See sanity/lib/queries.ts.
      query: activeSort === "popular" ? NEWS_POPULAR_QUERY : NEWS_LATEST_QUERY,
      params: {
        search: query || null,
        // `null` rather than `undefined`: the GROQ filter tests `defined($category)`,
        // and an absent param would be a missing-parameter error.
        category: category || null,
      },
    }),
    client.fetch<FilterCategory[]>(CATEGORIES_QUERY, {}, contentCache),
  ]);

  const activeCategory = categories?.find(
    (item) => item.slug?.current === category,
  );

  const heading = query
    ? `Search result for "${query}"`
    : activeCategory
      ? `${activeCategory.title} news`
      : activeSort === "popular"
        ? "Most read"
        : "All news";

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
        <SearchForm query={query ?? ""} category={category} sort={activeSort} />
      </section>

      <section className="section_container">
        <p className="text-30-semibold">{heading}</p>

        <NewsFilters
          categories={categories ?? []}
          active={active}
          total={posts?.length ?? 0}
        />

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
          <p className="no-result mt-7">
            No stories match these filters.
          </p>
        )}
      </section>
    </>
  );
}
