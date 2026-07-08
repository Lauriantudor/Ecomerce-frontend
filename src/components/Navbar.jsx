import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartDropdown from "./cart&orders/CartDropdown";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./auth/ProfileDropDown";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user, openAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#121212] rounded-lg";

  return (
    <>
      <nav className="bg-white dark:bg-[#121212] border-b border-stone-200 dark:border-zinc-900 text-stone-900 dark:text-white px-4 sm:px-6 py-4 flex items-center justify-between relative z-50 transition-colors duration-300">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden flex-col gap-1.5 p-1 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
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

          <Link
            to="/"
            className={`text-xl font-black tracking-wider text-emerald-600 dark:text-emerald-500 font-sans px-2 py-0.5 ${focusRing}`}
          >
            E-COMMERCE
          </Link>

          <div className="hidden md:flex gap-6 text-sm font-medium ml-6">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  className={`text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors px-2 py-1 ${focusRing}`}
                >
                  Acasă
                </Link>

                <Link
                  to="/contact"
                  className={`text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors px-2 py-1 ${focusRing}`}
                >
                  Contact
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white transition-colors px-2 py-1 ${focusRing}`}
                >
                  Vezi Magazinul
                </Link>

                <Link
                  to="/admin/produse"
                  className={`inline-flex items-center text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold border-b-2 border-emerald-600/60 dark:border-emerald-500/40 px-2 py-0.5 transition-all ${focusRing}`}
                >
                  <span>Gestiune Produse</span>
                  <span aria-hidden="true" className="ml-1">
                    🛠️
                  </span>
                </Link>

                <Link
                  to="/admin/comenzi"
                  className={`inline-flex items-center text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold border-b-2 border-amber-700/60 dark:border-amber-500/40 px-2 py-0.5 transition-all ${focusRing}`}
                >
                  <span>Management Comenzi</span>
                  <span aria-hidden="true" className="ml-1">
                    📦
                  </span>
                </Link>

                <Link
                  to="/admin/mesaje"
                  className={`inline-flex items-center text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold border-b-2 border-indigo-600/60 dark:border-indigo-500/40 px-2 py-0.5 transition-all ${focusRing}`}
                >
                  <span>Management Mesaje</span>
                  <span aria-hidden="true" className="ml-1">
                    ✉️
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {user && !isAdmin && <CartDropdown />}

          {user ? (
            <ProfileDropdown />
          ) : (
            <button
              type="button"
              onClick={() => {
                if (typeof openAuthModal === "function") openAuthModal();
              }}
              className="p-2 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-900/50 transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer rounded-xl"
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

      <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  );
};

export default Navbar;
