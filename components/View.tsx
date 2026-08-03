import React from 'react'
import Ping from './Ping'
import { client } from '@/sanity/lib/client'
import { NEWS_VIEWS_QUERY } from '@/sanity/lib/queries'
import { writeClient } from '@/sanity/lib/write-client'
import { after } from 'next/server'

const View = async ({ id }: { id: string }) => {
    // View counts must never be served from cache, or every reader sees the
    // same stale number and the increment below compounds the staleness.
    const result = await client
        .withConfig({ useCdn: false })
        .fetch(NEWS_VIEWS_QUERY, { id }, { cache: 'no-store' })

    const totalViews = result?.views ?? 0

    after(async () => {
        try {
            // `inc` is applied atomically by Sanity. The previous version read
            // the count and wrote back `totalViews + 1`, so two readers loading
            // the page at once both wrote the same value and one view was lost.
            await writeClient
                .patch(id)
                .setIfMissing({ views: 0 })
                .inc({ views: 1 })
                .commit()
        } catch (error) {
            // A failed counter update must not surface as a page error.
            console.error('[View] failed to increment view count', error)
        }
    })

    return (
        <div className='view-container'>
            <div className="absolute -top-2 -right-2">
                <Ping />
            </div>
            <p className="view-text">
                <span className="font-black">Views : {totalViews}</span>
            </p>
        </div>
    )
}

export default View
