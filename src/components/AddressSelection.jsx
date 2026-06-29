import React, { useState, useEffect, useRef } from "react";
import addressService from "../services/addressService";
import AddressForm from "./AdressForm.jsx";

const AddressSelection = ({ onAddressSelect, selectedAddressId }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Controlul formularului
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Ref pentru a muta focusul pe primul input din formular când se deschide
  const formContainerRef = useRef(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Mutăm focusul automat pe formular imediat ce este randat în DOM
  useEffect(() => {
    if (isFormOpen && formContainerRef.current) {
      // Căutăm primul input din formular pentru a-i oferi focus direct
      const firstInput = formContainerRef.current.querySelector("input");
      if (firstInput) {
        firstInput.focus();
      } else {
        formContainerRef.current.focus();
      }
    }
  }, [isFormOpen, editingAddress]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const res = await addressService.getUserAddresses();
      const fetchedAddresses = res.addresses || res.data || res || [];
      setAddresses(fetchedAddresses);

      if (fetchedAddresses.length > 0 && !selectedAddressId) {
        onAddressSelect(fetchedAddresses[0].id || fetchedAddresses[0]._id);
      }
    } catch (error) {
      console.error("Eroare la încărcarea adreselor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingAddress) {
        const addressId = editingAddress.id || editingAddress._id;
        await addressService.updateAddress(addressId, formData);
        alert("Adresă actualizată cu succes!");
      } else {
        await addressService.saveAddress(formData);
        alert("Adresă adăugată cu succes!");
      }

      setIsFormOpen(false);
      setEditingAddress(null);
      await fetchAddresses();
    } catch (error) {
      console.error("Eroare la trimiterea formularului de adresă:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  const handleEditClick = (e, addr) => {
    e.preventDefault();
    e.stopPropagation(); // Oprim propagarea buclei către containerul părinte
    setEditingAddress(addr);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (e, addr) => {
    e.preventDefault();
    e.stopPropagation();
    const addressId = addr.id || addr._id;

    if (window.confirm("Ești sigur că vrei să ștergi această adresă?")) {
      try {
        await addressService.deleteAddress(addressId);
        alert("Adresă ștearsă cu succes!");
        await fetchAddresses();
      } catch (error) {
        console.error("Eroare la ștergerea adresei:", error);
        alert("Nu s-a putut șterge adresa. Încearcă din nou.");
      }
    }
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  if (loading)
    return (
      // MODIFICAT: text-stone-500 adaptiv pentru ambele teme
      <p className="text-stone-500 dark:text-zinc-500 text-sm" role="status">
        Se încarcă adresele...
      </p>
    );

  return (
    <div className="space-y-4">
      {/* MODIFICAT: text-stone-700 pe light mode pentru un titlu lizibil */}
      <h3 className="text-md font-bold uppercase tracking-wide text-stone-700 dark:text-zinc-300">
        1. Selectează Adresa de Livrare
      </h3>

      {/* Listă adrese */}
      <div
        className="space-y-2"
        role="region"
        aria-label="Adresele tale de livrare"
      >
        {addresses.length === 0 ? (
          <p className="text-stone-400 dark:text-zinc-500 text-sm italic">
            Nu ai nicio adresă salvată.
          </p>
        ) : (
          addresses.map((addr) => {
            const id = addr.id || addr._id;
            const isSelected = selectedAddressId === id;
            return (
              <div
                key={id}
                // MODIFICAT: Fundaluri și margini adaptive. Pe light mode folosește stone-100/bg-white.
                className={`p-4 rounded-xl border text-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-emerald-50/40 dark:bg-zinc-900 border-emerald-600 dark:border-emerald-500"
                    : "bg-stone-50 dark:bg-zinc-950 border-stone-200 dark:border-zinc-900 hover:border-stone-300 dark:hover:border-zinc-800"
                }`}
              >
                {/* Partea stângă funcționează ca un buton dedicat exclusiv selecției */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onAddressSelect(id)}
                  className="flex items-center gap-3 text-left w-full flex-1 min-w-0 focus:outline-none cursor-pointer"
                  aria-label={`Selectează adresa: ${addr.fullName || addr.fullname}, ${addr.streetAddress || addr.street}, ${addr.city}`}
                >
                  {/* MODIFICAT: Cercul radio adaptat la temă */}
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-emerald-600 dark:border-emerald-500" : "border-stone-300 dark:border-zinc-700"}`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-500" />
                    )}
                  </div>
                  <div className="truncate">
                    {/* MODIFICAT: text-stone-800 pe light mode pentru contrast ridicat */}
                    <span className="font-bold text-stone-800 dark:text-zinc-200 block sm:inline">
                      {addr.fullName || addr.fullname}
                    </span>
                    <span className="text-stone-300 dark:text-zinc-500 mx-2 hidden sm:inline">
                      |
                    </span>
                    <span className="text-stone-500 dark:text-zinc-400 text-xs sm:text-sm">
                      {addr.streetAddress || addr.street}, {addr.city}
                    </span>
                  </div>
                </button>

                {/* Partea dreaptă conține butoanele izolate care acum pot primi focus independent */}
                {/* MODIFICAT: Border adaptiv pentru separatorul pe mobil */}
                <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-stone-200/60 dark:border-zinc-900 sm:border-t-0 pt-2 sm:pt-0 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleEditClick(e, addr)}
                    // MODIFICAT: Butoane cu fundal deschis/gri discret pe light mode și contrast corect al textului
                    className="text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-200 transition-colors px-2 py-1 bg-white dark:bg-zinc-900/50 rounded-md border border-stone-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                    aria-label={`Modifică adresa lui ${addr.fullName || addr.fullname}`}
                  >
                    Modifică
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, addr)}
                    // MODIFICAT: Culoarea de ștergere este un roșu mai intens pe light mode (rose-600) pentru accesibilitate
                    className="text-xs font-semibold text-rose-600 dark:text-red-500/70 hover:text-rose-700 dark:hover:text-red-400 transition-colors px-2 py-1 bg-white dark:bg-zinc-900/50 rounded-md border border-stone-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm"
                    aria-label={`Șterge adresa lui ${addr.fullName || addr.fullname}`}
                  >
                    Șterge
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isFormOpen && (
        <button
          type="button"
          onClick={handleAddNewClick}
          // MODIFICAT: text-emerald-600 pe light mode pentru un contrast optim cu fundalul alb/stone
          className="text-xs text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors focus:outline-none focus:underline cursor-pointer pt-1 block"
        >
          ＋ Adaugă adresă nouă
        </button>
      )}

      {/* RENDER FORMULAR REUTILIZABIL */}
      {isFormOpen && (
        <div
          ref={formContainerRef}
          tabIndex={-1}
          className="focus:outline-none"
        >
          <AddressForm
            initialData={editingAddress}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingAddress(null);
            }}
            submitLabel={
              editingAddress ? "Actualizează Adresa" : "Salvează Adresa Nouă"
            }
          />
        </div>
      )}
    </div>
  );
};

export default AddressSelection;
