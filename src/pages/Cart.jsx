import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddressSelection from "../components/AddressSelection";
import orderService from "../services/orderService";

const Cart = () => {
  const { user } = useAuth();
  const {
    cartItems,
    totalItems,
    totalPrice,
    removeItem,
    updateCartQuantity,
    clearCart,
  } = useContext(CartContext);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const navigate = useNavigate();
  // Stări pentru gestionarea adresei și a modului de checkout
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const decrementQuantity = (item) => {
    if (updateCartQuantity) {
      updateCartQuantity(item, item.quantity - 1);
    }
  };

  const incrementQuantity = (item) => {
    if (updateCartQuantity) {
      updateCartQuantity(item, item.quantity + 1);
    }
  };

  // PROTECȚIE ACCESIBILITATE & SECURITATE: Redirecționăm utilizatorul dacă nu este logat
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert(
        "Te rugăm să selectezi sau să adaugi o adresă de livrare înainte de a plasa comanda.",
      );
      return;
    }

    try {
      setIsSubmiting(true);

      // Trimitem id-ul adresei selectate către backend-ul tău
      const response = await orderService.createOder(selectedAddressId);

      alert(response.message || "Comanda a fost plasată cu succes!");

      if (typeof clearCart === "function") {
        clearCart();
      }

      // Redirecționăm clientul direct către noua sa pagină de comenzi active
      navigate("/comenzile-mele");
    } catch (error) {
      console.error("Eroare la plasarea comenzii:", error);
      alert(
        error.response?.data?.message ||
          "A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.",
      );
    } finally {
      setIsSubmiting(false);
    }
  };

  // Dacă utilizatorul nu este logat, nu randăm nimic în timp ce se face redirecționarea
  if (!user) return null;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div
        // MODIFICAT: Fundal adaptiv stone-50 / text întunecat pe timp de zi
        className="min-h-[80vh] bg-stone-50 dark:bg-[#0c0c0c] text-stone-900 dark:text-white flex flex-col items-center justify-center px-4 transition-colors duration-300"
        role="status"
        aria-live="polite"
      >
        <div className="text-6xl mb-4" aria-hidden="true">
          🛒
        </div>
        <h2 className="text-2xl font-bold mb-2 text-stone-800 dark:text-zinc-100">
          Coșul tău este gol
        </h2>
        <p className="text-stone-500 dark:text-zinc-500 text-sm mb-6 text-center max-w-sm">
          Nu ai adăugat niciun produs în coșul de cumpărături încă. Explorează
          magazinul nostru pentru a găsi haine pe placul tău!
        </p>
        <Link
          to="/produse"
          // MODIFICAT: Contrast ridicat text-white pe emerald-600 pentru light mode
          className="px-6 py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-black font-black text-sm rounded-xl transition-all tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-stone-50 dark:focus:ring-offset-[#0c0c0c]"
          aria-label="Mergi la pagina de produse"
        >
          Mergi la Produse
        </Link>
      </div>
    );
  }

  return (
    // MODIFICAT: bg-stone-50 pe light mode
    <div className="min-h-screen  text-stone-900 dark:text-white py-12 px-4 sm:px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8 text-stone-800 dark:text-zinc-100 uppercase">
          Coșul tău{" "}
          <span
            className="text-emerald-700 dark:text-emerald-500"
            aria-label={`conține ${totalItems} produse`}
          >
            ({totalItems})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* COLOANA DIN STÂNGA (PRODUSE + ADRESĂ) */}
          <div className="lg:col-span-2 space-y-8">
            {/* LISTA DE PRODUSE */}
            <div
              className="space-y-4"
              role="region"
              aria-label="Produse în coș"
            >
              {cartItems.map((item) => {
                const produs = item.product || item.Product || item;

                return (
                  <div
                    key={item.id}
                    // MODIFICAT: Card alb pur cu margini discrete pe light mode
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-4 sm:p-5 transition-all hover:border-stone-300 dark:hover:border-zinc-800 shadow-sm"
                  >
                    {/* Poză și Detalii Produs */}
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                      {produs?.image ? (
                        <img
                          src={produs.image}
                          alt={`Imagine cu produsul ${produs.name || "Haine"}`}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-stone-100 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-2xl border border-stone-200 dark:border-zinc-800 shrink-0 overflow-hidden">
                          <img
                            src={`http://localhost:3000${produs.imageUrl}`}
                            alt={produs.altImagine || produs.name}
                            className="w-full aspect-square object-cover object-bottom-right rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
                          />
                        </div>
                      )}
                      <div className="truncate">
                        <h3 className="font-bold text-base text-stone-800 dark:text-zinc-100 truncate">
                          {produs?.name || "Produs"}
                        </h3>
                        <p className="text-stone-400 dark:text-zinc-500 text-xs mt-0.5 capitalize">
                          Categorie: {produs?.category || "Haine"}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm mt-1">
                          {produs?.price || 0} RON
                        </p>
                      </div>
                    </div>

                    {/* Controale Cantitate și Ștergere */}
                    {/* MODIFICAT: Separatoare și fundaluri adaptate la tema curentă */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-stone-100 dark:border-zinc-900 sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                      <div
                        className="flex items-center bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-900 rounded-xl px-2 py-1"
                        role="group"
                        aria-label="Modifică cantitatea"
                      >
                        <button
                          onClick={() => decrementQuantity(item)}
                          className="text-stone-400 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-white px-2 py-1 text-sm font-bold transition-colors disabled:opacity-30 focus:outline-none focus:text-stone-900 dark:focus:text-white"
                          disabled={item.quantity <= 1}
                          aria-label={`Scade cantitatea pentru ${produs?.name || "produs"}`}
                        >
                          -
                        </button>
                        <span
                          className="text-stone-800 dark:text-zinc-200 font-bold text-xs px-3 min-w-6 text-center"
                          aria-live="pure"
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item)}
                          className="text-stone-400 dark:text-zinc-500 hover:text-stone-900 dark:hover:text-white px-2 py-1 text-sm font-bold transition-colors focus:outline-none focus:text-stone-900 dark:focus:text-white"
                          aria-label={`Crește cantitatea pentru ${produs?.name || "produs"}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className="text-stone-800 dark:text-zinc-100 font-black text-sm min-w-17.5 text-right"
                          aria-label={`Subtotal produs: ${((produs?.price || 0) * item.quantity).toFixed(2)} RON`}
                        >
                          {((produs?.price || 0) * item.quantity).toFixed(2)}{" "}
                          RON
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-red-400 p-2 rounded-xl transition-colors text-sm focus:outline-none focus:text-rose-600 dark:focus:text-red-400 cursor-pointer"
                          aria-label={`Elimină ${produs?.name || "produsul"} din coș`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECTIUNEA ADRESA (Mutată aici, sub produse) */}
            {/* MODIFICAT: Învelit într-un card adaptiv cu stilizare curată */}
            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-6 animate-fadeIn shadow-sm">
              <AddressSelection
                onAddressSelect={setSelectedAddressId}
                selectedAddressId={selectedAddressId}
              />
            </div>
          </div>

          {/* COLOANA DIN DREAPTA (REZUMAT COMANDĂ & CHECKOUT - STICKY) */}
          <div className="lg:sticky lg:top-24 w-full">
            <div
              // MODIFICAT: Cardul de sumar devine alb pe timp de zi
              className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-6 space-y-6 shadow-sm"
              role="region"
              aria-label="Sumar plată"
            >
              <h2 className="text-lg font-bold text-stone-800 dark:text-zinc-100 tracking-wide uppercase pb-3 border-b border-stone-100 dark:border-zinc-900">
                Sumar Comandă
              </h2>

              <div className="space-y-3 text-sm text-stone-500 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Total produse</span>
                  <span className="font-medium text-stone-800 dark:text-zinc-200">
                    {totalItems} unități
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Livrare</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                    Gratuită
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-100 dark:border-zinc-900/50 pt-3 text-base font-bold text-stone-800 dark:text-zinc-100">
                  <span>Total de plată</span>
                  <span
                    className="text-emerald-700 dark:text-emerald-500 font-black text-lg"
                    aria-live="polite"
                  >
                    {totalPrice} RON
                  </span>
                </div>
              </div>

              {/* BUTONUL DE CHECKOUT ACCESIBIL */}
              <button
                onClick={handleCheckout}
                disabled={isSubmiting}
                // MODIFICAT: bg-emerald-600 / text-white pe light mode pentru lizibilitate
                className={`w-full py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:bg-stone-100 dark:disabled:bg-zinc-800 disabled:text-stone-400 dark:disabled:text-zinc-600 text-white dark:text-black font-black text-sm rounded-xl transition-all tracking-wider uppercase shadow-md dark:shadow-lg dark:shadow-emerald-500/10 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#121212] cursor-pointer ${
                  isSubmiting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label={
                  isSubmiting
                    ? "Se procesează comanda..."
                    : `Finalizează comanda în valoare totală de ${totalPrice} RON`
                }
              >
                <span>
                  {isSubmiting ? "Se procesează..." : "Finalizează Comanda"}
                </span>
                {!isSubmiting && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                )}
              </button>

              <Link
                to="/produse"
                className="block text-center text-xs text-stone-800 dark:text-zinc-500 hover:text-stone-600 dark:hover:text-zinc-300 transition-colors font-medium focus:outline-none focus:underline"
              >
                ← Continuă cumpărăturile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
