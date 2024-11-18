import { client } from '@/sanity/lib/client'
import { NEWS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import NewsCard, { StartupTypeCard } from './NewsCard'

const UserNews = async ({id} : {id: string}) => {
    const news = await client.fetch(NEWS_BY_AUTHOR_QUERY, {id})

  return (
    <>
    {news.length > 0 ? news.map((startup: StartupTypeCard) => (
        <NewsCard key={startup._id} post={startup} />
    )) : (
        <p className="no-result">No news yet</p>
    )}
    </>
  )
}

export default UserNews