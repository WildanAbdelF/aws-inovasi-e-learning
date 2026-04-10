"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";
import { listMyCourseAccesses } from "@/lib/services/userApi";
import type { UserCourseAccess } from "@/types/user";
import { useAuth } from "@/components/providers/AuthProvider";

export default function CourseCard({ course }: { course: Course }) {
  const { user } = useAuth();
  const [purchased, setPurchased] = useState(false);
  const [subscription, setSubscription] = useState<UserCourseAccess | null>(null);

  useEffect(() => {
    const loadAccess = async () => {
      if (!user) {
        setPurchased(false);
        setSubscription(null);
        return;
      }

      try {
        const accesses = await listMyCourseAccesses();
        const related = accesses.filter((item) => item.courseId === String(course.id));
        setPurchased(related.some((item) => item.accessType === "lifetime"));
        setSubscription(
          related.find(
            (item) =>
              item.accessType === "subscription" &&
              (!item.expiresAt || new Date(item.expiresAt).getTime() > Date.now())
          ) ?? null
        );
      } catch {
        setPurchased(false);
        setSubscription(null);
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
        {subscription && (
          <span className="absolute top-2 right-2 z-10 rounded-full bg-blue-600 text-white text-[10px] font-semibold px-2 py-1 shadow-sm">
            Langganan 1 Bulan
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
          {subscription && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Kursus tersedia selama 1 bulan
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
