import React from 'react'
import Form from 'next/form'
import SearchFormReset from './SearchFormReset'
import { Search } from 'lucide-react'

const SearchForm = ({ query }: { query: string }) => {
  return (
    <Form action="/" scroll={false} className="search-form">
      <label htmlFor="search-query" className="sr-only">
        Search news
      </label>
      <input
        id="search-query"
        name="query"
        // Was hardcoded to "", so after searching the box looked empty and you
        // could not see or refine the term you had just searched for.
        //
        // `key` forces a remount when the query changes: `defaultValue` is only
        // read on mount, so during client-side navigation React would otherwise
        // reuse the existing input node and the value would never update.
        key={query}
        defaultValue={query}
        className="search-input"
        placeholder="Search news"
      />
      <div className="flex gap-2 shrink-0">
        {query && <SearchFormReset />}
        <button type="submit" className="search-btn text-white" aria-label="Search">
          <Search className="size-5" />
        </button>
      </div>
    </Form>
  )
}

export default SearchForm
