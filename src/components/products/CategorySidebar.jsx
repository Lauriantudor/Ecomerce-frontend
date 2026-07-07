import React, { useEffect, useState } from "react";
import categoryService from "../../services/categoriesService";

function CategorySidebar({
  selectedCategory,
  onSelectCategory,
  productsCount,
  allProducts = [],
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching the categories: " + error);
        setError(error);
      } finally {
        loading && setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 rounded-2xl p-5 text-stone-500 dark:text-zinc-400 text-sm animate-pulse shadow-sm">
          Se încarcă categoriile...
        </div>
      </aside>
    );
  }

  const totalImutabilProduse = productsCount ?? allProducts.length;

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 rounded-2xl p-5 sticky top-24 shadow-sm transition-colors duration-300">
        <h2
          id="sidebar-categories-title"
          className="text-sm font-black text-stone-700 dark:text-zinc-400 uppercase tracking-wider mb-4 px-1"
        >
          Categorii
        </h2>

        <ul
          role="tablist"
          aria-labelledby="sidebar-categories-title"
          className="space-y-1.5"
        >
          {/* ─── OPȚIUNEA: TOATE PRODUSELE ─── */}
          <li role="presentation">
            <button
              onClick={() => onSelectCategory("all")}
              role="tab"
              aria-selected={selectedCategory === "all" ? "true" : "false"}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                selectedCategory === "all"
                  ? "bg-emerald-600/10 text-emerald-900 dark:text-emerald-400 border border-emerald-600/10 dark:border-emerald-500/20 font-semibold"
                  : "text-stone-700 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <span>Toate produsele</span>

              <span className="sr-only">
                , {totalImutabilProduse} produse disponibile
              </span>

              <span
                aria-hidden="true"
                className="text-xs bg-stone-50 dark:bg-zinc-700 text-stone-700 dark:text-zinc-100 px-2.5 py-0.5 rounded-md font-black shadow-none border border-stone-200/60 dark:border-zinc-600/30"
              >
                {totalImutabilProduse}
              </span>
            </button>
          </li>

          {/* ─── LISTAREA CATEGORIILOR DIN DB ─── */}
          {categories.map((cat) => {
            const catId = typeof cat === "object" ? cat?.id : cat;
            const catName = typeof cat === "object" ? cat?.name : cat;
            const isSelected = selectedCategory === catId;

            return (
              <li key={catId} role="presentation">
                <button
                  onClick={() => onSelectCategory(catId)}
                  role="tab"
                  aria-selected={isSelected ? "true" : "false"}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center capitalize ${
                    isSelected
                      ? "bg-emerald-600/10 text-emerald-900 dark:text-emerald-400 border border-emerald-600/10 dark:border-emerald-500/20 font-semibold"
                      : "text-stone-700 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 hover:bg-stone-50 dark:hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <span className="truncate">{catName}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

export default CategorySidebar;
