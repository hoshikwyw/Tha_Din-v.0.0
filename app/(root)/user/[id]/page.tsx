import type { Metadata } from 'next'
import { auth } from '@/auth'
import ImageWithFallback from '@/components/ImageWithFallback'
import { NewsCardSkeleton } from '@/components/NewsCard'
import UserNews from '@/components/UserNews'
import { absoluteUrl, siteConfig } from '@/lib/site'
import { getAuthorById } from '@/sanity/lib/fetchers'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const user = await getAuthorById(id)

  if (!user) {
    return { title: 'Author not found', robots: { index: false, follow: false } }
  }

  const name = user.name ?? user.username ?? 'Author'
  const description = user.bio || `Stories written by ${name} on ${siteConfig.name}.`

  return {
    title: name,
    description,
    alternates: { canonical: absoluteUrl(`/user/${id}`) },
    openGraph: {
      type: 'profile',
      title: name,
      description,
      url: absoluteUrl(`/user/${id}`),
      siteName: siteConfig.name,
      images: user.image ? [user.image] : undefined,
    },
  }
}

const UserProfilePage = async ({params}: {params: Promise<{id: string}>}) => {
  const id = (await params).id
  const session = await auth()

  const user = await getAuthorById(id)
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

          <ImageWithFallback src={user?.image} alt={user?.name ?? "profile"} width={220} height={220} className='profile_image' />

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

export default UserProfilePage