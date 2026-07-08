import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  categories = [], // Default value pentru siguranță
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    altImage: "",
    image: null,
  });

  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      previousFocusRef.current = document.activeElement;

      if (editingProduct) {
        setFormData({
          name: editingProduct.name || "",
          description: editingProduct.description || "",
          price: editingProduct.price || "",
          stock: editingProduct.stock || "",
          // Dacă produsul are deja categorie o păstrăm, altfel lăsăm gol pentru selectare manuală
          categoryId: editingProduct.categoryId || "",
          altImage: editingProduct.altImage || "",
          image: null,
        });
        setIsNewCategory(false);
        setNewCategoryName("");
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          categoryId: "", // 🌟 String gol implicit pentru a activa placeholder-ul la adăugare
          altImage: "",
          image: null,
        });
        setIsNewCategory(false);
        setNewCategoryName("");
      }

      const mainContent =
        document.getElementById("root") || document.querySelector("main");
      if (mainContent) {
        mainContent.setAttribute("aria-hidden", "true");
      }

      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = "unset";

      const mainContent =
        document.getElementById("root") || document.querySelector("main");
      if (mainContent) {
        mainContent.removeAttribute("aria-hidden");
      }

      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      const mainContent =
        document.getElementById("root") || document.querySelector("main");
      if (mainContent) mainContent.removeAttribute("aria-hidden");
    };
  }, [isOpen, editingProduct]); // Am scos categories de aici pentru a evita resetări inutile în timpul editării

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key !== "Tab") return;

    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
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

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "NEW_CATEGORY") {
      setIsNewCategory(true);
      setFormData((prev) => ({ ...prev, categoryId: "" }));
    } else {
      setIsNewCategory(false);
      setFormData((prev) => ({ ...prev, categoryId: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      isNewCategory,
      newCategoryName: isNewCategory ? newCategoryName.trim() : "",
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
        onKeyDown={handleKeyDown}
        className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto transition-colors duration-300 focus:outline-none"
      >
        {/* Buton Închidere */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Închide modalul"
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer text-sm font-bold focus:outline-none focus:ring-2 focus:ring-stone-400 rounded-full p-1"
        >
          ✕
        </button>

        <h2
          id="modal-title"
          className="text-lg font-black uppercase text-stone-900 dark:text-white tracking-tight mb-4"
        >
          {editingProduct
            ? `Editează Produsul #${editingProduct.id}`
            : "Adaugă un Produs Nou"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nume Produs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
              Nume Produs *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-zinc-800 shadow-sm dark:shadow-none"
            />
          </div>

          {/* Descriere */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
              Descriere
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-zinc-800 resize-none shadow-sm dark:shadow-none"
            ></textarea>
          </div>

          {/* Preț și Stoc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
                Preț (RON) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-zinc-800 shadow-sm dark:shadow-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
                Stoc Inițial *
              </label>
              <input
                type="number"
                name="stock"
                required
                disabled={!!editingProduct}
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 disabled:opacity-40 dark:disabled:opacity-50 shadow-sm dark:shadow-none"
              />
            </div>
          </div>

          {/* Categorie */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
              Categorie *
            </label>
            <select
              name="categoryId"
              required
              value={isNewCategory ? "NEW_CATEGORY" : formData.categoryId}
              onChange={handleCategoryChange}
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-emerald-800 dark:text-emerald-400 font-bold focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-zinc-800 shadow-sm dark:shadow-none"
            >
              {/* 🌟 Rezolvare: Opțiunea implicită dezactivată obligă o schimbare reală de onChange */}
              <option
                value=""
                disabled
                className="text-stone-400 dark:text-zinc-600 bg-white dark:bg-zinc-950"
              >
                -- Selectează o categorie --
              </option>

              {categories &&
                categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                    className="text-stone-900 dark:text-white bg-white dark:bg-zinc-950"
                  >
                    {cat.name}
                  </option>
                ))}

              <option
                value="NEW_CATEGORY"
                className="text-emerald-700 dark:text-emerald-400 font-bold bg-white dark:bg-zinc-950"
              >
                + Adaugă categorie nouă...
              </option>
            </select>
          </div>

          {/* Câmp dinamic Categorie Nouă */}
          {isNewCategory && (
            <div className="bg-stone-100/50 dark:bg-zinc-950/50 p-4 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl animate-fade-in space-y-2">
              <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                Nume Categorie Nouă *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Încălțăminte, Accesorii"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-900 dark:text-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-950"
              />
            </div>
          )}

          {/* Imagine Produs */}
          <div className="border-t border-stone-200 dark:border-zinc-800 pt-3">
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
              Imagine Produs {editingProduct ? "(Opțional)" : "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingProduct}
              onChange={handleFileChange}
              className="w-full text-xs text-stone-500 dark:text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-stone-200 dark:file:bg-zinc-800 file:text-stone-800 dark:file:text-zinc-200 hover:file:bg-stone-300 dark:hover:file:bg-zinc-700 cursor-pointer transition-all focus:outline-none"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-zinc-300 uppercase mb-1.5">
              Descriere Alternativă Imagine (Alt Text) *
            </label>
            <input
              type="text"
              name="altImage"
              required={!editingProduct || !!formData.image}
              placeholder="Ex: Hanorac negru streetwear, detalii brodate"
              value={formData.altImage}
              onChange={handleInputChange}
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-900 dark:text-white placeholder-stone-500 dark:placeholder-zinc-500 focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 focus:ring-2 focus:ring-stone-200 dark:focus:ring-zinc-800 shadow-sm dark:shadow-none"
            />
          </div>

          {/* Acțiuni Formular */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-900 dark:text-zinc-100 text-xs font-bold uppercase px-4 py-3 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400"
            >
              Anulează
            </button>
            <button
              type="submit"
              className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-zinc-950 text-xs font-black uppercase px-4 py-3 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            >
              {editingProduct ? "Salvează Modificările" : "Creează Produs"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default ProductFormModal;
