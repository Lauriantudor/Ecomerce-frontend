import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartDropdown from "./CartDropdown";

import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropDown";

const Navbar = () => {
  const { user, openAuthModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#121212] border-b border-zinc-900 text-white px-4 sm:px-6 py-4 flex items-center justify-between relative z-50">
        {/* PARTEA STÂNGĂ: Hamburger + Logo + Link-uri Desktop */}
        <div className="flex items-center gap-4 flex-1">
          {/* BUTON HAMBURGER MOBIL */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden flex-col gap-1.5 p-1 text-zinc-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
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
            className="text-xl font-black tracking-wider text-emerald-500 font-sans focus:outline-none focus:text-emerald-400 shrink-0"
          >
            E-COMMERCE
          </Link>

          {/* LINK-URI DESKTOP */}
          <div className="hidden md:flex gap-6 text-sm text-zinc-400 font-medium ml-6">
            <Link
              to="/"
              className="hover:text-white transition-colors focus:outline-none focus:text-white"
            >
              Acasă
            </Link>
            <Link
              to="/produse"
              className="hover:text-white transition-colors focus:outline-none focus:text-white"
            >
              Produse
            </Link>
            <Link
              to="/about"
              className="hover:text-white transition-colors focus:outline-none focus:text-white"
            >
              Despre Noi
            </Link>
          </div>
        </div>

        {/* PARTEA DREAPTĂ: Control Coș & Profil */}
        <div className="flex items-center gap-4 shrink-0">
          {/* COȘ DE CUMPĂRĂTURI */}
          {user && <CartDropdown />}

          {/* STATUS PROFIL SAU AUTENTIFICARE */}
          {user ? (
            <ProfileDropdown />
          ) : (
            <button
              type="button"
              onClick={() => {
                if (typeof openAuthModal === "function") openAuthModal();
              }}
              className="p-2 text-zinc-400 hover:text-white transition-colors flex items-center justify-center focus:outline-none cursor-pointer"
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
