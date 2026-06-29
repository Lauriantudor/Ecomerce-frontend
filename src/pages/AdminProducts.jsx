import React, { useState, useEffect } from "react";
import productService from "../services/productService";
import categoriesService from "../services/categoriesService";
import ProductFormModal from "../components/ProductFormModal";
import CategoryManager from "../components/CategoryManager";
import ProductTable from "../components/ProductTable";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const prodData = await productService.getAllProducts();
      const catData = await categoriesService.getCategories();

      setProducts(prodData.products || prodData || []);
      setCategories(catData.categories || catData || []);
    } catch (err) {
      console.error(err);
      setError("Nu s-au putut încărca datele de administrare.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (modalData) => {
    try {
      let finalCategoryId = modalData.categoryId;

      if (modalData.isNewCategory && modalData.newCategoryName) {
        const newCatResponse = await categoriesService.saveCategory(
          modalData.newCategoryName,
        );
        finalCategoryId =
          newCatResponse?.id ||
          newCatResponse?.categoryID ||
          newCatResponse?.category?.id ||
          newCatResponse?.data?.id;
        if (!finalCategoryId)
          throw new Error("ID-ul noii categorii nu a putut fi preluat.");
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", modalData.name);
      formDataToSend.append("description", modalData.description);
      formDataToSend.append("price", modalData.price);
      formDataToSend.append("categoryId", finalCategoryId);

      if (modalData.altImage)
        formDataToSend.append("altImage", modalData.altImage);
      if (!editingProduct) formDataToSend.append("stock", modalData.stock);
      if (modalData.image) formDataToSend.append("image", modalData.image);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formDataToSend);
        alert("Produsul a fost actualizat!");
      } else {
        await productService.saveProduct(formDataToSend);
        alert("Produsul a fost adăugat!");
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Eroare la salvare.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest produs?")) return;
    try {
      await productService.deleteProduct(id);
      alert("Produs eliminat.");
      loadData();
    } catch (err) {
      alert("Eroare la ștergerea produsului.");
    }
  };

  const handleUpdateStock = async (id, qty) => {
    try {
      await productService.addStock(id, qty);
      alert("Stoc actualizat cu succes!");
      loadData();
    } catch (err) {
      alert("Eroare la actualizarea stocului.");
    }
  };

  const handleSaveCategory = async (name) => {
    try {
      await categoriesService.saveCategory(name);
      alert("Categorie nouă salvată!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Eroare la salvarea categoriei.");
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    try {
      await categoriesService.updateCategory(id, { name: newName });
      alert("Categoria a fost modificată!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Eroare la modificarea categoriei.");
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (
      !window.confirm(
        `Sigur vrei să ștergi categoria "${name}"? Produsele asociate pot rămâne fără categorie.`,
      )
    )
      return;
    try {
      await categoriesService.deleteCategory(id);
      alert("Categoria a fost ștearsă!");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Eroare la ștergerea categoriei.");
    }
  };

  if (loading)
    return (
      // MODIFICAT: Fundal adaptiv stone-50 / zinc-950 pentru starea de loading
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-500 dark:text-zinc-400 flex items-center justify-center font-medium p-4 text-center transition-colors duration-300">
        Se încarcă datele...
      </div>
    );
  if (error)
    return (
      // MODIFICAT: Fundal adaptiv stone-50 / zinc-950 pentru starea de eroare
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-medium p-4 text-center transition-colors duration-300">
        {error}
      </div>
    );

  return (
    // MODIFICAT: bg-stone-50 pe light mode, culori adaptate pentru text principal
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-zinc-100 py-6 sm:py-8 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        {/* Antet flexibil și adaptabil pe ecrane mici */}
        {/* MODIFICAT: Border discret adaptiv */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-zinc-900 pb-6">
          <div>
            {/* MODIFICAT: text-stone-900 pe light mode */}
            <h1 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
              Dashboard Administrare
            </h1>
            {/* MODIFICAT: text-stone-400 pe light mode */}
            <p className="text-xs text-stone-500 dark:text-zinc-500 mt-1">
              Catalog produse, stocuri și management categorii.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            // MODIFICAT: bg-emerald-600 și text-white pe light mode pentru un contrast premium adaptat
            className="w-full sm:w-auto text-center bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-zinc-950 font-black text-xs uppercase px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md dark:shadow-lg dark:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Adaugă Produs Nou
          </button>
        </div>

        <CategoryManager
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />

        <ProductTable
          products={products}
          onEditProduct={handleOpenEditModal}
          onDeleteProduct={handleDeleteProduct}
          onUpdateStock={handleUpdateStock}
        />

        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingProduct={editingProduct}
          categories={categories}
          onSubmit={handleFormSubmit}
        />
      </div>
    </main>
  );
}

export default AdminProducts;
