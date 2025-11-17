import CourseCard from "./CourseCard";
import { dummyCourses } from "../lib/dummyCourses";
import { Button } from "./ui/button";

export default function FeaturedCourses() {
  return (
    <section className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-center text-3xl font-bold">Kursus Unggulan Kami</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {dummyCourses.map((course) => (
            <CourseCard key={course.id.toString()} course={{ ...course, id: course.id.toString() }} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button className="bg-red-600 hover:bg-red-700">Lihat Semua</Button>
        </div>
      </div>
    </section>
  );
}
