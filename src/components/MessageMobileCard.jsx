import React from "react";

function MessageMobileCard({ msg, onOpen }) {
  const dateFormatted = msg.createdAt
    ? new Date(msg.createdAt).toLocaleDateString("ro-RO")
    : "N/A";

  const isRead = msg.isRead;

  return (
    <div
      onClick={() => onOpen(msg)}
      // CORECTAT: Înlocuit bg-zinc-900 și opacity-70 cu fundaluri specifice fiecărui mod (bg-white / bg-stone-50 pe light mode)
      className={`border rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden transition-all cursor-pointer ${
        isRead
          ? "bg-white dark:bg-zinc-900/60 border-stone-200 dark:border-zinc-800/80"
          : "bg-emerald-500/[0.03] dark:bg-zinc-900 border-emerald-300 dark:border-emerald-500/30 ring-1 ring-emerald-500/[0.08] dark:ring-emerald-500/10"
      }`}
    >
      {/* Badge "Nou" */}
      {!isRead && (
        <div className="absolute top-0 right-0 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-bl-lg">
          Nou
        </div>
      )}

      {/* Card Header */}
      {/* CORECTAT: border-stone-100 pe light mode */}
      <div className="flex justify-between items-start border-b border-stone-100 dark:border-zinc-800/60 pb-2.5">
        <div>
          <h3
            // CORECTAT: text-stone-900 (necitit) și text-stone-700 (citit) pentru contrast optim pe zi
            className={`text-sm ${
              !isRead
                ? "font-black text-stone-900 dark:text-white"
                : "font-bold text-stone-700 dark:text-zinc-300"
            }`}
          >
            {msg.name || "Anonim"}
          </h3>
          {/* CORECTAT: text-stone-600 pe light mode */}
          <span className="text-[11px] text-stone-600 dark:text-zinc-400 font-mono block mt-0.5">
            {msg.email}
          </span>
        </div>
        {/* CORECTAT: bg-stone-100 și border-stone-200 / text-stone-700 pe light mode */}
        <span className="text-[11px] text-stone-700 dark:text-zinc-400 font-bold bg-stone-100 dark:bg-zinc-950 px-2 py-0.5 border border-stone-200 dark:border-zinc-850 rounded-md whitespace-nowrap">
          {dateFormatted}
        </span>
      </div>

      {/* Card Content */}
      <div className="text-xs space-y-1">
        {/* CORECTAT: text-stone-400 pe light mode */}
        <span className="text-stone-400 dark:text-zinc-400 font-black uppercase tracking-wider block">
          Subiect
        </span>
        <p
          // CORECTAT: text-emerald-700 (necitit) și text-stone-900 (citit) pe light mode
          className={`font-medium truncate ${
            !isRead
              ? "text-emerald-700 dark:text-emerald-300 font-black"
              : "text-stone-900 dark:text-zinc-200"
          }`}
        >
          {msg.subject || "Fără subiect specificat"}
        </p>
        {/* CORECTAT: text-stone-600 pe light mode pentru lizibilitatea fragmentului din mesaj */}
        <p className="text-stone-600 dark:text-zinc-400 line-clamp-2 mt-1 italic leading-relaxed">
          "{msg.message}"
        </p>
      </div>

      {/* Card Action */}
      <div className="pt-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onOpen(msg)}
          // CORECTAT: Butoanele folosesc culori solide pe light mode (bg-stone-100 pentru cele citite)
          className={`w-full py-2.5 text-xs rounded-xl font-bold transition-all text-center cursor-pointer shadow-sm ${
            !isRead
              ? "bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black hover:bg-emerald-700 dark:hover:bg-emerald-600"
              : "bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 text-stone-700 hover:text-stone-900 dark:text-zinc-200 dark:hover:text-white border border-stone-200/60 dark:border-transparent"
          }`}
        >
          {isRead ? "📖 Recitește complet" : "✉️ Deschide și citește"}
        </button>
      </div>
    </div>
  );
}

export default MessageMobileCard;
