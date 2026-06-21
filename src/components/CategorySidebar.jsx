import React, { useEffect, useState } from "react";
import categoryService from "../services/categoriesService";

function CategorySidebar({
  selectedCategory,
  onSelectCategory,
  productsCount,
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
        console.error("Eror fetching the categories" + error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-zinc-500 text-sm animate-pulse">
        Se încarcă categoriile...
      </div>
    );
  }
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sticky top-24 shadow-xl">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 px-1">
          Categorii
        </h2>

        <ul className="space-y-1">
          {/* Opțiunea implicită: Toate produsele */}
          <li>
            <button
              onClick={() => onSelectCategory("Toate")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                selectedCategory === "Toate"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <span>Toate produsele</span>
              <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-500">
                {productsCount}
              </span>
            </button>
          </li>

          {/* Listarea categoriilor venite din DB rute */}
          {categories.map((cat) => {
            // Verificăm dacă obiectul are .name (din DB) sau e string direct
            const catName = cat?.name || cat;
            const catId = cat?.id || catName;

            return (
              <li key={catId}>
                <button
                  onClick={() => onSelectCategory(catName)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-between capitalize ${
                    selectedCategory === catName
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent"
                  }`}
                >
                  <span>{catName}</span>
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
