import React, { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import cartService from "../services/cartService";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await cartService.getCart();

      console.log("Date primite în CartContext:", data);

      // Sincronizare perfectă cu structura ta din backend: data.cart.items
      let itemsToSet = [];
      if (data && data.cart && Array.isArray(data.cart.items)) {
        itemsToSet = data.cart.items;
      } else if (data && Array.isArray(data.items)) {
        itemsToSet = data.items;
      } else if (Array.isArray(data)) {
        itemsToSet = data;
      }

      setCartItems(itemsToSet);
    } catch (err) {
      console.error("Eroare la aducerea coșului din backend:", err);
      if (err.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Preluăm coșul doar când utilizatorul este logat cu succes
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Calculăm dinamic valorile totale securizat (fără risc de TypeError)
  const totalItems = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((sum, item) => {
        const productData = item.product || item.Product || item;
        return sum + (item.quantity || 0) * (productData?.price || 0);
      }, 0)
    : 0;

  const addToCart = async (product, quantity) => {
    try {
      const numericProductId = Number(product.id);
      await cartService.addToCart(numericProductId, quantity);
      await fetchCart(); // Reîmprospătare instantanee
    } catch (err) {
      console.error("Eroare la adăugarea în coș:", err);
      alert("Nu s-a putut adăuga produsul. Te rugăm să încerci din nou.");
    }
  };

  const updateCartQuantity = async (cartItem, quantity) => {
    try {
      // Încercăm să luăm ID-ul liniei din coș (item.id sau item._id)
      // NU product.id!
      const cartItemId = cartItem?.id || cartItem?._id;

      if (!cartItemId) {
        console.error(
          "Eroare: Nu s-a găsit niciun ID valid pentru acest element din coș!",
        );
        return;
      }

      await cartService.updateQuantity(cartItemId, quantity);
      console.log("[Succes] Cantitatea a fost modificată.");
      await fetchCart();
    } catch (error) {
      console.error("Eroare la cuptatarea de cantitate", error);
    }
  };
  const removeItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      await fetchCart(); // Reîmprospătare instantanee după ștergere
    } catch (err) {
      console.error("Eroare la ștergerea din coș:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        loading,
        addToCart,
        updateCartQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
