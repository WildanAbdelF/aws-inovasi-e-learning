import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabaseAuthClient } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
  mapUserProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const response = NextResponse.json({ data: session.profile });
  applyRefreshedSessionCookies(response, session, request);
  return response;
}

export async function PUT(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const supabaseAuth = getSupabaseAuthClient();
  if (!supabaseAdmin || !supabaseAuth) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword =
    typeof body.confirmPassword === "string" ? body.confirmPassword : "";

  const updateProfilePayload: Record<string, unknown> = {};

  if (name && name !== session.profile.name) {
    updateProfilePayload.name = name;
  }

  const wantsPasswordUpdate = Boolean(newPassword || confirmPassword || currentPassword);

  if (wantsPasswordUpdate) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Kata sandi saat ini wajib diisi." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 6 karakter." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Konfirmasi kata sandi baru tidak cocok." },
        { status: 400 }
      );
    }

    const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: session.profile.email,
      password: currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Kata sandi saat ini tidak sesuai." },
        { status: 400 }
      );
    }

    const { error: updatePasswordError } = await supabaseAdmin.auth.admin.updateUserById(
      session.profile.id,
      {
        password: newPassword,
      }
    );

    if (updatePasswordError) {
      return NextResponse.json(
        { error: updatePasswordError.message },
        { status: 500 }
      );
    }
  }

  let updatedProfile = session.profile;

  if (Object.keys(updateProfilePayload).length > 0) {
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(updateProfilePayload)
      .eq("id", session.profile.id)
      .select("id, name, email, role, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    updatedProfile = mapUserProfile(data);
  }

  const response = NextResponse.json({ data: updatedProfile });
  applyRefreshedSessionCookies(response, session, request);
  return response;
}
