import CourseCard from "@/components/course/CourseCard";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import type { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function FeaturedCourses() {
  if (!isSupabaseConfigured) {
    return (
      <section className="bg-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-bold">Kursus Unggulan Kami</h2>
          <p className="text-center text-sm text-neutral-500 mt-6">
            Konfigurasi database belum aktif. Silakan set env Supabase lalu restart server.
          </p>
        </div>
      </section>
    );
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return (
      <section className="bg-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-bold">Kursus Unggulan Kami</h2>
          <p className="text-center text-sm text-neutral-500 mt-6">
            Konfigurasi database belum aktif. Silakan set env Supabase lalu restart server.
          </p>
        </div>
      </section>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) {
    return (
      <section className="bg-neutral-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-bold">Kursus Unggulan Kami</h2>
          <p className="text-center text-sm text-neutral-500 mt-6">
            Gagal memuat kursus unggulan: {error.message}
          </p>
        </div>
      </section>
    );
  }

  const featuredCourses = (data ?? []).map(normalizeCourse);

  return (
    <section className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold">Kursus Unggulan Kami</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id.toString()} course={course} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/katalog">Lihat Semua</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
