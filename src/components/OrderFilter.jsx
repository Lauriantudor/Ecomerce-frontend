import React from "react";

function OrderFilter({ selectedStatus, onStatusFilterChange }) {
  return (
    <div className="flex items-center space-x-3 w-full sm:w-auto">
      <label
        htmlFor="statusFilter"
        // MODIFICAT: text-stone-500 pe light mode pentru un contrast optim
        className="text-xs font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
      >
        Status:
      </label>
      <select
        id="statusFilter"
        value={selectedStatus}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        // MODIFICAT: bg-white, border-stone-200, text-stone-800 și shadow-sm pe light mode
        className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-300 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer shadow-sm dark:shadow-none transition-colors duration-300"
      >
        {/* MODIFICAT: Adăugat text-stone-900 pe opțiuni pentru lizibilitatea dropdown-ului în sistemul de operare pe light mode */}
        <option
          value="all"
          className="text-stone-900 dark:text-white dark:bg-zinc-950"
        >
          Toate comenzile
        </option>
        <option
          value="pending"
          className="text-stone-900 dark:text-white dark:bg-zinc-950"
        >
          În așteptare
        </option>
        <option
          value="shipped"
          className="text-stone-900 dark:text-white dark:bg-zinc-950"
        >
          Expediat (Shipped)
        </option>
        <option
          value="delivered"
          className="text-stone-900 dark:text-white dark:bg-zinc-950"
        >
          Livrat (Delivered)
        </option>
        <option
          value="cancelled"
          className="text-stone-900 dark:text-white dark:bg-zinc-950"
        >
          Anulat (Cancelled)
        </option>
      </select>
    </div>
  );
}

export default OrderFilter;
