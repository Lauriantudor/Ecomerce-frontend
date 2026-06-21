import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-navigation"
      className="md:hidden bg-[#121212] border-b border-zinc-900 text-zinc-400 font-medium text-sm flex flex-col items-center gap-4 py-4 absolute w-full left-0 z-40"
    >
      <Link
        to="/"
        onClick={() => setIsOpen(false)}
        className="hover:text-white transition-colors w-full text-center py-1"
      >
        Acasă
      </Link>
      <Link
        to="/produse"
        onClick={() => setIsOpen(false)}
        className="hover:text-white transition-colors w-full text-center py-1"
      >
        Produse
      </Link>
      <Link
        to="/about"
        onClick={() => setIsOpen(false)}
        className="hover:text-white transition-colors w-full text-center py-1"
      >
        Despre Noi
      </Link>
    </div>
  );
};

export default MobileMenu;
