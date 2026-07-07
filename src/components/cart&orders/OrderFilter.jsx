import React from "react";

function OrderFilter({ selectedStatus, onStatusFilterChange }) {
  return (
    <div className="flex items-center space-x-3 w-full sm:w-auto">
      <label
        htmlFor="statusFilter"
        className="text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider whitespace-nowrap"
      >
        Status:
      </label>
      <select
        id="statusFilter"
        value={selectedStatus}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-300 text-xs font-bold rounded-xl px-4 py-2.5 cursor-pointer shadow-sm dark:shadow-none transition-colors duration-300"
      >
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
