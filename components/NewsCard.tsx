import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import React from "react";
import { Author, Category, News } from "@/sanity/types";
import { Skeleton } from "./ui/skeleton";
import {
  resolveCategorySlug,
  resolveCategoryTitle,
  resolveImageUrl,
} from "@/sanity/lib/image";

export type NewsCardType = Omit<News, "author" | "category"> & {
  author?: Author;
  category?: Pick<Category, "_id" | "title" | "slug"> | null;
};

/**
 * Editorial card: image, meta line, headline, excerpt, then a hairline footer
 * with author and views.
 *
 * The previous layout led with a date pill and the author's name above the
 * headline, and closed with a "Details" button duplicating links the card
 * already had. Leading with the image and headline is both the conventional
 * reading order for news and a much calmer composition.
 */
const NewsCard = ({ post }: { post: NewsCardType }) => {
  const { _createdAt, views, author, title, category, _id, image, description } =
    post;

  const categoryTitle = resolveCategoryTitle(category);
  const categorySlug = resolveCategorySlug(category);
  const href = `/news/${_id}`;

  return (
    <li className="news-card group">
      <Link href={href} className="news-card_media" tabIndex={-1} aria-hidden="true">
        <ImageWithFallback
          src={resolveImageUrl(image, { width: 800, height: 500 })}
          alt=""
          className="news-card_img"
          width={800}
          height={500}
          // Fluid inside a 1/2/3/4-column grid. Without `sizes` the browser
          // assumes 100vw and pulls the largest srcset candidate.
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
      </Link>

      <div className="news-card_body">
        <div className="news-card_meta">
          {categoryTitle &&
            (categorySlug ? (
              <Link
                href={`/?category=${encodeURIComponent(categorySlug)}`}
                className="news-card_category"
              >
                {categoryTitle}
              </Link>
            ) : (
              <span className="news-card_category">{categoryTitle}</span>
            ))}
          {categoryTitle && <span aria-hidden="true">&middot;</span>}
          <time dateTime={_createdAt} className="news-card_date">
            {formatDate(_createdAt)}
          </time>
        </div>

        <h3 className="news-card_title">
          <Link href={href}>{title}</Link>
        </h3>

        {description && <p className="news-card_desc">{description}</p>}

        <div className="news-card_footer">
          <Link href={`/user/${author?._id}`} className="news-card_author">
            <ImageWithFallback
              src={author?.image}
              alt=""
              width={24}
              height={24}
              className="rounded-full border border-border shrink-0"
            />
            <span className="truncate">{author?.name}</span>
          </Link>

          <span className="news-card_views">
            <EyeIcon className="size-4" aria-hidden="true" />
            {views ?? 0}
            <span className="sr-only"> views</span>
          </span>
        </div>
      </div>
    </li>
  );
};

export const NewsCardSkeleton = () => (
  <>
    {[0, 1, 2, 3, 4].map((index) => (
      <li key={index}>
        <Skeleton className="news-card_skeleton" />
      </li>
    ))}
  </>
);

export default NewsCard;
