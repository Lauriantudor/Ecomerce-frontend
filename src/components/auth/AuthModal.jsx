import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [globalError, setGlobalError] = useState(null);
  const [globalSuccess, setGlobalSuccess] = useState(null);

  const modalRef = useRef(null);

  // Resetăm mesajele la comutare sau deschidere
  useEffect(() => {
    if (isAuthModalOpen) {
      setGlobalError(null);
      setGlobalSuccess(null);
    }
  }, [isAuthModalOpen, isLoginMode]);

  // Trap Focus & Keydown listener (Păstrat intact)
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
          {isLoginMode ? "Autentificare" : "Creare Cont"}
        </h2>

        {/* Alerte globale */}
        {globalError && (
          <div
            className="bg-rose-600/10 border border-rose-600/20 text-rose-800 dark:text-red-400 text-xs py-2 px-3 rounded-xl mb-4 text-center font-semibold animate-fadeIn"
            role="alert"
          >
            {globalError}
          </div>
        )}
        {globalSuccess && (
          <div
            className="bg-emerald-600/10 border border-emerald-600/20 text-emerald-600 text-xs py-2 px-3 rounded-xl mb-4 text-center font-semibold animate-fadeIn"
            role="alert"
          >
            {globalSuccess}
          </div>
        )}

        {/* Injectăm componenta corespunzătoare modului selectat */}
        {isLoginMode ? (
          <LoginForm
            login={login}
            onSuccess={() => closeAuthModal()}
            onError={(msg) => setGlobalError(msg)}
            switchToRegister={() => setIsLoginMode(false)}
          />
        ) : (
          <RegisterForm
            registerFn={register}
            onRegisterSuccess={() => {
              setIsLoginMode(true);
              setGlobalSuccess("Cont creat cu succes! Te poți autentifica.");
            }}
            onError={(msg) => setGlobalError(msg)}
            switchToLogin={() => setIsLoginMode(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
