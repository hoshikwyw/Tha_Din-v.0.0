/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

/**
 * Every colour resolves to a CSS variable holding HSL channels, so a single
 * `.dark` class on <html> reskins the whole site. The `<alpha-value>` slot is
 * what keeps opacity modifiers (e.g. `text-white-100/80`) working.
 */
const withAlpha = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`;

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: "475px",
            },
            colors: {
                // Brand palette. Names are unchanged so existing markup keeps
                // working — only the values became theme-aware.
                primary: {
                    "100": withAlpha("--primary-100"),
                    DEFAULT: withAlpha("--primary"),
                },
                secondary: withAlpha("--secondary"),
                accent: withAlpha("--accent"),
                // "black" is the ink colour: near-black in light mode, near-white
                // in dark. Used for text — not for borders, see `border` below.
                black: {
                    "100": withAlpha("--ink-100"),
                    "200": withAlpha("--ink-200"),
                    "300": withAlpha("--ink-300"),
                    "400": withAlpha("--ink-400"),
                    DEFAULT: withAlpha("--ink"),
                },
                // "white" is the raised surface colour (cards, navbar, inputs).
                white: {
                    "100": withAlpha("--surface-100"),
                    DEFAULT: withAlpha("--surface"),
                },

                // Borders get their own token: at 5px, a full-contrast ink border
                // is right in light mode but overwhelming in dark, where a
                // mid-tone reads far better.
                border: withAlpha("--border"),
                input: withAlpha("--input"),
                ring: withAlpha("--ring"),

                // Semantic tokens the shadcn primitives in components/ui already
                // reference. They were never defined, so classes like
                // `bg-background` on the toast silently produced nothing.
                background: withAlpha("--background"),
                foreground: withAlpha("--foreground"),
                card: {
                    DEFAULT: withAlpha("--card"),
                    foreground: withAlpha("--card-foreground"),
                },
                popover: {
                    DEFAULT: withAlpha("--popover"),
                    foreground: withAlpha("--popover-foreground"),
                },
                muted: {
                    DEFAULT: withAlpha("--muted"),
                    foreground: withAlpha("--muted-foreground"),
                },
                destructive: {
                    DEFAULT: withAlpha("--destructive"),
                    foreground: withAlpha("--destructive-foreground"),
                },
                success: {
                    DEFAULT: withAlpha("--success"),
                    foreground: withAlpha("--success-foreground"),
                },
                "primary-foreground": withAlpha("--foreground"),
                "secondary-foreground": withAlpha("--foreground"),
                "accent-foreground": withAlpha("--foreground"),
                "hero-fg": withAlpha("--hero-fg"),
            },
            fontFamily: {
                "work-sans": ["var(--font-work-sans)"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                // The offset "hard" shadows are the brand. They were hardcoded to
                // pure black, which is invisible against a dark background, so
                // the colour is a variable now too.
                100: "2px 2px 0px 0px hsl(var(--shadow))",
                200: "2px 2px 0px 2px hsl(var(--shadow))",
                300: "2px 2px 0px 2px hsl(var(--shadow-accent))",
                400: "2px 2px 0px 2px hsl(var(--shadow-highlight))",
                lift: "6px 6px 0px 0px hsl(var(--shadow))",
            },
            transitionTimingFunction: {
                snap: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
