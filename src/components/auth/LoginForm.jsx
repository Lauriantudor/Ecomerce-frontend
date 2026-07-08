import React, { useState } from "react";

const LoginForm = ({ login, onSuccess, onError, switchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let localErrors = {};

    if (!email.trim())
      localErrors.email = "Te rugăm să introduci adresa de email.";
    if (!password.trim())
      localErrors.password = "Te rugăm să introduci parola.";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        setErrors({
          email: " ",
          password:
            "Datele introduse sunt incorecte. Verifică email-ul sau parola.",
        });
      }
    } catch (err) {
      onError("A apărut o eroare la conectare. Încearcă din nou.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1">
          Adresă de email <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          className={`w-full bg-stone-50 dark:bg-zinc-900 border text-stone-900 dark:text-white rounded-xl px-4 py-3 text-sm transition-all placeholder-stone-400 ${
            errors.email
              ? "border-rose-500"
              : "border-stone-200/60 dark:border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
          }`}
          placeholder="test@test.com"
        />
        {errors.email && errors.email.trim() && (
          <p
            className="text-rose-600 dark:text-rose-400 text-[11px] font-semibold mt-1.5 px-1 animate-fadeIn"
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider mb-2 px-1">
          Parolă <span className="text-rose-500">*</span>
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
            className={`w-full bg-stone-50 dark:bg-zinc-900 border text-stone-900 dark:text-white rounded-xl pl-4 pr-11 py-3 text-sm transition-all placeholder-stone-400 ${
              errors.password
                ? "border-rose-500"
                : "border-stone-200/60 dark:border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
            }`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-300 p-1 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {errors.password && (
          <p
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

      <div className="mt-6 text-center text-xs text-stone-500 dark:text-zinc-400">
        Nu ai un cont creat?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer focus:outline-none"
        >
          Înregistrează-te acum
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
