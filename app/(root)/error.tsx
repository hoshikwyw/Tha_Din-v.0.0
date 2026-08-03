"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary. Without this, a failed Sanity fetch rendered the
 * unstyled default Next.js error screen and lost the site chrome entirely.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <section className="pink_container">
      <h1 className="heading">Something went wrong</h1>
      <p className="sub-heading !max-w-xl">
        We couldn&apos;t load this page. This is usually temporary — please try
        again in a moment.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={reset} className="news-card_btn">
          Try again
        </Button>
        <Button asChild className="news-card_btn !bg-white">
          <Link href="/">Back to home</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-6 text-14-normal">Reference: {error.digest}</p>
      )}
    </section>
  );
}
