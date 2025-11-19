import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="block">
      <Card className="overflow-hidden shadow-sm hover:scale-105 transition">
        <img src={course.image} className="w-full h-40 object-cover" />

        <CardContent className="p-4 space-y-1">
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-neutral-500">Oleh {course.author}</p>

          <p className="text-red-600 font-bold mt-2">
            Rp {course.price.toLocaleString("id-ID")}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
