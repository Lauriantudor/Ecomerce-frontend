import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartDropdown from "./CartDropdown";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropDown";

// IMPORTĂM COMPONENTA DE SCHIMBARE TEMĂ
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, openAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <>
      {/* CONTAINER ADAPTIV: Fundal alb pe Light Mode, Gri Închis în Dark Mode */}
      <nav className="bg-white dark:bg-[#121212] border-b border-stone-200/60 dark:border-zinc-900 text-stone-800 dark:text-white px-4 sm:px-6 py-4 flex items-center justify-between relative z-50 transition-colors duration-300">
        {/* PARTEA STÂNGĂ: Hamburger + Logo + Link-uri Desktop */}
        <div className="flex items-center gap-4 flex-1">
          {/* BUTON HAMBURGER MOBIL */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden flex-col gap-1.5 p-1 text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
            aria-label="Meniu principal"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "transform rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`}
            ></span>
          </button>

          {/* BRAND / LOGO */}
          <Link
            to="/"
            className="text-xl font-black tracking-wider text-emerald-600 dark:text-emerald-500 font-sans focus:outline-none focus:text-emerald-500 shrink-0"
          >
            E-COMMERCE
          </Link>

          {/* LINK-URI DESKTOP ADAPTIVE */}
          <div className="hidden md:flex gap-6 text-sm font-medium ml-6">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  className="text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors focus:outline-none"
                >
                  Acasă
                </Link>

                <Link
                  to="/contact"
                  className="text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors focus:outline-none"
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors focus:outline-none"
                >
                  Vezi Magazinul
                </Link>

                <Link
                  to="/admin/produse"
                  // MODIFICAT: text-emerald-700 pe light mode pentru lizibilitate maximă
                  className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-bold border-b-2 border-emerald-500/20 px-0.5 transition-all"
                >
                  Gestiune Produse 🛠️
                </Link>

                <Link
                  to="/admin/comenzi"
                  // MODIFICAT: De la amber-600 (prea șters) la amber-800 pe light, păstrând amber-400 pe dark
                  className="text-amber-800 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold border-b-2 border-amber-500/20 px-0.5 transition-all"
                >
                  Management Comenzi 📦
                </Link>

                <Link
                  to="/admin/mesaje"
                  // MODIFICAT: text-indigo-700 pe light mode și border-indigo pentru a se separa complet de galbenul de la comenzi
                  className="text-indigo-700 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 font-bold border-b-2 border-indigo-500/30 dark:border-indigo-500/20 px-0.5 transition-all"
                >
                  Management Mesaje ✉️
                </Link>
              </>
            )}
          </div>
        </div>

        {/* PARTEA DREAPTĂ: Control Coș, Theme Toggle & Profil */}
        {/* MODIFICAT: Toate iconițele din acest wrapper împart acum o clasă părinte pentru uniformizarea culorilor default și hover */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* BUTONUL DE TOGGLE LIGHT / DARK */}
          <ThemeToggle />

          {/* COȘ DE CUMPĂRĂTURI */}
          {user && !isAdmin && <CartDropdown />}

          {/* STATUS PROFIL SAU AUTENTIFICARE */}
          {user ? (
            <ProfileDropdown />
          ) : (
            <button
              type="button"
              onClick={() => {
                if (typeof openAuthModal === "function") openAuthModal();
              }}
              // MODIFICAT: Sincronizat cu stilul profilului logat (hover pe gri închis pe light / alb pe dark)
              className="p-2 text-stone-500 dark:text-zinc-400 hover:text-stone-950 dark:hover:text-white transition-colors flex items-center justify-center focus:outline-none cursor-pointer rounded-xl hover:bg-stone-50 dark:hover:bg-zinc-900/50"
              aria-label="Deschide formularul de autentificare"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 pointer-events-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* MENIUL MOBIL */}
      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Navbar;
