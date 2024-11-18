// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://da8d6b1f6469a6f30d2def5fe0934d76@o4508314038697984.ingest.us.sentry.io/4508314042957824",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

// SENTRY_AUTH_TOKEN=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

