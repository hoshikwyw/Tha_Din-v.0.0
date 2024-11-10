import SearchForm from "@/components/SearchForm";

export default async function Home({searchParams}: {
  searchParams: Promise<{ query: string }>
}) {
    const query = (await searchParams).query

  return (
    <>
    <section className="pink_container">
      <h1 className="heading">Collection of the news of Civil War in Myanmar</h1>
      <p className="sub-heading !max-w-3xl">What happening in Myanmar during the Civil War</p>
      <SearchForm query={query} />
    </section>
    </>
  );
}
