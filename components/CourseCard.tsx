import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`} className="block h-full">
      <Card className="overflow-hidden shadow-sm hover:scale-105 transition h-full flex flex-col">
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
