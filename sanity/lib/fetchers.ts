import "server-only";

import { cache } from "react";

import { client, contentCache } from "./client";
import { AUTHOR_BY_ID_QUERY, NEWS_BY_ID_QUERY } from "./queries";

/**
 * Request-scoped memoised reads.
 *
 * `generateMetadata` and the page component both need the same document. React's
 * `cache()` guarantees the query runs once per request instead of twice, which
 * otherwise doubles Sanity traffic on every article view.
 */
export const getNewsById = cache((id: string) =>
  client.fetch(NEWS_BY_ID_QUERY, { id }, contentCache),
);

export const getAuthorById = cache((id: string) =>
  client.fetch(AUTHOR_BY_ID_QUERY, { id }, contentCache),
);
