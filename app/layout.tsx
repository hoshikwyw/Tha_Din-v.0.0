import type { Metadata } from "next";
import localFont from "next/font/local";
import { SanityLive } from "@/sanity/lib/live";
import RouteProgress from "@/components/RouteProgress";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Only the weights the UI actually uses are declared. Thin/ExtraLight/Light
// were loaded but never referenced by any class, and their weights were mapped
// backwards (Thin as 300, ExtraLight as 100) — those files are gone now.
const workSans = localFont({
  src: [
    { path: "./fonts/WorkSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/WorkSans-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/WorkSans-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/WorkSans-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/WorkSans-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/WorkSans-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-work-sans",
  // Render immediately in a fallback face instead of blocking on the font.
  display: "swap",
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  // Required for relative OG/Twitter image paths to resolve to absolute URLs.
  // Social crawlers reject relative ones, so without this shared links lose
  // their preview image entirely.
  metadataBase: new URL(siteConfig.url),
  title: {
    // Article pages supply just their headline; this appends the site name.
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Runs before the browser paints anything, so a visitor who prefers dark mode
 * never sees a flash of the light theme. It has to be inline and synchronous —
 * a deferred script or a `useEffect` would both run after first paint.
 *
 * Kept in sync with components/ThemeToggle.tsx.
 */
const THEME_BOOT_SCRIPT = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    /* storage blocked — fall through to the light default */
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the boot script above mutates <html> before
    // React hydrates, so the class and style attributes intentionally differ
    // from the server output.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className={workSans.variable} suppressHydrationWarning>
        {/* Bridges the gap between a link click and the segment's loading.tsx
            beginning to stream, which is otherwise dead air on a slow network. */}
        <RouteProgress />
        {children}
        {/*
          Required for `defineLive` in sanity/lib/live.ts to do anything. Without
          this component mounted, `sanityFetch` never receives live updates — it
          was configured but never rendered.
        */}
        <SanityLive />
      </body>
    </html>
  );
}
