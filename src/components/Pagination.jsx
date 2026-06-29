import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 pt-8 pb-4">
      {/* Săgeată Înapoi */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        // MODIFICAT: bg-white, border-stone-200, text-stone-500, hover:text-stone-800 și hover:border-stone-300 pe light mode
        className={`p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 select-none ${
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
            // MODIFICAT: Logică dual-theme completă pentru stările active și inactive
            className={`h-11 w-11 text-xs font-black uppercase tracking-wider rounded-xl transition-all border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 select-none cursor-pointer ${
              isActive
                ? "bg-emerald-500 dark:bg-emerald-500 border-emerald-500 text-stone-950 dark:text-black shadow-md shadow-emerald-500/10"
                : "bg-white dark:bg-zinc-900 border-stone-200 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:border-stone-300 dark:hover:border-zinc-700 shadow-sm"
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
        // MODIFICAT: bg-white, border-stone-200, text-stone-500, hover:text-stone-800 și hover:border-stone-300 pe light mode
        className={`p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 select-none ${
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
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default Pagination;
