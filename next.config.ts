import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { ALLOWED_IMAGE_HOSTS } from "./lib/images";

const nextConfig: NextConfig = {
  // Type errors now fail the build. They were being ignored, which is how the
  // broken `next-auth.d.ts` module augmentation went unnoticed.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Lint errors now fail the build too. Both escape hatches are closed.
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    // Previously `hostname: "*"`, which turned the optimiser into an open image
    // proxy: anyone could pass /_next/image?url=<any-url> and have this server
    // fetch it, burning bandwidth and laundering requests through our IP.
    remotePatterns: ALLOWED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
    // `dangerouslyAllowSVG` was on. SVGs are executable documents; serving one
    // from our own origin is a stored-XSS vector. The placeholder fallback is an
    // inline data: URI rendered with `unoptimized`, so it does not need this.
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },
};

export default withSentryConfig(nextConfig, {
  org: "orovibe",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
