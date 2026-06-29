import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import categoryService from "../services/categoriesService";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import SearchBar from "../components/SearchBar";

// IMPORTĂM COMPONENTA DE PAGINARE PE CARE AM CREAT-O DEJA COMANA
import Pagination from "../components/Pagination";

function Home() {
  const [products, setProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryNameDisplayed, setCategoryNameDisplayed] =
    useState("Toate Produsele");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ─── STĂRI PENTRU PAGINARE ───
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Setat la 6 conform standardului tău vizual

  const fetchAllProducts = async (isFirstLoad = false) => {
    try {
      setLoading(true);
      setError("");
      const responseData = await productService.getAllProducts();

      let productsList = [];
      if (responseData && responseData.products) {
        productsList = responseData.products;
      } else if (Array.isArray(responseData)) {
        productsList = responseData;
      }

      setProducts(productsList);

      if (isFirstLoad) {
        setTotalProductsCount(productsList.length);
      }

      setCategoryNameDisplayed("Toate Produsele");
    } catch (err) {
      console.error("Eroare la încărcarea produselor globale:", err);
      setError("Nu s-au putut încărca produsele globale.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts(true);
  }, []);

  const handleCategorySelection = async (catId) => {
    setSelectedCategory(catId);
    setError("");
    setCurrentPage(1); // Resetăm pagina la 1 când schimbăm categoria

    if (catId === "all") {
      await fetchAllProducts(false);
      return;
    }

    try {
      setLoading(true);
      const responseData = await categoryService.getCategoryById(catId);
      const targetCategory = responseData?.category || responseData;

      if (targetCategory && !targetCategory.error) {
        setProducts(targetCategory.products || responseData.products || []);
        setCategoryNameDisplayed(targetCategory.name || "Categorie");
      } else {
        setProducts([]);
        setError("Categoria selectată nu a putut fi procesată corect.");
      }
    } catch (err) {
      console.error(`Eroare la încărcarea categoriei cu ID ${catId}:`, err);
      setProducts([]);
      setError("Nu s-au putut aduce produsele din această categorie.");
    } finally {
      setLoading(false);
    }
  };

  // Resetăm pagina la 1 atunci când utilizatorul tastează în SearchBar
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Toate produsele filtrate conform căutării
  const filteredProducts = products.filter((prod) => {
    const lowerQuery = searchQuery.toLowerCase().trim();
    if (!lowerQuery) return true;

    return (
      prod?.name?.toLowerCase().includes(lowerQuery) ||
      prod?.category?.name?.toLowerCase().includes(lowerQuery)
    );
  });

  // ─── LOGICĂ TĂIERE LISTĂ PENTRU PAGINĂ CURENTĂ ───
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Produsele care se vor randa efectiv pe ecran pe pagina curentă
  const currentProductsDisplayed = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );

  // Calculăm dinamic numărul total de pagini necesare
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // MODIFICAT: Ecranul de încărcare folosește text adaptiv și fundal transparent pentru a lăsa index.css să controleze culoarea
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white flex items-center justify-center font-medium">
        Se încarcă magazinul...
      </div>
    );
  }

  return (
    // MODIFICAT: Am scos bg-zinc-950 de aici și am pus text adaptiv (text-zinc-900 / dark:text-zinc-100)

    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Categorii */}
        <CategorySidebar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelection}
          productsCount={totalProductsCount}
        />

        {/* Secțiunea de Produse */}
        <section className="flex-1 flex flex-col">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          {/* Titlu Secțiune și Contor local curent */}
          <div className="mb-6 flex justify-between items-center px-1">
            {/* MODIFICAT: Titlul text-zinc-900 pe light, text-white pe dark */}
            <h1 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight capitalize">
              {categoryNameDisplayed}
              {searchQuery && (
                <span className="text-zinc-400 dark:text-zinc-500 font-normal text-sm lowercase">
                  {" "}
                  (rezultate pentru "{searchQuery}")
                </span>
              )}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Se afișează {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "produs" : "produse"}
            </p>
          </div>

          {error ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-rose-950/40 rounded-3xl p-12 text-center text-rose-600 dark:text-rose-400 font-medium shadow-sm">
              ⚠️ {error} <br />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal block mt-2">
                Încearcă să selectezi altă categorie din meniul din stânga.
              </span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 dark:text-zinc-400 shadow-sm">
              Nu s-a găsit niciun produs care să se potrivească criteriilor
              tale.
            </div>
          ) : (
            <>
              {/* Grid-ul cu produsele paginii curente */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProductsDisplayed.map((product) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                  />
                ))}
              </div>

              {/* ─── UTILIZAREA COMPONENTEI GENERICE DE PAGINARE ─── */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;
