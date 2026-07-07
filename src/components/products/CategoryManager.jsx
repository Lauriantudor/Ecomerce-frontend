import React, { useState } from "react";

function CategoryManager({
  categories,
  onSaveCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryNameInline, setNewCategoryNameInline] = useState("");

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const handleStartEdit = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setIsCreatingCategory(false);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const handleSaveUpdate = async (id) => {
    if (!editingCategoryName.trim())
      return alert("Numele categoriei nu poate fi gol.");
    await onUpdateCategory(id, editingCategoryName);
    setEditingCategoryId(null);
  };

  const handleSaveCreate = async () => {
    if (!newCategoryNameInline.trim())
      return alert("Introdu un nume pentru noua categorie.");
    await onSaveCategory(newCategoryNameInline);
    setNewCategoryNameInline("");
    setIsCreatingCategory(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-800 dark:text-zinc-300">
            Management Categorii Existente
          </h2>
          <p className="text-xs text-stone-600 dark:text-zinc-400">
            Editează numele sau elimină categoriile din baza de date.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreatingCategory(!isCreatingCategory);
            setEditingCategoryId(null);
          }}
          className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 dark:hover:text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all border border-stone-200 dark:border-zinc-700/40 cursor-pointer"
        >
          <span>{isCreatingCategory ? "Închide" : "➕ Categorie Nouă"}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
        {/* Adăugare Inline */}
        {isCreatingCategory && (
          <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-50/5 border border-emerald-200 dark:border-emerald-50/20 rounded-xl px-3 py-2 text-sm w-full sm:w-auto justify-between sm:justify-start">
            <input
              type="text"
              placeholder="Nume..."
              value={newCategoryNameInline}
              onChange={(e) => setNewCategoryNameInline(e.target.value)}
              className="bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-lg text-xs px-2 py-1 text-stone-800 dark:text-white w-28 sm:w-32 focus:outline-none focus:border-emerald-500 shadow-sm dark:shadow-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveCreate}
                className="text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Adaugă
              </button>
              <button
                onClick={() => {
                  setIsCreatingCategory(false);
                  setNewCategoryNameInline("");
                }}
                className="text-stone-600 dark:text-zinc-400 font-bold text-xs hover:text-stone-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                Anulează
              </button>
            </div>
          </div>
        )}

        {/* Listare Categorii */}
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm max-w-full transition-colors"
          >
            {editingCategoryId === cat.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                  className="bg-white dark:bg-zinc-900 border border-stone-300 dark:border-zinc-700 rounded-lg text-xs px-2 py-1 text-stone-800 dark:text-white w-24 sm:w-28 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
                <button
                  onClick={() => handleSaveUpdate(cat.id)}
                  className="text-emerald-700 dark:text-emerald-400 font-bold text-xs hover:underline cursor-pointer"
                >
                  Ok
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="text-stone-600 dark:text-zinc-400 font-bold text-xs hover:underline cursor-pointer"
                >
                  X
                </button>
              </div>
            ) : (
              <>
                <span className="font-medium text-stone-800 dark:text-zinc-200 capitalize truncate max-w-30 sm:max-w-50">
                  {cat.name}
                </span>
                <div className="flex items-center gap-1.5 ml-1 border-l border-stone-200 dark:border-zinc-800 pl-1.5 shrink-0">
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="text-xs text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white font-medium cursor-pointer transition-colors"
                  >
                    Editează
                  </button>
                  <span className="text-stone-300 dark:text-zinc-700 text-xs select-none">
                    |
                  </span>
                  <button
                    onClick={() => onDeleteCategory(cat.id, cat.name)}
                    className="text-xs text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 font-medium cursor-pointer transition-colors"
                  >
                    Șterge
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {categories.length === 0 && !isCreatingCategory && (
          <p className="text-xs text-stone-500 dark:text-zinc-500 italic px-1 py-1">
            Nu există nicio categorie în baza de date.
          </p>
        )}
      </div>
    </div>
  );
}

export default CategoryManager;
