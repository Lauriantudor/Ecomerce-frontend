import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const modalRef = useRef(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setEmail("");
      setPassword("");
      setErrors({});
      setShowPassword(false);
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (!isAuthModalOpen) return;
    modalRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeAuthModal();
        return;
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let localErrors = {};

    if (!email.trim()) {
      localErrors.email = "Te rugăm să introduci adresa de email.";
    }
    if (!password.trim()) {
      localErrors.password = "Te rugăm să introduci parola.";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        setEmail("");
        setPassword("");
        setErrors({});
        setShowPassword(false);
      } else {
        setErrors({
          email: " ",
          password:
            "Datele introduse sunt incorecte. Verifică email-ul sau parola.",
        });
      }
    } catch (err) {
      setErrors({
        global: "A apărut o eroare la conectare. Încearcă din nou.",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-all"
      onClick={(e) => e.target === e.currentTarget && closeAuthModal()}
    >
      <div
        ref={modalRef}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white dark:bg-[#161616] border border-stone-200/60 dark:border-zinc-800 w-full max-w-md rounded-2xl p-6 relative shadow-xl dark:shadow-2xl text-stone-900 dark:text-zinc-100 transition-colors duration-300"
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-white text-lg transition-colors cursor-pointer rounded"
          aria-label="Închidere pop-up"
        >
          ✕
        </button>

        <h2
          id="modal-title"
          className="text-xl font-black text-stone-900 dark:text-white tracking-wide uppercase mb-6 text-center"
        >
          Autentificare
        </h2>

        {errors.global && (
          <div
            className="bg-rose-600/10 dark:bg-red-500/10 border border-rose-600/20 dark:border-red-500/20 text-rose-800 dark:text-red-400 text-xs py-2 px-3 rounded-xl mb-4 text-center font-semibold"
            role="alert"
          >
            {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              id="email-label"
              className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1"
            >
              Adresă de email{" "}
              <span className="text-rose-500" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: null }));
              }}
              required
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full bg-stone-50 dark:bg-zinc-900 border text-stone-900 dark:text-white rounded-xl px-4 py-3 text-sm transition-all placeholder-stone-400 ${
                errors.email
                  ? "border-rose-500 dark:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                  : "border-stone-200/60 dark:border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
              }`}
              placeholder="test@test.com"
            />
            {errors.email && errors.email.trim() && (
              <p
                id="email-error"
                className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold mt-1.5 px-1 animate-fadeIn"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              id="password-label"
              className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1"
            >
              Parolă{" "}
              <span className="text-rose-500" aria-hidden="true">
                *
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: null }));
                }}
                required
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`w-full bg-stone-50 dark:bg-zinc-900 border text-stone-900 dark:text-white rounded-xl pl-4 pr-11 py-3 text-sm transition-all placeholder-stone-400 ${
                  errors.password
                    ? "border-rose-500 dark:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30"
                    : "border-stone-200/60 dark:border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 transition-colors cursor-pointer rounded"
                aria-label={
                  showPassword
                    ? "Ascunde parola"
                    : "Afișează parola în text clar"
                }
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold mt-1.5 px-1 animate-fadeIn"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition-all uppercase tracking-wider mt-2 shadow-sm cursor-pointer"
          >
            Intră în cont
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
