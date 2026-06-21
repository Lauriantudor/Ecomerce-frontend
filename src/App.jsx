import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";

function App() {
  // Extragem stările din context. Asigură-te că numele sunt exact acestea!
  const auth = useAuth();

  // Adăugăm un console.log direct în App.jsx ca să fim 100% siguri de date
  console.log("Datele din AuthContext în App.jsx:", auth);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Bara de navigare globală */}
      <Navbar />

      {/* Trimitem explicit variabila extrasă din context */}
      <AuthModal />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produse" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/comenzile-mele" element={<MyOrders />} />
      </Routes>
    </div>
  );
}

export default App;
