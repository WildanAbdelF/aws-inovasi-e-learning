import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const RESET_EMAIL_COOKIE_KEY = "lms_password_reset_email";

export const runtime = "nodejs";

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  const visible = localPart.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, localPart.length - 2))}@${domain}`;
}

export async function GET(request: NextRequest) {
  const email = request.cookies.get(RESET_EMAIL_COOKIE_KEY)?.value;

  if (!email) {
    return NextResponse.json({ data: { valid: false } }, { status: 200 });
  }

  return NextResponse.json({
    data: {
      valid: true,
      maskedEmail: maskEmail(email),
    },
  });
}

export async function POST(request: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials." },
      { status: 500 }
    );
  }

  const email = request.cookies.get(RESET_EMAIL_COOKIE_KEY)?.value;
  if (!email) {
    return NextResponse.json(
      { error: "Reset session is invalid or expired." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword =
    typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Kata sandi minimal 6 karakter." },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Konfirmasi kata sandi tidak cocok." },
      { status: 400 }
    );
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (profileError || !profile?.id) {
    return NextResponse.json(
      { error: "Akun tidak ditemukan." },
      { status: 404 }
    );
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
    password,
  });

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(RESET_EMAIL_COOKIE_KEY, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
