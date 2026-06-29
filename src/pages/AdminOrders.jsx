import React, { useEffect, useState } from "react";
import orderService from "../services/orderService";
import AddessDetailsModal from "../components/AddessDetailsModal";
import OrderDetailsModal from "../components/OrderDetailsModal";

// IMPORTĂM SUB-COMPONENTELE NOI
import OrderFilter from "../components/OrderFilter";
import OrdersTableDesktop from "../components/OrdersTableDesktop";
import OrdersCardsMobile from "../components/OrdersCardsMobile";
import Pagination from "../components/Pagination";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getAllOrders();
      setOrders(data.orders || data || []);
    } catch (err) {
      console.error(err);
      setError("Nu s-au putut încărca comenzile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    if (order.status?.toLowerCase() === "cancelled") {
      alert(
        "Această comandă a fost deja anulată și nu mai poate fi modificată!",
      );
      return;
    }
    try {
      await orderService.changeStatus(order.id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)),
      );
    } catch (err) {
      console.error("Eroare la schimbarea statusului:", err);
      alert(err.response?.data?.message || "Eroare la modificarea statusului.");
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Logica de filtrare și tăiere
  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "all") return true;
    return order.status?.toLowerCase() === selectedStatus.toLowerCase();
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrdersDisplayed = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  if (loading) {
    return (
      // MODIFICAT: Ecranul de încărcare este acum adaptiv (bg-stone-50 și text-stone-800 pe light mode)
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-white flex items-center justify-center font-medium transition-colors duration-300">
        Se încarcă managerul de comenzi...
      </div>
    );
  }

  return (
    // MODIFICAT: Containerul principal devine bg-stone-50 și text-stone-800 pe light mode
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header-ul Pagină */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            {/* MODIFICAT: Titlu text-stone-900 pe light mode */}
            <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
              Management Comenzi 📦
            </h1>
            {/* MODIFICAT: Text descriptiv text-stone-500 pe light mode */}
            <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
              Gestionează statusul livrărilor și verifică datele clienților.
            </p>
          </div>

          <OrderFilter
            selectedStatus={selectedStatus}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        {error ? (
          // MODIFICAT: Boxă de eroare adaptivă cu bg-rose-50 și border-rose-200 pe light mode
          <div className="bg-rose-50 dark:bg-zinc-900 border border-rose-200 dark:border-rose-950/45 p-6 rounded-2xl text-rose-700 dark:text-rose-400 font-medium shadow-sm">
            ⚠️ {error}
          </div>
        ) : orders.length === 0 ? (
          // MODIFICAT: Container stări goale adaptiv (bg-white, border-stone-200, text-stone-500)
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 rounded-3xl text-center text-stone-500 dark:text-zinc-400 shadow-sm transition-colors">
            Nu există nicio comandă plasată în magazin în acest moment.
          </div>
        ) : filteredOrders.length === 0 ? (
          // MODIFICAT: Alerte combinate adaptive pentru filtre fără rezultate
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 rounded-3xl text-center text-stone-500 dark:text-zinc-400 shadow-sm transition-colors">
            Nu s-a găsit nicio comandă cu statusul "{selectedStatus}".
          </div>
        ) : (
          <div className="space-y-4">
            <OrdersTableDesktop
              orders={currentOrdersDisplayed}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewOrderDetails}
            />

            <OrdersCardsMobile
              orders={currentOrdersDisplayed}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewOrderDetails}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modalele rămân neschimbate în structura lor de apel */}
      {isAddressModalOpen && (
        <AddessDetailsModal
          address={selectedAddress}
          onClose={() => setIsAddressModalOpen(false)}
        />
      )}
      {isOrderModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
    </main>
  );
}

export default AdminOrders;
