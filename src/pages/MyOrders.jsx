import React, { useState, useEffect, useRef } from "react";
import orderService from "../services/orderService";
import OrderDetailsModal from "../components/cart&orders/OrderDetailsModal";
import OrderFilter from "../components/cart&orders/OrderFilter";
import Pagination from "../components/Pagination";
import { toast } from "sonner";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const lastActiveButtonRef = useRef(null);

  const isAnyModalOpen = !!selectedOrderDetails;

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // ─── UX OPTIMIZARE: Scroll automat sus la schimbarea paginii ───
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getUserOrder();
      setOrders(res.orders || []);
    } catch (error) {
      console.error("Eroare la încărcarea comenzilor:", error);
      toast.error("Nu s-a putut încărca istoricul", {
        description: "A apărut o eroare la preluarea comenzilor tale.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Ești sigur că vrei să anulezi această comandă?")) {
      try {
        setActionLoadingId(orderId);
        const res = await orderService.cancelOrder(orderId);

        toast.success("Comandă anulată", {
          description: res.message || "Comanda a fost anulată cu succes. 🛒",
        });

        await fetchUserOrders();
      } catch (error) {
        console.error("Eroare la anularea comenzii:", error);
        toast.error("Eroare la anulare", {
          description:
            error.response?.data?.message ||
            "Nu s-a putut anula comanda în acest moment.",
        });
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const openDetailsModal = (e, order) => {
    lastActiveButtonRef.current = e.currentTarget;
    setSelectedOrderDetails(order);
  };

  const closeDetailsModal = () => {
    setSelectedOrderDetails(null);
    setTimeout(() => {
      lastActiveButtonRef.current?.focus();
    }, 50);
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "all") return true;
    return order.status?.toLowerCase() === selectedStatus.toLowerCase();
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-20 text-sm font-medium text-stone-500 dark:text-zinc-500"
        role="status"
      >
        Se încarcă istoricul comenzilor tale...
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto">
      <div
        className="max-w-4xl mx-auto"
        aria-hidden={isAnyModalOpen ? "true" : "false"}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-stone-800 dark:text-zinc-100 uppercase">
              Comenzile Mele
            </h1>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
              Administrează și verifică stadiul livrării pentru comenzile tale.
            </p>
          </div>

          <OrderFilter
            selectedStatus={selectedStatus}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-stone-400 dark:text-zinc-500 text-sm italic">
              {selectedStatus === "all"
                ? "Nu ai plasat nicio comandă până în acest moment."
                : "Nu există comenzi cu statusul selectat."}
            </p>
          </div>
        ) : (
          <div
            className="space-y-4"
            role="region"
            aria-label="Istoricul comenzilor tale"
          >
            {currentItems.map((order) => {
              const isPending =
                order.status === "pending" || order.status === "panding";
              const isCancelling = actionLoadingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-[#121212] border border-stone-200/60 dark:border-zinc-900 rounded-2xl p-5 md:p-6 space-y-4 transition-all hover:border-stone-300 dark:hover:border-zinc-800 shadow-sm"
                >
                  {/* Cap Comandă */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 dark:border-zinc-900 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-stone-800 dark:text-zinc-200">
                        Comanda #{order.id}
                      </h3>
                      <p className="text-stone-400 dark:text-zinc-500 text-xs">
                        Plasată la data de:{" "}
                        {new Date(order.createdAt).toLocaleDateString("ro-RO")}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPending
                            ? "bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                            : order.status === "shipped"
                              ? "bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                              : order.status === "delivered"
                                ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                                : "bg-rose-100 dark:bg-red-500/10 text-rose-800 dark:text-red-400 border border-rose-200 dark:border-red-500/20"
                        }`}
                      >
                        {isPending
                          ? "În așteptare"
                          : order.status === "shipped"
                            ? "Expediată"
                            : order.status === "delivered"
                              ? "Livrată"
                              : "Anulată"}
                      </span>
                    </div>
                  </div>

                  {/* Produse comandate */}
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-stone-600 dark:text-zinc-400"
                      >
                        <span className="truncate max-w-[70%]">
                          {item.product?.name}{" "}
                          <span className="text-stone-400 dark:text-zinc-600 font-bold text-xs">
                            x{item.quantity}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer Comandă */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-3 border-t border-stone-100 dark:border-zinc-900/50">
                    <p className="text-sm text-stone-500 dark:text-zinc-400">
                      Total de plată:{" "}
                      <span className="text-emerald-700 dark:text-emerald-500 font-black text-base">
                        {Number(order.totalAmount).toFixed(2)} RON
                      </span>
                    </p>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        tabIndex={isAnyModalOpen ? "-1" : "0"}
                        onClick={(e) => openDetailsModal(e, order)}
                        className="text-xs font-bold text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-zinc-800 hover:border-stone-300 dark:hover:border-zinc-700 bg-stone-50 dark:bg-zinc-900/50 px-4 py-2 rounded-xl transition-all uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-zinc-400 cursor-pointer"
                      >
                        Detalii Comandă
                      </button>

                      {isPending && (
                        <button
                          type="button"
                          tabIndex={isAnyModalOpen ? "-1" : "0"}
                          disabled={isCancelling}
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-xs font-bold text-rose-600 dark:text-red-400/90 hover:text-rose-700 dark:hover:text-red-400 border border-rose-200 dark:border-red-950 bg-rose-50 dark:bg-red-950/20 hover:bg-rose-100 dark:hover:bg-red-950/40 px-4 py-2 rounded-xl transition-all uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-red-500 disabled:opacity-40 cursor-pointer"
                        >
                          {isCancelling ? "Se anulează..." : "Anulează Comanda"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* COMPONENTA DE PAGINARE */}
            {totalPages > 1 && (
              <div className="pt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <OrderDetailsModal
        order={selectedOrderDetails}
        onClose={closeDetailsModal}
      />
    </div>
  );
};

export default MyOrders;
