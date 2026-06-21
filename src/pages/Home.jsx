import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import ProductCard from "../components/ProductCard";
import CategorySidebar from "../components/CategorySidebar";
import SearchBar from "../components/SearchBar"; // <-- Importăm noua componentă

function Home() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Toate");
  const [searchQuery, setSearchQuery] = useState(""); // <-- Stare nouă pentru textul căutat
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const responseData = await productService.getAllProducts();

        let productsList = [];
        if (responseData && responseData.products) {
          productsList = responseData.products;
        } else if (Array.isArray(responseData)) {
          productsList = responseData;
        }
        setProducts(productsList);
      } catch (err) {
        console.error("Eroare la încărcarea produselor:", err);
        setError("Nu s-au putut încărca produsele.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  {
    /* LOGICĂ DUBLĂ DE FILTRARE:
      Filtrează produsele în funcție de Categoria din stânga ȘI Textul din SearchBar
  */
  }
  const filteredProducts = products.filter((prod) => {
    // 1. Verificăm potrivirea categoriei
    const matchesCategory =
      selectedCategory === "Toate" || prod?.category?.name === selectedCategory;

    // 2. Verificăm dacă textul se află în Nume sau în Categorie (transformăm în litere mici ca să nu conteze Caps Lock)
    const lowerQuery = searchQuery.toLowerCase().trim();
    const matchesSearch =
      prod?.name?.toLowerCase().includes(lowerQuery) ||
      prod?.category?.name?.toLowerCase().includes(lowerQuery);

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-medium">
        Se încarcă magazinul...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-medium text-rose-400">
        {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Categorii în stânga */}
          <CategorySidebar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              // Opțional: Când schimbi categoria, putem curăța căutarea text sau o putem lăsa
            }}
            productsCount={products.length}
          />

          {/* Secțiunea de Produse în dreapta */}
          <section className="flex-1 flex flex-col">
            {/* Componenta SearchBar integrată perfect deasupra produselor */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {/* Titlu Secțiune și Contor */}
            <div className="mb-6 flex justify-between items-center px-1">
              <h1 className="text-xl font-extrabold text-white tracking-tight capitalize">
                {selectedCategory === "Toate"
                  ? "Toate Produsele"
                  : selectedCategory}
                {searchQuery && (
                  <span className="text-zinc-500 font-normal text-sm lowercase">
                    {" "}
                    (rezultate pentru "{searchQuery}")
                  </span>
                )}
              </h1>
              <p className="text-xs text-zinc-500 font-medium">
                Se afișează {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "produs" : "produse"}
              </p>
            </div>

            {/* Randare Grid sau Mesaj Gol */}
            {filteredProducts.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-400">
                Nu s-a găsit niciun produs care să se potrivească criteriilor
                tale.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Home;
