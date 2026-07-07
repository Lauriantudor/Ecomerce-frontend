import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import AddressDetailsModal from "../addresses/AddessDetailsModal";

const OrderDetailsModal = ({ order, onClose }) => {
  const modalCloseButtonRef = useRef(null);
  const addressTriggerButtonRef = useRef(null);
  const orderModalRef = useRef(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (!isAddressModalOpen && order) {
      setTimeout(() => {
        modalCloseButtonRef.current?.focus();
      }, 50);
    }
  }, [isAddressModalOpen, order]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!order) return;

      if (e.key === "Escape" && !isAddressModalOpen) {
        onClose();
        return;
      }

      if (e.key === "Tab" && !isAddressModalOpen) {
        if (!orderModalRef.current) return;
        const focusableElements = orderModalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isAddressModalOpen, order]);

  if (!order) return null;

  const productItems = order.items || order.orderItems || [];
  const currentStatus = order.status?.toLowerCase();
  const isPending = currentStatus === "pending" || currentStatus === "panding";
  const statusLabel = isPending ? "În așteptare" : order.status;

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    setTimeout(() => {
      addressTriggerButtonRef.current?.focus();
    }, 50);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={orderModalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-hidden={isAddressModalOpen ? "true" : "false"}
        className="w-full max-w-lg bg-white dark:bg-[#141414] border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh] transition-colors duration-300 relative"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-900 pb-3">
          <h2
            id="modal-title"
            className="text-lg font-black text-stone-900 dark:text-zinc-100 uppercase tracking-wide"
          >
            Detalii Comandă #{order.id}
          </h2>
          <button
            ref={modalCloseButtonRef}
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-white p-2 rounded-xl text-sm transition-colors cursor-pointer"
            aria-label="Închide detaliile comenzii"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-stone-700 dark:text-zinc-300 tracking-wider">
              Adresă de Livrare
            </h4>
            {order.address && (
              <button
                ref={addressTriggerButtonRef}
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 px-2.5 py-1 rounded-lg transition-all uppercase tracking-wide cursor-pointer"
              >
                Vezi Adresa Completă
              </button>
            )}
          </div>

          {order.address ? (
            <div className="text-sm text-stone-700 dark:text-zinc-300 bg-stone-50 dark:bg-zinc-950 p-3 border border-stone-200 dark:border-zinc-900 rounded-xl space-y-0.5 shadow-sm">
              <p className="font-bold text-stone-900 dark:text-zinc-100">
                {order.address.fullName ||
                  order.address.fullname ||
                  "Nespecificat"}
              </p>
              <p className="text-xs text-stone-700 dark:text-zinc-300/90 truncate font-medium">
                {order.address.streetAddress ||
                  order.address.street ||
                  "str. Fără nume"}
                , {order.address.city || "Oraș nespecificat"}
              </p>
            </div>
          ) : (
            <p className="text-stone-600 dark:text-zinc-400 text-xs italic">
              Informațiile despre adresă nu sunt disponibile.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-stone-700 dark:text-zinc-300 tracking-wider">
            Produse achiziționate
          </h4>
          <div className="divide-y divide-stone-200/60 dark:divide-zinc-900 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-900 rounded-xl p-3 shadow-sm">
            {productItems.length === 0 ? (
              <p className="text-stone-600 dark:text-zinc-400 text-xs italic p-2 text-center">
                Nu există produse în această comandă.
              </p>
            ) : (
              productItems.map((item) => {
                const itemSubtotal = (
                  (item.price || item.product?.price || 0) * item.quantity
                ).toFixed(2);
                return (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2.5 text-sm first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="font-semibold text-stone-800 dark:text-zinc-200 truncate">
                        {item.product?.name || item.product?.title || "Produs"}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-zinc-300/90 mt-0.5">
                        Cantitate: {item.quantity} x{" "}
                        {item.price || item.product?.price || 0} RON
                      </p>
                    </div>
                    <span className="font-bold text-stone-800 dark:text-zinc-200 flex-shrink-0">
                      {itemSubtotal} RON
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="border-t border-stone-100 dark:border-zinc-900 pt-4 flex justify-between items-center text-sm">
          <span className="text-stone-700 dark:text-zinc-300 font-medium">
            Status actual:
          </span>
          <span
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
            {statusLabel}
          </span>
        </div>

        <div className="flex justify-between items-center text-base font-black text-stone-900 dark:text-zinc-100 bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-900 rounded-xl shadow-sm">
          <span>Total Achitat:</span>
          <span className="text-emerald-700 dark:text-emerald-400 text-lg">
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
    </div>,
    document.body,
  );
};

export default OrderDetailsModal;
