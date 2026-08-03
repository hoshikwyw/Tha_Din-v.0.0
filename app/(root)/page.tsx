import NewsCard, { NewsCardType } from "@/components/NewsCard";
import SearchForm from "@/components/SearchForm";
import { sanityFetch } from "@/sanity/lib/live";
import { newsQuery } from "@/sanity/lib/queries";

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
        <p className="text-30-semibold text-white">
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
