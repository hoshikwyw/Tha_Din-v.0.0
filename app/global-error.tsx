"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Last-resort boundary: catches errors thrown by the root layout itself.
 *
 * It replaces the entire document, so `app/layout.tsx` never renders — which
 * means the Tailwind stylesheet and the font are not guaranteed to be present.
 * Everything here is therefore self-contained: a scoped <style> block and
 * system fonts, so the page still looks intentional even when the app's CSS
 * never loaded. That is also why it does not use any project component.
 */
const STYLES = `
  .ge-root {
    --ge-bg: #FAFAF9;
    --ge-fg: #14151A;
    --ge-muted: #6B6660;
    --ge-line: #E5E2E0;
    --ge-card: #FFFFFF;
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 24px;
    background: var(--ge-bg);
    color: var(--ge-fg);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  @media (prefers-color-scheme: dark) {
    .ge-root {
      --ge-bg: #111114;
      --ge-fg: #F2F2F0;
      --ge-muted: #A8A29E;
      --ge-line: #2A2C33;
      --ge-card: #1A1B1F;
    }
  }
  .ge-card {
    width: 100%;
    max-width: 460px;
    text-align: center;
    background: var(--ge-card);
    border: 1px solid var(--ge-line);
    border-radius: 12px;
    padding: 40px 28px;
  }
  .ge-eyebrow {
    margin: 0 0 14px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ge-muted);
  }
  .ge-title {
    margin: 0 0 12px;
    font-size: 26px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    font-weight: 800;
  }
  .ge-text {
    margin: 0 0 28px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--ge-muted);
  }
  .ge-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .ge-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--ge-fg);
    background: var(--ge-fg);
    color: var(--ge-bg);
    text-decoration: none;
    font-family: inherit;
  }
  .ge-btn--ghost {
    background: transparent;
    color: var(--ge-fg);
    border-color: var(--ge-line);
  }
  .ge-ref {
    margin: 24px 0 0;
    font-size: 12px;
    color: var(--ge-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
`;

export default function GlobalError({
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
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        <div className="ge-root">
          <main className="ge-card">
            <p className="ge-eyebrow">Application error</p>
            <h1 className="ge-title">Something went badly wrong</h1>
            <p className="ge-text">
              The page couldn&apos;t be displayed. Reloading usually fixes it —
              if it keeps happening, please try again later.
            </p>

            <div className="ge-actions">
              <button type="button" className="ge-btn" onClick={() => reset()}>
                Try again
              </button>
              {/* A hard navigation, deliberately. This boundary catches errors
                  in the root layout, so the router itself may be the thing that
                  failed — `next/link` would try a client-side transition
                  through the very code that just crashed. A full document load
                  is the only reliable escape, so the lint rule is suppressed. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a className="ge-btn ge-btn--ghost" href="/">
                Back to home
              </a>
            </div>

            {error.digest && <p className="ge-ref">Reference: {error.digest}</p>}
          </main>
        </div>
      </body>
    </html>
  );
}
