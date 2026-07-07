import React, { useEffect, useState } from "react";

function ThemeToggle() {
  // Inițializăm starea verificând dacă utilizatorul a salvat deja o preferință în trecut
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      aria-pressed={isDarkMode}
      aria-label={
        isDarkMode ? "Activează modul luminos" : "Activează modul întunecat"
      }
      title={isDarkMode ? "Schimbă pe Light Mode" : "Schimbă pe Dark Mode"}
      className="p-2 rounded-xl text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-zinc-900 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
    >
      {isDarkMode ? (
        // Iconiță de Soare (pentru Light Mode)
        <svg
          className="h-5 w-5 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ) : (
        // Iconiță de Lună (pentru Dark Mode)
        <svg
          className="h-5 w-5 text-stone-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
