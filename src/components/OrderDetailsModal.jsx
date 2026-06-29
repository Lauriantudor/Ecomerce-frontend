import React, { useEffect, useRef, useState } from "react";
import AddressDetailsModal from "./AddessDetailsModal";

const OrderDetailsModal = ({ order, onClose }) => {
  const modalCloseButtonRef = useRef(null);
  const addressTriggerButtonRef = useRef(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (!isAddressModalOpen) {
      setTimeout(() => {
        modalCloseButtonRef.current?.focus();
      }, 50);
    }
  }, [isAddressModalOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isAddressModalOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isAddressModalOpen]);

  if (!order) return null;

  const productItems = order.items || order.orderItems || [];
  const currentStatus = order.status?.toLowerCase();
  const isPending = currentStatus === "pending" || currentStatus === "panding";

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    setTimeout(() => {
      addressTriggerButtonRef.current?.focus();
    }, 50);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        // MODIFICAT: bg-white și border-stone-200 pe light mode
        className="w-full max-w-lg bg-white dark:bg-[#141414] border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl dark:shadow-2xl overflow-y-auto max-h-[90vh] transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Pop-up */}
        {/* MODIFICAT: border-stone-100 pe light mode */}
        <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-900 pb-3">
          <h2
            id="modal-title"
            // MODIFICAT: text-stone-900 pe light mode
            className="text-lg font-black text-stone-900 dark:text-zinc-100 uppercase tracking-wide"
          >
            Detalii Comandă #{order.id}
          </h2>
          <button
            ref={modalCloseButtonRef}
            type="button"
            onClick={onClose}
            // MODIFICAT: text-stone-400 și hover:text-stone-700 pe light mode
            className="text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-white p-2 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-zinc-600 cursor-pointer"
            aria-label="Închide detaliile comenzii"
          >
            ✕
          </button>
        </div>

        {/* Informații Livrare */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            {/* MODIFICAT: text-stone-500 pe light mode */}
            <h4 className="text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 tracking-wider">
              Adresă de Livrare
            </h4>

            {order.address && (
              <button
                ref={addressTriggerButtonRef}
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                // MODIFICAT: bg-emerald-50, text-emerald-700, border-emerald-200 și hover-uri pe light mode
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 px-2.5 py-1 rounded-lg transition-all uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                aria-label="Deschide fereastra cu datele complete ale adresei de livrare"
              >
                Vezi Adresa Completă
              </button>
            )}
          </div>

          {order.address ? (
            // MODIFICAT: bg-stone-50, border-stone-200 și text-stone-700/stone-900 pe light mode
            <div className="text-sm text-stone-700 dark:text-zinc-300 bg-stone-50 dark:bg-zinc-950 p-3 border border-stone-200 dark:border-zinc-900 rounded-xl space-y-0.5 shadow-sm dark:shadow-none">
              <p className="font-bold text-stone-900 dark:text-zinc-100">
                {order.address.fullName ||
                  order.address.fullname ||
                  "Nespecificat"}
              </p>
              <p className="text-xs text-stone-600 dark:text-zinc-300/90 truncate font-medium">
                {order.address.streetAddress ||
                  order.address.street ||
                  "str. Fără nume"}
                , {order.address.city || "Oraș nespecificat"}
              </p>
            </div>
          ) : (
            // MODIFICAT: text-stone-400 pe light mode
            <p className="text-stone-400 dark:text-zinc-500 text-xs italic">
              Informațiile despre adresă nu sunt disponibile.
            </p>
          )}
        </div>

        {/* Produse achiziționate */}
        <div className="space-y-2">
          {/* MODIFICAT: text-stone-500 pe light mode */}
          <h4 className="text-xs font-bold uppercase text-stone-500 dark:text-zinc-400 tracking-wider">
            Produse achiziționate
          </h4>
          {/* MODIFICAT: divide-stone-100, bg-stone-50 și border-stone-200 pe light mode */}
          <div className="divide-y divide-stone-200/60 dark:divide-zinc-900 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-900 rounded-xl p-3 shadow-sm dark:shadow-none">
            {productItems.length === 0 ? (
              <p className="text-stone-400 dark:text-zinc-500 text-xs italic p-2 text-center">
                No items available.
              </p>
            ) : (
              productItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2.5 text-sm first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    {/* MODIFICAT: text-stone-800 pe light mode */}
                    <p className="font-semibold text-stone-800 dark:text-zinc-200 truncate">
                      {item.product?.name || item.product?.title || "Produs"}
                    </p>
                    {/* MODIFICAT: text-stone-500 pe light mode */}
                    <p className="text-xs text-stone-500 dark:text-zinc-300/80 font-mono mt-0.5">
                      Cantitate: {item.quantity} x{" "}
                      {item.price || item.product?.price || 0} RON
                    </p>
                  </div>
                  {/* MODIFICAT: text-stone-800 pe light mode */}
                  <span className="font-bold text-stone-800 dark:text-zinc-200 flex-shrink-0 font-mono">
                    {(
                      (item.price || item.product?.price || 0) * item.quantity
                    ).toFixed(2)}{" "}
                    RON
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status actual */}
        {/* MODIFICAT: border-stone-100 pe light mode */}
        <div className="border-t border-stone-100 dark:border-zinc-900 pt-4 flex justify-between items-center text-sm">
          {/* MODIFICAT: text-stone-600 pe light mode */}
          <span className="text-stone-600 dark:text-zinc-300 font-medium">
            Status actual:
          </span>
          <span
            // MODIFICAT: Stiluri dual-theme complete pentru stările ecusonului (text-700/800 și bg-100 pe light mode)
            className={`font-black uppercase tracking-wider text-xs px-3 py-1 rounded-lg border ${
              isPending
                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60"
                : currentStatus === "shipped"
                  ? "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/60"
                  : currentStatus === "delivered"
                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60"
                    : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60"
            }`}
          >
            {isPending ? "În așteptare" : order.status}
          </span>
        </div>

        {/* Total general */}
        {/* MODIFICAT: bg-stone-900 devine bg-stone-900/5 sau o variantă deschisă pe light mode, text-stone-900 și border-stone-200 */}
        <div className="flex justify-between items-center text-base font-black text-stone-900 dark:text-zinc-100 bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-900 rounded-xl shadow-sm dark:shadow-none">
          <span>Total Achitat:</span>
          {/* MODIFICAT: text-emerald-700 pe light mode */}
          <span className="text-emerald-700 dark:text-emerald-400 text-lg font-mono">
            {order.totalAmount || order.total || "0.00"} RON
          </span>
        </div>
      </div>

      {isAddressModalOpen && (
        <AddressDetailsModal
          address={order.address}
          onClose={handleCloseAddressModal}
        />
      )}
    </div>
  );
};

export default OrderDetailsModal;
