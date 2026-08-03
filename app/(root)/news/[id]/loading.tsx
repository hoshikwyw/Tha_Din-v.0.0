import { Skeleton } from "@/components/ui/skeleton";

/**
 * Mirrors the article layout: header (eyebrow, headline, standfirst, byline),
 * 16:9 hero image, then body copy. Matching the real shape keeps the page from
 * jumping when content arrives.
 */
export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading article…</span>

      <section className="pink_container">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="mt-5 h-10 sm:h-14 w-full max-w-3xl" />
        <Skeleton className="mt-3 h-10 sm:h-14 w-3/4 max-w-2xl" />
        <Skeleton className="mt-6 h-5 w-full max-w-xl" />

        <div className="mt-8 flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </section>

      <section className="section_container">
        <Skeleton className="max-w-4xl mx-auto w-full aspect-[16/9] rounded-xl" />

        <div className="mt-10 max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </section>
    </div>
  );
}
