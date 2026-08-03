import Link from "next/link";

/**
 * Root 404, for URLs that match no route at all.
 *
 * `app/(root)/not-found.tsx` only covers `notFound()` thrown inside that route
 * group — an unmatched URL never enters the group, so without this file Next
 * falls back to its unstyled built-in 404.
 *
 * This renders inside the root layout only, so there is no Navbar here; the
 * link back home is the way out.
 */
export default function NotFound() {
  return (
    <main className="min-h-[70vh] grid place-items-center px-4 py-20 text-center font-work-sans">
      <div>
        <p className="eyebrow text-secondary">404</p>
        <h1 className="heading mt-4">This page doesn&apos;t exist</h1>
        <p className="sub-heading mx-auto">
          The link may be out of date, or the story may have been moved.
        </p>

        <Link href="/" className="news-card_btn mt-8">
          Browse all news
        </Link>
      </div>
    </main>
  );
}
