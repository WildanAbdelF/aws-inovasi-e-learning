import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Course } from "@/types/course";

export const runtime = "nodejs";

function normalizeCourse(input: any, fallbackId: string): Course {
  return {
    id: typeof input.id === "string" && input.id.trim() ? input.id : fallbackId,
    title: typeof input.title === "string" ? input.title.trim() : "",
    author: typeof input.author === "string" ? input.author.trim() : "",
    price: Number.isFinite(input.price) ? Number(input.price) : 0,
    image: typeof input.image === "string" ? input.image.trim() : "",
    description:
      typeof input.description === "string" ? input.description.trim() : undefined,
    curriculum: Array.isArray(input.curriculum)
      ? input.curriculum.filter((c: unknown) => typeof c === "string")
      : undefined,
    modules: Array.isArray(input.modules) ? input.modules : undefined,
    enrollmentCount: Number.isFinite(input.enrollmentCount) ? Number(input.enrollmentCount) : 0,
  };
}

function validateCourse(course: Course) {
  if (!course.title) return "Title is required.";
  if (!course.author) return "Author is required.";
  if (!course.image) return "Image is required.";
  return null;
}

function toDbCourse(course: Course) {
  return {
    id: course.id,
    title: course.title,
    author: course.author,
    price: course.price,
    image: course.image,
    description: course.description ?? null,
    curriculum: Array.isArray(course.curriculum) ? course.curriculum : [],
    modules: Array.isArray(course.modules) ? course.modules : [],
    enrollment_count: course.enrollmentCount ?? 0,
    updated_at: new Date().toISOString(),
  };
}

function mapDbCourse(row: any): Course {
  return {
    id: typeof row?.id === "string" ? row.id : "",
    title: typeof row?.title === "string" ? row.title : "",
    author: typeof row?.author === "string" ? row.author : "",
    price: Number.isFinite(row?.price) ? Number(row.price) : 0,
    image: typeof row?.image === "string" ? row.image : "",
    description:
      typeof row?.description === "string" && row.description.trim()
        ? row.description
        : undefined,
    curriculum: Array.isArray(row?.curriculum)
      ? row.curriculum.filter((c: unknown) => typeof c === "string")
      : [],
    modules: Array.isArray(row?.modules) ? row.modules : [],
    enrollmentCount: Number.isFinite(row?.enrollment_count) ? Number(row.enrollment_count) : 0,
  };
}

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: (data ?? []).map(mapDbCourse) });
}

export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const fallbackId = `course_${randomUUID()}`;
  const course = normalizeCourse(body, fallbackId);

  const errorMessage = validateCourse(course);
  if (errorMessage) {
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  const payload = toDbCourse(course);
  const { data, error } = await supabaseAdmin
    .from("courses")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: mapDbCourse(data) }, { status: 201 });
}
