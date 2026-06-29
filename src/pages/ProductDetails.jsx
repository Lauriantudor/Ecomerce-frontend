import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { user, openAuthModal } = useAuth();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = product?.stock === 0;

  const incrementQuantity = () => {
    if (quantity >= product?.stock) return;
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => setQuantity(Math.max(1, quantity - 1));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Eroare la aducerea produsului:", err);
        setError(err?.message || "Eroare la aducerea produsului.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || isOutOfStock) return;
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
    } catch (err) {
      console.error("Eroare la adăugarea în coș:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f0] dark:bg-zinc-950 text-stone-900 dark:text-white flex items-center justify-center font-medium transition-colors duration-300">
        Se încarcă detaliile...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf8f0] dark:bg-zinc-950 text-stone-900 dark:text-white flex flex-col items-center justify-center space-y-4 transition-colors duration-300">
        <p
          role="alert"
          className="text-rose-600 dark:text-rose-400 font-semibold px-4 text-center"
        >
          {error || "Produsul nu a fost găsit."}
        </p>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen bg-[#faf8f0] dark:bg-zinc-950 text-stone-800 dark:text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* CARD CONTAINER PRINCIPAL: Fundal alb, borduri fine stone pe light */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 rounded-3xl p-6 lg:p-8 shadow-sm dark:shadow-2xl items-start transition-colors duration-300">
          {/* Imagine Produs */}
          <div className="w-full rounded-2xl overflow-hidden border border-stone-100 dark:border-zinc-800 bg-stone-50 dark:bg-zinc-900 shadow-sm dark:shadow-xl flex">
            <img
              src={`http://localhost:3000${product.imageUrl}`}
              alt={product.altImagine || product.name}
              className="w-full aspect-square object-cover object-bottom-right rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
            />
          </div>

          {/* Detalii Produs */}
          <div className="flex flex-col justify-between space-y-6 md:pt-4 h-full">
            <div>
              {product?.category?.name && (
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 bg-emerald-600/10 dark:bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-600/10 dark:border-emerald-500/20">
                  {product.category.name}
                </span>
              )}

              <h1 className="text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight mt-3">
                {product?.name}
              </h1>

              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                {product?.price} RON
              </div>

              <hr className="border-stone-200/60 dark:border-zinc-800 my-6" />

              <div className="space-y-3">
                <h2 className="text-xs font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-wider">
                  Descriere Completă
                </h2>
                <p className="text-stone-600 dark:text-zinc-300 text-base leading-relaxed">
                  {product?.description ||
                    "Acest produs minunat este configurat și extras direct din baza de date a serverului."}
                </p>
              </div>
            </div>

            {/* Zona de Actiuni / Stoc */}
            <div className="space-y-6 pt-6 border-t border-stone-200/60 dark:border-zinc-800/60 mt-auto">
              {/* --- STOC STATUS --- */}
              <div className="text-sm text-stone-500 dark:text-zinc-500 flex items-center space-x-2.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? "bg-rose-500 animate-none" : "bg-emerald-500 animate-pulse"}`}
                ></span>
                <span>
                  {isOutOfStock ? (
                    <strong className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                      Stoc epuizat
                    </strong>
                  ) : (
                    <>
                      Produs în stoc (Disponibile:{" "}
                      <strong className="text-stone-900 dark:text-zinc-200 font-bold">
                        {product?.stock}
                      </strong>{" "}
                      bucăți)
                    </>
                  )}
                </span>
              </div>

              {/* Randul cu butoane */}
              {isAdmin ? null : user ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  {/* Selector Cantitate */}
                  <div
                    className={`flex items-center justify-between bg-stone-50 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 rounded-xl p-1.5 min-w-35 transition-colors ${isOutOfStock ? "opacity-40 pointer-events-none" : ""}`}
                  >
                    <button
                      onClick={decrementQuantity}
                      disabled={isOutOfStock}
                      className="text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white px-3 py-1 text-lg font-black transition-colors cursor-pointer disabled:cursor-not-allowed"
                      type="button"
                    >
                      -
                    </button>
                    <span className="text-stone-900 dark:text-white font-bold text-sm w-8 text-center select-none">
                      {isOutOfStock ? 0 : quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      disabled={isOutOfStock}
                      className="text-stone-400 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white px-3 py-1 text-lg font-black transition-colors cursor-pointer disabled:cursor-not-allowed"
                      type="button"
                    >
                      +
                    </button>
                  </div>

                  {/* Buton Adaugă în coș */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || isOutOfStock}
                    className={`flex-1 text-sm font-black py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 ${
                      isOutOfStock
                        ? "bg-stone-100 dark:bg-zinc-800 text-stone-400 dark:text-zinc-500 cursor-not-allowed border border-stone-200/30 dark:border-zinc-750"
                        : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 cursor-pointer"
                    } disabled:opacity-50`}
                  >
                    {!isOutOfStock && (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    )}
                    <span>
                      {isOutOfStock
                        ? "Nu se poate adăuga"
                        : isAdding
                          ? "Se adaugă..."
                          : "Adaugă în coș"}
                    </span>
                  </button>
                </div>
              ) : (
                /* Mesaj Cerință Login */
                <div className="bg-stone-50 dark:bg-zinc-950 border border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl p-4 text-center transition-colors">
                  <p className="text-stone-500 dark:text-zinc-400 text-xs mb-2.5">
                    {isOutOfStock
                      ? "Acest produs nu mai este disponibil în stoc."
                      : "Trebuie să fii autentificat pentru a adăuga acest produs în coș."}
                  </p>
                  {!isOutOfStock && (
                    <button
                      onClick={openAuthModal}
                      className="inline-flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Autentifică-te aici</span>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
