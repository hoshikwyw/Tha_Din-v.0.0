import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Serves the `notFound()` calls in the news and user routes, which previously
 * fell through to the default Next.js 404 with no site chrome.
 */
export default function NotFound() {
  return (
    <section className="pink_container !min-h-[60vh]">
      <p className="tag">404</p>
      <h1 className="heading">This page doesn&apos;t exist</h1>
      <p className="sub-heading !max-w-xl">
        The story you&apos;re looking for may have been moved or removed.
      </p>

      <Button asChild className="startup-card_btn mt-8">
        <Link href="/">Browse all news</Link>
      </Button>
    </section>
  );
}
