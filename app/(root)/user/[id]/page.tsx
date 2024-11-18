import { auth } from '@/auth'
import { NewsCardSkeleton } from '@/components/NewsCard'
import UserNews from '@/components/UserNews'
import { client } from '@/sanity/lib/client'
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

export const experimental_ppr = true

const page = async ({params}: {params: Promise<{id: string}>}) => {
  const id = (await params).id
  const session = await auth()

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, {id})
  if(!user) return notFound()

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="text-24-black uppercase text-center line-clamp-1">
              {user.name}
            </h3>
          </div>

          <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzuXm5Lc874YeX7ti9YruxTleQ8V1YJtqkEA&s" alt="profile" width={220} height={220} className='profile_image' />

          <p className="text-30-extrabold mt-7 text-center">
            @{user?.username}
          </p>

          <p className=" mt-1 text-center text-14-normal">
            {user?.bio}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
          <p className="text-30-bold">
            {session?.id === id ? "Your": "All"} News
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<NewsCardSkeleton />}>
              <UserNews id={id} />
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  )
}

export default page