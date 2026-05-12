"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { listMyCourseAccesses } from "@/lib/services/userApi";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CourseCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const loadAccess = async () => {
      if (!user) {
        setPurchased(false);
        return;
      }

      try {
        const accesses = await listMyCourseAccesses();
        const related = accesses.filter((item) => item.courseId === String(course.id));
        setPurchased(related.length > 0);
      } catch {
        setPurchased(false);
      }
    };

    void loadAccess();
  }, [course.id, user]);

  return (
    <Link href={`/courses/${course.id}`} className="block h-full">
      <Card className="overflow-hidden shadow-sm hover:scale-105 transition h-full flex flex-col relative">
        {purchased && (
          <span className="absolute top-2 left-2 z-10 rounded-full bg-emerald-600 text-white text-[10px] font-semibold px-2 py-1 shadow-sm">
            Sudah dibeli
          </span>
        )}
        

        <img src={course.image} className="w-full h-40 object-cover" />

        <CardContent className="p-4 flex flex-col flex-1">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold line-clamp-2 min-h-[3rem]">{course.title}</h3>
            <p className="text-sm text-neutral-500">Oleh {course.author}</p>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-red-600 font-bold">
              Rp {course.price.toLocaleString("id-ID")}
            </p>
            <p className="text-xs text-neutral-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
              {course.enrollmentCount?.toLocaleString("id-ID")} siswa
            </p>
          </div>
          
        </CardContent>
      </Card>
    </Link>
  );
}
