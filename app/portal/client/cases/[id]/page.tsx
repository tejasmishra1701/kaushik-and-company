"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  IconArrowLeft,
  IconBriefcase,
  IconClock,
  IconSend,
  IconDownload,
  IconFileText,
  IconCalendar,
  IconGavel,
  IconAlertTriangle,
  IconCircleCheck,
  IconNotes,
} from "@tabler/icons-react";

// ── Types ────────────────────────────────────────────────────────
type Case = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  practice_area: string;
  created_at: string;
  client_id: string;
  next_hearing_date: string | null;
};

type Document = {
  id: string;
  file_name: string;
  file_path: string;
  created_at: string;
};

type Message = {
  id: string;
  sender_id: string;
  message_text: string;
  created_at: string;
  sender_role: string;
};

type CaseUpdate = {
  id: string;
  case_id: string;
  title: string;
  content: string;
  update_type: string;
  hearing_date: string | null;
  court_name: string | null;
  posted_by: string;
  created_at: string;
};

// ── Helpers ──────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
  pending: "text-yellow-400 bg-yellow-950/30 border-yellow-900/40",
  closed: "text-silver-dim bg-[#1a1a1a] border-[#2a2a2a]",
};

const UPDATE_TYPES = [
  { value: "general", label: "General Update", icon: IconNotes, color: "text-silver" },
  { value: "hearing", label: "Hearing Scheduled", icon: IconCalendar, color: "text-blue-400" },
  { value: "order", label: "Court Order / Judgment", icon: IconGavel, color: "text-purple-400" },
  { value: "resolved", label: "Matter Resolved", icon: IconCircleCheck, color: "text-emerald-400" },
  { value: "urgent", label: "Urgent Notice", icon: IconAlertTriangle, color: "text-red-400" },
];

function UpdateIcon({ type }: { type: string }) {
  const found = UPDATE_TYPES.find((t) => t.value === type) ?? UPDATE_TYPES[0];
  const Icon = found.icon;
  return <Icon size={14} className={found.color} />;
}

// ── Main Component ───────────────────────────────────────────────
export default function ClientCaseDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = createClient();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [caseUpdates, setCaseUpdates] = useState<CaseUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    } else {
      router.push("/portal/login");
      return;
    }

    const [docsRes, msgsRes, updatesRes] = await Promise.all([
      supabase
        .from("documents")
        .select("id, file_name, file_path, created_at")
        .eq("case_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("messages")
        .select("id, sender_id, message_text, created_at, sender_role")
        .eq("case_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("case_updates")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: false }),
    ]);

    // Try with next_hearing_date; fall back without it if column doesn't exist yet
    let caseData: any = null;
    const caseRes = await supabase
      .from("cases")
      .select("id, title, description, status, practice_area, created_at, client_id, next_hearing_date")
      .eq("id", id)
      .single();

    if (caseRes.error) {
      const fallbackRes = await supabase
        .from("cases")
        .select("id, title, description, status, practice_area, created_at, client_id")
        .eq("id", id)
        .single();

      if (fallbackRes.error || fallbackRes.data?.client_id !== user.id) {
        router.push("/portal/client");
        return;
      }
      caseData = { ...fallbackRes.data, next_hearing_date: null };
    } else {
      if (caseRes.data?.client_id !== user.id) {
        router.push("/portal/client");
        return;
      }
      caseData = caseRes.data;
    }

    setCaseDetails(caseData);
    setDocuments(docsRes.data ?? []);
    setMessages(msgsRes.data ?? []);
    setCaseUpdates(updatesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Realtime: messages from admin
    const msgChannel = supabase
      .channel(`client-case-msgs-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `case_id=eq.${id}` },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        })
      .subscribe();

    // Realtime: new case updates from admin
    const updateChannel = supabase
      .channel(`client-case-updates-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "case_updates", filter: `case_id=eq.${id}` },
        (payload) => {
          const incoming = payload.new as CaseUpdate;
          setCaseUpdates((prev) => {
            if (prev.some((u) => u.id === incoming.id)) return prev;
            return [incoming, ...prev];
          });
        })
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(updateChannel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !currentUserId) return;

    setSendingMessage(true);
    setNewMessage("");

    const optimisticMsg: Message = {
      id: `optimistic-${Date.now()}`,
      sender_id: currentUserId,
      message_text: text,
      created_at: new Date().toISOString(),
      sender_role: "client",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({ case_id: id, sender_id: currentUserId, message_text: text, sender_role: "client" })
      .select("id")
      .single();

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setNewMessage(text);
      alert("Error: " + error.message);
    } else if (inserted) {
      setMessages((prev) =>
        prev.map((m) => m.id === optimisticMsg.id ? { ...m, id: inserted.id } : m)
      );
    }
    setSendingMessage(false);
  };

  // ── Download doc ─────────────────────────────────────────────
  const downloadDocument = async (doc: Document) => {
    const { data, error } = await supabase.storage.from("case-documents").download(doc.file_path);
    if (error) { alert("Download error: " + error.message); return; }
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url; a.download = doc.file_name;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url); a.remove();
  };

  // ── Render ────────────────────────────────────────────────────
  if (loading || !caseDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-silver-dim text-sm">
        Loading case details…
      </div>
    );
  }

  const inputClasses =
    "flex-1 bg-[#0a0a0a] border border-[#1e1e1e] px-4 py-3 text-silver text-sm placeholder:text-[#6b6965] focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <div className="min-h-full px-8 py-10 flex flex-col gap-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/portal/client")} className="flex items-center gap-2 text-xs uppercase tracking-widest text-silver-dim transition-colors hover:text-silver">
          <IconArrowLeft size={14} /> Back to Cases
        </button>
        <span className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${statusColors[caseDetails.status] ?? statusColors.pending}`}>
          {caseDetails.status}
        </span>
      </div>

      {/* Case Header */}
      <div className="border border-[#1e1e1e] bg-[#111111]/40 p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <IconBriefcase className="text-[#c9a84c]" size={20} />
            <h1 className="font-serif text-2xl font-normal text-white">{caseDetails.title}</h1>
          </div>
          <p className="text-sm text-silver-dim max-w-2xl leading-relaxed">{caseDetails.description || "No description provided."}</p>
          <div className="flex flex-wrap gap-4 text-xs text-silver-dim pt-2">
            <span>Practice Area: <strong className="text-silver">{caseDetails.practice_area}</strong></span>
            <span>&middot;</span>
            <span className="flex items-center gap-1"><IconClock size={12} />Opened {new Date(caseDetails.created_at).toLocaleDateString("en-IN")}</span>
            {caseDetails.next_hearing_date && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-1.5 font-medium text-yellow-400">
                  <IconCalendar size={12} />
                  Next Hearing: {new Date(caseDetails.next_hearing_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Documents + Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Documents — download only */}
        <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 flex flex-col gap-6 h-[480px]">
          <div className="text-xs uppercase tracking-widest text-silver-dim font-bold border-b border-[#1e1e1e] pb-4">Shared Documents</div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {documents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <IconFileText size={32} className="text-silver-dim mb-3" />
                <p className="text-xs text-silver-dim">No shared documents available.</p>
              </div>
            ) : documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border border-[#1e1e1e] bg-[#111111]/40 px-4 py-3 hover:border-[#2e2e2e] transition-colors">
                <div className="flex items-center gap-3 truncate">
                  <IconFileText size={16} className="text-silver-dim shrink-0" />
                  <div className="truncate">
                    <div className="text-xs text-silver truncate">{doc.file_name}</div>
                    <div className="text-[10px] text-silver-dim mt-0.5">Uploaded {new Date(doc.created_at).toLocaleDateString("en-IN")}</div>
                  </div>
                </div>
                <button onClick={() => downloadDocument(doc)} className="p-1.5 text-silver-dim hover:text-white transition-colors" title="Download">
                  <IconDownload size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 flex flex-col gap-4 h-[480px]">
          <div className="text-xs uppercase tracking-widest text-silver-dim font-bold border-b border-[#1e1e1e] pb-4">Message Thread with Advocate</div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-silver-dim">No messages yet. Send a message to your advocate.</div>
            ) : messages.map((msg) => {
              const isClient = msg.sender_role === "client";
              return (
                <div key={msg.id} className="flex flex-col" style={{ alignItems: isClient ? "flex-end" : "flex-start" }}>
                  <div className={`max-w-[85%] border px-4 py-2.5 text-sm ${isClient ? "border-[#c9a84c]/20 bg-[#c9a84c]/5 text-silver" : "border-[#1e1e1e] bg-[#111111] text-silver"}`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                  </div>
                  <span className="text-[9px] text-silver-dim mt-1 px-1">
                    {isClient ? "You" : "Kaushik & Company"} &middot;{" "}
                    {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#1e1e1e]">
            <input type="text" placeholder="Type a message to your advocate..." required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={inputClasses} />
            <button type="submit" disabled={sendingMessage || !newMessage.trim()} className="border border-[#1e1e1e] bg-[#111111] px-4 py-3 text-silver transition-colors hover:border-[#c9a84c] hover:text-white disabled:opacity-40 disabled:hover:border-[#1e1e1e] shrink-0">
              <IconSend size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Case Timeline (read-only) ─────────────────────────────── */}
      <div>
        <div className="mb-5">
          <div className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">Case Timeline</div>
          <p className="pl-3 mt-0.5 text-[10px] text-silver-dim/60">Updates from your legal team — newest first</p>
        </div>

        <div className="space-y-0">
          {caseUpdates.length === 0 ? (
            <div className="border border-[#1e1e1e] px-6 py-10 text-center text-sm text-silver-dim">
              No updates posted yet. Your legal team will post updates here as your case progresses.
            </div>
          ) : caseUpdates.map((update, idx) => {
            const typeInfo = UPDATE_TYPES.find((t) => t.value === update.update_type) ?? UPDATE_TYPES[0];
            return (
              <div key={update.id} className="flex gap-4">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className="mt-5 flex h-7 w-7 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111111] shrink-0">
                    <UpdateIcon type={update.update_type} />
                  </div>
                  {idx < caseUpdates.length - 1 && <div className="flex-1 w-px bg-[#1e1e1e] my-1" />}
                </div>

                {/* Card */}
                <div className="flex-1 border border-[#1e1e1e] bg-[#0d0d0d] p-5 mb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase tracking-widest ${typeInfo.color}`}>{typeInfo.label}</span>
                      </div>
                      <h3 className="text-sm font-medium text-silver">{update.title}</h3>
                      {update.hearing_date && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-yellow-400">
                          <IconCalendar size={11} />
                          {new Date(update.hearing_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                          {update.court_name && <span className="text-silver-dim">&middot; {update.court_name}</span>}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-silver-dim">
                        {new Date(update.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </div>
                  {update.content && (
                    <p className="mt-3 text-xs text-silver-dim leading-relaxed border-t border-[#1e1e1e] pt-3">
                      {update.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
