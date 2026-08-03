"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/spinner";

/** Wait this long before showing the veil — fast navigations never show it. */
const OVERLAY_DELAY_MS = 450;
/** Give up after this long so a cancelled navigation can't strand the bar. */
const SAFETY_TIMEOUT_MS = 20000;

/**
 * Global feedback for client-side navigations.
 *
 * `loading.tsx` only renders once a route segment starts streaming. On a slow
 * connection there is a real gap between the click and that moment where
 * nothing at all happens, which reads as a broken link. This fills that gap.
 *
 * The App Router has no router events, so a navigation is detected by observing
 * link clicks and GET form submissions, and considered finished when the
 * pathname or query string actually changes.
 */
const RouteProgressInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [showOverlay, setShowOverlay] = useState(false);
  const firstRender = useRef(true);

  // A committed route change means the navigation finished.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setShowOverlay(false);
    setState((current) => (current === "loading" ? "done" : "idle"));
  }, [pathname, searchParams]);

  // Reset once the completion transition has played out.
  useEffect(() => {
    if (state !== "done") return;
    const timer = setTimeout(() => setState("idle"), 500);
    return () => clearTimeout(timer);
  }, [state]);

  // Escalate to the veil only if the wait is genuinely long.
  useEffect(() => {
    if (state !== "loading") return;

    const overlayTimer = setTimeout(
      () => setShowOverlay(true),
      OVERLAY_DELAY_MS,
    );
    const safetyTimer = setTimeout(() => {
      setShowOverlay(false);
      setState("idle");
    }, SAFETY_TIMEOUT_MS);

    return () => {
      clearTimeout(overlayTimer);
      clearTimeout(safetyTimer);
    };
  }, [state]);

  useEffect(() => {
    const currentUrl = () => window.location.pathname + window.location.search;

    const onClick = (event: MouseEvent) => {
      // Let the browser handle modified clicks (new tab, download, etc.).
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // External links leave the app; the browser shows its own progress.
      if (url.origin !== window.location.origin) return;
      // Navigating to where we already are produces no transition to track.
      if (url.pathname + url.search === currentUrl()) return;

      setState("loading");
    };

    const onSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      // Server actions are covered by their button's own pending state; this is
      // for the GET search/filter form, which navigates.
      if (!form || form.method.toLowerCase() !== "get") return;
      setState("loading");
    };

    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  return (
    <>
      <div className="route-progress" data-state={state} aria-hidden="true" />

      {showOverlay && (
        <div className="route-overlay" role="status" aria-live="polite">
          <div className="route-overlay_card">
            <Spinner />
            Loading…
          </div>
        </div>
      )}
    </>
  );
};

/**
 * `useSearchParams` opts the tree into client-side rendering, so it must sit
 * behind a Suspense boundary or it would deopt every page to dynamic.
 */
const RouteProgress = () => (
  <Suspense fallback={null}>
    <RouteProgressInner />
  </Suspense>
);

export default RouteProgress;
