import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CasesTable from "./CasesTable";

export default async function CasesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  // Fetch cases and client profiles in parallel
  const [casesResult, { data: clientsData }] = await Promise.all([
    supabase
      .from("cases")
      .select(
        "id, title, status, practice_area, created_at, client_id, next_hearing_date, profiles(full_name)"
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "client")
      .order("full_name"),
  ]);

  let cases = casesResult.data ?? [];

  // Fallback if next_hearing_date column doesn't exist yet
  if (casesResult.error) {
    const { data: fallbackData } = await supabase
      .from("cases")
      .select("id, title, status, practice_area, created_at, client_id, profiles(full_name)")
      .order("created_at", { ascending: false });
    cases = (fallbackData ?? []).map((c: any) => ({ ...c, next_hearing_date: null }));
  }

  return (
    <div className="min-h-full px-8 py-10">
      <CasesTable initialCases={cases as any} clients={clientsData ?? []} />
    </div>
  );
}
