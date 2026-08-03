import { NewsCardSkeleton } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Streamed instantly while the route's data resolves, so navigation feels
 * immediate instead of hanging on a blank screen.
 */
export default function Loading() {
  return (
    <>
      <section className="pink_container">
        <Skeleton className="h-10 sm:h-14 w-full max-w-3xl bg-muted rounded-lg" />
        <Skeleton className="mt-5 h-5 w-full max-w-xl bg-muted rounded-lg" />
        <Skeleton className="mt-8 h-12 w-full max-w-xl bg-muted rounded-full" />
      </section>

      <section className="section_container">
        <Skeleton className="h-8 w-40 bg-muted rounded-lg" />
        <ul className="mt-7 card_grid">
          <NewsCardSkeleton />
        </ul>
      </section>
    </>
  );
}
