"use client";

import { useEffect, useState } from "react";
import { Inbox, Mail, CheckCheck, Trash2, Calendar, Phone, MessageSquare, ArrowRight } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  serviceType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data);
        if (data.length > 0 && !selectedMessage) {
          setSelectedMessage(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      // Mark as read instantly on DB
      try {
        const res = await fetch(`/api/admin/messages/${msg.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
        const data = await res.json();
        if (data.success) {
          setMessages(
            messages.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
          );
          setSelectedMessage({ ...msg, isRead: true });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const remaining = messages.filter((m) => m.id !== id);
        setMessages(remaining);
        setSelectedMessage(remaining.length > 0 ? remaining[0] : null);
      } else {
        alert(data.error || "Failed to delete message.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleMarkUnread = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: false }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(
          messages.map((m) => (m.id === id ? { ...m, isRead: false } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: false });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-brand-charcoal">Messages Inbox</h1>
        <p className="text-brand-dark-gray text-xs tracking-wider uppercase font-medium mt-1">
          Review and respond directly to client booking inquiries and feedback
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24 flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-brand-white p-12 rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] text-center py-32 space-y-4 flex-1 flex flex-col justify-center">
          <Inbox className="mx-auto text-brand-dark-gray/30" size={48} />
          <p className="text-brand-dark-gray text-sm font-light">Your inquiry inbox is empty.</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          {/* Messages List Left Pane */}
          <div className="lg:col-span-5 bg-brand-white rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] flex flex-col min-h-0 overflow-hidden">
            <div className="p-6 border-b border-brand-gray/50 shrink-0">
              <h3 className="font-serif text-xl font-semibold text-brand-charcoal">Inquiries Feed</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-brand-gray/30 p-2 space-y-1">
              {messages.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 rounded-xl cursor-pointer transition-all flex items-start gap-4 ${
                      isSelected
                        ? "bg-brand-cream border border-brand-gold/20"
                        : "border border-transparent hover:bg-brand-gray/20"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className={`text-sm truncate ${msg.isRead ? "font-medium text-brand-charcoal" : "font-bold text-brand-charcoal"}`}>
                          {msg.name}
                        </h4>
                        {!msg.isRead && (
                          <span className="w-2.5 h-2.5 bg-brand-gold rounded-full shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-4 mt-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-gray">
                          {msg.serviceType}
                        </span>
                        <span className="text-[9px] text-brand-dark-gray/60 font-light">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-brand-dark-gray mt-2 line-clamp-1 font-light">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Detail Right Pane */}
          <div className="lg:col-span-7 bg-brand-white rounded-2xl border border-brand-gray/50 shadow-[0_4px_30px_rgba(0,0,0,0.01)] flex flex-col min-h-0 overflow-hidden">
            {selectedMessage ? (
              <div className="flex flex-col h-full">
                {/* Header detail */}
                <div className="p-8 border-b border-brand-gray/50 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-brand-cream/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-gold font-bold px-3 py-1 bg-brand-cream border border-brand-gold/15 rounded-full">
                      {selectedMessage.serviceType} Inquiry
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-charcoal mt-3">{selectedMessage.name}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-brand-dark-gray font-light">
                      <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-1.5 hover:text-brand-gold transition-colors font-medium">
                        <Mail size={14} /> {selectedMessage.email}
                      </a>
                      {selectedMessage.phone && (
                        <span className="flex items-center gap-1.5 font-medium">
                          <Phone size={14} /> {selectedMessage.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => handleMarkUnread(e, selectedMessage.id)}
                      className="p-2 border border-brand-gray hover:bg-brand-gray/40 text-brand-dark-gray rounded-full transition-colors"
                      title="Mark as unread"
                    >
                      <CheckCheck size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-cream border border-brand-gold/15 flex items-center justify-center shrink-0 text-brand-gold">
                      <MessageSquare size={18} />
                    </div>
                    <div className="bg-brand-gray/20 border border-brand-gray/50 rounded-2xl p-6 flex-1 text-sm text-brand-charcoal font-light leading-relaxed whitespace-pre-line shadow-[0_2px_15px_rgba(0,0,0,0.01)]">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-brand-dark-gray/60 font-medium pl-14">
                    <Calendar size={12} />
                    Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Footer Reply Bar */}
                <div className="p-6 border-t border-brand-gray/50 shrink-0 bg-brand-cream/15 text-right">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Churchill Concept Photography - ${selectedMessage.serviceType} Inquiry`}
                    className="inline-flex items-center gap-2 px-6 py-4 bg-brand-gold text-white font-semibold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/15 hover:bg-brand-gold-hover transition-all"
                  >
                    Reply via Email <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center p-12 text-center text-brand-dark-gray/50 space-y-2">
                <Mail size={32} />
                <p className="text-sm font-light">Select a message from the feed to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
