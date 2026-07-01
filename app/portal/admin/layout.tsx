import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
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

  if (profile?.role !== "admin") redirect("/portal/client");

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <AdminSidebar userEmail={user.email ?? ""} userName={profile?.full_name ?? "Admin"} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
