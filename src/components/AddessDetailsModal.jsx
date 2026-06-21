import React, { useEffect, useRef } from "react";

function AddessDetailsModal({ address, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!address) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-modal-title"
        className="w-full max-w-md bg-[#161616] border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
          <h3
            id="address-modal-title"
            className="text-base font-black text-zinc-100 uppercase tracking-wide"
          >
            Date Complete Livrare
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-2 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600"
            aria-label="Închide detaliile adresei"
          >
            ✕
          </button>
        </div>

        {/* Datele Structurate din Baza ta de Date */}
        <div className="space-y-4 text-sm text-zinc-300">
          <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-xl space-y-3">
            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase block tracking-wider">
                Destinatar
              </span>
              <p className="text-zinc-200 font-bold text-base mt-0.5">
                {address.fullName || address.fullname}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase block tracking-wider">
                Număr de Telefon
              </span>
              <p className="text-zinc-200 font-mono mt-0.5">
                {address.phoneNumber || address.phonenumber || "Nespecificat"}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase block tracking-wider">
                Adresă
              </span>
              <p className="text-zinc-200 mt-0.5">
                {address.streetAddress || address.street}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase block tracking-wider">
                  Oraș
                </span>
                <p className="text-zinc-200 mt-0.5">{address.city}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase block tracking-wider">
                  Județ / Regiune
                </span>
                <p className="text-zinc-200 mt-0.5">
                  {address.county || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-zinc-500 uppercase block tracking-wider">
                Țară
              </span>
              <p className="text-zinc-200 mt-0.5">
                {address.country || "Romania"}
              </p>
            </div>
          </div>
        </div>

        {/* Buton Închidere la Baza Modalului */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-600"
        >
          Înapoi la detalii comandă
        </button>
      </div>
    </div>
  );
}

export default AddessDetailsModal;
