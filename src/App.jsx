import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminMessages from "./pages/AdminMessages";
import ContactForm from "./pages/ContactForm";

function App() {
  const { user, loading } = useAuth();

  // Componentă Helper pentru a proteja rutele de Admin
  const AdminRoute = ({ children }) => {
    if (loading)
      return (
        // CURĂȚAT: Fără min-h direct sau bg, lasă layout-ul global din CSS să preia controlul
        <div className="flex items-center justify-center font-medium py-20">
          Se verifică drepturile...
        </div>
      );
    return user && user.role === "admin" ? (
      children
    ) : (
      <Navigate to="/" replace />
    );
  };

  return (
    // CORECTAT: Am șters bg-zinc-50, dark:bg-zinc-950, text-zinc-800 și transition.
    // Acum <main> este complet transparent și se va folosi exclusiv culoarea stabilă de vanilie (bg-stone-50) setată global în index.css.
    <>
      {" "}
      <header>
        <Navbar />
      </header>
      <main className="w-full">
        <AuthModal />

        <Routes>
          {/* RUTE PUBLICE / CLIENȚI */}
          <Route path="/" element={<Home />} />
          <Route path="/produse" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/comenzile-mele" element={<MyOrders />} />
          <Route path="/contact" element={<ContactForm />} />

          {/* RUTE PROTEJATE ADMIN */}
          <Route
            path="/admin/produse"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route path="/admin/comenzi" element={<AdminOrders />} />
          <Route path="/admin/mesaje" element={<AdminMessages />} />

          {/* Redirecționare fallback pentru pagini inexistente */}
          <Route path="*" replace to="/" />
        </Routes>
      </main>
    </>
  );
}

export default App;
