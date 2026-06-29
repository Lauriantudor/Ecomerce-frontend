import React, { useEffect, useState } from "react";
import contactMessageService from "../services/contactMessageService";
import MessageTableRow from "../components/MessageTableRow";
import MessageMobileCard from "../components/MessageMobileCard";
import MessageModal from "../components/MessageModal";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (loading) {
    return (
      // MODIFICAT: Suport light mode pentru starea de loading (bg-stone-50 text-stone-900)
      <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-900 dark:text-white flex items-center justify-center font-medium transition-colors duration-300">
        Se încarcă mesajele primite...
      </div>
    );
  }

  return (
    // MODIFICAT: Fundal general bg-stone-50 și text-stone-800 pe light mode
    <main className="min-h-screen bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Panou */}
        <div className="mb-8">
          {/* MODIFICAT: text-stone-900 pe light mode */}
          <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
            Mesaje Contact ✉️
          </h1>
          {/* MODIFICAT: text-stone-500 pe light mode */}
          <p className="text-sm text-stone-500 dark:text-zinc-400 mt-1">
            Citește și gestionează solicitările. Mesajele necitite sunt
            evidențiate automat.
          </p>
        </div>

        {error ? (
          // MODIFICAT: Culori eroare adaptate pentru light mode (bg-rose-50 border-rose-200)
          <div className="bg-rose-50 dark:bg-zinc-900 border border-rose-200 dark:border-rose-950/45 p-6 rounded-2xl text-rose-600 dark:text-rose-400 font-medium shadow-sm">
            ⚠️ {error}
          </div>
        ) : messages.length === 0 ? (
          // MODIFICAT: State gol adaptat pentru light mode (bg-white border-stone-200 text-stone-500)
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 rounded-3xl text-center text-stone-500 dark:text-zinc-400 shadow-sm">
            Nu s-a primit niciun mesaj prin formularul de contact până acum.
          </div>
        ) : (
          <div className="space-y-4">
            {/* 1. LAYOUT DESKTOP: Tabel */}
            {/* MODIFICAT: Card tabel bg-white și border-stone-200 pe light mode */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    {/* MODIFICAT: border-stone-200, text-stone-500 și bg-stone-50/50 pe light mode */}
                    <tr className="border-b border-stone-200 dark:border-zinc-800 text-xs font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-wider bg-stone-50/50 dark:bg-zinc-900/50">
                      <th className="p-5 w-12 text-center">Status</th>
                      <th className="p-5">Expeditor</th>
                      <th className="p-5">Email</th>
                      <th className="p-5">Subiect / Fragment</th>
                      <th className="p-5">Data</th>
                      <th className="p-5 text-right">Acțiuni</th>
                    </tr>
                  </thead>
                  {/* MODIFICAT: divide-stone-100 pe light mode */}
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

            {/* 2. LAYOUT MOBIL: Carduri Stacked */}
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

      {/* MODAL COMPLET CITIRE */}
      <MessageModal
        isOpen={isModalOpen}
        message={selectedMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default AdminMessages;
