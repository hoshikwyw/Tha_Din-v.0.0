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
        <Skeleton className="h-[46px] sm:h-[64px] w-full max-w-5xl bg-black/20 rounded-lg" />
        <Skeleton className="mt-5 h-6 w-full max-w-2xl bg-black/10 rounded-lg" />
        <Skeleton className="mt-8 h-[80px] w-full max-w-3xl bg-white/60 rounded-[80px]" />
      </section>

      <section className="section_container">
        <Skeleton className="h-9 w-40 bg-white/40 rounded-lg" />
        <ul className="mt-7 card_grid">
          <NewsCardSkeleton />
        </ul>
      </section>
    </>
  );
}
