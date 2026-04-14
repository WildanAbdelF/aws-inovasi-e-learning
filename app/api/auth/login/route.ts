import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";
import { setAuthCookies } from "@/lib/authCookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabaseAuth = getSupabaseAuthClient();
  const supabaseAdmin = getSupabaseAdmin();

  if (!supabaseAuth || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.session || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "Invalid email or password." },
      { status: 401 }
    );
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const defaultRole = email === "admin@example.com" ? "admin" : "user";

  const userProfile =
    profile ?? {
      id: authData.user.id,
      name: authData.user.user_metadata?.name ?? email.split("@")[0],
      email,
      role: defaultRole,
    };

  if (!profile) {
    const { error: upsertError } = await supabaseAdmin.from("users").upsert(
      {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
  }

  const response = NextResponse.json({
    data: {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: userProfile.role,
    },
  });

  setAuthCookies(response, authData.session, request);
  return response;
}
