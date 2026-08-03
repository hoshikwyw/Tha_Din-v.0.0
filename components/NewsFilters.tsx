import Link from "next/link";
import { Clock, Flame } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  buildFilterHref,
  SORT_OPTIONS,
  type ActiveFilters,
  type SortValue,
} from "@/lib/news-filters";

export type FilterCategory = {
  _id: string;
  title: string | null;
  slug?: { current?: string | null } | null;
};

const SORT_ICONS: Record<SortValue, typeof Clock> = {
  latest: Clock,
  popular: Flame,
};

/**
 * Filter bar for the news list.
 *
 * Deliberately a server component built from plain links: the filters are URL
 * state, so they need no client JS, stay shareable and bookmarkable, and work
 * before hydration.
 */
const NewsFilters = ({
  categories,
  active,
  total,
}: {
  categories: FilterCategory[];
  active: ActiveFilters;
  total: number;
}) => {
  const selectable = categories.filter((category) => category.slug?.current);

  return (
    <div className="filter-bar">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="filter-count">
          {total} {total === 1 ? "story" : "stories"}
        </p>

        <div
          className="filter-group"
          role="group"
          aria-label="Sort stories"
        >
          {SORT_OPTIONS.map((option) => {
            const Icon = SORT_ICONS[option.value];
            const isActive = active.sort === option.value;

            return (
              <Link
                key={option.value}
                href={buildFilterHref(active, { sort: option.value })}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn("filter-chip", isActive && "filter-chip--active")}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      {selectable.length > 0 && (
        <nav aria-label="Filter by category" className="filter-scroller">
          <Link
            href={buildFilterHref(active, { category: null })}
            scroll={false}
            aria-current={!active.category ? "true" : undefined}
            className={cn(
              "filter-chip",
              !active.category && "filter-chip--active",
            )}
          >
            All
          </Link>

          {selectable.map((category) => {
            const slug = category.slug!.current as string;
            const isActive = active.category === slug;

            return (
              <Link
                key={category._id}
                href={buildFilterHref(active, { category: slug })}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "filter-chip",
                  isActive && "filter-chip--active",
                )}
              >
                {category.title ?? slug}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default NewsFilters;
