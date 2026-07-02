"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { IconMail, IconX, IconCheck, IconArchive, IconTrash } from "@tabler/icons-react";

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  matter: string;
  message: string | null;
  status: "new" | "read" | "archived";
  created_at: string;
};

const statusStyles: Record<string, string> = {
  new: "text-[#c9a84c] bg-[#c9a84c]/5 border-[#c9a84c]/30",
  read: "text-silver-dim bg-[#1a1a1a] border-[#2a2a2a]",
  archived: "text-[#3a3a3a] bg-[#111111] border-[#1e1e1e]",
};

export default function EnquiriesTable({
  initialEnquiries,
}: {
  initialEnquiries: Enquiry[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "archived">("all");
  const [acting, setActing] = useState(false);

  const filtered =
    filter === "all"
      ? initialEnquiries
      : initialEnquiries.filter((e) => e.status === filter);

  const newCount = initialEnquiries.filter((e) => e.status === "new").length;

  const updateStatus = async (id: string, status: string) => {
    setActing(true);
    await supabase.from("enquiries").update({ status }).eq("id", id);
    router.refresh();
    setSelected(null);
    setActing(false);
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Permanently delete this enquiry?")) return;
    setActing(true);
    await supabase.from("enquiries").delete().eq("id", id);
    router.refresh();
    setSelected(null);
    setActing(false);
  };

  // Mark as read when opening detail view
  const openEnquiry = async (enquiry: Enquiry) => {
    setSelected(enquiry);
    if (enquiry.status === "new") {
      await supabase.from("enquiries").update({ status: "read" }).eq("id", enquiry.id);
      router.refresh();
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-1 text-xs uppercase tracking-widest text-silver-dim">Inbox</div>
          <h1 className="font-serif text-3xl font-normal text-white">
            Enquiries
            {newCount > 0 && (
              <span className="ml-3 inline-block border border-[#c9a84c]/30 bg-[#c9a84c]/5 px-2 py-0.5 font-sans text-xs uppercase tracking-widest text-[#c9a84c]">
                {newCount} new
              </span>
            )}
          </h1>
          <div className="mt-3 h-[1px] w-10 bg-[#c9a84c]" />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {(["all", "new", "read", "archived"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${
                filter === f
                  ? "border-[#c9a84c]/40 bg-[#c9a84c]/5 text-[#c9a84c]"
                  : "border-[#1e1e1e] text-silver-dim hover:text-silver"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border border-[#1e1e1e]">
        <div className="grid grid-cols-5 border-b border-[#1e1e1e] bg-[#0d0d0d] px-6 py-3 text-[10px] uppercase tracking-widest text-silver-dim">
          <span>Name</span>
          <span>Phone</span>
          <span>Matter</span>
          <span>Received</span>
          <span>Status</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <IconMail size={28} className="text-silver-dim/40" />
            <p className="text-sm text-silver-dim">
              {filter === "all" ? "No enquiries yet." : `No ${filter} enquiries.`}
            </p>
          </div>
        ) : (
          filtered.map((enquiry) => (
            <button
              key={enquiry.id}
              onClick={() => openEnquiry(enquiry)}
              className={`w-full grid grid-cols-5 items-center border-b border-[#1a1a1a] px-6 py-4 text-left transition-colors hover:bg-[#111111] ${
                enquiry.status === "new" ? "bg-[#0d0d0d]" : ""
              }`}
            >
              <div className={`text-sm ${enquiry.status === "new" ? "font-medium text-white" : "text-silver"}`}>
                {enquiry.name}
              </div>
              <div className="text-xs text-silver-dim">{enquiry.phone}</div>
              <div className="text-xs text-silver-dim">{enquiry.matter}</div>
              <div className="text-xs text-silver-dim">
                {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div>
                <span
                  className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                    statusStyles[enquiry.status]
                  }`}
                >
                  {enquiry.status}
                </span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Detail slide-over */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[#2e2e2e] bg-[#0d0d0d] shadow-2xl"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between border-b border-[#1e1e1e] px-6 py-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-silver-dim">Enquiry Detail</div>
                  <h2 className="mt-0.5 font-serif text-xl text-white">{selected.name}</h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-silver-dim transition-colors hover:text-silver"
                >
                  <IconX size={18} />
                </button>
              </div>

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-widest text-silver-dim">Phone</div>
                    <a
                      href={`tel:${selected.phone}`}
                      className="text-sm text-silver transition-colors hover:text-white"
                    >
                      {selected.phone}
                    </a>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-widest text-silver-dim">Status</div>
                    <span
                      className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                        statusStyles[selected.status]
                      }`}
                    >
                      {selected.status}
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-widest text-silver-dim">Matter</div>
                    <div className="text-sm text-silver">{selected.matter}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-widest text-silver-dim">Received</div>
                    <div className="text-sm text-silver-dim">
                      {new Date(selected.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {selected.message && (
                  <div>
                    <div className="mb-2 text-[10px] uppercase tracking-widest text-silver-dim">Message</div>
                    <div className="border border-[#1e1e1e] bg-[#111111] px-4 py-4 text-sm leading-relaxed text-silver">
                      {selected.message}
                    </div>
                  </div>
                )}

                {/* WhatsApp quick action */}
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 border border-emerald-900/40 bg-emerald-950/10 py-2.5 text-xs uppercase tracking-widest text-emerald-400 transition-colors hover:bg-emerald-950/20"
                >
                  Reply via WhatsApp →
                </a>
              </div>

              {/* Panel actions */}
              <div className="border-t border-[#1e1e1e] px-6 py-4 flex items-center gap-2">
                {selected.status !== "archived" && (
                  <button
                    onClick={() => updateStatus(selected.id, "archived")}
                    disabled={acting}
                    className="flex items-center gap-1.5 border border-[#1e1e1e] px-3 py-2 text-[10px] uppercase tracking-widest text-silver-dim transition-colors hover:border-[#2e2e2e] hover:text-silver disabled:opacity-40"
                  >
                    <IconArchive size={12} />
                    Archive
                  </button>
                )}
                {selected.status === "archived" && (
                  <button
                    onClick={() => updateStatus(selected.id, "read")}
                    disabled={acting}
                    className="flex items-center gap-1.5 border border-[#1e1e1e] px-3 py-2 text-[10px] uppercase tracking-widest text-silver-dim transition-colors hover:border-[#2e2e2e] hover:text-silver disabled:opacity-40"
                  >
                    <IconCheck size={12} />
                    Unarchive
                  </button>
                )}
                <button
                  onClick={() => deleteEnquiry(selected.id)}
                  disabled={acting}
                  className="flex items-center gap-1.5 border border-transparent px-3 py-2 text-[10px] uppercase tracking-widest text-silver-dim transition-colors hover:border-red-900/30 hover:bg-red-950/20 hover:text-red-400 disabled:opacity-40"
                >
                  <IconTrash size={12} />
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
