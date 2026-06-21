import React, { useEffect, useRef, useState } from "react";
import AddressDetailsModal from "./AddessDetailsModal"; // Importăm sub-modalul

const OrderDetailsModal = ({ order, onClose }) => {
  const modalCloseButtonRef = useRef(null);
  const addressTriggerButtonRef = useRef(null); // Ref pentru butonul care deschide adresa

  // Stare pentru sub-modalul de adresă
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    if (!isAddressModalOpen) {
      // Când se închide sub-modalul de adresă sau se deschide modalul principal, focusul rămâne în contextul corect
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

  const isPending = order.status === "pending" || order.status === "panding";

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
    // Întoarcem focusul NVDA exact pe butonul care a declanșat fereastra de adresă
    setTimeout(() => {
      addressTriggerButtonRef.current?.focus();
    }, 50);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg bg-[#121212] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Pop-up */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <h2
            id="modal-title"
            className="text-lg font-black text-zinc-100 uppercase tracking-wide"
          >
            Detalii Comandă #{order.id}
          </h2>
          <button
            ref={modalCloseButtonRef}
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-2 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
            aria-label="Închide detaliile comenzii"
          >
            ✕
          </button>
        </div>

        {/* Informații Livrare modificat cu buton pentru detalii complete */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
              Adresă de Livrare
            </h4>

            {order.address && (
              <button
                ref={addressTriggerButtonRef}
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="text-[11px] font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 px-2.5 py-1 rounded-lg transition-all uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Deschide fereastra cu datele complete ale adresei de livrare"
              >
                Vezi Adresa Completă
              </button>
            )}
          </div>

          {order.address ? (
            <div className="text-sm text-zinc-300 bg-zinc-950 p-3 border border-zinc-900 rounded-xl space-y-0.5">
              <p className="font-bold text-zinc-200">
                {order.address.fullName || order.address.fullname}
              </p>
              <p className="text-xs text-zinc-400 truncate">
                {order.address.streetAddress || order.address.street},{" "}
                {order.address.city}
              </p>
            </div>
          ) : (
            <p className="text-zinc-600 text-xs italic">
              Informațiile despre adresă nu sunt disponibile.
            </p>
          )}
        </div>

        {/* Produse achiziționate */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">
            Produse achiziționate
          </h4>
          <div className="divide-y divide-zinc-900 bg-zinc-950 border border-zinc-900 rounded-xl p-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2.5 text-sm first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-semibold text-zinc-200">
                    {item.product?.name || "Produs"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    Cantitate: {item.quantity} x {item.product?.price} RON
                  </p>
                </div>
                <span className="font-bold text-zinc-300">
                  {((item.product?.price || 0) * item.quantity).toFixed(2)} RON
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status actual */}
        <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-sm">
          <span className="text-zinc-400 font-medium">Status actual:</span>
          <span
            className={`font-bold uppercase tracking-wider text-xs px-2.5 py-1 rounded-full border ${
              isPending
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : order.status === "shipped"
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : order.status === "delivered"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {isPending ? "În așteptare" : order.status}
          </span>
        </div>

        {/* Total general */}
        <div className="flex justify-between items-center text-base font-black text-zinc-100 bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
          <span>Total Achitat:</span>
          <span className="text-emerald-500 text-lg">
            {order.totalAmount} RON
          </span>
        </div>
      </div>

      {/* RENDER AL DOILEA POP-UP (SUB-MODAL ADRESĂ) */}
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
