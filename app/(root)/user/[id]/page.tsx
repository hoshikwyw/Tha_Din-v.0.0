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
        {/* Image leads now. The name used to sit in a slab pinned above the
            card with skewed black pseudo-elements behind it. */}
        <div className="profile_card">
          <ImageWithFallback
            src={user?.image}
            alt=""
            width={96}
            height={96}
            className="profile_image size-24"
          />

          <div className="profile_title">
            <h1 className="text-24-black line-clamp-2">{user.name}</h1>
          </div>

          <p className="eyebrow text-black-100">@{user?.username}</p>

          {user?.bio && <p className="mt-4 text-14-normal">{user.bio}</p>}
        </div>

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <h2 className="text-30-bold">
            {session?.id === id ? "Your" : "All"} News
          </h2>
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