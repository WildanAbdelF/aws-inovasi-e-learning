import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_KEYS } from "@/lib/authCookies";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabaseAuth = getSupabaseAuthClient();
  const supabaseAdmin = getSupabaseAdmin();

  if (!supabaseAuth || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const accessToken = request.cookies.get(AUTH_COOKIE_KEYS.accessToken)?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: authUser, error: authError } = await supabaseAuth.auth.getUser(accessToken);

  if (authError || !authUser.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role")
    .eq("id", authUser.user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const role = profile?.role ?? (authUser.user.email === "admin@example.com" ? "admin" : "user");

  return NextResponse.json({
    data: {
      id: authUser.user.id,
      name: profile?.name ?? authUser.user.user_metadata?.name ?? authUser.user.email?.split("@")[0] ?? "User",
      email: profile?.email ?? authUser.user.email ?? "",
      role,
    },
  });
}
