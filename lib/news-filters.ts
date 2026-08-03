/**
 * URL contract for the news list filters, defined in one place so the page,
 * the filter bar and the metadata all agree on it.
 *
 *   /?query=...&category=<slug>&sort=popular
 *
 * The default sort is deliberately omitted from the URL: `/` and `/?sort=latest`
 * would otherwise be two URLs for identical content.
 */

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortValue = "latest";

/** Never trust the raw query string — fall back to the default on anything else. */
export const parseSort = (value?: string | null): SortValue =>
  SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortValue)
    : DEFAULT_SORT;

export type ActiveFilters = {
  query?: string;
  category?: string;
  sort: SortValue;
};

/**
 * Build a list URL from the currently active filters plus a change. Filters
 * compose rather than replace one another, so switching sort keeps the selected
 * category and any search term.
 *
 * Pass `category: null` to clear the category.
 */
export const buildFilterHref = (
  active: ActiveFilters,
  patch: { category?: string | null; sort?: SortValue } = {},
): string => {
  const category =
    patch.category !== undefined ? patch.category : active.category;
  const sort = patch.sort !== undefined ? patch.sort : active.sort;

  const params = new URLSearchParams();
  if (active.query) params.set("query", active.query);
  if (category) params.set("category", category);
  if (sort !== DEFAULT_SORT) params.set("sort", sort);

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
};
