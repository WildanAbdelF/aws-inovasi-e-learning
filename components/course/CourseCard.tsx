import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types/course";
import { getPurchases } from "@/lib/localStorageHelper";
import { useEffect, useState } from "react";

export default function CourseCard({ course }: { course: Course }) {
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    try {
      const list = getPurchases();
      setPurchased(list.some((c) => c.id === String(course.id)));
    } catch {
      setPurchased(false);
    }
  }, [course.id]);

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

          <p className="text-red-600 font-bold mt-2">
            Rp {course.price.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
