import { NewsCardSkeleton } from "@/components/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the two-column profile layout: sidebar card plus the story grid. */
export default function Loading() {
  return (
    <section className="profile_container" role="status" aria-live="polite">
      <span className="sr-only">Loading profile…</span>

      <div className="profile_card">
        <Skeleton className="size-24 rounded-full" />
        <Skeleton className="mt-4 h-6 w-36" />
        <Skeleton className="mt-3 h-3 w-24 rounded-full" />
        <Skeleton className="mt-5 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-4/5" />
      </div>

      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <Skeleton className="h-8 w-40" />
        <ul className="card_grid-sm">
          <NewsCardSkeleton />
        </ul>
      </div>
    </section>
  );
}
