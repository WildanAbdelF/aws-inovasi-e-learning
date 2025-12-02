import { dummyCourses } from "@/lib/data";
import Link from "next/link";
import CourseDetailClient from "./CourseDetailClient";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requestedId = String(id ?? "");

  // 1) coba cari berdasarkan id (toleran terhadap number/string)
  let course = dummyCourses.find((c) => String(c.id) === requestedId);

  // 2) jika tidak ditemukan, coba cocokkan dengan slug dari title (mis. /courses/ui-ux-design)
  const slugify = (s: string) =>
    s
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  if (!course) {
    course = dummyCourses.find((c) => slugify(c.title) === requestedId);
  }

  if (!course) {
    // tampilkan diagnostik yang membantu debugging: id yang diminta dan daftar id/slug tersedia
    const available = dummyCourses.map((c) => ({ id: String(c.id), slug: slugify(c.title), title: c.title }));

    return (
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-xl font-semibold">Kursus tidak ditemukan</h2>
        <p className="mt-2 text-sm text-neutral-600">Requested id: <strong>{requestedId}</strong></p>

        <div className="mt-4 p-4 bg-neutral-50 border rounded">
          <p className="text-sm font-medium mb-2">Daftar kursus yang tersedia (id / slug):</p>
          <ul className="text-sm list-disc pl-5">
            {available.map((a) => (
              <li key={a.id}>
                {a.id} — {a.slug} — {a.title}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-sm text-neutral-600">Kembali ke <Link href="/katalog" className="text-blue-600">katalog</Link>.</p>
      </div>
    );
  }

  // UI utama detail kursus ditangani oleh komponen client agar bisa memakai dialog & localStorage
  return <CourseDetailClient course={course} />;
}

// struktur layout & konten utama dipindah ke komponen client di CourseDetailClient.tsx

