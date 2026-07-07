import React, { useEffect, useRef } from "react";

function AddressDetailsModal({ address, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!address) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-transparent backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        className="w-full max-w-md bg-white dark:bg-[#161616] border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl dark:shadow-2xl transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1"
      >
        <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-900 pb-4 mb-4">
          <h3
            id="address-modal-title"
            className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider"
          >
            Date Complete Livrare
          </h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-stone-500 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white p-2 text-sm transition-colors cursor-pointer rounded-lg"
            aria-label="Închide detaliile adresei și revino la comandă"
          >
            ✕
          </button>
        </div>

        <div className="bg-stone-50 dark:bg-zinc-950 p-5 border border-stone-200 dark:border-zinc-900 rounded-xl space-y-4 text-sm text-stone-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
          <div>
            <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
              Destinatar
            </span>
            <span className="text-stone-900 dark:text-white font-bold text-base">
              {address.fullName || "Nespecificat"}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
              Număr de Telefon
            </span>
            <span className="text-stone-800 dark:text-zinc-200">
              {address.phoneNumber || "Nespecificat"}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
              Adresă
            </span>
            <span className="text-stone-800 dark:text-zinc-200">
              {address.streetAddress || address.addressLine || "Nespecificat"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
                Oraș
              </span>
              <span className="text-stone-900 dark:text-zinc-200 font-semibold">
                {address.city || "Nespecificat"}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
                Județ / Regiune
              </span>
              <span className="text-stone-900 dark:text-zinc-200 font-semibold">
                {address.state || address.county || "Romania"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
              Țară
            </span>
            <span className="text-stone-800 dark:text-zinc-200">
              {address.country || "România"}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-700 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider border border-stone-200 dark:border-zinc-800 cursor-pointer shadow-sm"
          >
            Înapoi la comenzi
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressDetailsModal;
