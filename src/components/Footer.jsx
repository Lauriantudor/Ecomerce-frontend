import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#121212] rounded-lg";

  return (
    <footer className="w-full bg-white dark:bg-zinc-900 border-t border-stone-200 dark:border-zinc-800 transition-colors duration-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            user ? "md:grid-cols-3" : "md:grid-cols-2"
          } gap-6 md:gap-8 mb-6 items-start`}
        >
          {/* Brand & Descriere */}
          <div className="space-y-2">
            <Link
              to="/"
              className={`text-xl font-black tracking-wider text-emerald-600 dark:text-emerald-500 font-sans px-2 py-0.5 ${focusRing}`}
            >
              Urbano
            </Link>
            <p className="text-[11px] text-stone-600 dark:text-zinc-300 leading-relaxed max-w-xs">
              Haine streetwear și accesorii minimaliste, create special pentru
              confortul și stilul tău zilnic.
            </p>
          </div>

          {/* Link-uri Client (Dacă este utilizator obișnuit) */}
          {user && !isAdmin && (
            <div className="space-y-2 md:mx-auto">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-zinc-400">
                Client
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/cart"
                    className="text-[11px] font-bold text-stone-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors focus:outline-none focus:text-emerald-600 dark:focus:text-emerald-400"
                  >
                    Coșul Meu
                  </Link>
                </li>
                <li>
                  <Link
                    to="/comenzile-mele"
                    className="text-[11px] font-bold text-stone-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors focus:outline-none focus:text-emerald-600 dark:focus:text-emerald-400"
                  >
                    Comenzile Mele
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Link-uri Admin (Apare doar dacă rolul este admin) */}
          {user && isAdmin && (
            <div className="space-y-2 md:mx-auto">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Panou Admin
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/admin/comenzi"
                    className="text-[11px] font-bold text-stone-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors focus:outline-none"
                  >
                    Management Comenzi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/produse"
                    className="text-[11px] font-bold text-stone-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors focus:outline-none"
                  >
                    Gestionare Produse
                  </Link>
                </li>
              </ul>
            </div>
          )}

          {/* Suport și Date de Contact */}
          <div className="space-y-2 md:ml-auto md:max-w-xs w-full">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-600 dark:text-zinc-400">
              Suport
            </h4>

            {!isAdmin && (
              <ul className="space-y-1.5">
                <li>
                  <Link
                    to="/contact"
                    className="text-[11px] font-bold text-stone-700 hover:text-emerald-600 dark:text-zinc-300 dark:hover:text-emerald-400 transition-colors focus:outline-none focus:text-emerald-600 dark:focus:text-emerald-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            )}

            <div className="text-[11px] space-y-1 text-stone-600 dark:text-zinc-300 font-medium pt-2 border-t border-stone-200 dark:border-zinc-800/60">
              <p className="flex items-center gap-1.5">
                <span aria-hidden="true">📍</span> Oradea, Bihor County
              </p>
              <p className="flex items-center gap-1.5">
                <span aria-hidden="true">✉️</span> suport@eshop.ro
              </p>
              <p className="flex items-center gap-1.5">
                <span aria-hidden="true">🕒</span> Luni - Vineri: 09:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-200 dark:border-zinc-800/60 pt-4 flex flex-col sm:flex-row items-center justify-center">
          <p className="text-[10px] font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
            &copy; {currentYear} E-Shop. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
