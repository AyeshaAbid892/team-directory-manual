// src/components/SearchBar/SearchBar.jsx
import './SearchBar.css';

function SearchBar({ query, onQueryChange, resultCount, totalCount }) {
  return (
    <div className="search-bar">
      <div className="search-bar__field">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search the ledger — name, role, skill, or city…"
          aria-label="Search team members"
        />
        {query && (
          <button type="button" className="search-bar__clear" onClick={() => onQueryChange('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>
      {query && (
        <span className="search-bar__count">
          {resultCount} of {totalCount} entries
        </span>
      )}
    </div>
  );
}

export default SearchBar;
