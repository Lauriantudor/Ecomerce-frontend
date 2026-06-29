import React, { useState, useEffect } from "react";

const AddressForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Salvează Adresa",
}) => {
  const [formData, setFormData] = useState({
    title: "",
    fullname: "",
    phoneNumber: "",
    city: "",
    county: "",
    country: "",
    streetAddress: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        fullname: initialData.fullName || "",
        phoneNumber: initialData.phoneNumber || "",
        city: initialData.city || "",
        county: initialData.county || "",
        country: initialData.country || "",
        streetAddress: initialData.streetAddress || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pasăm datele completate înapoi către componenta părinte
  };

  return (
    <form
      onSubmit={handleSubmit}
      // MODIFICAT: bg-stone-50 pe light mode, text adaptiv, margini discrete
      className="bg-stone-50 dark:bg-zinc-950 border border-stone-200 dark:border-zinc-900 rounded-xl p-4 space-y-3 mt-2捷 animate-fadeIn transition-colors duration-300"
    >
      {/* MODIFICAT: text-stone-500 pe light mode */}
      <h4 className="text-xs font-bold uppercase tracking-wide text-stone-500 dark:text-zinc-400">
        {initialData?.id || initialData?._id
          ? "Editează Adresa"
          : "Detalii Adresă Nouă"}
      </h4>

      <div>
        {/* MODIFICAT: text-stone-600 pentru etichete lizibile pe fundal deschis */}
        <label className="block text-[10px] text-stone-600 dark:text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
          Nume Complet
        </label>
        <input
          type="text"
          name="fullname"
          required
          value={formData.fullname}
          onChange={handleChange}
          // MODIFICAT: bg-white / border-stone-200 / text-stone-800 pe light mode, focus cu emerald stabil pe ambele
          className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-stone-800 dark:text-zinc-200 shadow-sm dark:shadow-none"
          placeholder="Ex: Popescu Andrei"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          {/* MODIFICAT: etichetă adaptivă */}
          <label className="block text-[10px] text-stone-600 dark:text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Telefon
          </label>
          <input
            type="tel"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-stone-800 dark:text-zinc-200 shadow-sm dark:shadow-none"
            placeholder="07xxxxxxxx"
          />
        </div>
        <div>
          {/* MODIFICAT: etichetă adaptivă */}
          <label className="block text-[10px] text-stone-600 dark:text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Oraș
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-stone-800 dark:text-zinc-200 shadow-sm dark:shadow-none"
            placeholder="Ex: Timișoara"
          />
        </div>
      </div>

      <div>
        {/* MODIFICAT: etichetă adaptivă */}
        <label className="block text-[10px] text-stone-600 dark:text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
          Adresă (Stradă, Număr...)
        </label>
        <input
          type="text"
          name="streetAddress"
          required
          value={formData.streetAddress}
          onChange={handleChange}
          className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-stone-800 dark:text-zinc-200 shadow-sm dark:shadow-none"
          placeholder="Ex: Bd. Mihai Viteazul Nr. 12"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          {/* MODIFICAT: etichetă adaptivă */}
          <label className="block text-[10px] text-stone-600 dark:text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Țară
          </label>
          <input
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-stone-800 dark:text-zinc-200 shadow-sm dark:shadow-none"
            placeholder="Ex: Romania"
          />
        </div>
        <div>
          {/* MODIFICAT: etichetă adaptivă */}
          <label className="block text-[10px] text-stone-600 dark:text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Județ
          </label>
          <input
            type="text"
            name="county"
            required
            value={formData.county}
            onChange={handleChange}
            className="w-full bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 dark:focus:border-emerald-500 text-stone-800 dark:text-zinc-200 shadow-sm dark:shadow-none"
            placeholder="Ex: Timiș"
          />
        </div>
      </div>

      {/* BUTOANE DE ACȚIUNE ADAPTIVE */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          // MODIFICAT: text-stone-500 și hover fin pe gri închis pentru light mode
          className="flex-1 py-2 bg-stone-200/70 hover:bg-stone-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-stone-300/60 dark:border-zinc-800 text-stone-600 dark:text-zinc-400 font-bold text-xs rounded-lg transition-all uppercase tracking-wider cursor-pointer"
        >
          Anulează
        </button>
        <button
          type="submit"
          // MODIFICAT: text-white obligatoriu pe un fundal emerald închis (emerald-600) pe light mode pentru accesibilitate
          className="flex-1 py-2 bg-emerald-600 dark:bg-zinc-800 hover:bg-emerald-700 dark:hover:bg-zinc-700 text-white font-bold text-xs rounded-lg transition-all uppercase tracking-wider cursor-pointer shadow-sm"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
