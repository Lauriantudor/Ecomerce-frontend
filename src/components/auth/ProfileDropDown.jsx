import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      navigate("/");
      setIsOpen(false);
      await logout();
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center justify-center cursor-pointer rounded-xl hover:bg-stone-100 dark:hover:bg-zinc-900/50"
        aria-label="Meniu profil"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl shadow-lg py-2 z-50 animate-fade-in text-sm font-medium transition-colors duration-300">
          <div className="px-4 py-2 border-b border-stone-100 dark:border-zinc-900/80 text-xs text-stone-600 dark:text-zinc-400 truncate font-mono">
            {user?.email}
            {isAdmin && (
              <span className="block text-emerald-700 dark:text-emerald-400 font-bold mt-0.5 uppercase tracking-wider text-[10px]">
                Admin Account
              </span>
            )}
          </div>

          {!isAdmin && (
            <Link
              to="/comenzile-mele"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-stone-600 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-900/40 transition-colors"
            >
              Comenzile Mele
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-colors border-t border-stone-100 dark:border-zinc-900/50 mt-1 cursor-pointer font-bold"
          >
            Deconectare
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
