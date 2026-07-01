"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowLeft,
  IconBriefcase,
  IconClock,
  IconSend,
  IconDownload,
  IconUpload,
  IconFileText,
  IconTrash,
  IconPlus,
  IconX,
  IconCalendar,
  IconGavel,
  IconAlertTriangle,
  IconCircleCheck,
  IconNotes,
} from "@tabler/icons-react";

// ── Types ───────────────────────────────────────────────────────
type Case = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  practice_area: string;
  created_at: string;
  client_id: string;
  next_hearing_date: string | null;
  profiles: { full_name: string; email: string } | null;
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
export default function AdminCaseDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = createClient();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [caseDetails, setCaseDetails] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [caseUpdates, setCaseUpdates] = useState<CaseUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Message form
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("Admin");

  // File upload
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Case update form
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    title: "",
    content: "",
    update_type: "general",
    hearing_date: "",
    court_name: "",
  });
  const [postingUpdate, setPostingUpdate] = useState(false);

  // ── Data fetching ─────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      if (profile?.full_name) setCurrentUserName(profile.full_name);
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

    // Try fetching case with next_hearing_date; fall back without it if the
    // column hasn't been migrated yet — only redirect on a genuine not-found.
    let caseData: any = null;
    const caseRes = await supabase
      .from("cases")
      .select("id, title, description, status, practice_area, created_at, client_id, next_hearing_date, profiles(full_name, email)")
      .eq("id", id)
      .single();

    if (caseRes.error) {
      // Retry without next_hearing_date in case migration hasn't run
      const fallbackRes = await supabase
        .from("cases")
        .select("id, title, description, status, practice_area, created_at, client_id, profiles(full_name, email)")
        .eq("id", id)
        .single();

      if (fallbackRes.error) {
        // Genuine not-found or permission error — redirect
        router.push("/portal/admin/cases");
        return;
      }
      caseData = { ...fallbackRes.data, next_hearing_date: null };
    } else {
      caseData = caseRes.data;
    }

    setCaseDetails(caseData as any);
    setDocuments(docsRes.data ?? []);
    setMessages(msgsRes.data ?? []);
    setCaseUpdates(updatesRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    // Realtime: messages from client
    const msgChannel = supabase
      .channel(`admin-case-msgs-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `case_id=eq.${id}` },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        })
      .subscribe();

    // Realtime: new case updates
    const updateChannel = supabase
      .channel(`admin-case-updates-${id}`)
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

  // ── Handlers ──────────────────────────────────────────────────
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
      sender_role: "admin",
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    const { data: inserted, error } = await supabase
      .from("messages")
      .insert({ case_id: id, sender_id: currentUserId, message_text: text, sender_role: "admin" })
      .select("id")
      .single();

    if (error) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setNewMessage(text);
      alert("Error sending message: " + error.message);
    } else if (inserted) {
      setMessages((prev) =>
        prev.map((m) => m.id === optimisticMsg.id ? { ...m, id: inserted.id } : m)
      );
    }
    setSendingMessage(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("case-documents").upload(filePath, file);
    if (uploadError) { alert("Upload error: " + uploadError.message); setUploadingDoc(false); return; }

    const { error: dbError } = await supabase.from("documents").insert({ case_id: id, file_name: file.name, file_path: filePath });
    if (dbError) {
      alert("DB error: " + dbError.message);
    } else {
      const { data } = await supabase.from("documents").select("id, file_name, file_path, created_at").eq("case_id", id).order("created_at", { ascending: false });
      setDocuments(data ?? []);
    }
    setUploadingDoc(false);
  };

  const downloadDocument = async (doc: Document) => {
    const { data, error } = await supabase.storage.from("case-documents").download(doc.file_path);
    if (error) { alert("Download error: " + error.message); return; }
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url; a.download = doc.file_name;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url); a.remove();
  };

  const deleteDocument = async (docId: string, filePath: string) => {
    if (!confirm("Delete this document?")) return;
    await supabase.storage.from("case-documents").remove([filePath]);
    await supabase.from("documents").delete().eq("id", docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const updateCaseStatus = async (newStatus: string) => {
    const { error } = await supabase.from("cases").update({ status: newStatus }).eq("id", id);
    if (!error && caseDetails) setCaseDetails({ ...caseDetails, status: newStatus });
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm.title.trim() || !updateForm.content.trim()) return;
    setPostingUpdate(true);

    const payload: any = {
      case_id: id,
      title: updateForm.title.trim(),
      content: updateForm.content.trim(),
      update_type: updateForm.update_type,
      posted_by: currentUserName,
      hearing_date: updateForm.hearing_date || null,
      court_name: updateForm.court_name || null,
    };

    // Optimistic insert
    const optimisticUpdate: CaseUpdate = { id: `opt-${Date.now()}`, created_at: new Date().toISOString(), ...payload };
    setCaseUpdates((prev) => [optimisticUpdate, ...prev]);

    const { data: inserted, error } = await supabase
      .from("case_updates")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      setCaseUpdates((prev) => prev.filter((u) => u.id !== optimisticUpdate.id));
      alert("Error posting update: " + error.message);
    } else {
      // If it's a hearing update, also update next_hearing_date on the case
      if (updateForm.update_type === "hearing" && updateForm.hearing_date) {
        await supabase.from("cases").update({ next_hearing_date: updateForm.hearing_date }).eq("id", id);
        if (caseDetails) setCaseDetails({ ...caseDetails, next_hearing_date: updateForm.hearing_date });
      }
      setCaseUpdates((prev) =>
        prev.map((u) => u.id === optimisticUpdate.id ? inserted : u)
      );
    }

    setUpdateForm({ title: "", content: "", update_type: "general", hearing_date: "", court_name: "" });
    setShowUpdateModal(false);
    setPostingUpdate(false);
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
  const formInputClasses =
    "w-full bg-[#0a0a0a] border border-[#1e1e1e] px-4 py-3 text-silver text-sm placeholder:text-[#6b6965] focus:outline-none focus:border-[#c9a84c] transition-colors";

  return (
    <div className="min-h-full px-8 py-10 flex flex-col gap-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/portal/admin/cases")} className="flex items-center gap-2 text-xs uppercase tracking-widest text-silver-dim transition-colors hover:text-silver">
          <IconArrowLeft size={14} /> Back to Cases
        </button>
        <div className="flex items-center gap-2">
          <label className="text-xs uppercase tracking-widest text-silver-dim">Status:</label>
          <select value={caseDetails.status} onChange={(e) => updateCaseStatus(e.target.value)} className="border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-xs text-silver focus:outline-none focus:border-[#c9a84c]">
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Case Header */}
      <div className="border border-[#1e1e1e] bg-[#111111]/40 p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <IconBriefcase className="text-[#c9a84c]" size={20} />
            <h1 className="font-serif text-2xl font-normal text-white">{caseDetails.title}</h1>
          </div>
          <p className="text-sm text-silver-dim max-w-xl leading-relaxed">{caseDetails.description || "No description provided."}</p>
          <div className="flex flex-wrap gap-4 text-xs text-silver-dim pt-2">
            <span>Practice Area: <strong className="text-silver">{caseDetails.practice_area}</strong></span>
            <span>&middot;</span>
            <span className="flex items-center gap-1"><IconClock size={12} />Opened {new Date(caseDetails.created_at).toLocaleDateString("en-IN")}</span>
            {caseDetails.next_hearing_date && (
              <>
                <span>&middot;</span>
                <span className="flex items-center gap-1 text-yellow-400"><IconCalendar size={12} />Next Hearing: {new Date(caseDetails.next_hearing_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </>
            )}
          </div>
        </div>
        <div className="border-t md:border-t-0 md:border-l border-[#1e1e1e] pt-6 md:pt-0 md:pl-8 flex flex-col justify-center min-w-[200px]">
          <div className="text-[10px] uppercase tracking-widest text-silver-dim">Client Details</div>
          <div className="mt-2 text-sm font-medium text-silver">{caseDetails.profiles?.full_name ?? "—"}</div>
          <div className="text-xs text-silver-dim mt-0.5">{caseDetails.profiles?.email ?? "—"}</div>
        </div>
      </div>

      {/* Documents + Messages split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Documents */}
        <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 flex flex-col gap-6 h-[480px]">
          <div className="flex items-center justify-between border-b border-[#1e1e1e] pb-4">
            <div className="text-xs uppercase tracking-widest text-silver-dim font-bold">Case Documents</div>
            <label className="flex items-center gap-2 cursor-pointer border border-[#1e1e1e] bg-[#111111] px-3 py-1.5 text-xs text-silver transition-colors hover:border-[#c9a84c] hover:text-white">
              {uploadingDoc ? "Uploading..." : <><IconUpload size={14} />Upload</>}
              <input type="file" className="hidden" disabled={uploadingDoc} onChange={handleFileUpload} />
            </label>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {documents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <IconFileText size={32} className="text-silver-dim mb-3" />
                <p className="text-xs text-silver-dim">No documents uploaded yet.</p>
              </div>
            ) : documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between border border-[#1e1e1e] bg-[#111111]/40 px-4 py-3 hover:border-[#2e2e2e] transition-colors">
                <div className="flex items-center gap-3 truncate">
                  <IconFileText size={16} className="text-silver-dim shrink-0" />
                  <div className="truncate">
                    <div className="text-xs text-silver truncate">{doc.file_name}</div>
                    <div className="text-[10px] text-silver-dim mt-0.5">{new Date(doc.created_at).toLocaleDateString("en-IN")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => downloadDocument(doc)} className="p-1.5 text-silver-dim hover:text-white transition-colors" title="Download"><IconDownload size={14} /></button>
                  <button onClick={() => deleteDocument(doc.id, doc.file_path)} className="p-1.5 text-silver-dim hover:text-red-400 transition-colors" title="Delete"><IconTrash size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="border border-[#1e1e1e] bg-[#0d0d0d] p-6 flex flex-col gap-4 h-[480px]">
          <div className="text-xs uppercase tracking-widest text-silver-dim font-bold border-b border-[#1e1e1e] pb-4">Case Message Thread</div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-xs text-silver-dim">No messages yet. Start the conversation.</div>
            ) : messages.map((msg) => {
              const isAdmin = msg.sender_role === "admin";
              return (
                <div key={msg.id} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] border px-4 py-2.5 text-sm ${isAdmin ? "border-[#c9a84c]/20 bg-[#c9a84c]/5 text-silver" : "border-[#1e1e1e] bg-[#111111] text-silver"}`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                  </div>
                  <span className="text-[9px] text-silver-dim mt-1 px-1">
                    {isAdmin ? "You" : caseDetails.profiles?.full_name} &middot;{" "}
                    {new Date(msg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-[#1e1e1e]">
            <input type="text" placeholder="Type your message..." required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={inputClasses} />
            <button type="submit" disabled={sendingMessage || !newMessage.trim()} className="border border-[#1e1e1e] bg-[#111111] px-4 py-3 text-silver transition-colors hover:border-[#c9a84c] hover:text-white disabled:opacity-40 disabled:hover:border-[#1e1e1e] shrink-0">
              <IconSend size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Case Updates / Timeline ─────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">Case Timeline</div>
            <p className="pl-3 mt-0.5 text-[10px] text-silver-dim/60">Updates, hearings, and orders — visible to the client</p>
          </div>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="flex items-center gap-2 border border-[#1e1e1e] bg-[#111111] px-4 py-2.5 text-xs uppercase tracking-widest text-silver transition-colors hover:border-[#c9a84c] hover:text-white"
          >
            <IconPlus size={14} /> Post Update
          </button>
        </div>

        <div className="space-y-0">
          {caseUpdates.length === 0 ? (
            <div className="border border-[#1e1e1e] px-6 py-10 text-center text-sm text-silver-dim">
              No updates posted yet. Post the first update to keep your client informed.
            </div>
          ) : (
            caseUpdates.map((update, idx) => {
              const typeInfo = UPDATE_TYPES.find((t) => t.value === update.update_type) ?? UPDATE_TYPES[0];
              return (
                <div key={update.id} className="flex gap-4">
                  {/* Timeline spine */}
                  <div className="flex flex-col items-center">
                    <div className={`mt-5 flex h-7 w-7 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#111111] shrink-0`}>
                      <UpdateIcon type={update.update_type} />
                    </div>
                    {idx < caseUpdates.length - 1 && <div className="flex-1 w-px bg-[#1e1e1e] my-1" />}
                  </div>

                  {/* Content card */}
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
                        <div className="text-[10px] text-silver-dim mt-0.5">{update.posted_by}</div>
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
            })
          )}
        </div>
      </div>

      {/* ── Post Update Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showUpdateModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setShowUpdateModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.2 }} className="fixed inset-x-0 top-1/2 z-50 mx-auto w-full max-w-lg -translate-y-1/2 border border-[#2e2e2e] bg-[#111111] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-xl font-normal text-white">Post Case Update</h2>
                <button onClick={() => setShowUpdateModal(false)} className="text-silver-dim hover:text-silver"><IconX size={18} /></button>
              </div>

              <form onSubmit={handlePostUpdate} className="space-y-4">
                {/* Update type */}
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-widest text-silver-dim">Update Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {UPDATE_TYPES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setUpdateForm({ ...updateForm, update_type: t.value })}
                        className={`flex items-center gap-2 border px-3 py-2.5 text-xs text-left transition-colors ${
                          updateForm.update_type === t.value
                            ? "border-[#c9a84c]/40 bg-[#c9a84c]/5 text-silver"
                            : "border-[#1e1e1e] text-silver-dim hover:border-[#2e2e2e]"
                        }`}
                      >
                        <t.icon size={13} className={t.color} />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">Title</label>
                  <input type="text" required placeholder="e.g. Next hearing scheduled for 15 Aug" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} className={formInputClasses} />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">Details</label>
                  <textarea rows={4} required placeholder="Describe what happened or what the client needs to know…" value={updateForm.content} onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })} className={`${formInputClasses} resize-none`} />
                </div>

                {updateForm.update_type === "hearing" && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">Hearing Date</label>
                      <input type="date" value={updateForm.hearing_date} onChange={(e) => setUpdateForm({ ...updateForm, hearing_date: e.target.value })} className={formInputClasses} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-silver-dim">Court / Venue (optional)</label>
                      <input type="text" placeholder="e.g. District Court, Gurugram" value={updateForm.court_name} onChange={(e) => setUpdateForm({ ...updateForm, court_name: e.target.value })} className={formInputClasses} />
                    </div>
                  </>
                )}

                <button type="submit" disabled={postingUpdate} className="w-full border border-[#1e1e1e] bg-[#0a0a0a] py-3 text-xs uppercase tracking-widest text-silver transition-all hover:border-[#c9a84c] hover:text-white disabled:opacity-40 mt-2">
                  {postingUpdate ? "Posting…" : "Post Update"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
