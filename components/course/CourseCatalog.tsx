"use client";

import { useEffect, useMemo, useState } from "react";
import CourseList from "./CourseList";
import { dummyCourses } from "@/lib/data/courses.data";
import { getAdminCourses } from "@/lib/adminCoursesStorage";

export default function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [adminCourses, setAdminCourses] = useState<any[]>([]);

  useEffect(() => {
    // Ambil course yang dibuat admin dari localStorage
    const data = getAdminCourses();
    setAdminCourses(data);
  }, []);

  const allCourses = useMemo(
    () => [...dummyCourses, ...adminCourses],
    [adminCourses]
  );

  const filtered = allCourses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="max-w-7xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Katalog Kursus</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari kursus..."
          className="w-full sm:flex-1 border rounded px-4 py-2"
        />

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-transform">Kategori</button>
          <button className="px-4 py-2 border rounded border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:scale-105 transition-transform">Paling Populer</button>
        </div>
      </div>

      <CourseList courses={filtered} />
    </section>
  );
}
