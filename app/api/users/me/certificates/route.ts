import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  applyRefreshedSessionCookies,
  getAuthenticatedProfile,
} from "@/lib/serverAuth";
import type { UserCertificate } from "@/types/user";

export const runtime = "nodejs";

function mapCertificate(row: any, profile: { name: string; email: string }): UserCertificate {
  const course = row?.courses ?? row?.course ?? null;

  return {
    id: typeof row?.id === "string" ? row.id : "",
    courseId: typeof row?.course_id === "string" ? row.course_id : "",
    courseTitle:
      typeof row?.course_title === "string"
        ? row.course_title
        : typeof course?.title === "string"
          ? course.title
          : "",
    instructorName:
      typeof row?.instructor_name === "string"
        ? row.instructor_name
        : typeof course?.author === "string"
          ? course.author
          : "Tim Instruktur",
    userName: profile.name,
    userEmail: profile.email,
    completedAt:
      typeof row?.issued_at === "string" && row.issued_at.trim()
        ? row.issued_at
        : new Date().toISOString(),
  };
}

async function readCertificates(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  userId: string
) {
  const primaryQuery = await supabaseAdmin!
    .from("certificates")
    .select("id, course_id, issued_at, instructor_name, courses!inner(id, title, author)")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  if (!primaryQuery.error) {
    return primaryQuery;
  }

  const fallbackQuery = await supabaseAdmin!
    .from("certificates")
    .select("id, course_id, issued_at, courses!inner(id, title, author)")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

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

  const { data, error } = await readCertificates(supabaseAdmin, session.profile.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({
    data: (data ?? []).map((row: any) => mapCertificate(row, session.profile)),
  });
  applyRefreshedSessionCookies(response, session, request);
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

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
  }

  const existingPrimary = await supabaseAdmin
    .from("certificates")
    .select("id, course_id, issued_at, instructor_name, courses!inner(id, title, author)")
    .eq("user_id", session.profile.id)
    .eq("course_id", courseId)
    .maybeSingle();

  const existingFallback =
    existingPrimary.error &&
    existingPrimary.error.message.toLowerCase().includes("instructor_name")
      ? await supabaseAdmin
          .from("certificates")
          .select("id, course_id, issued_at, courses!inner(id, title, author)")
          .eq("user_id", session.profile.id)
          .eq("course_id", courseId)
          .maybeSingle()
      : null;

  const existing = existingFallback?.data ?? existingPrimary.data;

  if (existing) {
    const response = NextResponse.json({ data: mapCertificate(existing, session.profile) });
    applyRefreshedSessionCookies(response, session, request);
    return response;
  }

  const { data: course, error: courseError } = await supabaseAdmin
    .from("courses")
    .select("id, author")
    .eq("id", courseId)
    .maybeSingle();

  if (courseError || !course?.id) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const payload = {
    id: `cert_${randomUUID()}`,
    user_id: session.profile.id,
    course_id: courseId,
    issued_at: new Date().toISOString(),
    instructor_name: typeof course.author === "string" ? course.author : "Tim Instruktur",
    certificate_url: null,
  };

  const primaryInsert = await supabaseAdmin
    .from("certificates")
    .insert(payload)
    .select("id, course_id, issued_at, instructor_name, courses!inner(id, title, author)")
    .single();

  if (!primaryInsert.error) {
    const response = NextResponse.json(
      { data: mapCertificate(primaryInsert.data, session.profile) },
      { status: 201 }
    );
    applyRefreshedSessionCookies(response, session, request);
    return response;
  }

  const fallbackInsert = await supabaseAdmin
    .from("certificates")
    .insert({
      id: payload.id,
      user_id: payload.user_id,
      course_id: payload.course_id,
      issued_at: payload.issued_at,
      certificate_url: payload.certificate_url,
    })
    .select("id, course_id, issued_at, courses!inner(id, title, author)")
    .single();

  if (fallbackInsert.error) {
    return NextResponse.json({ error: fallbackInsert.error.message }, { status: 500 });
  }

  const response = NextResponse.json(
    { data: mapCertificate(fallbackInsert.data, session.profile) },
    { status: 201 }
  );
  applyRefreshedSessionCookies(response, session, request);
  return response;
}
