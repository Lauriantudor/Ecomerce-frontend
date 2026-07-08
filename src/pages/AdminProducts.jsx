import React, { useState, useEffect, useRef } from "react";
import productService from "../services/productService";
import categoriesService from "../services/categoriesService";
import ProductFormModal from "../components/products/ProductFormModal";
import CategoryManager from "../components/products/CategoryManager";
import ProductTable from "../components/products/ProductTable";
import { toast } from "sonner";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Referință esențială pentru controlul focusului la închiderea modalelor
  const lastFocusedElementRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const prodData = await productService.getAllProducts();
      console.log("Răspuns API Produse:", prodData);
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
    lastFocusedElementRef.current = document.activeElement;
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    lastFocusedElementRef.current = document.activeElement;
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Returnăm focusul pe elementul din tabel sau din header care a deschis acțiunea
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 0);
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
        toast.success("Produsul a fost actualizat cu succes!");
      } else {
        await productService.saveProduct(formDataToSend);
        toast.success("Produsul a fost adăugat în catalog!");
      }

      handleCloseModal();
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || err.message || "Eroare la salvare.",
      );
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi acest produs?")) return;
    try {
      await productService.deleteProduct(id);
      toast.success("Produsul a fost eliminat din baza de date.");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Eroare la ștergerea produsului.");
    }
  };

  const handleUpdateStock = async (id, qty) => {
    try {
      await productService.addStock(id, qty);
      toast.success("Stocul a fost actualizat cu succes!");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Eroare la actualizarea stocului.");
    }
  };

  const handleSaveCategory = async (name) => {
    try {
      await categoriesService.saveCategory(name);
      toast.success(`Categoria "${name}" a fost salvată!`);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Eroare la salvarea categoriei.",
      );
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    try {
      await categoriesService.updateCategory(id, { name: newName });
      toast.success("Categoria a fost modificată!");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Eroare la modificarea categoriei.",
      );
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
      toast.success("Categoria a fost ștearsă definitiv.");
      loadData();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Eroare la ștergerea categoriei.",
      );
    }
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-600 dark:text-zinc-400 flex items-center justify-center font-medium p-4 text-center transition-colors duration-300"
      >
        Se încarcă datele de administrare...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-medium p-4 text-center transition-colors duration-300"
      >
        <span aria-hidden="true" className="mr-2">
          ⚠️
        </span>{" "}
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 px-4 sm:px-6 lg:px-8 py-6">
      {/* Antet flexibil */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-zinc-900 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
            Dashboard Administrare
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 mt-1">
            Catalog produse, stocuri și management categorii.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto text-center bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-zinc-950 font-black text-xs uppercase px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md dark:shadow-lg dark:shadow-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        >
          Adaugă Produs Nou
        </button>
      </div>

      {/* Secțiuni de conținut separate logic */}
      <div className="space-y-6 sm:space-y-10">
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
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingProduct={editingProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default AdminProducts;
