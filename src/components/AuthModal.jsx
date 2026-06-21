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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-[#161616] border border-zinc-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl">
        {/* Buton Închidere (X) */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white text-lg focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-xl font-black text-white tracking-wide uppercase mb-6 text-center">
          Autentificare
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Adresă de email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="test@test.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Parolă
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs rounded-xl transition-all uppercase tracking-wider mt-2"
          >
            Intră în cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
