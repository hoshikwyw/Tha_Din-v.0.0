/* eslint-disable @typescript-eslint/no-require-imports */
import type {Config} from "tailwindcss";

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
                primary: {
                    "100": "#E5E5E5",
                    DEFAULT: "#F5E6CA",
                },
                secondary: "#E89F71",
                accent: "#D9A5B3",
                black: {
                    "100": "#A8A8A8",
                    "200": "#A8A8A8",
                    "300": "#2D3E50",
                    "400": "#2D3E50",
                    DEFAULT: "#2D3E50",
                },
                white: {
                    "100": "#FFF9F0",
                    DEFAULT: "#FFF9F0",
                },
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
                100: "2px 2px 0px 0px rgb(0, 0, 0)",
                200: "2px 2px 0px 2px rgb(0, 0, 0)",
                300: "2px 2px 0px 2px rgb(238, 43, 105)",
                400: "2px 2px 0px 2px #D4AF37",
            },
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;