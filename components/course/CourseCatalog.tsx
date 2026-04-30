"use client";

import { useEffect, useMemo, useState } from "react";
import CourseList from "./CourseList";
import type { Course } from "@/types/course";
import { listCourses } from "@/lib/services/courseApi";

export default function CourseCatalog() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
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

  const filtered = useMemo(() => {
    let result = courses.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    );

    if (sortBy === "popular") {
      result = result.sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0));
    }

    return result;
  }, [courses, query, sortBy]);

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

        <button 
          onClick={() => setSortBy(sortBy === "newest" ? "popular" : "newest")}
          className={`px-4 py-2 border rounded hover:scale-105 transition-transform ${
            sortBy === "popular"
              ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
              : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          }`}
        >
          {sortBy === "popular" ? "✓ Paling Populer" : "Paling Populer"}
        </button>
      </div>

      <CourseList courses={filtered} />
    </section>
  );
}
