import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";
import type { UserCourseAccess } from "@/types/user";

export const runtime = "nodejs";

function mapCourseAccess(row: any): UserCourseAccess {
  const course = row?.courses ?? row?.course ?? null;
  const rawAccessType = row?.access_type;
  const accessType = rawAccessType === "subscription" ? "subscription" : "lifetime";

  return {
    id: typeof row?.id === "string" ? row.id : "",
    courseId: typeof row?.course_id === "string" ? row.course_id : "",
    title:
      typeof row?.title === "string"
        ? row.title
        : typeof course?.title === "string"
          ? course.title
          : "",
    price:
      Number.isFinite(row?.price)
        ? Number(row.price)
        : Number.isFinite(course?.price)
          ? Number(course.price)
          : null,
    pricePaid: Number.isFinite(row?.price_paid) ? Number(row.price_paid) : null,
    accessType,
    status: row?.status === "completed" ? "completed" : "active",
    expiresAt:
      typeof row?.expires_at === "string" && row.expires_at.trim()
        ? row.expires_at
        : null,
    createdAt:
      typeof row?.created_at === "string" && row.created_at.trim()
        ? row.created_at
        : undefined,
  };
}

async function readMyCourses(supabaseAdmin: ReturnType<typeof getSupabaseAdmin>, userId: string) {
  const primaryQuery = await supabaseAdmin!
    .from("user_courses")
    .select(
      "id, course_id, status, created_at, expires_at, access_type, price_paid, courses!inner(id, title, price)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!primaryQuery.error) {
    return primaryQuery;
  }

  const fallbackQuery = await supabaseAdmin!
    .from("user_courses")
    .select("id, course_id, status, created_at, courses!inner(id, title, price)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return fallbackQuery;
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

  const { data, error } = await readMyCourses(supabaseAdmin, session.profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({ data: (data ?? []).map(mapCourseAccess) });
  applyRefreshedSessionCookies(response, session);
  return response;
}

export async function POST(request: NextRequest) {
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
  const accessType = body.accessType === "subscription" ? "subscription" : "lifetime";

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
  }

  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("id, title, price")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course?.id) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const now = new Date();
  const expiresAt =
    accessType === "subscription"
      ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;

  const payload = {
    id: `user_course_${randomUUID()}`,
    user_id: session.profile.id,
    course_id: courseId,
    status: "active",
    progress: 0,
    access_type: accessType,
    expires_at: expiresAt,
    price_paid: Number.isFinite(course.price) ? Number(course.price) : 0,
  };

  const primaryUpsert = await supabaseAdmin
    .from("user_courses")
    .upsert(payload, { onConflict: "user_id,course_id" })
    .select(
      "id, course_id, status, created_at, expires_at, access_type, price_paid, courses!inner(id, title, price)"
    )
    .single();

  if (!primaryUpsert.error) {
    const response = NextResponse.json(
      { data: mapCourseAccess(primaryUpsert.data) },
      { status: 201 }
    );
    applyRefreshedSessionCookies(response, session);
    return response;
  }

  const fallbackPayload = {
    id: payload.id,
    user_id: payload.user_id,
    course_id: payload.course_id,
    status: payload.status,
    progress: payload.progress,
  };

  const fallbackUpsert = await supabaseAdmin
    .from("user_courses")
    .upsert(fallbackPayload, { onConflict: "user_id,course_id" })
    .select("id, course_id, status, created_at, courses!inner(id, title, price)")
    .single();

  if (fallbackUpsert.error) {
    return NextResponse.json({ error: fallbackUpsert.error.message }, { status: 500 });
  }

  const response = NextResponse.json(
    { data: mapCourseAccess(fallbackUpsert.data) },
    { status: 201 }
  );
  applyRefreshedSessionCookies(response, session);
  return response;
}
