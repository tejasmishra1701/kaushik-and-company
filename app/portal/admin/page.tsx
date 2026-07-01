import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconUsers, IconBriefcase, IconArrowRight } from "@tabler/icons-react";

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [{ count: clientCount }, { count: caseCount }, { data: recentCases }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client"),
      supabase
        .from("cases")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("cases")
        .select("id, title, status, created_at, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return { clientCount, caseCount, recentCases };
}

const statusColors: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-950/30 border-emerald-900/40",
  pending: "text-yellow-400 bg-yellow-950/30 border-yellow-900/40",
  closed: "text-silver-dim bg-[#1a1a1a] border-[#2a2a2a]",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { clientCount, caseCount, recentCases } = await getStats(supabase);

  const statCards = [
    {
      label: "Total Clients",
      value: clientCount ?? 0,
      icon: IconUsers,
      href: "/portal/admin/clients",
    },
    {
      label: "Total Cases",
      value: caseCount ?? 0,
      icon: IconBriefcase,
      href: "/portal/admin/cases",
    },
  ];

  return (
    <div className="min-h-full px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-1 text-xs uppercase tracking-widest text-silver-dim">
          Overview
        </div>
        <h1 className="font-serif text-3xl font-normal text-white">
          Dashboard
        </h1>
        <div className="mt-3 h-[1px] w-10 bg-[#c9a84c]" />
      </div>

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group flex items-center justify-between border border-[#1e1e1e] bg-[#111111] p-6 transition-colors hover:border-[#2e2e2e]"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-silver-dim">
                {card.label}
              </div>
              <div className="mt-2 font-serif text-4xl font-normal text-white">
                {card.value}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <card.icon
                size={20}
                className="text-silver-dim group-hover:text-[#c9a84c] transition-colors"
              />
              <IconArrowRight
                size={14}
                className="text-silver-dim opacity-0 transition-all group-hover:opacity-100"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent cases */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="border-l-2 border-[#c9a84c] pl-3 text-xs uppercase tracking-widest text-silver-dim">
            Recent Cases
          </div>
          <Link
            href="/portal/admin/cases"
            className="text-xs text-silver-dim transition-colors hover:text-silver"
          >
            View all →
          </Link>
        </div>

        <div className="divide-y divide-[#1e1e1e] border border-[#1e1e1e]">
          {!recentCases || recentCases.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-silver-dim">
              No cases yet. Create your first case.
            </div>
          ) : (
            recentCases.map((c: any) => (
              <Link
                key={c.id}
                href={`/portal/admin/cases/${c.id}`}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#111111]"
              >
                <div>
                  <div className="text-sm text-silver">{c.title}</div>
                  <div className="mt-0.5 text-xs text-silver-dim">
                    {c.profiles?.full_name ?? "Unknown client"}
                  </div>
                </div>
                <span
                  className={`inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                    statusColors[c.status] ?? statusColors.pending
                  }`}
                >
                  {c.status}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
