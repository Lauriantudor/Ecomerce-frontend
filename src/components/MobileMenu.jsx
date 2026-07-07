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
      className="md:hidden bg-white dark:bg-zinc-950 border-b border-stone-200 dark:border-zinc-900 font-medium text-sm flex flex-col items-stretch py-2 absolute w-full left-0 z-40 shadow-lg dark:shadow-none transition-colors duration-300"
    >
      {!isAdmin ? (
        <>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-900 transition-all focus:outline-none focus:bg-stone-50 dark:focus:bg-zinc-900"
          >
            Acasă
          </Link>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-900 transition-all focus:outline-none focus:bg-stone-50 dark:focus:bg-zinc-900"
          >
            Contact
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-900 transition-all focus:outline-none focus:bg-stone-50 dark:focus:bg-zinc-900"
          >
            Vezi Magazinul
          </Link>

          <Link
            to="/admin/produse"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all focus:outline-none focus:bg-emerald-50/50 dark:focus:bg-emerald-950/20"
          >
            Gestiune Produse{" "}
            <span aria-hidden="true" className="ml-1">
              🛠️
            </span>
          </Link>

          <Link
            to="/admin/comenzi"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-bold hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all focus:outline-none focus:bg-amber-50/50 dark:focus:bg-amber-950/20"
          >
            Management Comenzi{" "}
            <span aria-hidden="true" className="ml-1">
              📦
            </span>
          </Link>

          <Link
            to="/admin/mesaje"
            onClick={() => setIsOpen(false)}
            className="block text-center py-2.5 text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all focus:outline-none focus:bg-indigo-50/50 dark:focus:bg-indigo-950/20"
          >
            Management Mesaje{" "}
            <span aria-hidden="true" className="ml-1">
              ✉️
            </span>
          </Link>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
