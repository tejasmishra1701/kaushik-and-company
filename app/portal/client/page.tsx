import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconBriefcase, IconArrowRight } from "@tabler/icons-react";

async function getClientCases(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("cases")
    .select("id, title, status, practice_area, created_at")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

const statusColors: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
  pending: "text-yellow-400 bg-yellow-950/30 border-yellow-900/40",
  closed: "text-silver-dim bg-[#1a1a1a] border-[#2a2a2a]",
};

export default async function ClientDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const cases = await getClientCases(supabase, user.id);

  return (
    <div className="min-h-full px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-1 text-xs uppercase tracking-widest text-silver-dim">
          Overview
        </div>
        <h1 className="font-serif text-3xl font-normal text-white">
          My Cases
        </h1>
        <div className="mt-3 h-[1px] w-10 bg-[#c9a84c]" />
      </div>

      {/* Main cases section */}
      <div className="border border-[#1e1e1e]">
        <div className="grid grid-cols-3 border-b border-[#1e1e1e] bg-[#0d0d0d] px-6 py-3 text-[10px] uppercase tracking-widest text-silver-dim">
          <span>Case Title</span>
          <span>Practice Area</span>
          <span>Status</span>
        </div>

        {cases.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-silver-dim flex flex-col items-center justify-center gap-3">
            <IconBriefcase size={28} className="text-silver-dim" />
            <div>
              <p>No cases associated with your account.</p>
              <p className="text-xs text-silver-dim/60 mt-1">
                Please contact the firm if you believe this is an error.
              </p>
            </div>
          </div>
        ) : (
          cases.map((c) => (
            <Link
              key={c.id}
              href={`/portal/client/cases/${c.id}`}
              className="grid grid-cols-3 items-center border-b border-[#1a1a1a] px-6 py-4 transition-colors hover:bg-[#111111] group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver group-hover:text-white transition-colors">
                  {c.title}
                </span>
              </div>
              <div className="text-xs text-silver-dim">{c.practice_area}</div>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                    statusColors[c.status] ?? statusColors.pending
                  }`}
                >
                  {c.status}
                </span>
                <IconArrowRight
                  size={14}
                  className="text-silver-dim opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all mr-4"
                />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
