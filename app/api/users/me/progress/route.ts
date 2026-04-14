import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";

export const runtime = "nodejs";

const PROGRESS_ID_PREFIX = "progress::";

function buildProgressRowId(userId: string, courseId: string, itemId: string) {
  return `${PROGRESS_ID_PREFIX}${userId}::${encodeURIComponent(courseId)}::${encodeURIComponent(itemId)}`;
}

function decodeItemIdFromRow(row: any): string | null {
  if (typeof row?.item_id === "string" && row.item_id.trim()) {
    return row.item_id;
  }

  if (typeof row?.id !== "string" || !row.id.startsWith(PROGRESS_ID_PREFIX)) {
    return null;
  }

  const parts = row.id.split("::");
  if (parts.length < 4) return null;

  try {
    return decodeURIComponent(parts[3]);
  } catch {
    return null;
  }
}

function normalizeItemIds(rows: any[]) {
  return Array.from(
    new Set(
      rows
        .map((row) => decodeItemIdFromRow(row))
        .filter((id): id is string => Boolean(id))
    )
  );
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
    .select("id, item_id")
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
  applyRefreshedSessionCookies(response, session, request);
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
  const itemId = typeof body.itemId === "string" ? body.itemId.trim() : "";
  const completed = body.completed !== false;

  if (!courseId || !itemId) {
    return NextResponse.json(
      { error: "courseId and itemId are required." },
      { status: 400 }
    );
  }

  const progressRowId = buildProgressRowId(session.profile.id, courseId, itemId);

  const payload = {
    id: progressRowId,
    user_id: session.profile.id,
    course_id: courseId,
    module_id: null,
    item_id: null,
    completed,
  };

  const writeResult = await supabaseAdmin
    .from("user_progress")
    .upsert(payload, { onConflict: "id" })
    .select("id, item_id, completed")
    .single();

  if (writeResult.error) {
    return NextResponse.json({ error: writeResult.error.message }, { status: 500 });
  }

  const response = NextResponse.json({ data: writeResult.data });
  applyRefreshedSessionCookies(response, session, request);
  return response;
}
