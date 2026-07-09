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

  const AdminRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center font-medium py-20 text-stone-600 dark:text-zinc-400">
          Se verifică drepturile de acces...
        </div>
      );
    }

    if (user && user.role === "admin") {
      return children;
    }

    return <Navigate to="/" replace />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f0] dark:bg-zinc-950 text-stone-900 dark:text-white transition-colors duration-300">
      <a
        href="#main-content"
        className="pointer-events-none absolute top-4 left-4 z-50 -translate-y-24 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-transform focus:pointer-events-auto focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Sari la conținutul principal
      </a>
      <header>
        <Navbar />
      </header>

      <main id="main-content" tabIndex="-1" className="w-full flex-grow">
        <AuthModal />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/comenzile-mele" element={<MyOrders />} />
          <Route path="/contact" element={<ContactForm />} />

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

export default App;
