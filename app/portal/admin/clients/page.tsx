"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus, IconX, IconUser } from "@tabler/icons-react";

type Client = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
};

export default function ClientsPage() {
  const supabase = createClient();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New client form state
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, email, created_at")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    setClients(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/admin/create-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create client.");
      setCreating(false);
      return;
    }

    setSuccess(`Client "${form.full_name}" created. Share their credentials.`);
    setForm({ full_name: "", email: "", phone: "", password: "" });
    setCreating(false);
    fetchClients();
  };

  const inputClasses =
    "w-full bg-[#0a0a0a] border border-[#1e1e1e] px-4 py-3 text-silver text-sm placeholder:text-[#6b6965] focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <div className="min-h-full px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-1 text-xs uppercase tracking-widest text-silver-dim">
            Management
          </div>
          <h1 className="font-serif text-3xl font-normal text-white">
            Clients
          </h1>
          <div className="mt-3 h-[1px] w-10 bg-[#c9a84c]" />
        </div>
        <button
          onClick={() => { setShowModal(true); setError(null); setSuccess(null); }}
          className="flex items-center gap-2 border border-[#1e1e1e] bg-[#111111] px-4 py-2.5 text-xs uppercase tracking-widest text-silver transition-colors hover:border-[#c9a84c] hover:text-white"
        >
          <IconPlus size={14} />
          Add Client
        </button>
      </div>

      {/* Clients table */}
      <div className="border border-[#1e1e1e]">
        <div className="grid grid-cols-3 border-b border-[#1e1e1e] bg-[#0d0d0d] px-6 py-3 text-[10px] uppercase tracking-widest text-silver-dim">
          <span>Name</span>
          <span>Contact</span>
          <span>Joined</span>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-silver-dim">
            Loading…
          </div>
        ) : clients.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-silver-dim">
            No clients yet. Add your first client.
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-3 items-center border-b border-[#1a1a1a] px-6 py-4 transition-colors hover:bg-[#111111]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#1a1a1a]">
                  <IconUser size={14} className="text-silver-dim" />
                </div>
                <div className="text-sm text-silver">{client.full_name}</div>
              </div>
              <div>
                <div className="text-xs text-silver-dim">
                  {client.email ?? "—"}
                </div>
                <div className="text-xs text-silver-dim">
                  {client.phone ?? "—"}
                </div>
              </div>
              <div className="text-xs text-silver-dim">
                {new Date(client.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal — Add Client */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 top-1/2 z-50 mx-auto w-full max-w-md -translate-y-1/2 border border-[#2e2e2e] bg-[#111111] p-8 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-xl font-normal text-white">
                  Add New Client
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-silver-dim transition-colors hover:text-silver"
                >
                  <IconX size={18} />
                </button>
              </div>

              {success ? (
                <div className="border border-emerald-900/40 bg-emerald-950/20 px-4 py-4 text-sm text-emerald-400">
                  {success}
                  <button
                    onClick={() => { setSuccess(null); setShowModal(false); }}
                    className="mt-3 block text-xs text-silver-dim underline"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.full_name}
                      onChange={(e) =>
                        setForm({ ...form, full_name: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXXXXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                      Initial Password
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Share this with the client"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className={inputClasses}
                    />
                  </div>

                  {error && (
                    <div className="border border-red-900/40 bg-red-950/20 px-4 py-3 text-xs text-red-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full border border-[#1e1e1e] bg-[#0a0a0a] py-3 text-xs uppercase tracking-widest text-silver transition-all hover:border-[#c9a84c] hover:text-white disabled:opacity-40"
                  >
                    {creating ? "Creating…" : "Create Client"}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
