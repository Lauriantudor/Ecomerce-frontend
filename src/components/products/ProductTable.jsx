import React, { useState, useEffect } from "react";
import QuantitySelector from "../QuantitySelector";
import Pagination from "../Pagination";

function ProductTable({
  products = [],
  onEditProduct,
  onDeleteProduct,
  onUpdateStock,
}) {
  const [stockQuantities, setStockQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [products.length, totalPages, currentPage]);

  const handleInputChange = (productId, value) => {
    const safeValue = value !== undefined && value !== null ? value : "";
    const cleanValue = safeValue.toString().replace(/[^0-9]/g, "");
    setStockQuantities((prev) => ({ ...prev, [productId]: cleanValue }));
  };

  const handleAlimentareClick = async (productId) => {
    const rawValue = stockQuantities[productId];
    const qty =
      rawValue === "" || rawValue === undefined ? 1 : parseInt(rawValue, 10);

    if (isNaN(qty) || qty <= 0) return alert("Introdu o cantitate validă.");

    await onUpdateStock(productId, qty);
    setStockQuantities((prev) => ({ ...prev, [productId]: "" }));
  };

  return (
    <div className="space-y-4">
      <div className="hidden md:block bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="p-4 border-b border-stone-200 dark:border-zinc-800 bg-stone-50/70 dark:bg-zinc-900/50 flex justify-between items-center">
          <h2 className="text-sm font-black uppercase tracking-wider text-stone-700 dark:text-zinc-300">
            Catalog Produse
          </h2>
          <span className="text-xs font-medium text-stone-500 dark:text-zinc-400">
            Afișat {products.length > 0 ? indexOfFirstItem + 1 : 0}-
            {Math.min(indexOfLastItem, products.length)} din {products.length}
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider bg-stone-100/40 dark:bg-zinc-900/30">
              <th className="p-4">Produs</th>
              <th className="p-4">Categorie</th>
              <th className="p-4">Preț</th>
              <th className="p-4">Stoc Actual</th>
              <th className="p-4">Alimentare Rapidă Stoc</th>
              <th className="p-4 text-right">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-zinc-800/60 text-sm">
            {currentProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-stone-50 dark:hover:bg-zinc-800/20 transition-colors"
              >
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={
                      product.imageUrl
                        ? `http://localhost:3000${product.imageUrl}`
                        : "/placeholder.png"
                    }
                    alt=""
                    aria-hidden="true"
                    className="w-12 h-12 object-cover object-[80%_center] rounded-xl bg-stone-100 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-850 shrink-0 shadow-inner"
                  />
                  <div>
                    <span className="block font-bold text-stone-900 dark:text-white capitalize">
                      {product.name}
                    </span>
                    <p className="text-xs text-stone-600 dark:text-zinc-400 font-medium line-clamp-1 max-w-[180px] mt-1">
                      {product.description || "Fără descriere"}
                    </p>
                  </div>
                </td>
                <td className="p-4 text-stone-600 dark:text-zinc-400 capitalize whitespace-nowrap">
                  {product.category?.name || "Nespecificată"}
                </td>
                <td className="p-4 font-black text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                  {product.price} RON
                </td>
                <td className="p-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      product.stock > 0
                        ? "bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300"
                        : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                    }`}
                  >
                    {product.stock} buc
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <QuantitySelector
                      product={product}
                      value={stockQuantities[product.id] ?? ""}
                      onInputChange={handleInputChange}
                    />
                    <button
                      onClick={() => handleAlimentareClick(product.id)}
                      aria-label={`Alimentează stoc pentru ${product.name}`}
                      className="bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400"
                    >
                      Alimentează
                    </button>
                  </div>
                </td>
                <td className="p-4 text-right whitespace-nowrap">
                  <div
                    role="group"
                    aria-label={`Acțiuni pentru ${product.name}`}
                    className="inline-flex gap-2"
                  >
                    <button
                      onClick={() => onEditProduct(product)}
                      aria-label={`Editează ${product.name}`}
                      className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400"
                    >
                      Editează
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      aria-label={`Șterge ${product.name}`}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      Șterge
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-8 text-center text-stone-500 dark:text-zinc-400"
                >
                  Nu există produse de afișat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden space-y-4">
        <h2 className="text-xs font-black uppercase tracking-wider text-stone-600 dark:text-zinc-400 px-1">
          Catalog Produse ({products.length})
        </h2>

        <ul className="space-y-4" role="list">
          {currentProducts.map((product) => (
            <li
              key={product.id}
              className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-sm dark:shadow-lg transition-colors duration-300"
            >
              <div className="flex items-start gap-3">
                <img
                  src={
                    product.imageUrl
                      ? `http://localhost:3000${product.imageUrl}`
                      : "/placeholder.png"
                  }
                  alt=""
                  aria-hidden="true"
                  className="w-12 h-12 object-cover rounded-xl bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-800 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-stone-900 dark:text-white text-base capitalize truncate">
                      {product.name}
                    </h3>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 shrink-0">
                      {product.price} RON
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-zinc-400 font-medium line-clamp-2 mt-1">
                    {product.description || "Fără descriere"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-stone-50 dark:bg-zinc-950 text-stone-600 dark:text-zinc-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border border-stone-200 dark:border-zinc-800">
                      {product.category?.name || "Nespecificată"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        product.stock > 0
                          ? "bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300"
                          : "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                      }`}
                    >
                      Stoc: {product.stock} buc
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50/60 dark:bg-zinc-950/60 p-2.5 rounded-xl border border-stone-200 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                <span className="text-xs text-stone-600 dark:text-zinc-400 font-medium">
                  Adaugă stoc:
                </span>
                <div className="flex items-center gap-2">
                  <QuantitySelector
                    product={product}
                    value={stockQuantities[product.id] ?? ""}
                    onInputChange={handleInputChange}
                  />
                  <button
                    onClick={() => handleAlimentareClick(product.id)}
                    className="bg-stone-200 hover:bg-stone-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-200 font-bold text-xs px-2.5 py-2 rounded-lg cursor-pointer transition-all focus:outline-none"
                    aria-label={`Alimentează stoc pentru ${product.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pt-1 border-t border-stone-200 dark:border-zinc-800/50">
                <div
                  role="group"
                  aria-label={`Opțiuni manager pentru ${product.name}`}
                  className="grid grid-cols-2 pt-2 border-t border-stone-200 dark:border-zinc-850"
                >
                  <button
                    onClick={() => onEditProduct(product)}
                    aria-label={`Editează produsul ${product.name}`}
                    className="text-xs font-bold text-stone-700 dark:text-zinc-300 bg-transparent hover:bg-stone-50 dark:hover:bg-zinc-800/40 py-2.5 rounded-l-xl text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-zinc-600 border-r border-stone-200 dark:border-zinc-800"
                  >
                    Editează
                  </button>

                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    aria-label={`Șterge produsul ${product.name}`}
                    className="text-xs font-bold text-rose-700 dark:text-rose-400 bg-transparent hover:bg-rose-50/50 dark:hover:bg-rose-500/5 py-2.5 rounded-r-xl text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </li>
          ))}
          {currentProducts.length === 0 && (
            <li className="p-4 text-center text-stone-500 dark:text-zinc-400">
              Nu există produse de afișat.
            </li>
          )}
        </ul>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default ProductTable;
