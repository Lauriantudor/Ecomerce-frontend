import React from "react";

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="w-full max-w-md mb-6">
      <div className="relative flex items-center">
        {/* Iconița de lupă - adaptată cu text-stone-400 cald */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-stone-400 dark:text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
            />
          </svg>
        </div>

        {/* INPUT ADAPTIV: Bordură și text stone pe light mode, focus pe smarald */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Caută un produs sau o categorie..."
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 rounded-2xl text-sm text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-sm dark:shadow-inner"
        />

        {/* Butonul de ștergere text (X) */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 dark:text-zinc-500 hover:text-stone-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="Șterge textul căutat"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
