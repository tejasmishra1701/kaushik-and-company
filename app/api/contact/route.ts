import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role so no auth is needed — this is a public contact form
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, matter, message } = body;

    if (!name || !phone || !matter) {
      return NextResponse.json({ error: "Name, phone, and matter type are required." }, { status: 400 });
    }

    const { error } = await supabase.from("enquiries").insert({
      name: name.trim(),
      phone: phone.trim(),
      matter,
      message: message?.trim() || null,
    });

    if (error) {
      console.error("Enquiry insert error:", error.message);
      return NextResponse.json({ error: "Failed to save enquiry. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
