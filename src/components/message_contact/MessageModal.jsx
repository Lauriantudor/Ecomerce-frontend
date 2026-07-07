import React, { useEffect, useRef } from "react";

function MessageModal({ isOpen, message, onClose }) {
  const closeButtonRef = useRef(null);

  // Managementul focusului (WCAG AA Accessibility)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen || !message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg bg-white dark:bg-[#141414] border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh] transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-900 pb-3">
          <h2 className="text-base font-black text-stone-900 dark:text-zinc-100 uppercase tracking-wide">
            Vizualizare Solicitare
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-white p-2 rounded-xl text-sm transition-colors cursor-pointer"
            aria-label="Închide pop-up-ul de adresă"
          >
            ✕
          </button>
        </div>

        {/* Date de Identificare */}
        <div className="bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-900 rounded-xl space-y-3 text-sm shadow-sm dark:shadow-none">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
                Expeditor
              </span>
              <span className="text-stone-900 dark:text-white font-bold">
                {message.name}
              </span>
            </div>
            <div>
              <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
                Data Primirii
              </span>
              <span className="text-stone-900 dark:text-zinc-300 font-semibold">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleDateString("ro-RO")
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="border-t border-stone-200/60 dark:border-zinc-900 pt-2">
            <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
              Adresă Email
            </span>
            <span className="text-stone-800 dark:text-zinc-300 font-mono text-xs font-semibold">
              {message.email}
            </span>
          </div>
        </div>

        <div className="space-y-1.5 text-sm">
          <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block px-1">
            Subiect
          </span>
          <p className="text-stone-900 dark:text-zinc-100 font-bold bg-stone-50 dark:bg-zinc-950 px-4 py-2.5 border border-stone-200 dark:border-zinc-900 rounded-xl shadow-sm dark:shadow-none">
            {message.subject || "Fără subiect"}
          </p>
        </div>

        <div className="space-y-1.5 text-sm">
          <span className="text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider block px-1">
            Mesaj Complet
          </span>
          <div className="text-stone-800 dark:text-zinc-200 bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-900 rounded-xl whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-medium shadow-sm dark:shadow-none">
            {message.message}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-stone-700 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white font-bold text-xs rounded-xl transition-all uppercase tracking-wider border border-stone-200 dark:border-zinc-800 cursor-pointer shadow-sm"
          >
            Înapoi la listă
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
