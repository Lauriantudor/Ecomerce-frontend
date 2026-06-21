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
      className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3 mt-2 animate-fadeIn"
    >
      <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-400">
        {initialData?.id ? "Editează Adresa" : "Detalii Adresă Nouă"}
      </h4>

      <div>
        <label className="block text-[10px] text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
          Nume Complet
        </label>
        <input
          type="text"
          name="fullname"
          required
          value={formData.fullname}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
          placeholder="Ex: Popescu Andrei"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Telefon
          </label>
          <input
            type="tel"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
            placeholder="07xxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-[10px] text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Oraș
          </label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
            placeholder="Ex: 550123"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
          Adresă (Stradă, Număr...)
        </label>
        <input
          type="text"
          name="streetAddress"
          required
          value={formData.streetAddress}
          onChange={handleChange}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
          placeholder="Ex: Bd. Mihai Viteazul Nr. 12"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Țară
          </label>
          <input
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
            placeholder="Ex: Romania"
          />
        </div>
        <div>
          <label className="block text-[10px] text-zinc-500 font-bold mb-0.5 uppercase tracking-wider">
            Județ
          </label>
          <input
            type="text"
            name="county"
            required
            value={formData.county}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-zinc-200"
            placeholder="Ex: Timiș"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 font-bold text-xs rounded-lg transition-all uppercase tracking-wider"
        >
          Anulează
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg transition-all uppercase tracking-wider"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
