import React, { useState, useEffect } from "react";

function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  categories,
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

  // Stări pentru gestionarea unei categorii noi direct din modal
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || "",
          description: editingProduct.description || "",
          price: editingProduct.price || "",
          stock: editingProduct.stock || "",
          categoryId: editingProduct.categoryId || categories[0]?.id || "",
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
          categoryId: categories[0]?.id || "",
          altImage: "",
          image: null,
        });
        setIsNewCategory(false);
        setNewCategoryName("");
      }
    }
  }, [isOpen, editingProduct, categories]);

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

    // Trimitem datele produsului împreună cu intenția de categorie nouă (dacă e cazul)
    onSubmit({
      ...formData,
      isNewCategory,
      newCategoryName: isNewCategory ? newCategoryName.trim() : "",
    });
  };

  return (
    // MODIFICAT: Fundalul overlay-ului adaptat (semi-transparent întunecat pe ambele pentru focalizare vizuală)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* MODIFICAT: Fereastra modală devine bg-white și border-stone-200 pe light mode */}
      <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto transition-colors duration-300">
        {/* Buton Închidere */}
        <button
          onClick={onClose}
          // MODIFICAT: text-stone-400 și hover fin pe light mode
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-white transition-colors cursor-pointer text-sm font-bold"
        >
          ✕
        </button>

        {/* MODIFICAT: Titlu text-stone-900 pe light mode */}
        <h2 className="text-lg font-black uppercase text-stone-900 dark:text-white tracking-tight mb-4">
          {editingProduct
            ? `Editează Produsul #${editingProduct.id}`
            : "Adaugă un Produs Nou"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nume Produs */}
          <div>
            {/* MODIFICAT: Label-uri text-stone-600 pentru contrast pe fundal alb */}
            <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
              Nume Produs *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              // MODIFICAT: bg-stone-50, border-stone-200 și text-stone-800 pe light mode
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-800 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 shadow-sm dark:shadow-none"
            />
          </div>

          {/* Descriere */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
              Descriere
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-800 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 resize-none shadow-sm dark:shadow-none"
            ></textarea>
          </div>

          {/* Preț și Stoc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
                Preț (RON) *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-800 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 shadow-sm dark:shadow-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
                Stoc Inițial *
              </label>
              <input
                type="number"
                name="stock"
                required
                disabled={!!editingProduct}
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-800 dark:text-white focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 disabled:opacity-40 dark:disabled:opacity-50 shadow-sm dark:shadow-none"
              />
            </div>
          </div>

          {/* Selectare Categorie sau Opțiune Nouă */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
              Categorie *
            </label>
            <select
              name="categoryId"
              value={isNewCategory ? "NEW_CATEGORY" : formData.categoryId}
              onChange={handleCategoryChange}
              // MODIFICAT: text-emerald-600 pe light mode pentru lizibilitate optimă
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-emerald-600 dark:text-emerald-400 font-bold focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 shadow-sm dark:shadow-none"
            >
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  // MODIFICAT: text-stone-800 pe light mode în opțiuni
                  className="text-stone-800 dark:text-white bg-white dark:bg-zinc-950"
                >
                  {cat.name}
                </option>
              ))}
              <option
                value="NEW_CATEGORY"
                className="text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-zinc-950"
              >
                + Adaugă categorie nouă...
              </option>
            </select>
          </div>

          {/* Câmp dinamic apărut doar dacă se dorește o categorie nouă */}
          {isNewCategory && (
            // MODIFICAT: bg-stone-100/50 și border-stone-300 adaptiv
            <div className="bg-stone-100/50 dark:bg-zinc-950/50 p-4 border border-dashed border-stone-300 dark:border-zinc-800 rounded-xl animate-fade-in space-y-2">
              <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                Nume Categorie Nouă *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Încălțăminte, Accesorii"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-800 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          )}

          {/* Imagine Produs */}
          {/* MODIFICAT: Border separator adaptat */}
          <div className="border-t border-stone-200 dark:border-zinc-800 pt-3">
            <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
              Imagine Produs {editingProduct ? "(Opțional)" : "*"}
            </label>
            <input
              type="file"
              accept="image/*"
              required={!editingProduct}
              onChange={handleFileChange}
              // MODIFICAT: file:bg-stone-200 și file:text-stone-700 pe light mode pentru un contrast ridicat
              className="w-full text-xs text-stone-400 dark:text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-stone-200 dark:file:bg-zinc-800 file:text-stone-700 dark:file:text-zinc-200 hover:file:bg-stone-300 dark:hover:file:bg-zinc-700 cursor-pointer transition-all"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase mb-1.5">
              Descriere Alternativă Imagine (Alt Text) *
            </label>
            <input
              type="text"
              name="altImage"
              required={!editingProduct || !!formData.image}
              placeholder="Ex: Hanorac negru streetwear, detalii brodate"
              value={formData.altImage}
              onChange={handleInputChange}
              // MODIFICAT: placeholder-stone-400 pe light mode
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 rounded-xl p-3 text-sm text-stone-800 dark:text-white placeholder-stone-400 dark:placeholder-zinc-500 focus:outline-none focus:border-stone-400 dark:focus:border-zinc-700 shadow-sm dark:shadow-none"
            />
          </div>

          {/* Acțiuni Formular */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              // MODIFICAT: bg-stone-200 și text-stone-700 pe light mode
              className="bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 text-xs font-bold uppercase px-4 py-3 rounded-xl transition-all cursor-pointer"
            >
              Anulează
            </button>
            <button
              type="submit"
              // MODIFICAT: bg-emerald-600 și text-white pe light mode pentru standardele de contrast
              className="bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-zinc-950 text-xs font-black uppercase px-4 py-3 rounded-xl transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {editingProduct ? "Salvează Modificările" : "Creează Produs"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
