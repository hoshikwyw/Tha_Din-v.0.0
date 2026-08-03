import { client, contentCache } from '@/sanity/lib/client'
import { NEWS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import NewsCard, { StartupTypeCard } from './NewsCard'

const UserNews = async ({id} : {id: string}) => {
    const news = await client.fetch(NEWS_BY_AUTHOR_QUERY, {id}, contentCache)

  return (
    <>
    {news.length > 0 ? news.map((startup: StartupTypeCard) => (
        <NewsCard key={startup._id} post={startup} />
    )) : (
        // Rendered into the parent's <ul>, so the empty state has to be an <li>.
        <li className="no-result list-none">No news yet</li>
    )}
    </>
  )
}

export default UserNews