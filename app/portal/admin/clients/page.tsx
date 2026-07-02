import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientsTable from "./ClientsTable";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, phone, email, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-full px-8 py-10">
      <ClientsTable initialClients={clients ?? []} />
    </div>
  );
}
