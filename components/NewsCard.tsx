import { formatDate } from "@/lib/utils";
import { EyeIcon } from "lucide-react";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
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

const NewsCard = ({ post }: { post: NewsCardType }) => {
  const { _createdAt, views, author, title, category, _id, image, description } =
    post;

  const categoryTitle = resolveCategoryTitle(category);
  const categorySlug = resolveCategorySlug(category);

  return (
    <li className="news-card group">
      <div className="flex-between">
        <p className="news-card_date">{formatDate(_createdAt)}</p>

        <div className="flex gap-1.5">
          <EyeIcon className="size-6 text-black" />
          <span className="text-16-medium">{views ?? 0}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author?.name}</p>
          </Link>
          <Link href={`/news/${_id}`}>
            <h3 className="text-26-semibold line-clamp-1">{title}</h3>
          </Link>
        </div>
        <Link href={`/user/${author?._id}`}>
          <ImageWithFallback
            src={author?.image}
            alt={author?.name ?? "author"}
            width={48}
            height={48}
            className="rounded-full border border-border"
          />
        </Link>
      </div>

      <Link href={`/news/${_id}`}>
        <p className="news-card_desc">{description}</p>
        {/* Wrapper clips the hover zoom to the image's rounded corners. */}
        <div className="news-card_img-wrap">
          <ImageWithFallback
            src={resolveImageUrl(image, { width: 500, height: 500 })}
            alt={title ?? "News thumbnail"}
            className="news-card_img"
            width={500}
            height={500}
            // This thumbnail is fluid (`w-full`) inside a 1/2/3-column grid.
            // Without `sizes` the browser assumes 100vw and pulls the largest
            // srcset candidate — on a phone that is several times the pixels
            // actually needed.
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="flex-between gap-3 mt-5">
        {/* Was `/?query=<title>`, a plain text search that also matched titles
            and descriptions. It now uses the real category filter — and falls
            back to an unlinked label for legacy docs that have no slug. */}
        {categorySlug ? (
          <Link
            href={`/?category=${encodeURIComponent(categorySlug)}`}
            className="min-w-0"
          >
            <p className="text-16-medium truncate transition-colors hover:text-secondary">
              {categoryTitle}
            </p>
          </Link>
        ) : (
          <p className="text-16-medium truncate min-w-0">{categoryTitle}</p>
        )}
        <Button className="news-card_btn" asChild>
          <Link href={`/news/${_id}`}>Details</Link>
        </Button>
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
