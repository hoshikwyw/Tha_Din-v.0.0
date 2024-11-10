/* eslint-disable @typescript-eslint/no-unused-vars */
import NewsCard from "@/components/NewsCard";
import SearchForm from "@/components/SearchForm";

export default async function Home({searchParams}: {
  searchParams: Promise<{ query: string }>
}) {
    const query = (await searchParams).query

    const posts = [
      {
        _createdAt: new Date(),
        views: 55,
        author: {_id: 1,name: "Oro"},
        _id: 1,
        description: "This is a description",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7NOCw5TXI8NQAQ6cswIYCuRVE9TtjAbggQ&s",
        category: "Weather",
        title: "Today Weather News"
      }
    ]

  return (
    <>
    <section className="pink_container">
      <h1 className="heading">Collection of the news of Civil War in Myanmar</h1>
      <p className="sub-heading !max-w-3xl">What happening in Myanmar during the Civil War</p>
      <SearchForm query={query} />
    </section>
    <section className="section_container">
      <p className="text-30-semibold">
        {query ? `Search result for "${query}"` : "All news"}
      </p>
      <ul className="mt-7 card_grid">
        {posts?.length > 0 ? (
            posts.map((post: StartupCardType, index: number) => (
              <NewsCard key={post?._id} post={post} />
            ))
        ) : (
            <p className="no-results">No news found</p>
        )}
      </ul>
    </section>
    </>
  );
}
