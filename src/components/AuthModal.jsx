import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthModal = () => {
  // Își ia singur stările globale din context
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Dacă starea globală zice că e închis, nu randăm nimic
  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Te rugăm să completezi toate câmpurile.");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Resetăm câmpurile la succes
        setEmail("");
        setPassword("");
      } else {
        setError("Datele introduse sunt incorecte.");
      }
    } catch (err) {
      setError("A apărut o eroare la conectare.");
    }
  };

  return (
    // BACKDROP: Adăugat o peliculă fină de blur adaptabilă
    <div className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all">
      {/* MODAL CARD: Alb curat pe light, finisaje calde stone */}
      <div className="bg-white dark:bg-[#161616] border border-stone-200/60 dark:border-zinc-800 w-full max-w-md rounded-2xl p-6 relative shadow-xl dark:shadow-2xl text-stone-900 dark:text-zinc-100 transition-colors duration-300">
        {/* Buton Închidere (X) */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-white text-lg focus:outline-none transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-wide uppercase mb-6 text-center">
          Autentificare
        </h2>

        {error && (
          // EROARE: Roșu/Rose mai închis pe light mode pentru lizibilitate excelentă
          <div className="bg-rose-600/10 dark:bg-red-500/10 border border-rose-600/20 dark:border-red-500/20 text-rose-800 dark:text-red-400 text-xs py-2 px-3 rounded-xl mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1">
              Adresă de email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // INPUTS: Fundal mat texturat crem deschis (stone-50) pe light
              className="w-full bg-stone-50 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 text-stone-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder-stone-400"
              placeholder="test@test.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1">
              Parolă
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800 text-stone-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder-stone-400"
              placeholder="••••••••"
            />
          </div>

          {/* BUTON TRIMITERE: Verde profund cu text alb pe light mode */}
          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white dark:text-black font-black text-xs rounded-xl transition-all uppercase tracking-wider mt-2 shadow-sm cursor-pointer"
          >
            Intră în cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
