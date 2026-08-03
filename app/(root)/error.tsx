"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";
import { RefreshCw, WifiOff } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";

/**
 * Route-level error boundary. Without this, a failed Sanity fetch rendered the
 * unstyled default Next.js error screen and lost the site chrome entirely.
 *
 * It separates "you are offline" from "the app broke", because the recovery
 * differs: one is worth retrying immediately, the other usually is not. It also
 * listens for the connection returning, so a reader who regains signal is told
 * they can retry instead of being left at a dead end.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [isOffline, setIsOffline] = useState(false);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  useEffect(() => {
    // `navigator.onLine` is only trustworthy in the negative: false reliably
    // means no connection, true does not guarantee the server is reachable.
    setIsOffline(!navigator.onLine);

    const onOffline = () => setIsOffline(true);
    const onOnline = () => {
      setIsOffline(false);
      setBackOnline(true);
    };

    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  const retry = () => startTransition(() => reset());

  return (
    <section className="pink_container">
      {isOffline ? (
        <>
          <p className="tag inline-flex items-center gap-2">
            <WifiOff className="size-4" aria-hidden="true" />
            Offline
          </p>
          <h1 className="heading">You appear to be offline</h1>
          <p className="sub-heading">
            We couldn&apos;t reach the server. Check your connection and try
            again.
          </p>
        </>
      ) : (
        <>
          <p className="tag">Something went wrong</p>
          <h1 className="heading">This page didn&apos;t load</h1>
          <p className="sub-heading">
            {backOnline
              ? "Your connection is back. Try loading the page again."
              : "This is usually temporary. Try again in a moment, or head back to the homepage."}
          </p>
        </>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={retry}
          disabled={isPending}
          aria-busy={isPending}
          className="news-card_btn"
        >
          {isPending ? (
            <>
              <Spinner />
              Retrying…
            </>
          ) : (
            <>
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </>
          )}
        </button>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:border-black-400"
        >
          Back to home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-6 text-[13px] text-black-100">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      )}
    </section>
  );
}
