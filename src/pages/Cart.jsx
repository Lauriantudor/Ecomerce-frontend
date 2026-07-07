import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import AddressSelection from "../components/addresses/AddressSelection";
import QuantitySelector from "../components/QuantitySelector";
import orderService from "../services/orderService";
import { toast } from "sonner";

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
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleQuantityChange = (productId, newQty) => {
    if (!updateCartQuantity) return;

    const item = cartItems.find((ci) => {
      const p = ci.product || ci.Product || ci;
      return p.id === productId;
    });

    if (item) {
      const qty = parseInt(newQty, 10);
      if (!isNaN(qty) && qty >= 1) {
        updateCartQuantity(item, qty);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.warning("Adresă de livrare lipsă", {
        description:
          "Te rugăm să selectezi sau să adaugi o adresă de livrare înainte de a plasa comanda.",
      });
      return;
    }

    try {
      setIsSubmiting(true);
      // 🛠️ CORECTURĂ: Corectat typo din createOder în createOrder
      const response = await orderService.createOrder(selectedAddressId);

      toast.success("Comandă plasată cu succes!", {
        description: "Comanda ta a fost înregistrată în sistem.",
      });

      if (typeof clearCart === "function") {
        clearCart();
      }
      navigate("/comenzile-mele");
    } catch (error) {
      console.error("Eroare la plasarea comenzii:", error);
      toast.error("Eroare la plasarea comenzii", {
        description:
          error.response?.data?.message ||
          "A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.",
      });
    } finally {
      setIsSubmiting(false);
    }
  };

  if (!user) return null;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div
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
          className="px-6 py-3 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white dark:text-black font-black text-sm rounded-xl transition-all tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-stone-50 dark:focus:ring-offset-[#0c0c0c]"
          aria-label="Mergi la pagina de produse"
        >
          Mergi la Produse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-900 dark:text-white py-12 px-4 sm:px-8 md:px-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8 text-stone-800 dark:text-zinc-100 uppercase">
          Coșul tău{" "}
          <span
            className="text-emerald-700 dark:text-emerald-500"
            aria-live="polite"
            aria-atomic="true"
          >
            ({totalItems})
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div role="region" aria-label="Produse în coș">
              <ul className="space-y-4 animate-fadeIn">
                {cartItems.map((item) => {
                  const produs = item.product || item.Product || item;
                  const itemSubtotal = (
                    (produs?.price || 0) * item.quantity
                  ).toFixed(2);
                  const numeProdus = produs?.name || "Produs";

                  return (
                    <li
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-4 sm:p-5 transition-all hover:border-stone-300 dark:hover:border-zinc-800 shadow-sm"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                        {produs?.image ? (
                          <img
                            src={produs.image}
                            alt=""
                            aria-hidden="true"
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-stone-100 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 shrink-0"
                          />
                        ) : (
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-2xl border border-stone-200 dark:border-zinc-800 shrink-0 overflow-hidden"
                            aria-hidden="true"
                          >
                            <img
                              src={`http://localhost:3000${produs.imageUrl}`}
                              alt=""
                              className="w-full aspect-square object-cover object-bottom-right rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
                            />
                          </div>
                        )}
                        <div className="truncate">
                          <h3 className="font-bold text-base text-stone-800 dark:text-zinc-100 truncate">
                            {numeProdus}
                          </h3>
                          <p className="text-stone-700 dark:text-zinc-500 text-xs mt-0.5 capitalize">
                            Categorie: {produs?.category || "Haine"}
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm mt-1">
                            Preț unitar: {produs?.price || 0} RON
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-stone-100 dark:border-zinc-900 sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                        <QuantitySelector
                          product={produs}
                          value={item.quantity}
                          onInputChange={handleQuantityChange}
                          min={1}
                          max={99}
                        />

                        <div className="flex items-center gap-4">
                          <span
                            className="text-stone-800 dark:text-zinc-100 font-black text-sm min-w-17.5 text-right"
                            aria-live="polite"
                            aria-atomic="true"
                            aria-label={`Subtotal pentru acest produs: ${itemSubtotal} RON`}
                          >
                            {itemSubtotal} RON
                          </span>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-stone-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-red-400 p-2 rounded-xl transition-colors text-sm focus:outline-none focus:text-rose-600 dark:focus:text-red-400 cursor-pointer"
                            aria-label={`Elimină ${numeProdus} din coș`}
                          >
                            <span aria-hidden="true">✕</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-6 shadow-sm">
              <AddressSelection
                onAddressSelect={setSelectedAddressId}
                selectedAddressId={selectedAddressId}
              />
            </div>
          </div>

          {/* SIDEBAR: SUMAR */}
          <div className="lg:sticky lg:top-24 w-full">
            <div
              className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-6 space-y-6 shadow-sm"
              role="region"
              aria-label="Sumar plată"
            >
              <h2 className="text-lg font-bold text-stone-800 dark:text-zinc-100 tracking-wide uppercase pb-3 border-b border-stone-100 dark:border-zinc-900">
                Sumar Comandă
              </h2>

              <div className="space-y-3 text-sm text-stone-700 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Total produse</span>
                  <span
                    aria-live="polite"
                    aria-atomic="true"
                    className="font-medium text-stone-800 dark:text-zinc-200"
                  >
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
                    aria-live="polite"
                    aria-atomic="true"
                    className="text-emerald-700 dark:text-emerald-500 font-black text-lg"
                  >
                    {Number(totalPrice).toFixed(2)} RON
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isSubmiting}
                className={`w-full py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 disabled:bg-stone-100 dark:disabled:bg-zinc-800 disabled:text-stone-400 dark:disabled:text-zinc-600 text-white dark:text-black font-black text-sm rounded-xl transition-all tracking-wider uppercase shadow-md dark:shadow-lg dark:shadow-emerald-500/10 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#121212] cursor-pointer ${
                  isSubmiting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label={
                  isSubmiting
                    ? "Se procesează comanda..."
                    : "Finalizează Comanda"
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
                <span aria-hidden="true">←</span> Continuă cumpărăturile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
