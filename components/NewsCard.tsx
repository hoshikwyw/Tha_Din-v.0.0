/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const NewsCard = ({post}: {post: StartupTypeCard}) => {
    const {_createdAt, views, author: {_id: authorId, name}, title, category, _id, image, description} = post

  return (
    <li className='startup-card group'>
        <div className="flex-between">
            <p className="startupp_card_date">
                {formatDate(_createdAt)}
            </p>

            <div className="flex gap-1.5">
                <EyeIcon className='size-6 text-primary' />
                <span className='text-16-medium'>{views}</span>
            </div>

        </div>
        <div className="flex-between mt-5 gap-5">
                <div className="flex-1">
                    <Link href={`/user/${authorId}`}>
                        <p className="text-16-medium line-clamp-1">
                            {name}
                        </p>
                    </Link>
                    <Link href={`/news/${_id}`}>
                        <h3 className="text-26-semibold line-clamp-1">{title}</h3>
                    </Link>
                </div>
                <Link href={`/user/${authorId}`}>
                    <Image src="https://placehold.co/48" alt="placeholder" width={48} height={48} className="rounded-full" />
                </Link>
        </div>
        <Link href={`/news/${_id}`}>
            <p className="startup-card_desc">{description}</p>
            <Image src={image} alt='Image' className='startup-card_img' width={500} height={500} />
        </Link>
        <div className="flex-between gap-3 mt-5">
            <Link href={`/?query=${category.toLowerCase()}`}>
                <p className="text-16-medium">{category}</p>
            </Link>
            <Button className='startup-card_btn' asChild>
                <Link href={`/news/${_id}`}>Details</Link>
            </Button>
        </div>
    </li>
  )
}

export default NewsCard