import React, { useEffect, useState, useRef } from "react";
import contactMessageService from "../services/contactMessageService";
import MessageTableRow from "../components/message_contact/MessageTableRow";
import MessageMobileCard from "../components/message_contact/MessageMobileCard";
import MessageModal from "../components/message_contact/MessageModal";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Referință pentru a reține elementul care a deschis modalul
  const lastFocusedElementRef = useRef(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const responseData = await contactMessageService.getAllMessages();

      if (Array.isArray(responseData)) {
        setMessages(responseData);
      } else if (responseData && Array.isArray(responseData.messages)) {
        setMessages(responseData.messages);
      } else if (responseData && Array.isArray(responseData.contactMessage)) {
        setMessages(responseData.contactMessage);
      } else if (responseData && Array.isArray(responseData.data)) {
        setMessages(responseData.data);
      } else {
        setMessages([]);
        console.error("Structura răspunsului nu conține un array recunoscut.");
      }
    } catch (err) {
      console.error("Eroare la încărcarea mesajelor:", err);
      setError("Nu s-au putut încărca mesajele de contact.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg) => {
    // Salvăm elementul curent pe care s-a dat click (butonul/rândul din tabel)
    lastFocusedElementRef.current = document.activeElement;

    setSelectedMessage(msg);
    setIsModalOpen(true);

    if (!msg.isRead) {
      try {
        await contactMessageService.markAsRead(msg.id);
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m.id === msg.id ? { ...m, isRead: true } : m,
          ),
        );
      } catch (err) {
        console.error("Nu s-a putut marca mesajul ca citit pe server:", err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Returnăm focusul utilizatorului exact de unde a plecat
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 0);
  };

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-white flex items-center justify-center font-medium transition-colors duration-300"
      >
        Se încarcă mesajele primite...
      </div>
    );
  }

  return (
    <>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2"
        aria-live="polite"
      >
        {/* Header Panou */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
            Mesaje Contact <span aria-hidden="true">✉️</span>
          </h1>
          <p className="text-sm text-stone-600 dark:text-zinc-400 mt-1">
            Citește și gestionează solicitările. Mesajele necitite sunt
            evidențiate automat.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="bg-rose-50 dark:bg-zinc-900 border border-rose-200 dark:border-rose-950/45 p-6 rounded-2xl text-rose-600 dark:text-rose-400 font-medium shadow-sm"
          >
            <span aria-hidden="true" className="mr-1">
              ⚠️
            </span>{" "}
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 rounded-3xl text-center text-stone-600 dark:text-zinc-400 shadow-sm">
            Nu s-a primit niciun mesaj prin formularul de contact până acum.
          </div>
        ) : (
          <div className="space-y-4">
            {/* VARIANTĂ DESKTOP (TABEL SEMANTIC) */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-600 dark:text-zinc-400 uppercase tracking-wider bg-stone-50/50 dark:bg-zinc-900/50">
                      <th className="p-5 w-12 text-center">Status</th>
                      <th className="p-5">Expeditor</th>
                      <th className="p-5">Email</th>
                      <th className="p-5">Subiect / Fragment</th>
                      <th className="p-5">Data</th>
                      <th className="p-5 text-right px-6">Acțiuni</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-stone-100 dark:divide-zinc-800/60">
                    {messages.map((msg) => (
                      <MessageTableRow
                        key={msg.id}
                        msg={msg}
                        onOpen={handleOpenMessage}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VARIANTĂ MOBIL (CARDS) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {messages.map((msg) => (
                <MessageMobileCard
                  key={msg.id}
                  msg={msg}
                  onOpen={handleOpenMessage}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <MessageModal
        isOpen={isModalOpen}
        message={selectedMessage}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default AdminMessages;
