"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconPlus,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";

type Case = {
  id: string;
  title: string;
  status: string;
  practice_area: string;
  created_at: string;
  client_id: string;
  next_hearing_date: string | null;
  profiles: { full_name: string } | null;
};

type ClientProfile = { id: string; full_name: string };

const statusColors: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
  pending: "text-yellow-400 bg-yellow-950/30 border-yellow-900/40",
  closed: "text-silver-dim bg-[#1a1a1a] border-[#2a2a2a]",
};

const PRACTICE_AREAS = [
  "Civil & Property Law",
  "Corporate & Commercial",
  "Matrimonial & Family Law",
  "Criminal Law",
  "Debt Recovery & Arbitration",
  "Consumer & Service Matters",
];

type SortKey = "hearing" | "status" | "newest" | "oldest" | "client";
type FilterStatus = "all" | "active" | "pending" | "closed";

function getHearingLabel(dateStr: string | null): { label: string; urgent: boolean } {
  if (!dateStr) return { label: "No hearing set", urgent: false };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hearing = new Date(dateStr);
  hearing.setHours(0, 0, 0, 0);
  const diff = Math.round((hearing.getTime() - today.getTime()) / 86400000);

  if (diff < 0) return { label: `${Math.abs(diff)}d ago`, urgent: false };
  if (diff === 0) return { label: "Today", urgent: true };
  if (diff === 1) return { label: "Tomorrow", urgent: true };
  if (diff <= 7) return { label: `In ${diff} days`, urgent: true };
  return {
    label: hearing.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    urgent: false,
  };
}

const inputClasses =
  "w-full bg-[#0a0a0a] border border-[#1e1e1e] px-4 py-3 text-silver text-sm placeholder:text-[#6b6965] focus:outline-none focus:border-[#c9a84c] transition-colors";

const sortButtons: { key: SortKey; label: string }[] = [
  { key: "hearing", label: "Hearing Date" },
  { key: "status", label: "Status" },
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "client", label: "Client A–Z" },
];

export default function CasesTable({
  initialCases,
  clients,
}: {
  initialCases: Case[];
  clients: ClientProfile[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [sortKey, setSortKey] = useState<SortKey>("hearing");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    client_id: "",
    practice_area: "",
    status: "pending",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);

    const { error } = await supabase.from("cases").insert({
      title: form.title,
      client_id: form.client_id,
      practice_area: form.practice_area,
      status: form.status,
      description: form.description,
    });

    if (error) {
      setError(error.message);
      setCreating(false);
      return;
    }

    setShowModal(false);
    setForm({ title: "", client_id: "", practice_area: "", status: "pending", description: "" });
    setCreating(false);
    router.refresh(); // Re-runs Server Component with fresh data
  };

  // ── Sorting & filtering ──────────────────────────────────────
  const filtered = initialCases.filter(
    (c) => filterStatus === "all" || c.status === filterStatus
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case "hearing": {
        const aDate = a.next_hearing_date ? new Date(a.next_hearing_date).getTime() : Infinity;
        const bDate = b.next_hearing_date ? new Date(b.next_hearing_date).getTime() : Infinity;
        const now = Date.now();
        const aFuture = aDate >= now ? aDate : Infinity;
        const bFuture = bDate >= now ? bDate : Infinity;
        return aFuture - bFuture;
      }
      case "status": {
        const order = { active: 0, pending: 1, closed: 2 };
        return (
          (order[a.status as keyof typeof order] ?? 3) -
          (order[b.status as keyof typeof order] ?? 3)
        );
      }
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "client": {
        const aName = (a.profiles as any)?.full_name ?? "";
        const bName = (b.profiles as any)?.full_name ?? "";
        return aName.localeCompare(bName);
      }
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-1 text-xs uppercase tracking-widest text-silver-dim">Management</div>
          <h1 className="font-serif text-3xl font-normal text-white">Cases</h1>
          <div className="mt-3 h-[1px] w-10 bg-[#c9a84c]" />
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setError(null);
          }}
          className="flex items-center gap-2 border border-[#1e1e1e] bg-[#111111] px-4 py-2.5 text-xs uppercase tracking-widest text-silver transition-colors hover:border-[#c9a84c] hover:text-white"
        >
          <IconPlus size={14} />
          New Case
        </button>
      </div>

      {/* Sort + Filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest text-silver-dim mr-1">Sort:</span>
          {sortButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setSortKey(btn.key)}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
                sortKey === btn.key
                  ? "border-[#c9a84c]/40 bg-[#c9a84c]/5 text-[#c9a84c]"
                  : "border-[#1e1e1e] text-silver-dim hover:text-silver"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#2a2a2a]" />

        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase tracking-widest text-silver-dim mr-1">Filter:</span>
          {(["all", "active", "pending", "closed"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1 text-[10px] uppercase tracking-widest border transition-colors ${
                filterStatus === s
                  ? "border-[#c9a84c]/40 bg-[#c9a84c]/5 text-[#c9a84c]"
                  : "border-[#1e1e1e] text-silver-dim hover:text-silver"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cases table */}
      <div className="border border-[#1e1e1e]">
        <div className="grid grid-cols-5 border-b border-[#1e1e1e] bg-[#0d0d0d] px-6 py-3 text-[10px] uppercase tracking-widest text-silver-dim">
          <span>Case Title</span>
          <span>Client</span>
          <span>Practice Area</span>
          <span>Next Hearing</span>
          <span>Status</span>
        </div>

        {sorted.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-silver-dim">
            No cases match current filters.
          </div>
        ) : (
          sorted.map((c) => {
            const hearing = getHearingLabel(c.next_hearing_date);
            return (
              <Link
                key={c.id}
                href={`/portal/admin/cases/${c.id}`}
                className="grid grid-cols-5 items-center border-b border-[#1a1a1a] px-6 py-4 transition-colors hover:bg-[#111111]"
              >
                <div className="text-sm text-silver">{c.title}</div>
                <div className="text-xs text-silver-dim">
                  {(c.profiles as any)?.full_name ?? "—"}
                </div>
                <div className="text-xs text-silver-dim">{c.practice_area}</div>
                <div className="flex items-center gap-1.5">
                  {hearing.urgent && (
                    <IconAlertTriangle size={11} className="text-yellow-400 shrink-0" />
                  )}
                  <span className={`text-xs ${hearing.urgent ? "text-yellow-400" : "text-silver-dim"}`}>
                    {hearing.label}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                      statusColors[c.status] ?? statusColors.pending
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Modal — Create Case */}
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
                <h2 className="font-serif text-xl font-normal text-white">New Case</h2>
                <button onClick={() => setShowModal(false)} className="text-silver-dim hover:text-silver">
                  <IconX size={18} />
                </button>
              </div>
              <form onSubmit={handleCreateCase} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                    Case Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Property Dispute – Plot 421"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                    Client
                  </label>
                  <select
                    required
                    value={form.client_id}
                    onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select client
                    </option>
                    {clients.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                    Practice Area
                  </label>
                  <select
                    required
                    value={form.practice_area}
                    onChange={(e) => setForm({ ...form, practice_area: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="" disabled>
                      Select area
                    </option>
                    {PRACTICE_AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">
                    Description (optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description…"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={`${inputClasses} resize-none`}
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
                  {creating ? "Creating…" : "Create Case"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
