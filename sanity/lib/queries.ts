import { defineQuery } from "next-sanity";

/*
 * The news list comes in two sort orders. They are written out as two literal
 * queries rather than one query with a parameterised `order()`, because
 * `defineQuery` strings must stay static for `sanity typegen` to derive result
 * types from them.
 *
 * Both share the same filter: optional full-text search, plus an optional
 * category slug.
 *
 * Note `author->name`: this was `author.name`, which silently never matched.
 * `author` is a reference, so the unresolved object only holds `_ref`/`_type` —
 * searching by author name returned nothing.
 */

/** Newest first — the default ordering. */
export const NEWS_LATEST_QUERY =
  defineQuery(`*[_type == 'news' && defined(slug.current)
      && (!defined($search) || title match $search || description match $search || category->title match $search || author->name match $search)
      && (!defined($category) || category->slug.current == $category)
    ] | order(_createdAt desc) {
        _id,
        title,
        slug,
        _createdAt,
        author->{
            _id, name, image, bio
        },
        views,
        description,
        image,
        category->{ _id, title, slug }
    }`);

/** Most viewed first, with newest as the tie-breaker so the order is stable. */
export const NEWS_POPULAR_QUERY =
  defineQuery(`*[_type == 'news' && defined(slug.current)
      && (!defined($search) || title match $search || description match $search || category->title match $search || author->name match $search)
      && (!defined($category) || category->slug.current == $category)
    ] | order(coalesce(views, 0) desc, _createdAt desc) {
        _id,
        title,
        slug,
        _createdAt,
        author->{
            _id, name, image, bio
        },
        views,
        description,
        image,
        category->{ _id, title, slug }
    }`);

export const  NEWS_BY_ID_QUERY = defineQuery(`*[_type == "news" && _id == $id][0]{
        _id,
        title,
        slug,
        _createdAt,
        author->{
            _id, name, username, image, bio
        },
        views,
        description,
        image,
        category->{ _id, title, slug },
        pitch,
        facebookLink,
        tiktokLink,
        instagramLink
    }`)

export const NEWS_VIEWS_QUERY = defineQuery(`
    *[_type == "news" && _id == $id][0]{
        _id, views
    }
`)

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
    *[_type == "author" && id == $id][0]{
        _id,
        id,
        name,
        username,
        email,
        image,
        bio
    }
`)

export const AUTHOR_BY_ID_QUERY = defineQuery(`
    *[_type == "author" && _id == $id][0]{
        _id,
        id,
        name,
        username,
        email,
        image,
        bio
    }
`)

export const NEWS_BY_AUTHOR_QUERY = defineQuery(`*[_type == 'news' && author._ref == $id] | order(_createdAt desc) {
    _id,
    title,
    slug,
    _createdAt,
    author->{
        _id, name, image, bio
    },
    views,
    description,
    image,
    category->{ _id, title, slug }
}`);

export const PLAYLIST_BY_SLUG_QUERY = defineQuery(`*[_type == "playlist" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  select[]->{
    _id,
    _createdAt,
    title,
    slug,
    author->{
      _id,
      name,
      slug,
      image,
      bio
    },
    views,
    description,
    category->{ _id, title, slug },
    image,
    pitch
  }
}`);

export const CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  description
}`);

/** Minimal projection for app/sitemap.ts — ids and timestamps only. */
export const NEWS_SITEMAP_QUERY = defineQuery(`*[_type == "news" && defined(slug.current)] | order(_updatedAt desc) {
  _id,
  _updatedAt
}`);

/** Minimal projection for app/sitemap.ts — author profile pages. */
export const AUTHORS_SITEMAP_QUERY = defineQuery(`*[_type == "author"] | order(_updatedAt desc) {
  _id,
  _updatedAt
}`);