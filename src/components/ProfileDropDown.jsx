import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-800 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{user.username || "TestUser"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-3 h-3 text-zinc-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#161616] border border-zinc-800 rounded-xl shadow-xl p-1 z-50">
          <Link
            to="/comenzile-mele"
            onClick={() => setIsOpen(false)}
            className="block w-full text-left text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors focus:outline-none"
          >
            Comenzile mele
          </Link>

          <button
            onClick={() => {
              if (typeof logout === "function") logout();
              setIsOpen(false);
            }}
            className="w-full text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors focus:outline-none"
          >
            Deconectare
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
