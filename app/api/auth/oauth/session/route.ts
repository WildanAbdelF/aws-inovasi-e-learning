import { NextResponse } from "next/server";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";
import { setAuthCookies } from "@/lib/authCookies";

export const runtime = "nodejs";

type OAuthSessionPayload = {
  session?: Partial<Session>;
};

function resolveUserName(email: string, metadata: Record<string, unknown>) {
  const metadataName =
    typeof metadata.name === "string"
      ? metadata.name
      : typeof metadata.full_name === "string"
        ? metadata.full_name
        : typeof metadata.user_name === "string"
          ? metadata.user_name
          : "";

  return metadataName.trim() || email.split("@")[0] || "User";
}

export async function POST(request: Request) {
  const supabaseAuth = getSupabaseAuthClient();
  const supabaseAdmin = getSupabaseAdmin();

  if (!supabaseAuth || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => null)) as OAuthSessionPayload | null;
  const session = body?.session;
  const accessToken = typeof session?.access_token === "string" ? session.access_token : "";
  const refreshToken = typeof session?.refresh_token === "string" ? session.refresh_token : "";

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "OAuth session is incomplete." },
      { status: 400 }
    );
  }

  const { data: authData, error: authError } = await supabaseAuth.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return NextResponse.json(
      { error: authError?.message || "Invalid OAuth session." },
      { status: 401 }
    );
  }

  const email = authData.user.email ?? "";
  const role = email === "admin@example.com" ? "admin" : "user";
  const name = resolveUserName(email, authData.user.user_metadata as Record<string, unknown>);

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("users")
    .select("id, name, email, role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (!profile) {
    const { error: upsertError } = await supabaseAdmin.from("users").upsert(
      {
        id: authData.user.id,
        name,
        email,
        role,
      },
      { onConflict: "id" }
    );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
  }

  const response = NextResponse.json({
    data: {
      id: authData.user.id,
      name: profile?.name ?? name,
      email: profile?.email ?? email,
      role: profile?.role ?? role,
    },
    sessionEstablished: true,
  });

  setAuthCookies(
    response,
    {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: typeof session?.expires_in === "number" ? session.expires_in : 3600,
      token_type: typeof session?.token_type === "string" ? session.token_type : "bearer",
      user: authData.user,
    } as Session,
    request
  );

  return response;
}