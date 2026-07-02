import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EnquiriesTable from "./EnquiriesTable";

export default async function EnquiriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/portal/login");

  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, name, phone, matter, message, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-full px-8 py-10">
      <EnquiriesTable initialEnquiries={enquiries ?? []} />
    </div>
  );
}
