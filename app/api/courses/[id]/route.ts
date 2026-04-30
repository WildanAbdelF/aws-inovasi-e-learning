import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Course } from "@/types/course";

export const runtime = "nodejs";

function normalizeCourse(input: any, id: string): Course {
  return {
    id,
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    const status = error.code === "PGRST116" ? 404 : 500;
    const message = status === 404 ? "Course not found." : error.message;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ data: mapDbCourse(data) });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const course = normalizeCourse(body, id);

  const payload = toDbCourse(course);
  const { data, error } = await supabaseAdmin
    .from("courses")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: mapDbCourse(data) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from("courses")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { id } });
}
