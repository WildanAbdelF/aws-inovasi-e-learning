import Link from "next/link";
import CourseDetailClient from "./CourseDetailClient";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { Course } from "@/types/course";

function slugify(s: string) {
  return s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeCourse(row: any): Course {
  return {
    id: String(row.id),
    title: typeof row.title === "string" ? row.title : "",
    author: typeof row.author === "string" ? row.author : "",
    price: Number.isFinite(row.price) ? Number(row.price) : 0,
    image: typeof row.image === "string" ? row.image : "",
    description: typeof row.description === "string" ? row.description : undefined,
    curriculum: Array.isArray(row.curriculum)
      ? row.curriculum.filter((item: unknown) => typeof item === "string")
      : undefined,
    modules: Array.isArray(row.modules) ? row.modules : undefined,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requestedId = String(id ?? "");

  if (!isSupabaseConfigured) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-xl font-semibold">Konfigurasi Supabase belum aktif</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Set env SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY lalu restart server.
        </p>
      </div>
    );
  }

  const supabaseClient = getSupabaseAdmin();
  if (!supabaseClient) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-xl font-semibold">Konfigurasi Supabase belum aktif</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Set env SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY lalu restart server.
        </p>
      </div>
    );
  }

  const { data: courseById, error: byIdError } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", requestedId)
    .maybeSingle();

  let course = courseById ? normalizeCourse(courseById) : null;

  if (!course && byIdError) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-xl font-semibold">Gagal memuat kursus</h2>
        <p className="mt-2 text-sm text-neutral-600">{byIdError.message}</p>
      </div>
    );
  }

  if (!course) {
    const { data: allCourses, error: listError } = await supabaseClient
      .from("courses")
      .select("*");

    if (listError) {
      return (
        <div className="max-w-7xl mx-auto py-12 px-6">
          <h2 className="text-xl font-semibold">Gagal memuat kursus</h2>
          <p className="mt-2 text-sm text-neutral-600">{listError.message}</p>
        </div>
      );
    }

    const normalized: Course[] = (allCourses ?? []).map(normalizeCourse);
    course = normalized.find((c) => slugify(c.title) === requestedId) ?? null;

    if (!course) {
      const available: Array<{ id: string; slug: string; title: string }> = normalized.map((c) => ({
        id: String(c.id),
        slug: slugify(c.title),
        title: c.title,
      }));

      return (
        <div className="max-w-7xl mx-auto py-12 px-6">
          <h2 className="text-xl font-semibold">Kursus tidak ditemukan</h2>
          <p className="mt-2 text-sm text-neutral-600">Requested id: <strong>{requestedId}</strong></p>

          <div className="mt-4 p-4 bg-neutral-50 border rounded">
            <p className="text-sm font-medium mb-2">Daftar kursus yang tersedia (id / slug):</p>
            <ul className="text-sm list-disc pl-5">
              {available.map((a: { id: string; slug: string; title: string }) => (
                <li key={a.id}>
                  {a.id} - {a.slug} - {a.title}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm text-neutral-600">Kembali ke <Link href="/katalog" className="text-blue-600">katalog</Link>.</p>
        </div>
      );
    }
  }

  // UI utama detail kursus ditangani oleh komponen client agar bisa memakai dialog & localStorage
  return <CourseDetailClient course={course} />;
}

// struktur layout & konten utama dipindah ke komponen client di CourseDetailClient.tsx

