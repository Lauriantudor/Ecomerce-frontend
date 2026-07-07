import React from "react";

function OrdersTableDesktop({ orders, onStatusChange, onViewDetails }) {
  return (
    <div className="hidden md:block bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase tracking-wider bg-stone-100/50 dark:bg-zinc-900/50">
              <th className="p-5">ID Comandă</th>
              <th className="p-5">Client</th>
              <th className="p-5">Total</th>
              <th className="p-5">Status</th>
              <th className="p-5">Adresă Livrare</th>
              <th className="p-5 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-zinc-800/60">
            {orders.map((order) => {
              const clientName =
                order.user?.fullName ||
                order.user?.username ||
                `User ID: ${order.userId}`;
              const currentStatus = order.status?.toLowerCase();

              return (
                <tr
                  key={order.id}
                  className="hover:bg-stone-50/80 dark:hover:bg-zinc-850/30 transition-colors text-sm"
                >
                  <td className="p-5 font-mono text-stone-700 dark:text-zinc-300">
                    #{order.id}
                  </td>
                  <td className="p-5 font-semibold text-stone-900 dark:text-white">
                    {clientName}
                  </td>
                  <td className="p-5 font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                    {order.totalAmount || order.total || "0.00"} RON
                  </td>
                  <td className="p-5">
                    <select
                      value={currentStatus}
                      disabled={currentStatus === "cancelled"}
                      onChange={(e) => onStatusChange(order, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                        currentStatus === "cancelled"
                          ? "bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900 opacity-60 cursor-not-allowed"
                          : currentStatus === "pending"
                            ? "bg-amber-100 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60 cursor-pointer"
                            : currentStatus === "shipped"
                              ? "bg-sky-100 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/60 cursor-pointer"
                              : "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60 cursor-pointer"
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
                  </td>
                  <td className="p-5 text-stone-700 dark:text-zinc-300 max-w-xs truncate">
                    {order.address
                      ? `${order.address.city}, ${order.address.streetAddress || order.address.street || ""}`
                      : "Fără adresă"}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => onViewDetails(order)}
                      className="text-xs bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 dark:hover:text-white px-3 py-1.5 rounded-xl border border-stone-200 dark:border-zinc-750 transition-all font-semibold cursor-pointer"
                    >
                      <span aria-hidden="true">📦</span> Vezi Produse
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersTableDesktop;
