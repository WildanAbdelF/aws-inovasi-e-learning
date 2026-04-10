"use client";

import { useEffect, useMemo, useState } from "react";
import CourseList from "./CourseList";
import type { Course } from "@/types/course";
import { listCourses } from "@/lib/services/courseApi";

export default function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await listCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses:", error);
        window.alert("Gagal memuat course dari API.");
      } finally {
        setLoading(false);
      }
    };

    void loadCourses();
  }, []);

  const filtered = useMemo(() => courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  ), [courses, query]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-6">Katalog Kursus</h1>
        <p className="text-sm text-neutral-500">Memuat course...</p>
      </section>
    );
  }

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
