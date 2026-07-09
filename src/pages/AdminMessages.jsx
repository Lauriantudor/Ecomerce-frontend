import React, { useEffect, useState, useRef } from "react";
import contactMessageService from "../services/contactMessageService";
import MessageTableRow from "../components/message_contact/MessageTableRow";
import MessageMobileCard from "../components/message_contact/MessageMobileCard";
import MessageModal from "../components/message_contact/MessageModal";
import Pagination from "../components/Pagination";

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const filteredMessages = messages.filter((msg) => {
    if (filter === "read") return msg.isRead === true;
    if (filter === "unread") return msg.isRead === false;
    return true;
  });

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentMessages = filteredMessages.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filter, totalPages, currentPage]);

  const handleOpenMessage = async (msg) => {
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
    setTimeout(() => {
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
    }, 0);
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

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
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight uppercase">
              Mesaje Contact <span aria-hidden="true">✉️</span>
            </h1>
            <p className="text-sm text-stone-600 dark:text-zinc-400 mt-1">
              Citește și gestionează solicitările. Mesajele necitite sunt
              evidențiate automat.
            </p>
          </div>

          {messages.length > 0 && (
            <div className="inline-flex p-1 bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => {
                  setFilter("all");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-white dark:bg-zinc-800 text-stone-900 dark:text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300"
                }`}
              >
                Toate ({messages.length})
              </button>
              <button
                onClick={() => {
                  setFilter("unread");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  filter === "unread"
                    ? "bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300"
                }`}
              >
                Necitite
                {unreadCount > 0 && (
                  <span className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-black">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setFilter("read");
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  filter === "read"
                    ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-stone-500 hover:text-stone-800 dark:hover:text-zinc-300"
                }`}
              >
                Citite ({messages.length - unreadCount})
              </button>
            </div>
          )}
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
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-12 rounded-3xl text-center text-stone-500 dark:text-zinc-400 shadow-sm">
            Nu există mesaje care să corespundă filtrului selectat ("
            {filter === "read" ? "citite" : "necitite"}").
          </div>
        ) : (
          <div className="space-y-4">
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
                    {currentMessages.map((msg) => (
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

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {currentMessages.map((msg) => (
                <MessageMobileCard
                  key={msg.id}
                  msg={msg}
                  onOpen={handleOpenMessage}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
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
