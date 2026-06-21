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
      <p className="text-zinc-500 text-sm" role="status">
        Se încarcă adresele...
      </p>
    );

  return (
    <div className="space-y-4">
      <h3 className="text-md font-bold uppercase tracking-wide text-zinc-300">
        1. Selectează Adresa de Livrare
      </h3>

      {/* Listă adrese */}
      <div
        className="space-y-2"
        role="region"
        aria-label="Adresele tale de livrare"
      >
        {addresses.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">
            Nu ai nicio adresă salvată.
          </p>
        ) : (
          addresses.map((addr) => {
            const id = addr.id || addr._id;
            const isSelected = selectedAddressId === id;
            return (
              <div
                key={id}
                className={`p-4 rounded-xl border text-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-zinc-900 border-emerald-500"
                    : "bg-zinc-950 border-zinc-900 hover:border-zinc-800"
                }`}
              >
                {/* Partea stângă funcționează ca un buton dedicat exclusiv selecției */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onAddressSelect(id)}
                  className="flex items-center gap-3 text-left w-full flex-1 min-w-0 focus:outline-none"
                  aria-label={`Selectează adresa: ${addr.fullName || addr.fullname}, ${addr.streetAddress || addr.street}, ${addr.city}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? "border-emerald-500" : "border-zinc-700"}`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-zinc-200 block sm:inline">
                      {addr.fullName || addr.fullname}
                    </span>
                    <span className="text-zinc-500 mx-2 hidden sm:inline">
                      |
                    </span>
                    <span className="text-zinc-400 text-xs sm:text-sm">
                      {addr.streetAddress || addr.street}, {addr.city}
                    </span>
                  </div>
                </button>

                {/* Partea dreaptă conține butoanele izolate care acum pot primi focus independent */}
                <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-zinc-900 sm:border-t-0 pt-2 sm:pt-0 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleEditClick(e, addr)}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1 bg-zinc-900/50 rounded-md border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label={`Modifică adresa lui ${addr.fullName || addr.fullname}`}
                  >
                    Modifică
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, addr)}
                    className="text-xs font-semibold text-red-500/70 hover:text-red-400 transition-colors px-2 py-1 bg-zinc-900/50 rounded-md border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500"
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
          className="text-xs text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors focus:outline-none focus:underline"
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
