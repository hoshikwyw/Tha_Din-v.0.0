import { formatDate } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { NEWS_BY_ID_QUERY, PLAYLIST_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import NewsCard, { StartupTypeCard } from "@/components/NewsCard";

const md = markdownit();

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  // const post = await client.fetch(NEWS_BY_ID_QUERY, {id})

  const [post, { select: suggestPosts }] = await Promise.all([
    client.fetch(NEWS_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, {
      slug: "hot-feed",
    }),
  ]);

  if (!post) return notFound();

  const parsedContent = md.render(post?.pitch || "");

  // console.log(suggestPosts,">>>>");

  return (
    <div>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <div className=" w-full flex justify-center">
          <Image
            src={post.image}
            alt="thumbnail"
            width={300}
            height={300}
            className=" rounded-xl"
          />
        </div>
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post.author?._id}`}
              className=" flex gap-2 items-center mb-3"
            >
              {post.author?.image && (
                <Image
                  src={post.author?.image}
                  alt="profile"
                  width={64}
                  height={64}
                  className=" border border-black rounded-full drop-shadow-lg"
                />
              )}
              <div>
                <p className="text-20-medium">{post.author.name}</p>
                <p className="text-16-medium !text-secondary">
                  @{post.author.username}
                </p>
              </div>
            </Link>

            <div className="flex gap-1.5">
              <p className="category-tag">{post.category}</p>
            </div>
          </div>

          {/* <h3 className="text-30-bold !text-white-100">
            News Details
          </h3> */}
          {parsedContent ? (
            <article
              className=" prose max-w-4xl font-work-sans break-all !text-black"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        {suggestPosts.length > 0 && (
          <div className=" max-w-4xl mx-auto">
            <p className=" text-30-semibold">Suggest Posts for you</p>

            <ul className=" mt-7 card_grid-sm">
              {suggestPosts.map((post: StartupTypeCard, i: number) => (
                <NewsCard key={i} post={post} />
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

export default page;
