import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileMenu = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const isAdmin = user?.role === "admin";

  return (
    <div
      id="mobile-navigation"
      // MODIFICAT: bg-white pe light, înapoi la negru oled pe dark mode + borduri fine calde
      className="md:hidden bg-white dark:bg-[#121212] border-b border-stone-200/60 dark:border-zinc-900 text-stone-600 dark:text-zinc-400 font-medium text-sm flex flex-col items-center gap-4 py-4 absolute w-full left-0 z-40 shadow-md dark:shadow-none transition-colors duration-300"
    >
      {!isAdmin ? (
        <>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            // MODIFICAT: text-stone-600 cu hover elegant pe text-stone-900 (light mode)
            className="text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors w-full text-center py-1"
          >
            Acasă
          </Link>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors w-full text-center py-1"
          >
            Contact
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors w-full text-center py-1"
          >
            Vezi Magazinul
          </Link>
          <Link
            to="/admin/produse"
            onClick={() => setIsOpen(false)}
            // MODIFICAT: text-emerald-700 pe light mode pentru contrast maxim pe fundalul alb
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 font-bold transition-colors w-full text-center py-1"
          >
            Gestiune Produse 🛠️
          </Link>
          <Link
            to="/admin/comenzi"
            onClick={() => setIsOpen(false)}
            // MODIFICAT: text-amber-700 pe light mode ca să fie perfect lizibil
            className="text-amber-700 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-bold transition-colors w-full text-center py-1"
          >
            Management Comenzi 📦
          </Link>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
