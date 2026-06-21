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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:text-emerald-400 text-zinc-400 transition-colors relative flex items-center justify-center focus:outline-none"
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
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
            {totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-[#161616] border border-zinc-800/80 rounded-2xl shadow-2xl p-4 z-50 text-white">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5 mb-3">
            <span className="text-xs font-bold text-zinc-400 tracking-wide uppercase">
              Coș ({totalItems})
            </span>
            <span className="text-xs text-emerald-400 font-bold">
              {totalPrice} RON
            </span>
          </div>

          {!cartItems || cartItems.length === 0 ? (
            <p className="text-zinc-500 text-xs text-center py-6 font-medium">
              Coșul tău este gol momentan.
            </p>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-900/40">
                {cartItems.map((item) => {
                  const produs = item.product || item.Product || item;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 pt-3 first:pt-0"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {produs?.image ? (
                          <img
                            src={produs.image}
                            alt=""
                            className="w-9 h-9 object-cover rounded-xl bg-zinc-950 border border-zinc-900"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center text-sm border border-zinc-800">
                            📦
                          </div>
                        )}
                        <div className="truncate text-xs">
                          <p className="font-bold truncate text-zinc-200">
                            {produs?.name || "Produs"}
                          </p>
                          <p className="text-zinc-500 font-medium mt-0.5">
                            {item.quantity} x{" "}
                            <span className="text-emerald-400 font-semibold">
                              {produs?.price || 0} RON
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg text-xs font-bold focus:outline-none"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-900">
                <Link
                  to="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs rounded-xl text-center block tracking-wider uppercase focus:outline-none"
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
