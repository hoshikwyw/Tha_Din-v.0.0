import { X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

/**
 * Clears the current search by navigating back to the unfiltered list.
 *
 * This was a `<button type="reset">` wrapping a `<Link>` — invalid HTML
 * (interactive content nested inside interactive content), and one click fired
 * two competing behaviours: a form reset plus a navigation. It also reached
 * into the DOM via `document.querySelector('.search-form')`.
 *
 * Navigating to `/` re-renders the form with an empty query, which is all the
 * reset ever needed to do — so this is now a plain link and ships no client JS.
 */
const SearchFormReset = () => (
  <Link href="/" className="search-btn text-white" aria-label="Clear search">
    <X className="size-5" />
  </Link>
)

export default SearchFormReset
