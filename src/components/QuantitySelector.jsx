import React, { useRef, useEffect, useState } from "react";

const QuantitySelector = ({
  value = "",
  product = null,
  onInputChange,
  min = 1,
  max = 99,
}) => {
  const hasProduct = product !== null && product !== undefined && product.id;
  const currentVal = value === "" ? 0 : parseInt(value, 10) || 0;
  const productName = product?.name || "produs";

  const decrementRef = useRef(null);
  const incrementRef = useRef(null);
  const inputRef = useRef(null);
  const [lastAction, setLastAction] = useState(null);

  useEffect(() => {
    // Dacă acțiunea a dezactivat butonul, mutăm focusul pe input pentru a nu pierde utilizatorul
    if (lastAction === "dec") {
      if (currentVal <= min && inputRef.current) {
        inputRef.current.focus();
      } else if (decrementRef.current) {
        decrementRef.current.focus();
      }
    } else if (lastAction === "inc") {
      if (currentVal >= max && inputRef.current) {
        inputRef.current.focus();
      } else if (incrementRef.current) {
        incrementRef.current.focus();
      }
    }
    setLastAction(null);
  }, [value, lastAction, currentVal, min, max]);

  const handleDecrement = () => {
    if (currentVal <= min) return;
    setLastAction("dec");
    const newVal = Math.max(min, currentVal - 1);
    if (hasProduct) {
      onInputChange(product.id, newVal);
    } else {
      onInputChange(newVal);
    }
  };

  const handleIncrement = () => {
    const baseVal = value === "" ? 0 : currentVal;
    setLastAction("inc");
    const newVal = Math.min(max, baseVal + 1);
    if (hasProduct) {
      onInputChange(product.id, newVal);
    } else {
      onInputChange(newVal);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (hasProduct) {
      onInputChange(product.id, inputValue);
    } else {
      if (inputValue === "" || /^[0-9]*$/.test(inputValue)) {
        const num = parseInt(inputValue, 10);
        onInputChange(inputValue === "" ? "" : isNaN(num) ? min : num);
      }
    }
  };

  return (
    <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-full p-0.5 w-24 h-8 shadow-sm">
      {/* Zona aria-live discretă */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {value === ""
          ? "Cantitate zero"
          : `Cantitatea actuală pentru ${productName} este ${value}`}
      </div>

      {/* BUTONUL DE SCĂDERE */}
      <button
        ref={decrementRef}
        type="button"
        onClick={handleDecrement}
        disabled={currentVal <= min}
        aria-label={`Scade cantitatea pentru ${productName}`}
        className="text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white h-full px-2.5 text-sm font-bold cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-l-full disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
      >
        <span aria-hidden="true">-</span>
      </button>

      {/* INPUTUL VIZUAL */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="1"
        value={value}
        onChange={handleChange}
        aria-label={`Cantitate ${productName}`}
        className="bg-transparent text-stone-900 dark:text-zinc-100 font-bold text-xs w-7 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-sm select-all"
      />

      {/* BUTONUL DE CREȘTERE */}
      <button
        ref={incrementRef}
        type="button"
        onClick={handleIncrement}
        disabled={currentVal >= max}
        aria-label={`Crește cantitatea pentru ${productName}`}
        className="text-stone-600 hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white h-full px-2.5 text-sm font-bold cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-r-full disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
};

export default QuantitySelector;
