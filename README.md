# Tha Din

A news and content platform built with [Next.js 15](https://nextjs.org), [Sanity CMS](https://www.sanity.io/), and TypeScript. Users can browse news articles, explore curated playlists, and view author profiles.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **CMS:** Sanity v3 with live content and TypeGen
- **Auth:** NextAuth v5 (beta)
- **Styling:** Tailwind CSS, Radix UI, `class-variance-authority`
- **Content:** Markdown rendering via `@uiw/react-md-editor` and `markdown-it`
- **Monitoring:** Sentry
- **Validation:** Zod

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app. The Sanity Studio is embedded at [http://localhost:3000/studio](http://localhost:3000/studio).

## Environment Variables

Create a `.env.local` file in the project root with the following:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=
SANITY_WRITE_TOKEN=

AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

SENTRY_AUTH_TOKEN=
```

## Scripts

- `npm run dev` — start the dev server (runs Sanity typegen first)
- `npm run build` — production build (runs Sanity typegen first)
- `npm run start` — start the production server
- `npm run lint` — lint the project
- `npm run typegen` — extract Sanity schema and regenerate TypeScript types

## Project Structure

```
app/
  (root)/         # Public routes: home, news, user profiles
  api/            # Route handlers
  studio/         # Embedded Sanity Studio
components/       # Shared UI components
sanity/
  schemaTypes/    # Content schemas: author, news, playlist
  lib/            # Sanity client, queries, live helpers
lib/              # Utilities and server actions
```

## Content Model

Managed in Sanity, the main schemas are:

- **Author** — profile, bio, and avatar
- **News** — articles authored by users with slugs, views, and categories
- **Playlist** — curated collections of news entries

## Deployment

Deploy on [Vercel](https://vercel.com/new). Make sure all environment variables listed above are configured in your Vercel project settings. Sentry is wired through `instrumentation.ts` and the `sentry.*.config.ts` files.
