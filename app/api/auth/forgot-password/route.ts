import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const RESET_EMAIL_COOKIE_KEY = "lms_password_reset_email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const { data: user } = await supabaseAdmin
    .from("users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  const response = NextResponse.json({ success: true });

  if (user?.email) {
    response.cookies.set(RESET_EMAIL_COOKIE_KEY, user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });
  }

  return response;
}
