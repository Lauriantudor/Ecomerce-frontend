import React from "react";

function OrdersCardsMobile({ orders, onStatusChange, onViewDetails }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:hidden">
      {orders.map((order) => {
        const clientName =
          order.user?.fullName ||
          order.user?.username ||
          `User ID: ${order.userId}`;
        const currentStatus = order.status?.toLowerCase();

        return (
          <div
            key={order.id}
            className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4 shadow-sm dark:shadow-md transition-colors duration-300"
          >
            <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-800/60 pb-3">
              <div>
                <span className="text-xs font-bold font-mono text-stone-600 dark:text-zinc-400">
                  #{order.id}
                </span>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white mt-0.5">
                  {clientName}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-600 dark:text-zinc-400 block font-medium">
                  Total general
                </span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {order.totalAmount || order.total || "0.00"} RON
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-stone-700 dark:text-zinc-300 font-bold uppercase tracking-wider block">
                Destinație
              </span>
              <p className="text-stone-700 dark:text-zinc-200 truncate">
                {order.address
                  ? `${order.address.city}, ${order.address.streetAddress || order.address.street}`
                  : "Fără adresă atașată"}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 justify-between items-stretch">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Status Comandă
                </label>
                <select
                  value={currentStatus}
                  disabled={currentStatus === "cancelled"}
                  onChange={(e) => onStatusChange(order, e.target.value)}
                  className={`w-full text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
                    currentStatus === "cancelled"
                      ? "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 opacity-60 cursor-not-allowed"
                      : currentStatus === "pending"
                        ? "bg-amber-100 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60"
                        : currentStatus === "shipped"
                          ? "bg-sky-100 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/60"
                          : "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60"
                  }`}
                >
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

              <button
                onClick={() => onViewDetails(order)}
                className="py-2 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 text-xs rounded-xl border border-stone-200 dark:border-zinc-750 font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span aria-hidden="true">📦</span> Vezi Produse
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrdersCardsMobile;
