import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import productService from "../services/productService";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext"; // <-- Importăm contextul coșului

function ProductDetails() {
  const { id } = useParams();
  const { user, openAuthModal } = useAuth();
  const { addToCart } = useContext(CartContext); // <-- Extragem funcția de adăugare

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // <-- Stare pentru cantitate
  const [isAdding, setIsAdding] = useState(false); // <-- Stare pentru animația butonului

  const incrementQuantity = () => setQuantity(quantity + 1);
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
    if (!product) return;
    setIsAdding(true);
    try {
      // Apelăm funcția globală din context
      await addToCart(product, quantity);
    } catch (err) {
      console.error("Eroare la adăugarea în coș:", err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-medium">
        Se încarcă detaliile...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center space-y-4">
        <p
          role="alert"
          className="text-rose-400 font-semibold px-4 text-center"
        >
          {error || "Produsul nu a fost găsit."}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 lg:p-8 shadow-2xl items-start">
          {/* Imaginea Produsului */}
          <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl flex">
            <img
              src={`http://localhost:3000${product.imageUrl}`}
              alt={product.altImagine || product.name}
              className="w-full aspect-square object-cover object-bottom-right rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
            />
          </div>

          {/* Informații Produs */}
          <div className="flex flex-col justify-between space-y-6 md:pt-4 h-full">
            <div>
              {product?.category?.name && (
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  {product.category.name}
                </span>
              )}

              <h1 className="text-4xl font-extrabold text-white tracking-tight mt-3">
                {product?.name}
              </h1>

              <div className="text-3xl font-bold text-emerald-400 mt-2">
                {product?.price} RON
              </div>

              <hr className="border-zinc-800 my-6" />

              <div className="space-y-3">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Descriere Completă
                </h2>
                <p className="text-zinc-300 text-base leading-relaxed">
                  {product?.description ||
                    "Acest produs minunat este configurat și extras direct din baza de date a serverului."}
                </p>
              </div>
            </div>

            {/* Secțiune suplimentară (Stoc) + Butoane Acțiune */}
            <div className="space-y-6 pt-6 border-t border-zinc-800/60 mt-auto">
              <div className="text-sm text-zinc-500 flex items-center space-x-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  Produs în stoc (Disponibile:{" "}
                  <strong className="text-zinc-200">
                    {product?.stock || 0}
                  </strong>{" "}
                  bucăți)
                </span>
              </div>

              {/* RESTRICȚIE UI: Afișăm opțiunile de coș doar dacă userul este logat */}
              {user ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  {/* Selector Cantitate */}
                  <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 min-w-35">
                    <button
                      onClick={decrementQuantity}
                      className="text-zinc-400 hover:text-white px-3 py-1 text-lg font-black transition-colors cursor-pointer"
                      type="button"
                    >
                      -
                    </button>
                    <span className="text-white font-bold text-sm w-8 text-center select-none">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="text-zinc-400 hover:text-white px-3 py-1 text-lg font-black transition-colors cursor-pointer"
                      type="button"
                    >
                      +
                    </button>
                  </div>

                  {/* Butonul de adăugare */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 text-sm font-black py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                  >
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
                    <span>{isAdding ? "Se adaugă..." : "Adaugă în coș"}</span>
                  </button>
                </div>
              ) : (
                // Mesaj alternativ pentru vizitatorii deconectați
                <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-2xl p-4 text-center">
                  <p className="text-zinc-400 text-xs mb-2.5">
                    Trebuie să fii autentificat pentru a adăuga acest produs în
                    coș.
                  </p>
                  <button
                    onClick={openAuthModal}
                    className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold text-xs transition-colors"
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
