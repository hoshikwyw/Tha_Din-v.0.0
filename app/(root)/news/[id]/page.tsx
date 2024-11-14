import { formatDate } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { NEWS_BY_ID_QUERY } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import markdownit from 'markdown-it'
import { Skeleton } from '@/components/ui/skeleton'
import View from '@/components/View'

const md = markdownit()

export const experimental_ppr = true


const page = async ({params} : {params: Promise<{id: string}>}) => {
    const id = (await params).id

    const post = await client.fetch(NEWS_BY_ID_QUERY, {id})

    if(!post) return notFound()

    const parsedContent = md.render(post?.pitch || '')


  return (
    <div>
      <section className='pink_container !min-h-[230px]'>
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post.description}</p>
      </section>
      <section className="section_container">
        <Image src={post.image} alt="thumbnail" width={1000} height={1000} className=' rounded-xl w-full h-auto' />
        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">

            <Link href={`/user/${post.author?._id}`} className=' flex gap-2 items-center mb-3'>
            {post.author?.image && (
              <Image src={post.author?.image} alt="profile" width={64} height={64} className="rounded-full drop-shadow-lg" />
            )}
              <div>
                <p className='text-20-medium'>{post.author.name}</p>
                <p className='text-16-medium !text-accent'>@{post.author.username}</p>
              </div>
            </Link>

            <div className="flex gap-1.5">
              <p className="category-tag">{post.category}</p>
            </div>
          </div>

          <h3 className="text-30-bold !text-white-100">
            News Details
          </h3>
          {parsedContent ? (
            <article className=' prose max-w-4xl font-work-sans break-all !text-white' dangerouslySetInnerHTML={{__html: parsedContent}} />
          ) : (
            <p className="no-result">No details provided</p>
          )}
        </div>
        <hr className="divider" />

        {/* TODO : EDITOR SELECTED STARTUPS  */}

        <Suspense fallback={<Skeleton className='view_skeleton'/>}>
          <View id={id} />
        </Suspense>
      </section>

    </div>
  )
}

export default page