import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Navigare paginare"
      className="flex items-center justify-center space-x-2 pt-8 pb-4"
    >
      {/* Săgeată Înapoi */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Mergi la pagina anterioară"
        className={`p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 select-none ${
          currentPage === 1
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer hover:border-stone-300 dark:hover:border-zinc-700 shadow-sm"
        }`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Cifrele paginilor */}
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        const isActive = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            aria-current={isActive ? "page" : undefined}
            aria-label={`Pagina ${pageNumber}`}
            className={`h-11 w-11 text-sm font-bold rounded-xl transition-all border focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 select-none cursor-pointer ${
              isActive
                ? "bg-emerald-500 border-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/10"
                : "bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-zinc-700 shadow-sm"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Săgeată Înainte */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Mergi la pagina următoare"
        className={`p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 select-none ${
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "cursor-pointer hover:border-stone-300 dark:hover:border-zinc-700 shadow-sm"
        }`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
