import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading categories…</span>

      <section className="pink_container">
        <Skeleton className="h-10 sm:h-14 w-72 max-w-full" />
      </section>

      <section className="section_container">
        <div className="max-w-3xl mx-auto grid gap-10">
          <div>
            <Skeleton className="h-6 w-40" />
            <div className="mt-4 grid gap-4">
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          <div>
            <Skeleton className="h-6 w-44" />
            <div className="mt-4 grid gap-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
