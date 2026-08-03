import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading form…</span>

      <section className="pink_container">
        <Skeleton className="h-10 sm:h-14 w-80 max-w-full" />
      </section>

      <div className="news-form">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="mt-2 h-11 w-full rounded-lg" />
          </div>
        ))}
        <div>
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="mt-2 h-[300px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}
