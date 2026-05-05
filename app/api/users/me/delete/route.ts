import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { clearAuthCookies } from "@/lib/authCookies";
import { getAuthenticatedProfile } from "@/lib/serverAuth";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Missing Supabase credentials." }, { status: 500 });
  }

  const authDeletion = await supabaseAdmin.auth.admin.deleteUser(session.profile.id);
  if (authDeletion.error) {
    return NextResponse.json({ error: authDeletion.error.message }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", session.profile.id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response, request);
  return response;
}
