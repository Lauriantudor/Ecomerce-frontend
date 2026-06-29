import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef(null);

  const cartContext = useContext(CartContext) || {};
  const {
    cartItems = [],
    totalItems = 0,
    totalPrice = 0,
    removeItem = () => {},
  } = cartContext;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={cartRef}>
      {/* BUTTON TRIGGER COMPLET UNIFORMIZAT */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // MODIFICAT: Folosește text-current pentru uniformizare totală și primește hover discret ca profilul
        className="p-2 text-current hover:text-stone-900 dark:hover:text-white transition-colors relative flex items-center justify-center focus:outline-none cursor-pointer rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-900/50"
        aria-label={`Deschide coșul. Ai ${totalItems} produse.`}
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
        {totalItems > 0 && (
          // Bulina rămâne un verde vizibil, adaptat la textul interior
          <span className="absolute top-0.5 right-0.5 bg-emerald-500 dark:bg-emerald-500 text-white dark:text-zinc-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
            {totalItems}
          </span>
        )}
      </button>

      {/* DROPDOWN CONTAINER COMPLET ADAPTIV */}
      {isOpen && (
        // MODIFICAT: bg-white și border-stone pe light mode / bg-zinc și border-zinc pe dark mode
        <div className="fixed inset-x-4 top-20 z-50 bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-850 rounded-2xl p-4 shadow-xl md:absolute md:top-full md:right-0 md:left-auto md:w-80 md:inset-x-auto md:mt-2 transition-colors duration-300">
          <div className="flex justify-between items-center border-b border-stone-100 dark:border-zinc-800 pb-2.5 mb-3">
            <span className="text-xs font-bold text-stone-400 dark:text-zinc-500 tracking-wide uppercase">
              Coș ({totalItems})
            </span>
            {/* MODIFICAT: Verde închis pe light mode (emerald-700) pentru contrast optim pe fundal alb */}
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              {totalPrice} RON
            </span>
          </div>

          {!cartItems || cartItems.length === 0 ? (
            <p className="text-stone-400 dark:text-zinc-500 text-xs text-center py-6 font-medium">
              Coșul tău este gol momentan.
            </p>
          ) : (
            <>
              {/* LISTA DE PRODUSE INTERNĂ */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100 dark:divide-zinc-800/40">
                {cartItems.map((item) => {
                  const produs = item.product || item.Product || item;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 pt-3 first:pt-0"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Cutie iconiță placeholder */}
                        <div
                          className="w-9 h-9 bg-stone-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center text-sm border border-stone-100 dark:border-zinc-800 shrink-0"
                          aria-hidden="true"
                        >
                          📦
                        </div>

                        <div className="truncate text-xs">
                          <p className="font-bold truncate text-stone-800 dark:text-zinc-200">
                            {produs?.name || "Produs"}
                          </p>
                          <p className="text-stone-400 dark:text-zinc-500 font-medium mt-0.5">
                            {item.quantity} x{" "}
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                              {produs?.price || 0} RON
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Buton eliminare element */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-stone-400 hover:text-rose-600 dark:text-zinc-600 dark:hover:text-red-400 p-1.5 rounded-lg text-xs font-bold focus:outline-none transition-colors cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* BUTONUL „COȘUL MEU” */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  // MODIFICAT: bg-emerald-600 cu text alb pe Light Mode, își păstrează stilul contrastant pe Dark Mode
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-black text-xs rounded-xl text-center block tracking-wider uppercase focus:outline-none transition-all shadow-sm"
                >
                  Coșul meu
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CartDropdown;
