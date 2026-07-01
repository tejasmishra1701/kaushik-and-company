import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientSidebar from "./ClientSidebar";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "client") redirect("/portal/admin");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <ClientSidebar userEmail={user.email ?? ""} userName={profile?.full_name ?? "Client"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
