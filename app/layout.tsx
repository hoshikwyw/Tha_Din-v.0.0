import type { Metadata } from "next";
import localFont from "next/font/local";
import { SanityLive } from "@/sanity/lib/live";
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
  title: "Tha Din",
  description: "Collection of civil wars in Myanmar",
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
