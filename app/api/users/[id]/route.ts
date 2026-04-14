import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
  mapUserProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  if (session.profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const updatePayload: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    updatePayload.name = name;
  }

  if (typeof body.role === "string") {
    if (body.role !== "admin" && body.role !== "user") {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    updatePayload.role = body.role;
  }

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .update(updatePayload)
    .eq("id", id)
    .select("id, name, email, role, created_at")
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    return NextResponse.json(
      { error: status === 404 ? "User not found." : error.message },
      { status }
    );
  }

  const response = NextResponse.json({ data: mapUserProfile(data) });
  applyRefreshedSessionCookies(response, session, request);
  return response;
}
