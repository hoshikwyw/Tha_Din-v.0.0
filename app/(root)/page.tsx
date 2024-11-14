/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/auth";
import NewsCard,{StartupTypeCard} from "@/components/NewsCard";
import SearchForm from "@/components/SearchForm";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { newsQuery } from "@/sanity/lib/queries";

export default async function Home({searchParams}: {
  searchParams: Promise<{ query: string }>
}) {
    const query = (await searchParams).query
    const params = {search: query || null}
    const session = await auth()

    console.log(session?.id);
    
    // const posts = await client.fetch(newsQuery)
    const {data: posts} = await sanityFetch({query: newsQuery, params})

    // const posts = [
    //   {
    //     _createdAt: new Date(),
    //     views: 55,
    //     author: {_id: 1,name: "Oro"},
    //     _id: 1,
    //     description: "This is a description",
    //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7NOCw5TXI8NQAQ6cswIYCuRVE9TtjAbggQ&s",
    //     category: "Weather",
    //     title: "Today Weather News"
    //   }
    // ]

  return (
    <>
    <section className="pink_container">
      <h1 className="heading">Curated News Highlights: Stories that Spark Curiosity and Innovation</h1>
      <p className="sub-heading !max-w-3xl">Discover a curated selection of engaging and insightful news stories spanning the latest in technology, healthcare, and industry trends. This collection highlights breakthrough innovations, transformative advancements, and impactful developments shaping the future across various sectors. Dive in to stay informed and inspired by news that matters.</p>
      <SearchForm query={query} />
    </section>
    <section className="section_container">
      <p className="text-30-semibold text-white">
        {query ? `Search result for "${query}"` : "All news"}
      </p>
      <ul className="mt-7 card_grid">
        {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard, index: number) => (
              <NewsCard key={post?._id} post={post} />
            ))
        ) : (
            <p className="no-result">No news found</p>
        )}
      </ul>
    </section>
    <SanityLive />
    </>
  );
}
