import type { Metadata } from "next";
import localFont from "next/font/local";
import { SanityLive } from "@/sanity/lib/live";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={workSans.variable} suppressHydrationWarning>
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
