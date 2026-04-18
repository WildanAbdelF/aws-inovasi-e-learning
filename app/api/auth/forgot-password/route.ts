import { NextResponse } from "next/server";
import { getSupabaseAuthClient } from "@/lib/supabase";
import { resolveAppBaseUrl } from "@/lib/appUrl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabaseAuthClient = getSupabaseAuthClient();
  if (!supabaseAuthClient) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const appUrl = resolveAppBaseUrl(request);

  const redirectTo = appUrl
    ? `${appUrl.replace(/\/$/, "")}/forgot-password/reset`
    : undefined;

  await supabaseAuthClient.auth.resetPasswordForEmail(email, {
    redirectTo,
  }).catch(() => undefined);

  // Always return success to avoid account enumeration leaks.
  return NextResponse.json({ success: true });
}
