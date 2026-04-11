import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

function normalizeItemIds(rows: any[]) {
  return rows
    .map((row) => (typeof row?.item_id === "string" ? row.item_id : ""))
    .filter((id) => Boolean(id));
}

export async function GET(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Missing Supabase credentials." }, { status: 500 });
  }

  const courseId = request.nextUrl.searchParams.get("courseId")?.trim() ?? "";
  if (!courseId) {
    return NextResponse.json({ error: "courseId is required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("user_progress")
    .select("item_id")
    .eq("user_id", session.profile.id)
    .eq("course_id", courseId)
    .eq("completed", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({
    data: {
      courseId,
      completedItemIds: normalizeItemIds(data ?? []),
    },
  });
  applyRefreshedSessionCookies(response, session);
  return response;
}

export async function PUT(request: NextRequest) {
  const session = await getAuthenticatedProfile(request);
  if ("error" in session) {
    return NextResponse.json({ error: session.error }, { status: session.status });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Missing Supabase credentials." }, { status: 500 });
  }

  const body = await request.json();
  const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
  const moduleId = typeof body.moduleId === "string" ? body.moduleId.trim() : "";
  const itemId = typeof body.itemId === "string" ? body.itemId.trim() : "";
  const completed = body.completed !== false;

  if (!courseId || !itemId) {
    return NextResponse.json(
      { error: "courseId and itemId are required." },
      { status: 400 }
    );
  }

  const payload = {
    user_id: session.profile.id,
    course_id: courseId,
    module_id: moduleId || null,
    item_id: itemId,
    completed,
  };

  const existingRowResult = await supabaseAdmin
    .from("user_progress")
    .select("id")
    .eq("user_id", session.profile.id)
    .eq("course_id", courseId)
    .eq("item_id", itemId)
    .limit(1)
    .maybeSingle();

  if (existingRowResult.error) {
    return NextResponse.json({ error: existingRowResult.error.message }, { status: 500 });
  }

  const writeResult = existingRowResult.data?.id
    ? await supabaseAdmin
        .from("user_progress")
        .update(payload)
        .eq("id", existingRowResult.data.id)
        .select("item_id, completed")
        .single()
    : await supabaseAdmin
        .from("user_progress")
        .insert({ id: `progress_${randomUUID()}`, ...payload })
        .select("item_id, completed")
        .single();

  if (writeResult.error) {
    return NextResponse.json({ error: writeResult.error.message }, { status: 500 });
  }

  const response = NextResponse.json({ data: writeResult.data });
  applyRefreshedSessionCookies(response, session);
  return response;
}
