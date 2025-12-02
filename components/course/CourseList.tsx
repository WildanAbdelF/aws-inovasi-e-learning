import CourseCard from "./CourseCard";

export default function CourseList({ courses }: { courses: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {courses.map((c) => (
        <div
          key={String(c.id)}
          data-aos="fade-up"
          data-aos-duration="500"
        >
          <CourseCard course={c} />
        </div>
      ))}
    </div>
  );
}
