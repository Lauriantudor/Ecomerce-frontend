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
    /* 
      AICI ESTE SCHIMBAREA: Am înlocuit <> cu acest div structural.
      El forțează aplicația să aibă cel puțin înălțimea ecranului și aliniază componentele pe verticală.
    */
    <div className="flex flex-col min-h-screen bg-[#faf8f0] dark:bg-zinc-950 text-stone-900 dark:text-white transition-colors duration-300">
      <header>
        <Navbar />
      </header>

      {/* `flex-grow` îi spune main-ului să ocupe tot spațiul rămas liber, împingând footer-ul jos */}
      <main className="w-full flex-grow">
        <AuthModal />

        <Routes>
          {/* RUTE PUBLICE / CLIENȚI */}
          <Route path="/" element={<Home />} />
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

          {/* Redirecționare corectă pentru pagini inexistente */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer-ul va sta acum lipit de marginea de jos pe paginile goale, dar va coborî natural pe paginile lungi */}
      <Footer />

      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}

export default App;
