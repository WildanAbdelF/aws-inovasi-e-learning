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
    curriculum: course.curriculum ?? null,
    modules: course.modules ?? null,
    updated_at: new Date().toISOString(),
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

  return NextResponse.json({ data: data ?? [] });
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

  return NextResponse.json({ data }, { status: 201 });
}
