import { requireAdmin } from '@/lib/admin'
import StartupForm from '@/components/StartupForm'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { client } from '@/sanity/lib/client'
import { CATEGORIES_QUERY } from '@/sanity/lib/queries'

const CreateNewsPage = async () => {
    // Publishing is admin-only. This mirrors the gate in `createPitch`; the
    // action enforces it too, since a redirect here is only a UI convenience.
    const session = await requireAdmin()
    if (!session) redirect('/')

    // Must include a category created seconds ago on the /categories screen.
    const categories = await client
        .withConfig({ useCdn: false })
        .fetch(CATEGORIES_QUERY, {}, { cache: 'no-store' })

  return (
    <>
        <section className="pink_container !min-h-[230px]">
            <h1 className="heading">Create Your News</h1>
        </section>
        {categories.length === 0 && (
            <p className="max-w-3xl mx-auto mt-6 px-4 sm:px-6 text-center">
                No categories exist yet.{" "}
                <Link href="/categories" className="underline font-semibold">
                    Create one first
                </Link>
                .
            </p>
        )}
        <StartupForm categories={categories} />
    </>
  )
}

export default CreateNewsPage
