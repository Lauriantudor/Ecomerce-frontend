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
      // CORECTAT: Schimbat din bg-black/85 în bg-black/45 pentru a nu mai întuneca excesiv ecranul din spate
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        // MODIFICAT: bg-white și border-stone-200 pe light mode
        className="w-full max-w-lg bg-white dark:bg-[#141414] border border-stone-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh] transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        {/* MODIFICAT: border-stone-100 pe light mode */}
        <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-900 pb-3">
          {/* MODIFICAT: text-stone-900 pe light mode */}
          <h2 className="text-base font-black text-stone-900 dark:text-zinc-100 uppercase tracking-wide">
            Vizualizare Solicitare
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            // MODIFICAT: text-stone-400 și hover:text-stone-700 pe light mode
            className="text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-white p-2 rounded-xl text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Date de Identificare */}
        {/* MODIFICAT: bg-stone-50, border-stone-200 și text-stone-700 pe light mode */}
        <div className="bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-900 rounded-xl space-y-3 text-sm text-stone-700 dark:text-zinc-300 shadow-sm dark:shadow-none">
          <div className="grid grid-cols-2 gap-4">
            <div>
              {/* MODIFICAT: text-stone-400 pe light mode */}
              <span className="text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
                Expeditor
              </span>
              {/* MODIFICAT: text-stone-900 pe light mode */}
              <span className="text-stone-900 dark:text-white font-bold">
                {message.name}
              </span>
            </div>
            <div>
              {/* MODIFICAT: text-stone-400 pe light mode */}
              <span className="text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
                Data Primirii
              </span>
              {/* MODIFICAT: text-stone-900 pe light mode */}
              <span className="text-stone-900 dark:text-zinc-300 font-semibold">
                {message.createdAt
                  ? new Date(message.createdAt).toLocaleDateString("ro-RO")
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="border-t border-stone-200/60 dark:border-zinc-900 pt-2">
            {/* MODIFICAT: text-stone-400 pe light mode */}
            <span className="text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider block mb-0.5">
              Adresă Email
            </span>
            {/* MODIFICAT: text-stone-800 pe light mode */}
            <span className="text-stone-800 dark:text-zinc-300 font-mono text-xs font-semibold">
              {message.email}
            </span>
          </div>
        </div>

        {/* Subiect */}
        <div className="space-y-1.5 text-sm">
          {/* MODIFICAT: text-stone-400 pe light mode */}
          <span className="text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider block px-1">
            Subiect
          </span>
          {/* MODIFICAT: bg-stone-50, border-stone-200 și text-stone-900 pe light mode */}
          <p className="text-stone-900 dark:text-zinc-100 font-bold bg-stone-50 dark:bg-zinc-950 px-4 py-2.5 border border-stone-200 dark:border-zinc-900 rounded-xl shadow-sm dark:shadow-none">
            {message.subject || "Fără subiect"}
          </p>
        </div>

        {/* Corpul Mesajului */}
        <div className="space-y-1.5 text-sm">
          {/* MODIFICAT: text-stone-400 pe light mode */}
          <span className="text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider block px-1">
            Mesaj Complet
          </span>
          {/* MODIFICAT: text-stone-800, bg-stone-50 și border-stone-200 pe light mode */}
          <div className="text-stone-800 dark:text-zinc-200 bg-stone-50 dark:bg-zinc-950 p-4 border border-stone-200 dark:border-zinc-900 rounded-xl whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-medium shadow-sm dark:shadow-none">
            {message.message}
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            // MODIFICAT: bg-stone-100, hover:bg-stone-200, text-stone-700, hover:text-stone-900 și border-stone-200 pe light mode
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
