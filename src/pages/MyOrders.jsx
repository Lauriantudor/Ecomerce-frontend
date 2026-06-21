import React, { useState, useEffect, useRef } from "react";
import orderService from "../services/orderService";
import OrderDetailsModal from "../components/OrderDetailsModal"; // Importă componenta nouă

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Stări pentru controlul modalului separat
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const lastActiveButtonRef = useRef(null); // Păstrează elementul declanșator

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getUserOrder();
      setOrders(res.orders || []);
    } catch (error) {
      console.error("Eroare la încărcarea comenzilor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Ești sigur că vrei să anulezi această comandă?")) {
      try {
        setActionLoadingId(orderId);
        const res = await orderService.cancelOrder(orderId);
        alert(res.message || "Comandă anulată cu succes!");
        await fetchUserOrders();
      } catch (error) {
        console.error("Eroare la anularea comenzii:", error);
        alert(error.response?.data?.message || "Nu s-a putut anula comanda.");
      } finally {
        setActionLoadingId(null);
      }
    }
  };

  const openDetailsModal = (e, order) => {
    // Salvăm elementul butonului curent pentru a returna focusul ulterior
    lastActiveButtonRef.current = e.currentTarget;
    setSelectedOrderDetails(order);
  };

  const closeDetailsModal = () => {
    setSelectedOrderDetails(null);
    // Returnăm focusul imediat înapoi pe butonul de deschidere
    setTimeout(() => {
      lastActiveButtonRef.current?.focus();
    }, 50);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#0c0c0c] text-zinc-500 text-sm flex items-center justify-center"
        role="status"
      >
        Se încarcă istoricul comenzilor tale...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white py-12 px-4 sm:px-8 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black tracking-tight mb-8 text-zinc-100 uppercase">
          Comenzile Mele
        </h1>

        {orders.length === 0 ? (
          <div className="bg-[#121212] border border-zinc-900 rounded-2xl p-8 text-center">
            <p className="text-zinc-500 text-sm italic">
              Nu ai plasat nicio comandă până în acest moment.
            </p>
          </div>
        ) : (
          <div
            className="space-y-4"
            role="region"
            aria-label="Istoricul comenzilor tale"
          >
            {orders.map((order) => {
              const isPending =
                order.status === "pending" || order.status === "panding";
              const isCancelling = actionLoadingId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-[#121212] border border-zinc-900 rounded-2xl p-5 md:p-6 space-y-4 transition-all hover:border-zinc-800"
                >
                  {/* Cap Card */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-900 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-zinc-200">
                        Comanda #{order.id}
                      </h3>
                      <p className="text-zinc-500 text-xs">
                        Plasată la data de:{" "}
                        {new Date(order.createdAt).toLocaleDateString("ro-RO")}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPending
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : order.status === "shipped"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : order.status === "delivered"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
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

                  {/* Corp scurt / Prevualizare produse */}
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm text-zinc-400"
                      >
                        <span className="truncate max-w-[70%]">
                          {item.product?.name}{" "}
                          <span className="text-zinc-600 font-bold text-xs">
                            x{item.quantity}
                          </span>
                        </span>
                        <span className="text-zinc-300">
                          {((item.product?.price || 0) * item.quantity).toFixed(
                            2,
                          )}{" "}
                          RON
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Subsol Card cu Butoane */}
                  <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-3 border-t border-zinc-900/50">
                    <p className="text-sm text-zinc-400">
                      Total de plată:{" "}
                      <span className="text-emerald-500 font-black text-base">
                        {order.totalAmount} RON
                      </span>
                    </p>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={(e) => openDetailsModal(e, order)}
                        className="text-xs font-bold text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 px-4 py-2 rounded-xl transition-all uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-zinc-400"
                        aria-label={`Vezi detalii complete pentru comanda numărul ${order.id}`}
                      >
                        Detalii Comandă
                      </button>

                      {isPending && (
                        <button
                          type="button"
                          disabled={isCancelling}
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-xs font-bold text-red-500/80 hover:text-red-400 border border-red-950 bg-red-950/20 hover:bg-red-950/40 px-4 py-2 rounded-xl transition-all uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-40"
                          aria-label={`Anulează comanda numărul ${order.id}`}
                        >
                          {isCancelling ? "Se anulează..." : "Anulează Comanda"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RENDER POP-UP SEPARAT */}
      <OrderDetailsModal
        order={selectedOrderDetails}
        onClose={closeDetailsModal}
      />
    </div>
  );
};

export default MyOrders;
