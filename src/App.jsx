import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/auth/AuthModal";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminMessages from "./pages/AdminMessages";
import ContactForm from "./pages/ContactForm";
import Footer from "./components/Footer";

function App() {
  const { user, loading } = useAuth();

  // Helper pentru a proteja rutele de Admin
  const AdminRoute = ({ children }) => {
    // Dacă încă se încarcă starea sau dacă token-ul este verificat în background,
    // blocăm randarea pentru a preveni un redirect fals de tip "păcăleală"
    if (loading) {
      return (
        <div className="flex items-center justify-center font-medium py-20 text-stone-600 dark:text-zinc-400">
          Se verifică drepturile de acces...
        </div>
      );
    }

    // Verificare strictă de rol
    if (user && user.role === "admin") {
      return children;
    }

    // Dacă utilizatorul nu este admin sau nu e logat, îl trimitem politicos pe Home
    return <Navigate to="/" replace />;
  };

  return (
    <>
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

          {/* RUTE PROTEJATE ADMIN (Toate sunt trecute acum prin filtrul de securitate) */}
          <Route
            path="/admin/produse"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/comenzi"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/mesaje"
            element={
              <AdminRoute>
                <AdminMessages />
              </AdminRoute>
            }
          />

          {/* CORECTAT: Redirecționare corectă pentru pagini inexistente în v6 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}

export default App;
