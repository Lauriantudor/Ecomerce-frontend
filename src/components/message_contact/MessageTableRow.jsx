import React from "react";

function MessageTableRow({ msg, onOpen }) {
  const dateFormatted = msg.createdAt
    ? new Date(msg.createdAt).toLocaleDateString("ro-RO")
    : "N/A";

  const isRead = msg.isRead;

  return (
    <tr
      onClick={() => onOpen(msg)}
      className={`transition-colors text-sm cursor-pointer border-b border-stone-100 dark:border-zinc-800/60 ${
        isRead
          ? "bg-transparent hover:bg-stone-50 dark:hover:bg-zinc-850/20"
          : "bg-emerald-500/[0.04] dark:bg-emerald-500/5 hover:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/10"
      }`}
    >
      <td
        className="p-5 text-center align-middle"
        onClick={(e) => e.stopPropagation()}
      >
        {isRead ? (
          <span
            className="text-stone-500 dark:text-zinc-500 text-xs font-bold"
            title="Mesaj citit"
          >
            ✓
          </span>
        ) : (
          <span
            className="inline-block w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"
            title="Nou / Necitit"
          />
        )}
      </td>

      <td
        className={`p-5 transition-colors ${
          !isRead
            ? "font-bold text-stone-900 dark:text-white"
            : "font-medium text-stone-700 dark:text-zinc-300"
        }`}
      >
        {msg.name || "Anonim"}
      </td>

      <td className="p-5 text-stone-600 dark:text-zinc-400 font-mono text-xs">
        {msg.email}
      </td>

      <td className="p-5 max-w-xs truncate">
        <span
          className={`block mb-0.5 truncate ${
            !isRead
              ? "text-emerald-700 dark:text-emerald-300 font-black"
              : "text-stone-900 dark:text-zinc-300 font-bold"
          }`}
        >
          {msg.subject || "Fără subiect"}
        </span>

        <span
          className={`truncate block text-xs ${
            !isRead
              ? "text-stone-800 dark:text-zinc-200 font-medium"
              : "text-stone-600 dark:text-zinc-400"
          }`}
        >
          {msg.message}
        </span>
      </td>

      <td className="p-5 text-stone-700 dark:text-zinc-400 font-semibold text-xs whitespace-nowrap">
        {dateFormatted}
      </td>

      <td
        className="p-5 text-right whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpen(msg)}
          className={`text-xs px-3 py-1.5 rounded-xl border transition-all font-bold cursor-pointer focus:outline-none shadow-sm ${
            !isRead
              ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-black border-emerald-600 dark:border-emerald-400"
              : "bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 hover:text-stone-900 dark:text-zinc-200 dark:hover:text-white border-stone-200 dark:border-zinc-750"
          }`}
        >
          <span aria-hidden="true">📖</span> {isRead ? "Recitește" : "Citește"}
        </button>
      </td>
    </tr>
  );
}

export default MessageTableRow;
