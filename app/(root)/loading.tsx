import { NewsCardSkeleton } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streamed instantly while the route's data resolves, so navigation feels
 * immediate instead of hanging on a blank screen.
 */
export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading stories…</span>

      <section className="pink_container">
        <Skeleton className="h-10 sm:h-14 w-full max-w-3xl rounded-lg" />
        <Skeleton className="mt-5 h-5 w-full max-w-xl rounded-lg" />
        <Skeleton className="mt-8 h-12 w-full max-w-xl rounded-full" />
      </section>

      <section className="section_container">
        <Skeleton className="h-8 w-40 rounded-lg" />

        {/* Matches the filter bar so the layout doesn't shift when it arrives. */}
        <div className="filter-bar">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Skeleton className="h-3 w-20 rounded-full" />
            <Skeleton className="h-9 w-44 rounded-full" />
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        <ul className="mt-7 card_grid">
          <NewsCardSkeleton />
        </ul>
      </section>
    </div>
  );
}
