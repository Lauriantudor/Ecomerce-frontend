import React, { useState, useEffect } from "react";
import contactMessageService from "../services/contactMessageService";
import { useAuth } from "../context/AuthContext";

function ContactForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || user.username || "",
        email: user.email || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: "",
        email: "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      await contactMessageService.createMessage(formData);

      setStatus({
        type: "success",
        text: "Mesajul tău a fost trimis cu succes! Te vom contacta în cel mai scurt timp. 🚀",
      });

      setFormData((prev) => ({
        name: user ? user.name || user.username || "" : "",
        email: user ? user.email || "" : "",
        subject: "",
        message: "",
      }));
    } catch (error) {
      console.error("Eroare la trimiterea mesajului:", error);
      setStatus({
        type: "error",
        text: "A apărut o problemă la trimiterea mesajului. Te rugăm să încerci din nou.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen  dark:bg-zinc-950 text-stone-900 dark:text-zinc-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 border border-stone-200/60 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-2xl space-y-6 transition-colors duration-300">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
            Contactează-ne ✉️
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 max-w-md mx-auto">
            Ai o întrebare legată de o comandă sau vrei să ne transmiți un
            feedback? Lasă-ne un mesaj mai jos!
          </p>
        </div>

        {status.text && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
              status.type === "success"
                ? "bg-emerald-600/10 dark:bg-emerald-500/10 border-emerald-600/20 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400"
                : "bg-rose-600/10 dark:bg-rose-500/10 border-rose-600/20 dark:border-rose-500/30 text-rose-800 dark:text-rose-400"
            }`}
          >
            {status.type === "success" ? "✓" : "⚠️"} {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Câmp: Nume Complet */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="text-xs font-bold text-stone-950 dark:text-zinc-300 uppercase tracking-wider block px-1"
            >
              Nume Complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              disabled={!!user}
              placeholder="Ex: Tudor Laurian"
              className={`w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-800 dark:placeholder-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium ${
                user
                  ? "opacity-60 cursor-not-allowed bg-stone-100 dark:bg-zinc-950/40"
                  : ""
              }`}
            />
          </div>

          {/* Câmp: Adresă Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-xs font-bold text-stone-950 dark:text-zinc-300 uppercase tracking-wider block px-1"
            >
              Adresă Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={!!user}
              placeholder="nume@exemplu.com"
              className={`w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-800 dark:placeholder-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-mono ${
                user
                  ? "opacity-60 cursor-not-allowed bg-stone-100 dark:bg-zinc-950/40"
                  : ""
              }`}
            />
          </div>

          {/* Câmp: Subiect */}
          <div className="space-y-1">
            <label
              htmlFor="subject"
              className="text-xs font-bold text-stone-950 dark:text-zinc-200 uppercase tracking-wider block px-1"
            >
              Subiect
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              placeholder="Ex: Întrebare legată de livrare"
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-800 dark:placeholder-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium"
            />
          </div>

          {/* Câmp: Mesaj */}
          <div className="space-y-1">
            <label
              htmlFor="message"
              className="text-xs font-bold text-stone-950 dark:text-zinc-200 uppercase tracking-wider block px-1"
            >
              Mesajul tău
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Scrie aici detaliile solicitării tale..."
              className="w-full bg-stone-50 dark:bg-zinc-950 border border-stone-200/60 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-stone-900 dark:text-white placeholder-stone-800 dark:placeholder-zinc-300 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all font-medium resize-none min-h-[120px]"
            />
          </div>

          {/* Buton de trimitere - ACUM SINTAXA ESTE CORECTĂĂ */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-black text-xs rounded-xl tracking-wider uppercase transition-all shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Se trimite..." : "Trimite Mesaj"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
