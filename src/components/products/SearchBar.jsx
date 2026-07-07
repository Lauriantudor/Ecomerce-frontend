import React from "react";

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="w-full max-w-md mb-6">
      <div className="relative flex items-center">
        {/* Iconița de lupă - adaptată pentru contrast optim */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-stone-500 dark:text-zinc-400"
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

        {/* INPUT ADAPTIV: Contrast mărit pe placeholder și focus solid pe smarald */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Caută un produs sau o categorie..."
          className="w-full pl-11 pr-10 py-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl text-sm text-stone-900 dark:text-zinc-100 placeholder-stone-500 dark:placeholder-zinc-400 focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950/50 transition-all shadow-sm dark:shadow-inner"
        />

        {/* Butonul de ștergere text (X) cu stări de focus accesibile */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-500 dark:text-zinc-400 hover:text-stone-700 dark:hover:text-zinc-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-zinc-600 rounded-lg"
            aria-label="Șterge textul căutat"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
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
