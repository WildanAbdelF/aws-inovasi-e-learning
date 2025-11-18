import { dummyCourses } from "@/lib/dummyCourses";
import Link from "next/link";

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

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <nav className="text-sm text-neutral-500 mb-4">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/katalog">Katalog Kursus</Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold mb-2">{course.title}</h1>
          <p className="text-sm text-neutral-600 mb-6">Oleh {course.author}</p>

          <div className="bg-neutral-900 rounded-lg h-64 mb-6 flex items-center justify-center text-white">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover rounded-lg" />
          </div>

          <div className="border-b pb-4 mb-6">
            <h2 className="font-semibold mb-2">Tentang Kursus Ini</h2>
            <p className="text-sm text-neutral-700">{course.description ?? "Deskripsi tidak tersedia."}</p>
          </div>

          <section className="mb-6">
            <h3 className="font-semibold mb-2">Kurikulum</h3>
            <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
              {(course.curriculum ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Instruktur</h3>
            <p className="text-sm text-neutral-700">{course.author}</p>
          </section>
        </main>

        <aside>
          <div className="border rounded-lg p-6 shadow-sm bg-white">
            <div className="mb-4">
              <div className="text-2xl font-bold">Rp {course.price.toLocaleString("id-ID")}</div>
              <div className="text-xs text-neutral-500">Akses Lifetime</div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-red-600 text-white py-3 rounded-lg">Beli Lifetime</button>
              <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg">Gabung Langganan</button>
            </div>

            <ul className="mt-6 text-sm text-neutral-700 space-y-2">
              <li>25 Jam video on-demand</li>
              <li>Studi kasus dunia nyata</li>
              <li>Akses di mobile dan desktop</li>
              <li>Sertifikat kelulusan</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
