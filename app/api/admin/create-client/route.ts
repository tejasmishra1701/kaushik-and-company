import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Verify the calling user is an admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use the service role client to create users (bypasses email confirmation)
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const body = await request.json();
  const { full_name, email, phone, password } = body;

  if (!full_name || !email || !password) {
    return NextResponse.json(
      { error: "full_name, email, and password are required." },
      { status: 400 }
    );
  }

  // Create the auth user
  const { data: newUser, error: createError } =
    await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // skip email confirmation
    });

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  // Create the profile row
  const { error: profileError } = await adminSupabase
    .from("profiles")
    .insert({
      id: newUser.user.id,
      full_name,
      email,
      phone: phone || null,
      role: "client",
    });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, userId: newUser.user.id });
}
